import express from "express";
import { authenticate } from "../../auth/auth.utils";
import DiscountGetController from "../../controllers/discount/discount.get.controller";
import DiscountModifyController from "../../controllers/discount/discount.modify.controller";
import { asyncHandler } from "../../helpers/async.handler";

const router = express.Router();

router.get(
  "/get-by-code",
  asyncHandler(DiscountGetController.findDiscountByCode)
);

router.use(authenticate);

router.post("/create", asyncHandler(DiscountModifyController.createDiscount));

router.get(
  "/get-all-by-shop",
  asyncHandler(DiscountGetController.getAllDiscountCodeByShop)
);

export default router;
