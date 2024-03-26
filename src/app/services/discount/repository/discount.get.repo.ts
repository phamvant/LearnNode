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
}: {
  discountCode: string;
}) => {
  const discount = await postgres
    .query({
      text: `SELECT * FROM "Discount" WHERE discount_code = $1`,
      values: [discountCode],
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError({ message: "Cant find discount" });
    });

  return toCamel(discount.rows)[0] as Discount;
};

const DiscountGetRepo = { findDiscountById, findDiscountByCode };
export default DiscountGetRepo;
