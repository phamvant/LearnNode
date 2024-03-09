import { Product } from "./product.index.service";

export class Houseware extends Product {
  async createProduct() {
    const newProductName = await super.createProduct(3);

    return newProductName;
  }
}
