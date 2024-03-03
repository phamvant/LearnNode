import express from "express";
import { authenticate } from "../../auth/auth.utils";
import { ProductController } from "../../controllers/product.controller";
import { asyncHandler } from "../../helpers/async.handler";

const router = express.Router();

//-----------------NoAuthen-----------------//
router.get("/:searchText", asyncHandler(ProductController.searchPublicProduct));

//-----------------Authen-----------------//
router.use(authenticate);

router.post("/create", asyncHandler(ProductController.createProduct));

router.get("/get_draft", asyncHandler(ProductController.getAllDradtProduct));

router.get(
  "/get_published",
  asyncHandler(ProductController.getAllPublishedProduct)
);

router.post("/publishProduct", asyncHandler(ProductController.publishProduct));

router.post(
  "/unpublishProduct",
  asyncHandler(ProductController.unPublishProduct)
);

export default router;
