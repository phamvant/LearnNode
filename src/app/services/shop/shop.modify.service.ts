import { BadRequestError } from "../../core/error.response";
import { SignUpCredential } from "../access/access.service";

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
export const storeNewUser = async ({
  userId,
  email,
  username,
  name,
  password,
}: SignUpCredential) => {
  const newUser = await postgres
    .query({
      text: `INSERT INTO "User"(user_id, user_email, user_name, user_username, user_password, user_verified, user_status, user_roles) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
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
export const removeTokenById = async ({ userId }: { userId: string }) => {
  console.log({ userId });
  const removeToken = await postgres
    .query({
      text: `DELETE FROM "KeyToken" WHERE keytoken_user_id=$1`,
      values: [userId],
    })
    .catch((error) => {
      throw new BadRequestError({
        message: "Query failed at removeTokenById",
      });
    });

  return removeToken.rowCount;
};
