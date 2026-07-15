// Single source of truth for the restaurant's identity — name, address,
// contact info, and opening hours. Every screen/component that needs any of
// this must import it from here rather than hardcoding its own copy.
export const RESTAURANT = {
  name: "Foodhub",
  address: "55 Duke St, Fenton, Stoke-on-Trent ST4 3NR, United Kingdom",
  phone: "020 7946 0958",
  description:
    "Foodhub, based in London, serves bold peri peri flavours and American-style classics at honest prices. Get fresh food delivered hot to your doorstep!",
  // Approximate coordinates for the SW1A postcode area, London.
  latitude: 52.99559199675261, 
  longitude: -2.153478886895461,
  // UK Food Standards Agency style rating: 0 (urgent improvement necessary)
  // to 5 (very good) — shown on the info page's Food Hygiene Rating card.
  foodHygieneRating: 4,
  foodHygieneInspectionDate: "25 Feb 2026",
  // Index 0 = Monday ... 6 = Sunday.
  openingHours: [
    { day: "Mon", pickup: ["7:00 AM - 2:00 PM", "4:00 PM - 9:00 PM"], delivery: ["7:00 AM - 2:00 PM", "4:00 PM - 9:00 PM"] },
    { day: "Tue", pickup: ["4:00 PM - 9:00 PM"], delivery: ["4:00 PM - 9:00 PM"] },
    { day: "Wed", pickup: ["7:00 AM - 2:00 PM"], delivery: ["7:00 AM - 9:00 PM"] },
    { day: "Thu", pickup: ["7:00 AM - 2:00 PM", "4:00 PM - 9:00 PM"], delivery: ["7:00 AM - 2:00 PM", "4:00 PM - 9:00 PM"] },
    { day: "Fri", pickup: ["7:00 AM - 2:00 PM", "4:00 PM - 9:00 PM"], delivery: ["7:00 AM - 2:00 PM", "4:00 PM - 9:00 PM"] },
    { day: "Sat", pickup: ["7:00 AM - 2:00 PM"], delivery: ["4:00 PM - 9:00 PM"] },
    { day: "Sun", pickup: [] as string[], delivery: [] as string[] },
  ],
} as const;

export type OpeningHoursRow = (typeof RESTAURANT.openingHours)[number];

// Short form of the address (street + area) for compact spots like the home
// screen's location bar — the full address (with city/postcode/country)
// stays on the info page.
export const RESTAURANT_SHORT_ADDRESS = RESTAURANT.address.split(",").slice(0, 2).join(",");
