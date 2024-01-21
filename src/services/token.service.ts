import { BadRequestError } from "../core/error.response";
import { prisma } from "../database/init.prisma";

interface TokenSchema {
  userId: number;
  publicKey: string;
  privateKey: string;
  refreshToken: string;
}

class TokenService {
  static storeToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: TokenSchema) => {
    await prisma.keyToken
      .upsert({
        create: {
          userId: userId,
          publicKey: publicKey,
          privateKey: privateKey,
          usedRefreshToken: [refreshToken],
        },
        update: {
          usedRefreshToken: {
            push: refreshToken,
          },
        },
        where: {
          userId: userId,
        },
      })
      .catch((error) => {
        throw new BadRequestError({
          message: "Cant save keyToken",
          details: error as string,
        });
      });
  };

  static findKeyById = async ({ userId }: { userId: number }) => {
    const token = await prisma.keyToken
      .findFirst({
        where: {
          userId: userId,
        },
      })
      .catch((error) => {
        throw new BadRequestError({
          message: "Cant find keytoken",
          details: error as string,
        });
      });

    return token;
  };
}

export default TokenService;
