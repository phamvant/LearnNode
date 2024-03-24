import { findUserByEmail } from "./shop.get.service";
import { removeTokenById, storeNewUser } from "./shop.modify.service";

export const ShopModifyService = {
  storeNewUser,
  removeTokenById,
};

export const ShopGetService = { findUserByEmail };
