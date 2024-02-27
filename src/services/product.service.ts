import { BadRequestError } from "../core/error.response";
import { productTypeList } from "./product/product.type.config";

export class ProductFactory {
  static productType: Record<string, any> = {};

  static createProductType = async () => {
    productTypeList.forEach(async (productType, index) => {
      this.productType[Object.keys(productType)[0]] =
        Object.values(productType)[0];
    });
  };

  static createProduct = async (type: string, payload: any) => {
    const newProductName = new this.productType[type](payload).createProduct();
    if (!newProductName) {
      throw new BadRequestError({
        message: "Cant create new product",
      });
    }
    return newProductName;
  };
}

ProductFactory.createProductType();
