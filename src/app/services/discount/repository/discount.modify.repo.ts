import { BadRequestError } from "../../../core/error.response";
import { Discount } from "../../../models/discount.model";
import { getQueryParams } from "../../../utils";

const createDiscount = async (payload: Discount) => {
  const queryParams = getQueryParams([
    "discount_name",
    "discount_description",
    "discount_type",
    "discount_value",
    "discount_code",
    "discount_start_date",
    "discount_end_date",
    "discount_max_uses",
    "discount_uses_count",
    "discount_users_used",
    "discount_max_uses_per_user",
    "discount_min_order_value",
    "discount_shop_id",
    "discount_is_active",
    "discount_applies_to",
    "discount_product_id",
  ]);

  const newDiscount = await postgres
    .query({
      text: `INSERT INTO "Discount" ${queryParams.columnList}
      VALUES ${queryParams.valueList}; 
      `,
      values: Object.values(payload),
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError({ message: "Cant insert new discount" });
    });

  return newDiscount;
};

const DiscountModifyRepo = {
  createDiscount,
};

export default DiscountModifyRepo;
