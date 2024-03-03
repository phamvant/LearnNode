import express from "express";
import { ProductController } from "../../controllers/product.controller";
import { asyncHandler } from "../../helpers/async.handler";

const router = express.Router();

router.post("/product/create", asyncHandler(ProductController.createProduct));

router.get(
  "/product/get_draft",
  asyncHandler(ProductController.getAllDradtProduct)
);

router.get(
  "/product/get_published",
  asyncHandler(ProductController.getAllPublishedProduct)
);

router.post(
  "/product/publishProduct",
  asyncHandler(ProductController.publishProduct)
);

router.post(
  "/product/unpublishProduct",
  asyncHandler(ProductController.unPublishProduct)
);

export default router;
