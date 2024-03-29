import { NotFoundError } from "../../core/error.response";
import { toSnake } from "../../utils";
import DiscountGetRepo from "./repository/discount.get.repo";

const getAllDiscountCodeByShop = async ({ shopId }: { shopId: string }) => {
  const discounts = await DiscountGetRepo.getAllDiscountCodeByShop(shopId);
  return toSnake(discounts);
};

const findDiscountById = async ({ discountId }: { discountId: number }) => {
  const discount = await DiscountGetRepo.findDiscountById({
    discountId,
  });

  return discount;
};

const findDiscountByCode = async ({
  discountCode,
  discountShopId,
}: {
  discountCode: string | undefined;
  discountShopId: string | undefined;
}) => {
  if (!discountCode || !discountShopId) {
    throw new NotFoundError({ message: "Invalid request" });
  }
  const discount = await DiscountGetRepo.findDiscountByCode({
    discountCode,
    discountShopId,
  });
  return discount;
};

const DiscountGetService = {
  getAllDiscountCodeByShop,
  findDiscountById,
  findDiscountByCode,
};

export default DiscountGetService;
