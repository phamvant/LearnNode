import { BadRequestError } from "../../core/error.response";
import { toCamel } from "../../utils";

/**
 *
 * Find User By Email
 *
 * @static
 * @param {{ email: string }} { email }
 * @memberof ShopService
 */
export const findUserByEmail = async ({ email }: { email: string }) => {
  const user = await postgres
    .query({
      text: `SELECT * FROM "User" WHERE user_email=$1 LIMIT 1`,
      values: [email],
    })
    .catch((error) => {
      throw new BadRequestError({
        message: "Query failed at findUserByEmail",
      });
    });

  return toCamel(user.rows)[0];
};
