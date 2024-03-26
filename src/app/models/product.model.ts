export interface Product {
  productType: string;
  productName: string;
  productThumbs: string;
  productDescription: string;
  productPrice: number;
  productQuantity: number;
  productVariations: number[];
  productShopId: string;
  productSlug?: string;
  productRating?: number;
  productIsdraft?: boolean;
  productIspublished?: boolean;
}

export const productTypeList: Record<string, number> = {
  Clothes: 1,
  Electronics: 2,
  Houseware: 3,
};
