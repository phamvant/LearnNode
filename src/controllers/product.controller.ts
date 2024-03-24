import { NextFunction, Response } from "express";
import { CustomRequest } from "../auth/auth.utils";
import { CREATE, OK } from "../core/success.response";
import { Product } from "../services/product/product.index.service";

export class ProductController {
  //-----------------NoAuthen-----------------//
  static searchPublicProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Data queried",
      metadata: await Product.searchPublicProduct(req.params.searchText),
    }).send(res);
  };

  static getAllProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Products queried",
      metadata: await Product.getAllProduct({ limit: 5, page: 1 }),
    }).send(res);
  };
  //-----------------Authen-----------------//
  static createProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    new CREATE({
      message: "Product created",
      metadata: await Product.createProduct({
        ...req.body,
        productShop: req.metadata?.userId,
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

  static modifyProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    new CREATE({
      message: "Product modfied",
      metadata: await Product.modifyProduct({
        shop_id: req.metadata?.userId,
        payload: req.body,
      }),
    }).send(res);
  };
}
