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
        body:    ["var(--font-poppins)", "system-ui", "sans-serif"],
        sans:    ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      colors: {
        coral: {
          50:"#fff3ed", 100:"#ffe4d0", 200:"#ffc5a0", 300:"#ff9f6b",
          400:"#f5945c", 500:"#e87d43", 600:"#d4652a", 700:"#b34f1e",
          800:"#8f3d18", 900:"#6e2f14",
        },
        espresso: {
          50:"#f5f0ec", 100:"#e8ddd5", 200:"#d0baab", 300:"#b59480",
          400:"#96705a", 500:"#6b4a33", 600:"#4a3322", 700:"#381f10",
          800:"#281B13", 900:"#1a1009",
        },
        amber: {
          50:"#fffbf0", 100:"#fff3d0", 200:"#fee59a", 300:"#fec76f",
          400:"#feb84a", 500:"#f5a020", 600:"#d4850e", 700:"#a86508",
          800:"#7f4c06", 900:"#5c3705",
        },
        sand: {
          50:"#fdfcfa", 100:"#faf7f2", 200:"#f5f0e8", 300:"#ede6d8",
          400:"#e0d5c0", 500:"#c8b99a", 600:"#a8956e", 700:"#7a6a4a",
          800:"#4e4230", 900:"#2a2118",
        },
      },
      borderRadius: {
        "4xl":"2rem", "5xl":"2.5rem", "6xl":"3rem",
      },
      animation: {
        "fade-up":"fadeUp 0.6s ease forwards",
        "fade-in":"fadeIn 0.4s ease forwards",
        "bounce-slow":"bounce 3s infinite",
        "spin-slow":"spin 8s linear infinite",
      },
      keyframes: {
        fadeUp:{ "0%":{ opacity:"0", transform:"translateY(24px)" }, "100%":{ opacity:"1", transform:"translateY(0)" } },
        fadeIn:{ "0%":{ opacity:"0" }, "100%":{ opacity:"1" } },
      },
    },
  },
  plugins: [],
};

export default config;
