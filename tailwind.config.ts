import type { Config } from "tailwindcss";

/**
 * Tailwind v4 is configured CSS-first in `src/app/globals.css` via `@theme`
 * (design tokens: colors, fonts). This file documents the content sources and
 * keeps editor tooling/IntelliSense happy. Tokens live in globals.css.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
