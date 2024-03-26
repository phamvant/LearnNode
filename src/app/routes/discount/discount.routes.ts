import express from "express";
import { authenticate } from "../../auth/auth.utils";
import DiscountModifyController from "../../controllers/discount/discount.modify.controller";
import { asyncHandler } from "../../helpers/async.handler";

const router = express.Router();

router.use(authenticate);

router.post("/create", asyncHandler(DiscountModifyController.createDiscount));

export default router;
