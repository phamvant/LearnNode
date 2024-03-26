export interface Discount {
  discountId: number;
  discountName: string;
  discountDescription: string;
  discountType: string;
  discountValue: number;
  discountCode: string;
  startDate: string;
  endDate: string;
  maxUses: number;
  usesCount?: number;
  usersUsed?: number;
  maxUsesPerUser: number;
  minOrderValue: number;
  shopId: string;
  isActive: boolean;
  appliesTo: string;
  productId: string;
}
