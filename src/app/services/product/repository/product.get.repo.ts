import { BadRequestError, NotFoundError } from "../../../core/error.response";
import { Product } from "../../../models/product.model";
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

  return toCamel(product.rows)[0] as Product;
};

const getAllProduct = async ({
  limit,
  page,
}: {
  limit: number;
  page: number;
}) => {
  const products = await postgres
    .query({
      text: `SELECT product_name, product_thumb, product_price, product_rating
      FROM "Product"
      WHERE product_ispublished = TRUE
      ORDER BY product_rating DESC
      LIMIT $1 OFFSET $2`,
      values: [limit, (page - 1) * limit],
    })
    .catch((error) => {
      console.log(error);
      throw new NotFoundError({ message: "Cant get products" });
    });

  return toCamel(products.rows) as Product[];
};

const searchPublicProduct = async (searchText: string) => {
  const products = await postgres
    .query({
      text: `SELECT *
      FROM "Product"
      WHERE to_tsvector(product_name) @@ plainto_tsquery($1)
      AND product_ispublished = TRUE
      ORDER BY ts_rank(to_tsvector(product_name), plainto_tsquery($1)) DESC
      LIMIT 50; `,
      values: [searchText],
    })

    .catch((error) => {
      console.log(error);
      throw new NotFoundError({ message: "Cant find product" });
    });

  return toCamel(products.rows) as Product[];
};

const getAllDraftOfShop = async (shopId: string) => {
  const draftProduct = await postgres
    .query({
      text: `SELECT "Product".*
      FROM "Product", "User"
      WHERE "Product".product_shop_id = "User".user_id
      AND "Product".product_shop_id = $1 AND "Product".product_isdraft= TRUE`,
      values: [shopId],
    })
    .catch((error) => {
      console.log(error);
      throw new NotFoundError({ message: "Not found draft" });
    });

  return toCamel(draftProduct.rows) as Product[];
  // return draftProduct;
};

const ProductGetRepo = {
  findProductById,
  getAllProduct,
  searchPublicProduct,
  getAllDraftOfShop,
};

export default ProductGetRepo;
