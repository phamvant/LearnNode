import express from "express";
import { ProductController } from "../../controllers/product.controller";
import { asyncHandler } from "../../helpers/async.handler";

const router = express.Router();

router.post("/product/create", asyncHandler(ProductController.createProduct));

router.get(
  "/product/get_draft",
  asyncHandler(ProductController.getAllDradtProduct)
);

export default router;
