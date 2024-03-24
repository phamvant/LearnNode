import { BadRequestError } from "../../../core/error.response";
import { toCamel } from "../../../utils";

export const findProductById = async (
  product_id: string,
  fields = [
    "product_name",
    "product_thumb",
    "product_price",
    "product_rating",
    "product_shop_id",
  ]
) => {
  const columns = fields.reduce((sum, current) => {
    sum.push(current);
    return sum;
  }, [] as string[]);

  const product = await postgres
    .query({
      text: `SELECT ${columns.join(",")}
    FROM "Product" 
    WHERE product_id = $1`,
      values: [product_id],
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError({ message: "Cant find product by Id" });
    });

  return toCamel(product.rows)[0];
};
