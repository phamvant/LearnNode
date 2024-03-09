import { Product } from "./product.index.service";

export class Clothes extends Product {
  async createProduct() {
    const newProductName = await super.createProduct(1);
    return newProductName;
  }
}
