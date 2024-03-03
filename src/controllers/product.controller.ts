import { NextFunction, Response } from "express";
import { CustomRequest } from "../auth/auth.utils";
import { CREATE, OK } from "../core/success.response";
import { ProductFactory } from "../services/product.service";
import { Product } from "../services/product/product.index.service";

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
      message: "Data queried",
      metadata: await Product.getAllDraftOfShop({
        shop_id: req.metadata?.userId,
      }),
    }).send(res);
  };

  static getAllPublishedProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Data queried",
      metadata: await Product.getAllPublishedOfShop({
        shop_id: req.metadata?.userId,
      }),
    }).send(res);
  };

  static publishProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const product_id = req.body.product_id;

    new CREATE({
      message: "Product published",
      metadata: await Product.publishProduct({
        shop_id: req.metadata?.userId,
        product_id: product_id,
      }),
    }).send(res);
  };

  static unPublishProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const product_id = req.body.product_id;

    new CREATE({
      message: "Product unpublished",
      metadata: await Product.unPublishProduct({
        shop_id: req.metadata?.userId,
        product_id: product_id,
      }),
    }).send(res);
  };
}
