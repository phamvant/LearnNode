import { BadRequestError } from "../core/error.response";
import { SignUpCredential } from "./access.service";

class ShopService {
  /**
   *
   * Find User By Email
   *
   * @static
   * @param {{ email: string }} { email }
   * @memberof ShopService
   */
  static findUserByEmail = async ({ email }: { email: string }) => {
    const user = await postgres
      .query({
        text: `SELECT * FROM "User" WHERE email=$1 LIMIT 1`,
        values: [email],
      })
      .catch((error) => {
        throw new BadRequestError({
          message: "Query failed at findUserByEmail",
        });
      });

    return user.rows[0];
  };

  /**
   *
   * Save New User To Database
   *
   * @static
   * @param {SignUpCredential} {
   *     email,
   *     username,
   *     name,
   *     password,
   *   }
   * @memberof ShopService
   */
  static storeNewUser = async ({
    userId,
    email,
    username,
    name,
    password,
  }: SignUpCredential) => {
    const newUser = await postgres
      .query({
        text: `INSERT INTO "User"(id, email, name, username, password, verified, status, roles) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        values: [
          userId,
          email,
          name,
          username,
          password,
          false,
          "active",
          ["0000"],
        ],
      })
      .catch((error) => {
        throw new BadRequestError({ message: "Query failed at storeNewUser" });
      });

    return newUser;
  };

  /**
   *
   * Remove KeyToken By UserID
   *
   * @static
   * @param {{ userId: number }} { userId }
   * @memberof ShopService
   */
  static removeTokenById = async ({ userId }: { userId: string }) => {
    console.log({ userId });
    const removeToken = await postgres
      .query({
        text: `DELETE FROM "KeyToken" WHERE userId=$1`,
        values: [userId],
      })
      .catch((error) => {
        throw new BadRequestError({
          message: "Query failed at removeTokenById",
        });
      });

    return removeToken.rowCount;
  };
}

export default ShopService;
