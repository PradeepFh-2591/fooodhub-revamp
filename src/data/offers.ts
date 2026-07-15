export type Offer = {
  id: string;
  title: string;
  subtitle: string;
  details: string[];
};

// Single source of truth for the promo offers shown in the home screen's
// OffersBanner / OffersModal — add or remove entries here to change what's
// advertised, no component changes needed.
export const OFFERS: Offer[] = [
  {
    id: "bogo-burgers",
    title: "Buy 1 Get 1 FREE",
    subtitle: "On selected burgers",
    details: ["Valid on Delivery & Pickup", "Cheapest item free", "Available daily", "Only on selected items"],
  },
  {
    id: "10-off",
    title: "Get 10% OFF",
    subtitle: "On orders over £30",
    details: ["Valid on Delivery & Pickup", "Up to £25 savings", "Available daily", "Only on selected items"],
  },
];
