import { BadRequestError } from "../core/error.response";
import { Clothes } from "./product/clothes.service";
import { Electronics } from "./product/electronic.service";
import { Houseware } from "./product/houseware.service";

export class ProductFactory {
  static productType: Record<string, any> = {};

  static createProductType = (type: string, classRef: any) => {
    this.productType[type] = classRef;
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

ProductFactory.createProductType("Clothes", Clothes);
ProductFactory.createProductType("Electronics", Electronics);
ProductFactory.createProductType("Houseware", Houseware);
