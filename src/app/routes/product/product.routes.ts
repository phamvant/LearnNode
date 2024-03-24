import express from "express";
import { authenticate } from "../../auth/auth.utils";
import ProductGetController from "../../controllers/product/product.get.controller";
import ProductModifyController from "../../controllers/product/product.modify.controller";
import { asyncHandler } from "../../helpers/async.handler";

const router = express.Router();

//-----------------NoAuthen-----------------//
router.get(
  "/search/:searchText",
  asyncHandler(ProductGetController.searchPublicProduct)
);

router.get("/", asyncHandler(ProductGetController.getAllProduct));
//-----------------Authen-----------------//
router.use(authenticate);

router.post("/create", asyncHandler(ProductModifyController.createProduct));

router.get("/get_draft", asyncHandler(ProductGetController.getAllDradtProduct));

router.get(
  "/get_published",
  asyncHandler(ProductGetController.getAllPublishedProduct)
);

router.post(
  "/publishProduct",
  asyncHandler(ProductModifyController.publishProduct)
);

router.post(
  "/unpublishProduct",
  asyncHandler(ProductModifyController.unPublishProduct)
);

router.post(
  "/modifyProduct",
  asyncHandler(ProductModifyController.modifyProduct)
);

export default router;
