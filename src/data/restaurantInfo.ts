import { BURGERS, SIDES } from "./menuData";

export type Cuisine = {
  label: string;
  image: string;
};

export const CUISINES: Cuisine[] = [
  { label: "Burgers", image: BURGERS[0].image },
  { label: "Fries", image: SIDES.find((item) => item.id === "classic-fries")!.image },
  { label: "Breakfast", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80" },
];
