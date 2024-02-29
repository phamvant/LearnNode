import { BadRequestError } from "../core/error.response";

interface TokenSchema {
  userId: string;
  publicKey: string;
  refreshToken: string;
}

class TokenService {
  static storeToken = async ({
    userId,
    publicKey,
    refreshToken,
  }: TokenSchema) => {
    const existedUser = await this.findKeyById({ userId: userId });

    if (!existedUser) {
      const storedToken = await postgres
        .query({
          text: `INSERT INTO "KeyToken" (userid, publickey, usedrefreshtoken)
        VALUES ($1, $2, ARRAY[$3])`,
          values: [userId, publicKey, refreshToken],
        })
        .catch((error) => {
          console.log(error);
          throw new BadRequestError({ message: "Query failed at storeToken" });
        });

      return storedToken;
    } else {
      const updatedToken = await postgres
        .query({
          text: `UPDATE "KeyToken"
        SET usedrefreshtoken = usedrefreshtoken || ARRAY[$1],
        publickey=$2
        WHERE userid=$3
        `,
          values: [refreshToken, publicKey, userId],
        })
        .catch((error) => {
          console.log(error);
          throw new BadRequestError({ message: "Query failed at storeToken" });
        });

      return updatedToken;
    }
  };

  static findKeyById = async ({ userId }: { userId: string }) => {
    const token = await postgres
      .query({
        text: `SELECT * FROM "KeyToken" WHERE userId=$1 LIMIT 1`,
        values: [userId],
      })
      .catch((error) => {
        throw new BadRequestError({ message: "Query failed at findKeyById" });
      });

    return token.rows[0];
  };
}

export default TokenService;
