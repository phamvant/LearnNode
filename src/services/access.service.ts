import { generateKeyPairSync } from "node:crypto";
import { DEBUGING } from "..";
import createTokenPair from "../auth/auth.utils";
import {
  BadRequestError,
  ConflictRequestError,
  ForbiddenError,
  NotFoundError,
} from "../core/error.response";
import { prisma } from "../database/init.prisma";
import getIntoData from "../utils";
import ShopService from "./shop.service";
import tokenService from "./token.service";

interface Credentials {
  email: string;
  username: string;
  password: string;
}

export interface SignUpCredential extends Credentials {
  name: string;
}

class AccessService {
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

  static SignUp = async ({
    email,
    username,
    name,
    password,
  }: SignUpCredential): Promise<Record<string, any> | undefined> => {
    const existedUser = await ShopService.findUserByEmail({ email: email });

    if (existedUser) {
      throw new ConflictRequestError({ message: "Shop already existed" });
    }

    const newUser = await ShopService.storeNewUser({
      email: email,
      username: username,
      name: name,
      password: password,
    });

    if (!newUser) {
      throw new BadRequestError({ message: "Cant create new user" });
    }

    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: { type: "pkcs1", format: "pem" },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    const { accessToken, refreshToken } = await createTokenPair({
      payload: {
        userId: newUser.id,
        email: email,
      },
      privateKey: privateKey,
    });

    await tokenService.storeToken({
      userId: newUser.id,
      privateKey: privateKey,
      publicKey: publicKey,
      refreshToken: refreshToken,
    });

    //DEBUGING Delete User After Create
    if (DEBUGING) {
      await prisma.user.delete({
        where: {
          id: newUser.id,
        },
      });
    }

    return {
      useData: getIntoData({
        fields: ["userId", "email", "username"],
        objects: newUser,
      }),
      token: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  };

  /**
   *
   * Login Function
   *true
   * @static
   * @param {Credentials} { username, email, password }
   * @memberof AccessService
   */
  static Login = async ({ username, email, password }: Credentials) => {
    const loginUser = await ShopService.findUserByEmail({ email: email });

    if (!loginUser) {
      throw new BadRequestError({ message: "Cant find User" });
    }

    const isMatch = password === loginUser.password ? true : false;

    if (!isMatch) {
      throw new ForbiddenError({ message: "Password Incorrect" });
    }

    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: { type: "pkcs1", format: "pem" },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    const { accessToken, refreshToken } = await createTokenPair({
      payload: {
        userId: loginUser.id,
        email: loginUser.email,
      },
      privateKey: privateKey,
    });

    await tokenService.storeToken({
      userId: loginUser.id,
      privateKey: privateKey,
      publicKey: publicKey,
      refreshToken: refreshToken,
    });

    return {
      userData: getIntoData({
        objects: loginUser,
        fields: ["userId", "email", "username"],
      }),
      token: {
        accessToken,
        refreshToken,
      },
    };
  };

  static Logout = async ({ userId }: { userId: number }) => {
    const removeToken = await ShopService.removeTokenById({ userId: userId });

    if (!removeToken) {
      throw new NotFoundError({
        message: "Key not found",
      });
    }

    return true;
  };
}

export default AccessService;
