import { BadRequestError } from "../core/error.response";
import { prisma } from "../database/init.prisma";
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
    const user = await prisma.user
      .findUnique({
        where: {
          email: email,
        },
      })
      .catch((error) => {
        throw new BadRequestError({ message: "DB Error" });
      });

    return user;
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
    email,
    username,
    name,
    password,
  }: SignUpCredential) => {
    const newUser = await prisma.user
      .create({
        data: {
          email: email,
          name: name,
          username: username,
          password: password,
          roles: ["0000"],
        },
      })
      .catch((error) => {
        throw new BadRequestError({
          message: "Cant save user to DB",
          details: error as string,
        });
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
  static removeTokenById = async ({ userId }: { userId: number }) => {
    const removeToken = await prisma.keyToken
      .delete({
        where: {
          userId: userId,
        },
      })
      .catch((error) => {
        throw new BadRequestError({
          message: "Cant save user to DB",
          details: error as string,
        });
      });

    return removeToken;
  };
}

export default ShopService;
