import { generateKeyPairSync } from "node:crypto";
import createKeyPair from "../auth/authUtils";
import { BadRequestError, ConflictRequestError } from "../core/error.response";
import { prisma } from "../database/init.prisma";
import getIntoData from "../utils";
import tokenService from "./token.service";

type Req = {
  email: string;
  name: string;
  username: string;
  password: string;
};

class AccessService {
  static SignUp = async ({
    email,
    username,
    name,
    password,
  }: Req): Promise<Record<string, any> | undefined> => {
    const user = await prisma.user
      .findFirst({
        where: {
          email: email,
        },
      })
      .catch((error) => {
        console.log(error.toString());
        throw new BadRequestError({
          message: "DB Error",
          details: error,
        });
      });

    if (user) {
      throw new ConflictRequestError({
        message: "Shop Already Exist",
      });
    }

    const newUser = await prisma.user
      .create({
        data: {
          email: email,
          name: name,
          username: username,
          password: password,
          roles: ["0000"],
        },
      })
      .catch((error) => {
        throw new BadRequestError({
          message: "Cant save user to DB",
          details: error as string,
        });
      });

    if (newUser) {
      const { publicKey, privateKey } = generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: { type: "pkcs1", format: "pem" },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      });

      console.log({ publicKey });

      await tokenService.createToken({
        userId: newUser.id,
        publicKey: publicKey,
      });

      const token = await createKeyPair({
        payload: {
          userId: newUser.id,
          email: email,
        },
        publicKey: publicKey,
        privateKey: privateKey,
      });

      const { accessToken, refreshToken } = token;

      //DEBUGING

      // const UserToDelete = await prisma.user.delete({
      //   where: {
      //     id: newUser.id,
      //   },
      // });

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
    }
  };
}

export default AccessService;
