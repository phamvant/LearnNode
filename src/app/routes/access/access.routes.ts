import express from "express";
import { authenticate } from "../../auth/auth.utils";
import AccessController from "../../controllers/access/access.controller";
import { asyncHandler } from "../../helpers/async.handler";

const router = express.Router();

router.post("/signup", asyncHandler(AccessController.signUp));

router.post("/login", asyncHandler(AccessController.login));

/**
 * authentication
 */
router.use(authenticate);

router.post("/refresh", asyncHandler(AccessController.handleRefreshToken));

router.post("/logout", asyncHandler(AccessController.logout));

export default router;
