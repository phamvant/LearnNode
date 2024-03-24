import { NotFoundError } from "../../core/error.response";
import { getIntoData, toCamel, toSnake } from "../../utils";

//-----------------NoAuthen-----------------//

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

  return products.rows;
};
/**
 * Find product by search box
 * @param searchText
 * @returns
 */
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

  const productCamel = toCamel(products.rows) as Record<string, any>[];

  const ret = productCamel.reduce((previousValue, currentValue) => {
    previousValue.push(
      getIntoData({
        fields: ["productIsdraft", "productIspublished"],
        objects: currentValue,
        unSelect: true,
      })
    );
    return previousValue;
  }, []) as Record<string, any>[];

  return toSnake(ret);
};

/**
 * Get all draft product of shop
 * @param shop_id
 * @returns
 */
const getAllDraftOfShop = async ({ shop_id }: { shop_id: string }) => {
  const draftProduct = await postgres
    .query({
      text: `SELECT "Product".*
      FROM "Product", "User"
      WHERE "Product".product_shop_id = "User".user_id
      AND "Product".product_shop_id = $1 AND "Product".product_isdraft= TRUE`,
      values: [shop_id],
    })
    .catch((error) => {
      console.log(error);
      throw new NotFoundError({ message: "Not found draft" });
    });

  const products = draftProduct.rows.reduce((previousValue, currentValue) => {
    previousValue.push(
      getIntoData({
        fields: ["product_isdraft", "product_ispublished"],
        objects: currentValue,
        unSelect: true,
      })
    );
    return previousValue;
  }, []);

  return { length: draftProduct.rowCount, products: products };
};

/**
 * Get all public product of shop
 * @param shop_id
 * @returns
 */
const getAllPublishedOfShop = async ({ shop_id }: { shop_id: string }) => {
  const publishedProduct = await postgres
    .query({
      text: `SELECT "Product".*
      FROM "Product", "User"
      WHERE "Product".product_shop_id = "User".user_id
      AND "Product".product_shop_id = $1 AND "Product".product_ispublished = TRUE`,
      values: [shop_id],
    })
    .catch((error) => {
      console.log(error);
      throw new NotFoundError({ message: "Not found published" });
    });

  const products = publishedProduct.rows.reduce(
    (previousValue, currentValue) => {
      previousValue.push(
        getIntoData({
          fields: ["product_isdraft", "product_ispublished"],
          objects: currentValue,
          unSelect: true,
        })
      );
      return previousValue;
    },
    []
  );

  return { length: publishedProduct.rowCount, products: products };
};

const ProductGetService = {
  getAllDraftOfShop,
  getAllProduct,
  getAllPublishedOfShop,
  searchPublicProduct,
};

export default ProductGetService;
