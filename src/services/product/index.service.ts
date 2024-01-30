import { BadRequestError } from "../../core/error.response";
import { prisma } from "../../database/init.prisma";

export class Product {
  product_name: string;
  product_thumbs: string;
  product_description: string;
  product_price: number;
  product_quantity: number;
  product_attribute: Record<string, any>;
  product_shop: number;

  constructor({
    product_name,
    product_thumbs,
    product_description,
    product_price,
    product_quantity,
    product_attribute,
    product_shop,
  }: any) {
    this.product_name = product_name;
    this.product_thumbs = product_thumbs;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_attribute = product_attribute;
    this.product_shop = product_shop;

    console.log(product_shop);
  }

  async createProduct(productId: string) {
    const newProduct = await prisma.product
      .create({
        data: {
          id: productId,
          name: this.product_name,
          thumb: this.product_thumbs,
          description: this.product_description,
          price: this.product_price,
          shop_id: this.product_shop,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestError({ message: "Cant save new product" });
      });

    if (!newProduct) {
      throw new BadRequestError({ message: "Cant save new product" });
    }

    const newProductInventory = await prisma.productInventory
      .create({
        data: {
          productId: newProduct.id,
          quantity: this.product_quantity,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestError({
          message: "Cant save new product quantity",
        });
      });

    if (!newProductInventory) {
      throw new BadRequestError({
        message: "Cant save new product quantity",
      });
    }
    return { product_name: newProduct.name };
  }
}
