import { generateKeyPairSync } from "node:crypto";
import createKeyPair from "../auth/authUtils";
import { prisma } from "../database/init.prisma";
import getIntoData from "../utils";
import tokenService from "./token.service";

type Req = {
  email: string;
  name: string;
  username: string;
  password: string;
};

const userRole = {
  ADMIN: "01",
  NORMAL: "02",
};

class AccessService {
  static SignUp = async ({ email, username, name, password }: Req) => {
    try {
      const user = prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return {
          code: "0001",
          message: "Shop already exist",
          status: "error",
        };
      }

      const newUser = await prisma.user.create({
        data: {
          email: email,
          name: name,
          username: username,
          password: password,
          roles: ["0000"],
        },
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

        const publicKeyString = tokenService.createToken({
          userId: newUser.id,
          publicKey: publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "0001",
            message: "PublicKey String error",
            status: "error",
          };
        }

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

        const UserToDelete = await prisma.user.delete({
          where: {
            id: newUser.id,
          },
        });

        // const TokenToDelete = await prisma.keyToken.delete({
        //   where: {
        //     userId: newUser.id,
        //   },
        // });

        return {
          code: 201,
          metadata: {
            useData: getIntoData({
              fields: ["userId", "email", "username"],
              objects: newUser,
            }),
            token: {
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
          },
        };
      }

      return {
        code: "xxx",
        message: "cant create user",
        status: "error",
      };
    } catch (error) {
      console.log(error);
      return {
        code: "0001",
        message: error,
        status: "error",
      };
    }
  };
}

export default AccessService;
