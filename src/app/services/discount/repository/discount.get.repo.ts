import { BadRequestError } from "../../../core/error.response";
import { Discount } from "../../../models/discount.model";
import { toCamel } from "../../../utils";

const findDiscountById = async ({ discountId }: { discountId: number }) => {
  const discount = await postgres
    .query({
      text: `SELECT * FROM "Discount" WHERE discount_id = $1`,
      values: [discountId],
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError({ message: "Cant find discount" });
    });

  return discount;
};

const findDiscountByCode = async ({
  discountCode,
  discountShopId,
}: {
  discountCode: string;
  discountShopId: string;
}) => {
  const discount = await postgres
    .query({
      text: `SELECT * FROM "Discount" WHERE discount_code = $1 AND discount_shop_id = $2`,
      values: [discountCode, discountShopId],
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError({ message: "Cant find discount" });
    });

  return toCamel(discount.rows)[0] as Discount;
};

const getAllDiscountCodeByShop = async (shopId: string) => {
  const discounts = await postgres
    .query({
      text: `SELECT * FROM "Discount" WHERE discount_shop_id = $1 AND discount_is_active=TRUE`,
      values: [shopId],
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError({ message: "Cant get Discount" });
    });

  return toCamel(discounts.rows) as Discount[];
};

const CartGetRepo = {
  getAllDiscountCodeByShop,
};

const DiscountGetRepo = {
  findDiscountById,
  findDiscountByCode,
  getAllDiscountCodeByShop,
};
export default DiscountGetRepo;
