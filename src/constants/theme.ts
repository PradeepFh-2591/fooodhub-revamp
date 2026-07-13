import BRAND_COLORS from "./colors";

// BRAND_COLORS is also read by tailwind.config.js, so bg-primary/text-primary/
// etc. and COLORS.primary always stay in sync — re-theming for a customer's
// logo color only means editing colors.js.
export const COLORS = {
  ...BRAND_COLORS,
  white: "#FFFFFF",
  overlay: "rgba(0,0,0,0.55)",
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

export const FONT = {
  h1: 26,
  h2: 20,
  h3: 17,
  body: 14,
  small: 12,
  tiny: 11,
} as const;

export const MAX_CONTENT_WIDTH = 1400;
