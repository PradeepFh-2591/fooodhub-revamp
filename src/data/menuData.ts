export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  tag: string | null;
  image: string;
  category: string;
  subCategory?: string;
};

export type MenuOption = {
  id: string;
  label: string;
  price: number;
};

export type SubCategoryFilter = {
  label: string;
  description?: string;
};

export const HERO_IMAGE =
  "https://public.touch2success.com/static/ce7c9d9857decba736138605dbddfa1d/img/1783600209phpa2YRjE.jpg";

export const CATEGORIES = [
  "Burgers",
  "Peri Peri Chicken",
  "Grilled",
  "Wraps",
  "Pizza",
  "Sides",
  "Drinks",
  "Desserts",
  
];

// Not every category has sub-filters (e.g. Drinks/Desserts are flat lists), and
// not every sub-filter has a description — both are optional per entry.
export const SUB_FILTERS_BY_CATEGORY: Record<string, SubCategoryFilter[]> = {
  Burgers: [
    { label: "All Burgers" },
    { label: "Classic Burgers", description: "Traditional single smash-patty burgers" },
    { label: "Premium Burgers", description: "Higher-end builds with specialty toppings" },
    { label: "Chicken Burgers" },
    { label: "Loaded Burgers", description: "Stacked with extra patties, cheese & sauce" },
  ],
  "Peri Peri Chicken": [
    { label: "All Peri Peri" },
    { label: "Whole & Half", description: "Flame-grilled whole or half chickens, served with chips" },
    { label: "Wings" },
    { label: "Tenders", description: "Hand-breaded chicken tenders" },
  ],
  Grilled: [
    { label: "All Grilled" },
    { label: "Chicken" },
    { label: "Meat", description: "Char-grilled beef, pork & lamb mains" },
    { label: "Fish" },
  ],
  Wraps: [
    { label: "All Wraps" },
    { label: "Chicken" },
    { label: "Loaded", description: "Extra fillings, sauces & toppings" },
  ],
  Pizza: [
    { label: "All Pizza" },
    { label: "Classic" },
    { label: "Meat", description: "Topped with grilled or cured meats" },
    { label: "Veggie" },
  ],
  Sides: [
    { label: "All Sides" },
    { label: "Fries" },
    { label: "Salads", description: "Fresh, light options served chilled" },
    { label: "Dips" },
  ],
  // No sub-categories for these — the chip row is hidden entirely.
  Drinks: [],
  Desserts: [],
};

export const DRINK_OPTIONS: MenuOption[] = [
  { id: "coke", label: "Coke", price: 1.2 },
  { id: "diet_coke", label: "Diet Coke", price: 1.2 },
  { id: "fanta", label: "Fanta", price: 1.2 },
  { id: "sprite", label: "Sprite", price: 1.2 },
];

export const TOPPINGS: MenuOption[] = [
  { id: "cheese", label: "Extra Cheese", price: 1.0 },
  { id: "bacon", label: "Bacon", price: 1.5 },
  { id: "jalapenos", label: "Jalapenos", price: 0.5 },
  { id: "onions", label: "Fried Onions", price: 0.5 },
];

export const SIZES: MenuOption[] = [
  { id: "regular", label: "Regular", price: 0 },
  { id: "large", label: "Large", price: 1.5 },
];

export const BURGERS: Product[] = [
  {
    id: "classic-beef",
    name: "Classic Beef Burger",
    description: "Beef patty, lettuce, tomato, onion, cheese & house sauce",
    price: 6.49,
    tag: "BEST SELLER",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    category: "Burgers",
    subCategory: "Classic Burgers",
  },
  {
    id: "double-chicken",
    name: "Double Chicken Burger",
    description: "Crispy chicken, cheese, lettuce, mayo & peri peri sauce",
    price: 7.49,
    tag: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80",
    category: "Burgers",
    subCategory: "Chicken Burgers",
  },
  {
    id: "peri-peri",
    name: "Peri Peri Burger",
    description: "Grilled peri peri chicken, lettuce, onion, cheese & mayo",
    price: 6.99,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80",
    category: "Burgers",
    subCategory: "Chicken Burgers",
  },
  {
    id: "bbq-bacon",
    name: "BBQ Bacon Burger",
    description: "Beef patty, bacon, cheese, BBQ sauce, lettuce & onion",
    price: 7.49,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=80",
    category: "Burgers",
    subCategory: "Premium Burgers",
  },
  {
    id: "spicy-zinger",
    name: "Spicy Zinger Burger",
    description: "Crispy zinger fillet, lettuce, spicy mayo & cheese",
    price: 6.49,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1615297928064-24977384d0da?w=600&q=80",
    category: "Burgers",
    subCategory: "Chicken Burgers",
  },
  {
    id: "rafikiz-tower",
    name: "Rafikiz Tower Burger",
    description: "Double beef, double cheese, bacon, lettuce, onions & sauce",
    price: 8.99,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=600&q=80",
    category: "Burgers",
    subCategory: "Loaded Burgers",
  },
];

