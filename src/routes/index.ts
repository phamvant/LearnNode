import express from "express";
import { Permission } from "..";
import { checkByApiKey, permissionCheck } from "../auth/checkAuthByApiKey";
import accressRouter from "./access";

const router = express.Router();

router.use(checkByApiKey);

router.use(permissionCheck(Permission.PERMISSION_0000));

router.use("/v1/api", accressRouter);

export default router;
