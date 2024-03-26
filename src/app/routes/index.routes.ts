import express, { NextFunction, Response } from "express";

import {
  CustomRequest,
  checkApiKey,
  permissionCheck,
} from "../auth/auth.utils";
import { asyncHandler } from "../helpers/async.handler";
import { Permission } from "../type.index";
import AccressRouter from "./access/access.routes";
import DiscountRouter from "./discount/discount.routes";
import ProductRouter from "./product/product.routes";

const router = express.Router();

router.get(
  "",
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    return res.status(200).json({ Hello: "World" });
  }
);

router.use(asyncHandler(checkApiKey));

router.use(permissionCheck(Permission.PERMISSION_0000));

router.use("/v1/api/shop", AccressRouter);

router.use("/v1/api/product", ProductRouter);

router.use("/v1/api/discount", DiscountRouter);

export default router;
