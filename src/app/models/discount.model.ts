export interface Discount {
  discountId: number;
  discountName: string;
  discountDescription: string;
  discountType: string;
  discountValue: number;
  discountCode: string;
  discountStartDate: string;
  discountEndDate: string;
  discountMaxUses: number;
  usesCount?: number;
  usersUsed?: number;
  discountMaxUsesPerUser: number;
  discountMinOrderValue: number;
  discountShopId: string;
  discountIsActive: boolean;
  discountAppliesTo: string;
  discountProductId: string;
}
