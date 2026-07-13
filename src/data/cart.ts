import { Product } from "./menuData";

export type CartItem = {
  product: Product;
  sizeId: string;
  toppingIds: string[];
  drinkId: string;
  quantity: number;
  total: number;
};
