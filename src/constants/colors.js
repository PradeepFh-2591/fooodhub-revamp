// Single source of truth for brand colors. Both tailwind.config.js (for
// className="bg-primary" etc.) and theme.ts (for COLORS.primary used in
// JS-level props like icon `color`) read from here, so re-theming for a
// customer's logo color only ever requires changing a value in this file.
module.exports = {
  primary: "#D82927",
  cream: "#FAF1E4",
  black: "#111111",
  textDark: "#1A1A1A",
  textGray: "#6B6B6B",
  textLightGray: "#9A9A9A",
  border: "#ECECEC",
  chipBorder: "#D9D9D9",
  success: "#009A90",
  warning: "#EF901C",
  danger: "#D62828",
  headerBg: "#111111",
  headerIcon: "#FFFFFF",
};
