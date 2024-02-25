import { Product } from "./index.service";

export class Houseware extends Product {
  constructor({
    product_name,
    product_thumbs,
    product_description,
    product_price,
    product_quantity,
    product_variations,
    product_shop,
  }: any) {
    super({
      product_name,
      product_thumbs,
      product_description,
      product_price,
      product_quantity,
      product_variations,
      product_shop,
    });
  }

  async createProduct() {
    const newProductName = await super.createProduct(3);

    return newProductName;
  }
}
