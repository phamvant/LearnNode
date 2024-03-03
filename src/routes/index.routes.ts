import express, { NextFunction, Response } from "express";

import { Permission } from "..";
import {
  CustomRequest,
  checkApiKey,
  permissionCheck,
} from "../auth/auth.utils";
import postgres from "../database/init.postgres";
import AccressRouter from "./access/access.routes";
import ProductRouter from "./product/product.routes";

const router = express.Router();

router.use(checkApiKey);

router.use(permissionCheck(Permission.PERMISSION_0000));

router.get(
  "/v1/api",
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await postgres.query({
      text: `INSERT INTO "ApiKey"(key, status, permission) VALUES ($1, $2, ARRAY[$3]::"permission"[])`,
      values: ["xxx", true, Permission.PERMISSION_0000],
    });
    return res.status(200).json({ Hello: "World" });
  }
);

router.use("/v1/api/shop", AccressRouter);

router.use("/v1/api/product", ProductRouter);

export default router;
