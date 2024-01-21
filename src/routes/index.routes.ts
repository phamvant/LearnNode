import express from "express";
import { Permission } from "..";
import { checkApiKey, permissionCheck } from "../auth/auth.utils";
import accressRouter from "./access/access.routes";

const router = express.Router();

router.use(checkApiKey);

router.use(permissionCheck(Permission.PERMISSION_0000));

router.use("/v1/api", accressRouter);

export default router;
