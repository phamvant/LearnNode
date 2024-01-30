import { BadRequestError } from "../../core/error.response";
import { prisma } from "../../database/init.prisma";
import { Product } from "./index.service";

export class Electronics extends Product {
  constructor({
    product_name,
    product_thumbs,
    product_description,
    product_price,
    product_quantity,
    product_attribute,
  }: any) {
    super({
      product_name,
      product_thumbs,
      product_description,
      product_price,
      product_quantity,
      product_attribute,
    });
  }

  async createProduct() {
    console.log(this.product_name);

    const newDevice = await prisma.electronic
      .create({
        data: {
          brand: this.product_attribute.brand,
          color: this.product_attribute.color,
          material: this.product_attribute.material,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestError({ message: "Cant save device" });
      });

    if (!newDevice) {
      throw new BadRequestError({ message: "Cant save device" });
    }

    const newProductName = await super.createProduct(newDevice.id);

    if (!newProductName) {
      throw new BadRequestError({ message: "Cant save product" });
    }

    return newProductName;
  }
}
