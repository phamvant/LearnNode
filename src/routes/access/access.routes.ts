import express from "express";
import { authenticate } from "../../auth/auth.utils";
import accessController from "../../controllers/access.controller";
import { asyncHandler } from "../../helpers/async.handler";

const router = express.Router();

router.post("/signup", asyncHandler(accessController.signUp));

router.post("/login", asyncHandler(accessController.login));

/**
 * authentication
 */
router.use(authenticate);

router.post("/refresh", asyncHandler(accessController.handleRefreshToken));

router.post("/logout", asyncHandler(accessController.logout));

export default router;
