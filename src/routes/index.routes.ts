import express from "express";
import { Permission } from "..";
import { checkApiKey, permissionCheck } from "../auth/auth.utils";
import AccressRouter from "./access/access.routes";
import ProductRouter from "./product/product.routes";

const router = express.Router();

router.use(checkApiKey);

router.use(permissionCheck(Permission.PERMISSION_0000));

router.use("/v1/api", AccressRouter);

router.use("/v1/api", ProductRouter);

export default router;
