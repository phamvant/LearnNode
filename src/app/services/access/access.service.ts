import { generateKeyPairSync } from "node:crypto";
import { v4 as uuidv4 } from "uuid";
import createTokenPair from "../../auth/auth.utils";
import {
  BadRequestError,
  ConflictRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../core/error.response";
import { DEBUGING } from "../../type.index";
import { getIntoData } from "../../utils";
import { ShopGetService, ShopModifyService } from "../shop/shop.index.service";
import TokenService from "./token.service";

interface Credentials {
  email: string;
  username: string;
  password: string;
}

export interface SignUpCredential extends Credentials {
  userId: string;
  name: string;
}

/**
 *
 * Get New AccessToken using RefreshToken
 *
 * @static
 * @param {{
 *     userId: number;
 *     usedRefreshToken: string;
 *   }} {
 *     extractedClientID,
 *     usedRefreshToken,
 *   }
 * @memberof AccessService
 */
const HandleRefreshToken = async ({
  userId,
  usedRefreshToken,
}: {
  userId: string;
  usedRefreshToken: string;
}) => {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const { accessToken, refreshToken } = await createTokenPair({
    payload: {
      userId: userId,
    },
    privateKey: privateKey,
  });

  await TokenService.storeToken({
    userId: userId,
    publicKey: publicKey,
    refreshToken: usedRefreshToken,
  });

  return {
    userData: userId,
    token: {
      accessToken,
      refreshToken,
    },
  };
};

/**
 *
 * SignUp Function
 *
 * @static
 * @param {Credentials} {
 *     email,
 *     username,
 *     name,
 *     password,
 *   }
 * @memberof AccessService
 */

const SignUp = async ({
  email,
  username,
  name,
  password,
}: SignUpCredential): Promise<Record<string, any> | undefined> => {
  const existedUser = await ShopGetService.findUserByEmail({ email: email });

  if (existedUser) {
    throw new ConflictRequestError({ message: "Shop already existed" });
  }

  const userId = uuidv4();
  const newUser = await ShopModifyService.storeNewUser({
    userId: userId,
    email: email,
    username: username,
    name: name,
    password: password,
  });

  if (!newUser[0]) {
    throw new BadRequestError({ message: "Cant create new user" });
  }

  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const { accessToken, refreshToken } = await createTokenPair({
    payload: {
      userId: userId,
      email: email,
    },
    privateKey: privateKey,
  });

  const savedToken = await TokenService.storeToken({
    userId: userId,
    publicKey: publicKey,
    refreshToken: refreshToken,
  });

  if (!savedToken.rowCount) {
    throw new BadRequestError({ message: "Cant save token" });
  }

  if (DEBUGING) {
    //DEBUGING Delete User After Create
    await postgres.query({
      text: `DELETE FROM "User" WHERE user_id: $1`,
      values: [userId],
    });
  }

  return {
    // useData: getIntoData({
    //   fields: ["userId", "email", "username"],
    //   objects: newUser.rows[0],
    // }),
    userData: {
      userId,
      email,
    },
    token: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  };
};

/**
 *
 * Login Function
 *
 * @static
 * @param {Credentials} { username, email, password }
 * @memberof AccessService
 */
const Login = async ({ username, email, password }: Credentials) => {
  const loginUser = await ShopGetService.findUserByEmail({ email: email });

  if (!loginUser) {
    throw new BadRequestError({ message: "Cant find User" });
  }

  const isMatch = password === loginUser.userPassword ? true : false;

  if (!isMatch) {
    throw new ForbiddenError({ message: "Password Incorrect" });
  }

  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const { accessToken, refreshToken } = await createTokenPair({
    payload: {
      userId: loginUser.userId,
      email: loginUser.userEmail,
    },
    privateKey: privateKey,
  });

  await TokenService.storeToken({
    userId: loginUser.userId,
    publicKey: publicKey,
    refreshToken: refreshToken,
  });

  return {
    userData: getIntoData({
      objects: loginUser,
      fields: ["userId", "userEmail", "userUsername"],
    }),
    token: {
      accessToken,
      refreshToken,
    },
  };
};

const Logout = async ({ userId }: { userId: string }) => {
  const removeToken = await ShopModifyService.removeTokenById({
    userId: userId,
  });

  if (!removeToken) {
    throw new NotFoundError({
      message: "Key not found",
    });
  }

  return true;
};

const AccessService = {
  HandleRefreshToken,
  SignUp,
  Login,
  Logout,
};

export default AccessService;
