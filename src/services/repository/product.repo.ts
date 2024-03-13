import { BadRequestError } from "../../core/error.response";

export const findProductById = async (
  product_id: string,
  fields = ["name", "thumb", "price", "rating", "shop_id"]
) => {
  const columns = fields.reduce((sum, current) => {
    sum.push(current);
    return sum;
  }, [] as string[]);

  const product = await postgres
    .query({
      text: `SELECT ${columns.join(",")}
    FROM "Product" 
    WHERE "id" = $1`,
      values: [product_id],
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError({ message: "Cant find product by Id" });
    });

  return product.rows[0];
};
