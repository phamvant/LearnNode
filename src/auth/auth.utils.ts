import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { HEADER, Permission } from "..";
import {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../core/error.response";
import { asyncHandler } from "../helpers/async.handler";
import ApiKeyService from "../services/apikey.service";
import TokenService from "../services/token.service";

interface CustomRequest extends Request {
  apiKeyObject?: any;
  tokenObject?: any;
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

  req.apiKeyObject = storedApiKey;
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
    if (!req.apiKeyObject.permission) {
      throw new ForbiddenError({ message: "No permission included" });
    }

    const validPermission = req.apiKeyObject.permission.includes(permission);

    if (!validPermission) {
      throw new ForbiddenError({ message: "Permission denied" });
    }

    return next();
  };
};

export const authenticate = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const extractedClientID = req.headers[HEADER.CLIENTID];

    if (!extractedClientID) {
      throw new AuthFailureError({ message: "Invalid Request" });
    }

    const userToken = await TokenService.findKeyById({
      userId: parseInt(extractedClientID as string),
    });

    if (!userToken) {
      throw new NotFoundError({ message: "User not found" });
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];

    try {
      const decodedUser = JWT.verify(
        accessToken as string,
        userToken.publicKey
      );

      console.log(decodedUser);

      if (decodedUser !== extractedClientID) {
        throw new AuthFailureError({ message: "Invalid User" });
      }

      req.tokenObject = userToken;
      return next();
    } catch (e) {
      throw new AuthFailureError({ message: "Invalid User" });
    }
  }
);

export default createTokenPair;
