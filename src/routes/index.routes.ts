import express, { NextFunction, Response } from "express";

import { Permission } from "..";
import {
  CustomRequest,
  checkApiKey,
  permissionCheck,
} from "../auth/auth.utils";
import { asyncHandler } from "../helpers/async.handler";
import AccressRouter from "./access/access.routes";
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

export default router;
