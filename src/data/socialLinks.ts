import { COLORS } from "../constants/theme";

export type SocialLink = {
  key: string;
  // "fontawesome" is used where the plain brand glyph (e.g. just the "f") is
  // wanted instead of Ionicons' circular/badge-style logo icon.
  iconSet: "ionicons" | "fontawesome";
  icon: string;
  url: string;
  color: string;
};

// Single source of truth for the restaurant's social media links, used by
// LocationBar and anywhere else they're shown. Kept in its own file so this
// can later be swapped for data fetched from a CRM without touching the
// components that render it.
export const SOCIAL_LINKS: SocialLink[] = [
  {
    key: "facebook",
    iconSet: "fontawesome",
    icon: "facebook-f",
    url: "https://www.facebook.com/Foodhub.co.uk",
    color: "#1877F2",
  },
  {
    key: "instagram",
    iconSet: "ionicons",
    icon: "logo-instagram",
    url: "https://www.instagram.com/foodhub.co.uk",
    color: "#E1306C",
  },
  {
    key: "youtube",
    iconSet: "ionicons",
    icon: "logo-youtube",
    url: "https://www.youtube.com/channel/UC12E2pidPaspN8tWTvaRs-A",
    color: "#FF0000",
  },
  {
    key: "tiktok",
    iconSet: "ionicons",
    icon: "logo-tiktok",
    url: "https://www.tiktok.com/@foodhubuk",
    color: COLORS.textDark,
  },
];
