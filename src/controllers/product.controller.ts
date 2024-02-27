import { NextFunction, Response } from "express";
import { CustomRequest } from "../auth/auth.utils";
import { CREATE, OK } from "../core/success.response";
import { ProductFactory } from "../services/product.service";
import { Product } from "../services/product/index.service";

export class ProductController {
  static createProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    new CREATE({
      message: "Product created",
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.metadata?.userId,
      }),
    }).send(res);
  };

  static getAllDradtProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "ok",
      metadata: await Product.getAllDraftOfShop({
        shop_id: req.metadata?.userId,
      }),
    }).send(res);
  };
}
