import { BadRequestError } from "../../../core/error.response";

const deleteUserById = async (userId: string) => {
  await postgres
    .query({
      text: `DELETE FROM "User" WHERE user_id=$1`,
      values: [userId],
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError({ message: "Cant delete user" });
    });
};

const UserModifyRepo = {
  deleteUserById,
};

export default UserModifyRepo;
