import { NextFunction, Response } from "express";
import { CustomRequest } from "../../auth/auth.utils";
import { CREATE } from "../../core/success.response";
import DiscountModifyService from "../../services/discount/discount.modify.service";

const createDiscount = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  new CREATE({
    message: "Discount created",
    metadata: await DiscountModifyService.createDiscount(req.body),
  }).send(res);
};

const DiscountModifyController = {
  createDiscount,
};

export default DiscountModifyController;
