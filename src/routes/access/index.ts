import express from "express";
import accessController from "../../controllers/access.controller";
import { asyncHandler } from "../../helpers/async.handler";

const router = express.Router();

router.post("/shop/signup", asyncHandler(accessController.signUp));

export default router;
