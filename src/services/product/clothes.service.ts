import { BadRequestError } from "../../core/error.response";
import { prisma } from "../../database/init.prisma";
import { Product } from "./index.service";

export class Clothes extends Product {
  constructor({
    product_name,
    product_thumbs,
    product_description,
    product_price,
    product_quantity,
    product_attribute,
    product_shop,
  }: any) {
    super({
      product_name,
      product_thumbs,
      product_description,
      product_price,
      product_quantity,
      product_attribute,
      product_shop,
    });
  }

  async createProduct() {
    const newClothes = await prisma.clothes
      .create({
        data: {
          brand: this.product_attribute.brand,
          size: this.product_attribute.size,
          material: this.product_attribute.material,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestError({ message: "Cant save clothes" });
      });

    if (!newClothes) {
      throw new BadRequestError({ message: "Cant save clothes" });
    }

    const newProductName = await super.createProduct(newClothes.id);

    if (!newProductName) {
      throw new BadRequestError({ message: "Cant save product" });
    }

    return newProductName;
  }
}
