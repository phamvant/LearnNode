import {
  BadRequestError,
  ConflictRequestError,
} from "../../core/error.response";
import { Discount } from "../../models/discount.model";
import DiscountGetRepo from "./repository/discount.get.repo";
import DiscountModifyRepo from "./repository/discount.modify.repo";

const createDiscount = async ({
  payload,
  userId,
}: {
  payload: Discount;
  userId: string;
}) => {
  if (
    Date.parse(payload.discountStartDate) > Date.parse(payload.discountEndDate)
  ) {
    throw new BadRequestError({ message: "Start date must before end date" });
  }

  const isDiscountExisted = await DiscountGetRepo.findDiscountByCode({
    discountCode: payload.discountCode,
    discountShopId: userId,
  });

  if (isDiscountExisted && isDiscountExisted.discountIsActive) {
    throw new ConflictRequestError({ message: "Discount Existed" });
  }

  await DiscountModifyRepo.createDiscount(payload);

  return { discount_id: payload.discountId };
};

const DiscountModifyService = {
  createDiscount,
};

export default DiscountModifyService;
