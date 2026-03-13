import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        gold: {
          50: "#fdf8ee",
          100: "#f8eccc",
          200: "#f0d795",
          300: "#e8bd5a",
          400: "#e0a430",
          500: "#c8891a",
          600: "#a86c14",
          700: "#8a5212",
          800: "#6f3f13",
          900: "#5a3311",
        },
        surface: {
          DEFAULT: "#0a0a0a",
          50: "#f8f8f8",
          100: "#f0f0f0",
          200: "#e8e8e8",
          800: "#1a1a1a",
          900: "#0a0a0a",
        },
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        shimmer: "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
