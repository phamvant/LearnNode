import { prisma } from "../database/init.prisma";

class TokenService {
  createToken = async ({
    userId,
    publicKey,
  }: {
    userId: number;
    publicKey: string;
  }) => {
    try {
      const publicKeyString = publicKey.toString();

      const newToken = await prisma.keyToken.create({
        data: {
          userId: userId,
          publicKey: publicKeyString,
        },
      });

      return newToken ? newToken.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

export default new TokenService();
