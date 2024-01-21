import express from "express";
import { authenticate } from "../../auth/auth.utils";
import accessController from "../../controllers/access.controller";
import { asyncHandler } from "../../helpers/async.handler";

const router = express.Router();

router.post("/shop/signup", asyncHandler(accessController.signUp));

router.post("/shop/login", asyncHandler(accessController.login));

/**
 * authentication
 */
router.use(authenticate);

router.post("/shop/logout", asyncHandler(accessController.logout));

export default router;
