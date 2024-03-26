import { NextFunction, Response } from "express";
import { CustomRequest } from "../../auth/auth.utils";
import { CREATE } from "../../core/success.response";
import ProductModifyService from "../../services/product/product.modify.service";

const createProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  new CREATE({
    message: "Product created",
    metadata: await ProductModifyService.createProduct({
      ...req.body,
      productShopId: req.metadata?.userId,
    }),
  }).send(res);
};

const publishProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const productId = req.body.productId;

  new CREATE({
    message: "Product published",
    metadata: await ProductModifyService.publishProduct({
      shopId: req.metadata?.userId,
      productId: productId,
    }),
  }).send(res);
};

const unPublishProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const productId = req.body.productId;

  new CREATE({
    message: "Product unpublished",
    metadata: await ProductModifyService.unPublishProduct({
      shopId: req.metadata?.userId,
      productId: productId,
    }),
  }).send(res);
};

const modifyProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  new CREATE({
    message: "Product modfied",
    metadata: await ProductModifyService.modifyProduct({
      shop_id: req.metadata?.userId,
      payload: req.body,
    }),
  }).send(res);
};

const ProductModifyController = {
  createProduct,
  publishProduct,
  unPublishProduct,
  modifyProduct,
};

export default ProductModifyController;
