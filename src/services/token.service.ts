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

    if (!existedUser.rowCount) {
      const storedToken = await postgres.query({
        text: `INSERT INTO "KeyToken" (userid, publickey, usedrefreshtoken)
        VALUES ($1, $2, ARRAY[$3])`,
        values: [userId, publicKey, refreshToken],
      });

      return storedToken;
    } else {
      const updatedToken = await postgres.query({
        text: `UPDATE "KeyToken"
        SET usedrefreshtoken = usedrefreshtoken || ARRAY[$1],
        publickey=$2
        WHERE user=$3
        `,
        values: [refreshToken, publicKey, userId],
      });

      return updatedToken;
    }
  };

  static findKeyById = async ({ userId }: { userId: string }) => {
    const token = await postgres.query({
      text: `SELECT * FROM "KeyToken" WHERE userId=$1 LIMIT 1`,
      values: [userId],
    });

    return token;
  };
}

export default TokenService;
