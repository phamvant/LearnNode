import { NextFunction, Response } from "express";
import { CustomRequest } from "../../auth/auth.utils";
import { OK } from "../../core/success.response";
import ProductGetService from "../../services/product/product.get.service";

//-----------------NoAuthen-----------------//
export const searchPublicProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  new OK({
    message: "Data queried",
    metadata: await ProductGetService.searchPublicProduct(
      req.params.searchText
    ),
  }).send(res);
};

export const getAllProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  new OK({
    message: "Products queried",
    metadata: await ProductGetService.getAllProduct({ limit: 5, page: 1 }),
  }).send(res);
};

//-----------------Authen-----------------//

export const getAllDradtProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  new OK({
    message: "Data queried",
    metadata: await ProductGetService.getAllDraftOfShop({
      shop_id: req.metadata?.userId,
    }),
  }).send(res);
};

export const getAllPublishedProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  new OK({
    message: "Data queried",
    metadata: await ProductGetService.getAllPublishedOfShop({
      shop_id: req.metadata?.userId,
    }),
  }).send(res);
};

const ProductGetController = {
  searchPublicProduct,
  getAllProduct,
  getAllDradtProduct,
  getAllPublishedProduct,
};

export default ProductGetController;
