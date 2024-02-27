import { Clothes } from "./clothes.service";
import { Electronics } from "./electronic.service";
import { Houseware } from "./houseware.service";

export const productTypeList = [
  {
    Clothes: Clothes,
  },
  {
    Electronics: Electronics,
  },
  {
    Houseware: Houseware,
  },
];
