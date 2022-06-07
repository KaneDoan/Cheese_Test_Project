import { Session } from "express-session";

type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

declare module "express-session" {
  interface Session {
    views: number;
    cart: CartItemType[][];
  }
}
