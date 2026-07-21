const BRAND_COLORS = require("./src/constants/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Overrides Tailwind's default sans stack — Preflight (from
        // `@tailwind base` in global.css) applies this to `html`, so every
        // element inherits it without needing a className anywhere.
        sans: ["Lato", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        primary: BRAND_COLORS.primary,
        cream: BRAND_COLORS.cream,
        "brand-black": BRAND_COLORS.black,
        "text-dark": BRAND_COLORS.textDark,
        "text-gray": BRAND_COLORS.textGray,
        "text-light-gray": BRAND_COLORS.textLightGray,
        "border-light": BRAND_COLORS.border,
        "chip-border": BRAND_COLORS.chipBorder,
        success: BRAND_COLORS.success,
        warning: BRAND_COLORS.warning,
        danger: BRAND_COLORS.danger,
        "header-bg": BRAND_COLORS.headerBg,
        "header-icon": BRAND_COLORS.headerIcon,
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        xxl: "28px",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "18px",
        pill: "999px",
      },
      fontSize: {
        // Base sizes (mobile / narrow viewports).
        h1: "30px",
        h2: "23px",
        h3: "19px",
        body: "16px",
        small: "13px",
        tiny: "12px",
        // "-lg" variants, applied via the `md:` breakpoint for wider
        // (tablet/desktop/web) viewports — see components for `md:text-*-lg`.
        "h1-lg": "38px",
        "h2-lg": "27px",
        "h3-lg": "21px",
        "body-lg": "17px",
        "small-lg": "15px",
        "tiny-lg": "13px",
      },
      maxWidth: {
        content: "1400px",
      },
      screens: {
        // Product grid column breakpoints (2 / 3 / 4 columns) — kept
        // separate from the default sm/md/lg breakpoints used for type scale.
        cols3: "600px",
        cols4: "900px",
      },
    },
  },
  plugins: [],
};
