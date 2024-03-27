import { getQueryParams } from "../../../utils";

const createCart = async (userId: string) => {
  const queryParams = getQueryParams(["cart_user_id"]);

  const newCart = await postgres
    .query({
      text: `INSERT INTO "Cart" ${queryParams.columnList}
    VALUES ${queryParams.valueList};`,
      values: [userId],
    })
    .catch((error) => {
      console.log(error);
      return false;
    });

  return true;
};

const cartModifyRepo = {
  createCart,
};

export default cartModifyRepo;
