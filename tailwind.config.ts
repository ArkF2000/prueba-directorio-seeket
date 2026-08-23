import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "seeket-dark": "#0a0a0c",
        "seeket-surface": "#111114",
        "seeket-surface-2": "#17171b",
        "seeket-red-dark": "#9a2e2e",
        "seeket-red-vibrant": "#fa3934",
        "seeket-orange": "#ffac31",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        // Usada solo en precios / contadores para dar acento "dashboard técnico".
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glow: "0 0 24px -4px rgba(250, 57, 52, 0.45)",
        "glow-orange": "0 0 24px -4px rgba(255, 172, 49, 0.4)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};
export default config;