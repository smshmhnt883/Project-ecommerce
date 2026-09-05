import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/services/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ayur: {
          ivory: "#FAF8F5",
          cream: "#F4EFE6",
          sand: "#EAE3D5",
          parchment: "#E2D9C8",
          border: "#E7DFD2",
          surface: "#FFFFFF",
          green: {
            50: "#F1F5F2",
            100: "#DEEBE1",
            200: "#BED5C3",
            600: "#366147",
            700: "#2B4F39",
            800: "#1F3B2A",
            900: "#172D20",
            950: "#0D1B13",
          },
          terracotta: {
            50: "#FDF6F2",
            100: "#F9ECE4",
            500: "#BF6336",
            600: "#AA4E23",
            700: "#8D3C18",
          },
          amber: {
            50: "#FFF9F0",
            100: "#FEF2DE",
            500: "#CF8B32",
            600: "#B87520",
          },
          charcoal: {
            100: "#E5E5E5",
            200: "#CCCCCC",
            400: "#888888",
            600: "#555555",
            700: "#383838",
            800: "#242424",
            900: "#151515",
          },
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "Cambria", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(27, 45, 33, 0.04), 0 1px 3px rgba(27, 45, 33, 0.02)",
        card: "0 4px 20px rgba(27, 45, 33, 0.06)",
        hover: "0 10px 30px rgba(27, 45, 33, 0.10)",
        drawer: "-4px 0 24px rgba(23, 45, 32, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
