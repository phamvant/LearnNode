import {
  BadRequestError,
  ConflictRequestError,
} from "../../core/error.response";
import { Discount } from "../../models/discount.model";
import DiscountGetRepo from "./repository/discount.get.repo";
import DiscountModifyRepo from "./repository/discount.modify.repo";

const createDiscount = async (payload: Discount) => {
  if (Date.parse(payload.startDate) > Date.parse(payload.endDate)) {
    throw new BadRequestError({ message: "Start date must before end date" });
  }

  const isDiscountExisted = await DiscountGetRepo.findDiscountByCode({
    discountCode: payload.discountCode,
  });

  if (isDiscountExisted && isDiscountExisted.isActive) {
    throw new ConflictRequestError({ message: "Discount Existed" });
  }

  const newDiscount = await DiscountModifyRepo.createDiscount(payload);

  return { discount_id: payload.discountId };
};

const DiscountModifyService = {
  createDiscount,
};

export default DiscountModifyService;
