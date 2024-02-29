import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { HEADER, JwtPayload, Permission } from "..";
import {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../core/error.response";
import { asyncHandler } from "../helpers/async.handler";
import ApiKeyService from "../services/apikey.service";
import TokenService from "../services/token.service";

export interface CustomRequest extends Request {
  metadata?: Record<string, any>; //storedApiKey, TokenObj
}

/**
 *
 * Create AccessToken and RefreshToken
 *
 * @param {{
 *   payload: any;
 *   privateKey: any;
 * }} {
 *   payload,
 *   privateKey,
 * }
 * @return {*}  {*}
 */
const createTokenPair = ({
  payload,
  privateKey,
}: {
  payload: any;
  privateKey: any;
}): any => {
  const accessToken = JWT.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "2 days",
  });

  const refreshToken = JWT.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7 days",
  });

  return { accessToken, refreshToken };
};

/**
 *
 * Check API Key
 *
 * @param {CustomRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {*}
 */
export const checkApiKey = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const extractedApiKey = req.headers[HEADER.API_KEY]?.toString();

  if (!extractedApiKey) {
    throw new BadRequestError({ message: "No API Key" });
  }

  const storedApiKey = await ApiKeyService.findApiKey(extractedApiKey);

  if (!storedApiKey) {
    throw new BadRequestError({ message: "API key not sacrificed" });
  }

  req.metadata = { ...req.metadata, storedApiKey };

  return next();
};

/**
 *
 * Permission Check
 *
 * @param {Permission} permission
 * @return {*}
 */
export const permissionCheck = (permission: Permission) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.metadata?.storedApiKey.permission) {
      throw new ForbiddenError({ message: "No permission included" });
    }

    const validPermission =
      req.metadata.storedApiKey.permission.includes(permission);

    if (!validPermission) {
      throw new ForbiddenError({ message: "Permission denied" });
    }

    return next();
  };
};

export const authenticate = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let userId = req.headers[HEADER.CLIENTID]?.toString();

    if (!userId) {
      throw new AuthFailureError({ message: "Invalid Request" });
    }

    const userToken = await TokenService.findKeyById({
      userId: userId,
    });

    if (!userToken) {
      throw new NotFoundError({ message: "User not found" });
    }

    const [type, token] =
      req.headers[HEADER.AUTHORIZATION]?.toString().split(" ") ?? [];

    if (!token) {
      throw new BadRequestError({
        message: "Invalid Request",
      });
    }

    if (type === "Refresh") {
      if (userToken.usedRefreshToken.includes(token)) {
        //Remove session
        const query = {
          text: `DELETE FROM "KeyToken" WHERE userId = $1}`,
          value: [userId],
        };

        const storedKey = await postgres.query(query);

        if (!storedKey) {
          throw new BadRequestError({ message: "Cant modify DB" });
        }

        throw new AuthFailureError({ message: "Refresh Token Used" });
      }

      try {
        const decodedUser = JWT.verify(
          token.toString(),
          userToken.publickey
        ) as JwtPayload;

        if (decodedUser.userId != userId) {
          throw new AuthFailureError({ message: "Invalid User" });
        }

        req.metadata = {
          ...req.metadata,
          userId,
          usedRefreshToken: token,
        };
      } catch (error) {
        throw new AuthFailureError({ message: "Invalid User" });
      }
    }

    try {
      const decodedUser = JWT.verify(
        token.toString(),
        userToken.publickey
      ) as JwtPayload;

      if (decodedUser.userId != userId) {
        throw new AuthFailureError({ message: "Invalid User" });
      }

      req.metadata = { ...req.metadata, userId };
      return next();
    } catch (e) {
      console.log(e);
      throw new AuthFailureError({
        message: "Invalid User",
      });
    }
  }
);

export default createTokenPair;
