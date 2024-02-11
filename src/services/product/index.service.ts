import { BadRequestError } from "../../core/error.response";

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
  }

  async createProduct(productId: string) {
    const newProduct = await postgres.query({
      text: `INSERT INTO "Product"(id, name, thumb, description, price, shop_id)
      VALUES ($1, $2, $3, $4, $5, $6);
      `,
      values: [
        productId,
        this.product_name,
        this.product_thumbs,
        this.product_description,
        this.product_price,
        this.product_shop,
      ],
    });

    if (!newProduct.rowCount) {
      throw new BadRequestError({ message: "Cant save new product" });
    }

    const newProductInventory = await postgres.query({
      text: `INSERT INTO "ProductInventory"(productId, quantity)
     VALUES ($1, $2);
     `,
      values: [productId, this.product_quantity],
    });

    if (!newProductInventory.rowCount) {
      throw new BadRequestError({
        message: "Cant save new product quantity",
      });
    }
    return { product_name: this.product_name };
  }
}
