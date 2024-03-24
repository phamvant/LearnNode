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
      productShop: req.metadata?.userId,
    }),
  }).send(res);
};

const publishProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const product_id = req.body.product_id;

  new CREATE({
    message: "Product published",
    metadata: await ProductModifyService.publishProduct({
      shop_id: req.metadata?.userId,
      product_id: product_id,
    }),
  }).send(res);
};

const unPublishProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const product_id = req.body.product_id;

  new CREATE({
    message: "Product unpublished",
    metadata: await ProductModifyService.unPublishProduct({
      shop_id: req.metadata?.userId,
      product_id: product_id,
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
