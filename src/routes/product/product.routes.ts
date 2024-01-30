import express from "express";
import { ProductController } from "../../controllers/product.controller";
import { asyncHandler } from "../../helpers/async.handler";

const router = express.Router();

router.post("/product/create", asyncHandler(ProductController.createProduct));


export default router
