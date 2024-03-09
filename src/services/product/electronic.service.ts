import { Product } from "./product.index.service";

export class Electronics extends Product {
  async createProduct() {
    const newProductName = await super.createProduct(2);
    return newProductName;
  }
}
