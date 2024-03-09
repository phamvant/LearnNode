import { BadRequestError } from "../../core/error.response";

export const findProductById = async (product_id: string) => {
  const product = await postgres
    .query({
      text: `SELECT name, thumb, price, rating
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
