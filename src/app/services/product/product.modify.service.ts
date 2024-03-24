import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import {
  BadRequestError,
  ServerUnavailableError,
} from "../../core/error.response";
import {
  checkNullField,
  getIntoData,
  getQueryParams,
  getUpdateQueryParams,
} from "../../utils";
import { productTypeList } from "./product.type.config";
import { findProductById } from "./repository/product.repo";

export interface CommonProduct {
  productType: string;
  productName: string;
  productThumbs: string;
  productDescription: string;
  productPrice: number;
  productQuantity: number;
  productVariations: number[];
  productShop: number;
  productSlug?: string;
  productRating?: number;
  productIsdraft?: boolean;
  productIspublished?: boolean;
}

/**
 * Create new product
 */
export const createProduct = async (payload: CommonProduct) => {
  const productId = uuidv4();

  const insertProduct = getQueryParams([
    "product_id",
    "product_category_id",
    "product_shop_id",
    "product_name",
    "product_thumb",
    "product_description",
    "product_price",
    "product_slug",
  ]);

  const insertVariant = getQueryParams(
    ["product_variation_product_id", "product_variation_variation_id"],
    2
  );

  //Create connect for transaction
  const client = await postgres.connect().catch((e) => {
    throw new ServerUnavailableError({ message: e as string });
  });

  try {
    await client.query("BEGIN");

    /**
     * Create Product Record
     */

    await client.query({
      text: `INSERT INTO "Product" ${insertProduct.columnList}
        VALUES ${insertProduct.valueList}; 
        `,
      values: [
        productId,
        productTypeList[payload.productType],
        payload.productShop,
        payload.productName,
        payload.productThumbs,
        payload.productDescription,
        payload.productPrice,
        _.kebabCase(payload.productName).toString(),
      ],
    });

    /**
     * Create Product_Variation Record
     */
    await client.query({
      text: `INSERT INTO "ProductVariation" ${insertVariant.columnList}
      VALUES ${insertVariant.valueList}`,
      values: payload.productVariations.reduce((returnValue, currentValue) => {
        return [...returnValue, ...[productId, currentValue]];
      }, [] as any[]),
    });

    /**
     * Create Inventory Record
     */
    await client.query({
      text: `INSERT INTO "Inventory"(inventory_product_id, inventory_quantity)
           VALUES ($1, $2)`,
      values: [productId, payload.productQuantity],
    });

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    console.log(error);
    throw new ServerUnavailableError({
      message: "Query failed at createProduct",
    });
  }

  return { product_name: payload.productName };
};

/**
 * Publish a product of shop
 * @param shop_id
 * @returns
 */
export const publishProduct = async ({
  shop_id,
  product_id,
}: {
  shop_id: string;
  product_id: string;
}) => {
  await postgres
    .query({
      text: `UPDATE "Product"
        SET product_ispublished = TRUE, product_isdraft = FALSE
        WHERE product_shop_id = $1 
        AND product_id = $2`,
      values: [shop_id, product_id],
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError({ message: "Cant publish product" });
    });

  return { product_id };
};

/**
 * Unpublish a product of shop
 * @param shop_id
 * @returns
 */
export const unPublishProduct = async ({
  shop_id,
  product_id,
}: {
  shop_id: string;
  product_id: string;
}) => {
  await postgres
    .query({
      text: `UPDATE "Product"
        SET product_ispublished = FALSE, product_isdraft = TRUE
        WHERE product_shop_id = $1 
        AND product_id = $2`,
      values: [shop_id, product_id],
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError({ message: "Cant unpublish product" });
    });

  return { product_id };
};

export const modifyProduct = async ({
  shop_id,
  payload,
}: {
  shop_id: string;
  payload: Record<string, string | number>;
}) => {
  const nullField = checkNullField(payload);
  const product = await findProductById(payload.product_id as string);

  if (!product) {
    throw new BadRequestError({ message: "No product with queried id" });
  }

  if (product.productShopId != shop_id) {
    throw new BadRequestError({ message: "Product not belong to this shop" });
  }

  if (!nullField) {
    throw new BadRequestError({ message: "Null field contained" });
  }

  const queryData = getIntoData({
    fields: ["id"],
    objects: payload,
    unSelect: true,
  });

  const params = getUpdateQueryParams(queryData);

  await postgres
    .query({
      text: `UPDATE "Product"
      SET ${params.params}
      WHERE "product_id" = $${params.length + 1}
      `,
      values: [...Object.values(queryData), payload.product_id],
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError({ message: "Cant modify product" });
    });

  return { modifiedProduct: payload.product_id };
};

const ProductModifyService = {
  createProduct,
  modifyProduct,
  publishProduct,
  unPublishProduct,
};

export default ProductModifyService;
