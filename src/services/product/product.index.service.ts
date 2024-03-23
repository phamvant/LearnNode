import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import {
  BadRequestError,
  NotFoundError,
  ServerUnavailableError,
} from "../../core/error.response";
import {
  checkNullField,
  getIntoData,
  getQueryParams,
  getUpdateQueryParams,
  toCamel,
  toSnake,
} from "../../utils";
import { findProductById } from "../repository/product.repo";
import { productTypeList } from "./product.type.config";

interface CommonProduct {
  product_type: string;
  product_name: string;
  product_thumbs: string;
  product_description: string;
  product_price: number;
  product_quantity: number;
  product_variations: number[];
  product_shop: number;
  product_slug?: string;
  product_rating?: number;
  isDraft?: boolean;
  isPublished?: boolean;
}

export class Product {
  //-----------------NoAuthen-----------------//

  static getAllProduct = async ({
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
  static searchPublicProduct = async (searchText: string) => {
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

    const productCamel = toCamel(products.rows);

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

  //-----------------Authen-----------------//
  /**
   * Create new product
   */
  static async createProduct(payload: CommonProduct) {
    const product_id = uuidv4();
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
          product_id,
          productTypeList[payload.product_type],
          payload.product_shop,
          payload.product_name,
          payload.product_thumbs,
          payload.product_description,
          payload.product_price,
          _.kebabCase(payload.product_name).toString(),
        ],
      });

      /**
       * Create Product_Variation Record
       */
      await client.query({
        text: `INSERT INTO "ProductVariation" ${insertVariant.columnList}
      VALUES ${insertVariant.valueList}`,
        values: payload.product_variations.reduce(
          (returnValue, currentValue) => {
            return [...returnValue, ...[product_id, currentValue]];
          },
          [] as any[]
        ),
      });

      /**
       * Create Inventory Record
       */
      await client.query({
        text: `INSERT INTO "Inventory"(inventory_product_id, inventory_quantity)
           VALUES ($1, $2)`,
        values: [product_id, payload.product_quantity],
      });

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");

      console.log(error);
      throw new ServerUnavailableError({
        message: "Query failed at createProduct",
      });
    }

    return { product_name: payload.product_name };
  }

  /**
   * Get all draft product of shop
   * @param shop_id
   * @returns
   */
  static getAllDraftOfShop = async ({ shop_id }: { shop_id: string }) => {
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
  static getAllPublishedOfShop = async ({ shop_id }: { shop_id: string }) => {
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

  /**
   * Publish a product of shop
   * @param shop_id
   * @returns
   */
  static publishProduct = async ({
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
  static unPublishProduct = async ({
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

  static modifyProduct = async ({
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
      fields: ["product_id"],
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
}
