import { prisma } from "../database/init.prisma";

class ApiKeyService {
  static findById = async (apiKey: string) => {
    const objKey = await prisma.apiKey.findUnique({
      where: {
        key: apiKey,
      },
    });

    return objKey;
  };
}

export default ApiKeyService;
