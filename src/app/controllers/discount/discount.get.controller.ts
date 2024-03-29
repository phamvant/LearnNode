import { NextFunction, Response } from "express";
import { CustomRequest } from "../../auth/auth.utils";
import { OK } from "../../core/success.response";
import DiscountGetService from "../../services/discount/discount.get.service";

const getAllDiscountCodeByShop = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  new OK({
    message: "Discount queried",
    metadata: await DiscountGetService.getAllDiscountCodeByShop({
      shopId: req.metadata?.userId,
    }),
  }).send(res);
};

const findDiscountByCode = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  new OK({
    message: "Discount queried",
    metadata: await DiscountGetService.findDiscountByCode({
      discountCode: req.query.discountCode as string,
      discountShopId: req.query.discountShopId as string,
    }),
  }).send(res);
};

const DiscountGetController = {
  getAllDiscountCodeByShop,
  findDiscountByCode,
};

export default DiscountGetController;
