import { BadRequestError } from "../../core/error.response";
import { Product } from "../../models/product.model";
import { checkNullField } from "../../utils";
import { findProductById } from "./repository/product.get.repo";
import ProductModifyRepo from "./repository/product.modify.repo";

/**
 * Create new product
 */
export const createProduct = async (payload: Product) => {
  const { productName, productId } = await ProductModifyRepo.createProduct(
    payload
  );

  return { product_name: productName, product_id: productId };
};

/**
 * Publish a product of shop
 * @param shop_id
 * @returns
 */
export const publishProduct = async ({
  shopId,
  productId,
}: {
  shopId: string;
  productId: string;
}) => {
  await ProductModifyRepo.publishProduct({ shopId, productId });

  return { product_id: productId };
};

/**
 * Unpublish a product of shop
 * @param shop_id
 * @returns
 */
export const unPublishProduct = async ({
  shopId,
  productId,
}: {
  shopId: string;
  productId: string;
}) => {
  await ProductModifyRepo.publishProduct({ shopId, productId });

  return { productId };
};

export const modifyProduct = async ({
  shop_id,
  payload,
}: {
  shop_id: string;
  payload: Record<string, string | number>;
}) => {
  const nullField = checkNullField(payload);
  const product = await findProductById(payload.productId as string);

  if (!product) {
    throw new BadRequestError({ message: "No product with queried id" });
  }

  if (product.productShopId != shop_id) {
    throw new BadRequestError({ message: "Product not belong to this shop" });
  }

  if (!nullField) {
    throw new BadRequestError({ message: "Null field contained" });
  }

  await ProductModifyRepo.modifyProduct({ shop_id, payload });

  return { modified_product: payload.productId };
};

const ProductModifyService = {
  createProduct,
  modifyProduct,
  publishProduct,
  unPublishProduct,
};

export default ProductModifyService;
