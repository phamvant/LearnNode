import { BadRequestError } from "../core/error.response";
import { Clothes } from "./product/clothes.service";
import { Electronics } from "./product/electronic.service";

export class ProductFactory {
  createProduct = async (type: string, payload: any) => {
    switch (type) {
      case "Clothes":
        const newClothesName = new Clothes(payload).createProduct();
        if (!newClothesName) {
          throw new BadRequestError({
            message: "Cant create new product (Clothes)",
          });
        }
        return newClothesName;

      case "Electronics":
        const newDeviceName = new Electronics(payload).createProduct();
        if (!newDeviceName) {
          throw new BadRequestError({
            message: "Cant create new product (Electronics)",
          });
        }
        return newDeviceName;

      default:
        throw new BadRequestError({ message: "Invalid product type" });
    }
  };
}
