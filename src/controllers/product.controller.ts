import { NextFunction, Response } from "express";
import { CustomRequest } from "../auth/auth.utils";
import { CREATE } from "../core/success.response";
import { ProductFactory } from "../services/product.service";

export class ProductController {
  static createProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log(req.metadata);
    new CREATE({
      message: "Product created",
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.metadata?.userId,
      }),
    }).send(res);
  };
}
