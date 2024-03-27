import { BadRequestError } from "../../core/error.response";
import cartModifyRepo from "./repository/cart.modify.repo";

const createCart = async (userId: string) => {
  const newCart = await cartModifyRepo.createCart(userId);

  if (!newCart) {
    throw new BadRequestError({ message: "Cant create cart" });
  }

  return { user_id: userId };
};

const CartModfyService = {
  createCart,
};

export default CartModfyService;