export const PERI_PERI_CHICKEN: Product[] = [
  {
    id: "whole-peri-peri-chicken",
    name: "Whole Peri Peri Chicken",
    description:
      "Flame-grilled whole chicken marinated in peri peri spice, served with chips",
    price: 12.99,
    tag: "BEST SELLER",
    image:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80",
    category: "Peri Peri Chicken",
    subCategory: "Whole & Half",
  },
  {
    id: "peri-peri-wings",
    name: "Peri Peri Chicken Wings",
    description: "Char-grilled wings basted in peri peri sauce & garlic mayo",
    price: 6.99,
    tag: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=600&q=80",
    category: "Peri Peri Chicken",
    subCategory: "Wings",
  },
  {
    id: "peri-peri-bucket",
    name: "Peri Peri Fried Chicken Bucket",
    description: "Crispy fried chicken pieces glazed in peri peri sauce",
    price: 9.99,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80",
    category: "Peri Peri Chicken",
    subCategory: "Wings",
  },
  {
    id: "peri-peri-tenders",
    name: "Peri Peri Chicken Tenders",
    description: "Golden fried chicken tenders tossed in peri peri seasoning",
    price: 6.49,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=600&q=80",
    category: "Peri Peri Chicken",
    subCategory: "Tenders",
  },
];

export const GRILLED: Product[] = [
  {
    id: "grilled-chicken-breast",
    name: "Grilled Chicken Breast",
    description:
      "Char-grilled chicken breast with lemon herb butter & seasonal veg",
    price: 8.99,
    tag: "BEST SELLER",
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&q=80",
    category: "Grilled",
    subCategory: "Chicken",
  },
  {
    id: "bbq-pork-ribs",
    name: "BBQ Pork Ribs",
    description: "Slow-cooked ribs glazed in smoky BBQ sauce, served with slaw",
    price: 11.99,
    tag: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    category: "Grilled",
    subCategory: "Meat",
  },
  {
    id: "grilled-steak-chips",
    name: "Grilled Steak & Chips",
    description: "Char-grilled sirloin steak with herb butter and crispy chips",
    price: 13.99,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80",
    category: "Grilled",
    subCategory: "Meat",
  },
  {
    id: "grilled-salmon",
    name: "Grilled Salmon Fillet",
    description: "Pan-seared salmon fillet with citrus salsa & sautéed greens",
    price: 12.49,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    category: "Grilled",
    subCategory: "Fish",
  },
  {
    id: "chicken-skewers",
    name: "Grilled Chicken Skewers",
    description: "Marinated chicken skewers grilled over open flame with fries",
    price: 9.49,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&q=80",
    category: "Grilled",
    subCategory: "Chicken",
  },
];

export const WRAPS: Product[] = [
  {
    id: "chicken-tacos",
    name: "Chicken Tacos",
    description: "Soft tortillas filled with grilled chicken, slaw & chipotle mayo",
    price: 7.49,
    tag: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1611250188496-e966043a0629?w=600&q=80",
    category: "Wraps",
    subCategory: "Chicken",
  },
  {
    id: "street-tacos",
    name: "Street Tacos",
    description: "Slow-cooked meat tacos topped with fresh coriander & onion",
    price: 7.99,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600&q=80",
    category: "Wraps",
    subCategory: "Loaded",
  },
  {
    id: "loaded-taco-plate",
    name: "Loaded Taco Plate",
    description: "Three loaded tacos with beans, cheese, guacamole & salsa",
    price: 8.99,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80",
    category: "Wraps",
    subCategory: "Loaded",
  },
];

