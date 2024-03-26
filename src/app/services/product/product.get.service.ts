import { NotFoundError } from "../../core/error.response";
import { getIntoData, toCamel, toSnake } from "../../utils";
import ProductRepo from "./repository/product.get.repo";

//-----------------NoAuthen-----------------//

const getAllProduct = async ({
  limit,
  page,
}: {
  limit: number;
  page: number;
}) => {
  const products = await ProductRepo.getAllProduct({ limit, page });
  return toSnake(products);
};
/**
 * Find product by search box
 * @param searchText
 * @returns
 */
const searchPublicProduct = async (searchText: string) => {
  const products = await ProductRepo.searchPublicProduct(searchText);

  const productCamel = toCamel(products) as Record<string, any>[];

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
const getAllDraftOfShop = async ({ shopId }: { shopId: string }) => {
  const draftProducts = await ProductRepo.getAllDraftOfShop(shopId);

  const products = draftProducts.reduce((previousValue, currentValue) => {
    previousValue.push(
      getIntoData({
        fields: ["product_isdraft", "product_ispublished"],
        objects: currentValue,
        unSelect: true,
      })
    );
    return previousValue;
  }, [] as any[]);

  return { length: draftProducts.length, products: products };
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
