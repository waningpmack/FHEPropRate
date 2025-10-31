import type { Config } from "tailwindcss";
import { designTokens } from "./src/design-tokens";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: designTokens.colors.light.primary,
        secondary: designTokens.colors.light.secondary,
        accent: designTokens.colors.light.accent,
        background: designTokens.colors.light.background,
        surface: designTokens.colors.light.surface,
        foreground: designTokens.colors.light.text,
        muted: designTokens.colors.light.textSecondary,
        error: designTokens.colors.light.error,
        success: designTokens.colors.light.success,
      },
      fontFamily: designTokens.typography.fontFamily,
      fontSize: designTokens.typography.sizes,
      borderRadius: designTokens.borderRadius,
      boxShadow: designTokens.shadows,
      transitionDuration: {
        DEFAULT: `${designTokens.transitions.duration}ms`,
      },
      spacing: {
        '18': `${designTokens.spacing.unit * 2.25}rem`, // 18px
        '88': `${designTokens.spacing.unit * 11}rem`,   // 88px
      },
    },
  },
  plugins: [],
};
export default config;