export const PIZZA: Product[] = [
  {
    id: "margherita-pizza",
    name: "Margherita Pizza",
    description: "Classic tomato base, mozzarella & fresh basil",
    price: 8.49,
    tag: "BEST SELLER",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    category: "Pizza",
    subCategory: "Classic",
  },
  {
    id: "veggie-supreme-pizza",
    name: "Veggie Supreme Pizza",
    description: "Loaded with peppers, mushrooms, olives & sweetcorn",
    price: 9.49,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=80",
    category: "Pizza",
    subCategory: "Veggie",
  },
  {
    id: "bbq-chicken-pizza",
    name: "BBQ Chicken Pizza",
    description: "BBQ base topped with grilled chicken, red onion & mozzarella",
    price: 9.99,
    tag: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    category: "Pizza",
    subCategory: "Meat",
  },
];

export const SIDES: Product[] = [
  {
    id: "loaded-cheese-fries",
    name: "Loaded Cheese Fries",
    description: "Crispy fries topped with melted cheese & herbs",
    price: 4.49,
    tag: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
    category: "Sides",
    subCategory: "Fries",
  },
  {
    id: "classic-fries",
    name: "Classic Fries",
    description: "Golden, crispy skin-on fries",
    price: 2.99,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&q=80",
    category: "Sides",
    subCategory: "Fries",
  },
  {
    id: "garden-salad",
    name: "Garden Salad",
    description: "Fresh mixed greens, cherry tomatoes, cucumber & house dressing",
    price: 4.99,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=600&q=80",
    category: "Sides",
    subCategory: "Salads",
  },
  {
    id: "rainbow-salad-bowl",
    name: "Rainbow Salad Bowl",
    description: "A colourful mix of fresh vegetables, avocado & grains",
    price: 5.99,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=600&q=80",
    category: "Sides",
    subCategory: "Salads",
  },
  {
    id: "hummus-pita",
    name: "Hummus & Pita",
    description: "Creamy hummus topped with feta & pomegranate, warm pita",
    price: 4.49,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=600&q=80",
    category: "Sides",
    subCategory: "Dips",
  },
];

export const DRINKS: Product[] = [
  {
    id: "coca-cola-can",
    name: "Coca-Cola Can",
    description: "330ml can, ice cold",
    price: 1.5,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=80",
    category: "Drinks",
  },
  {
    id: "fresh-lemonade",
    name: "Fresh Lemonade",
    description: "Homemade lemonade with mint & lime",
    price: 2.99,
    tag: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80",
    category: "Drinks",
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    description: "Chilled iced tea served over ice with lime",
    price: 2.49,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
    category: "Drinks",
  },
  {
    id: "chocolate-milkshake",
    name: "Chocolate Milkshake",
    description: "Thick chocolate milkshake topped with whipped cream",
    price: 4.49,
    tag: "BEST SELLER",
    image:
      "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&q=80",
    category: "Drinks",
  },
];

export const DESSERTS: Product[] = [
  {
    id: "chocolate-fudge-cake",
    name: "Chocolate Fudge Cake",
    description: "Rich chocolate sponge layered with fudge frosting",
    price: 4.99,
    tag: "BEST SELLER",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    category: "Desserts",
  },
  {
    id: "molten-brownie",
    name: "Molten Brownie & Ice Cream",
    description: "Warm chocolate brownie with vanilla ice cream & caramel sauce",
    price: 5.49,
    tag: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80",
    category: "Desserts",
  },
  {
    id: "strawberry-crepes",
    name: "Strawberry Crepes",
    description: "Delicate crepes filled with fresh strawberries & cream",
    price: 5.99,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80",
    category: "Desserts",
  },
  {
    id: "choc-chip-cookies",
    name: "Chocolate Chip Cookies",
    description: "Warm, gooey chocolate chip cookies, baked fresh",
    price: 3.49,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80",
    category: "Desserts",
  },
];

export const MENU_ITEMS: Product[] = [
  ...BURGERS,
  ...PERI_PERI_CHICKEN,
  ...GRILLED,
  ...WRAPS,
  ...PIZZA,
  ...SIDES,
  ...DRINKS,
  ...DESSERTS,
];
