import { BadRequestError } from "../core/error.response";
import { prisma } from "../database/init.prisma";

class TokenService {
  createToken = async ({
    userId,
    publicKey,
  }: {
    userId: number;
    publicKey: string;
  }) => {
    await prisma.keyToken
      .create({
        data: {
          userId: userId,
          publicKey: publicKey,
        },
      })
      .catch((error) => {
        throw new BadRequestError({
          message: "Cant save keyToken",
          details: error as string,
        });
      });
  };
}

export default new TokenService();
