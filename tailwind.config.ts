import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f6fa",
          100: "#e8edf5",
          200: "#cdd6e8",
          300: "#a3b3d1",
          400: "#7289b5",
          500: "#50689e",
          600: "#3d5285",
          700: "#33446d",
          800: "#2d3b5b",
          900: "#29334d",
          950: "#1a2033",
        },
        surface: {
          0: "#ffffff",
          50: "#f8f9fb",
          100: "#f1f3f7",
          200: "#e6e9f0",
          300: "#d2d7e2",
          400: "#adb4c7",
          500: "#8890a6",
          600: "#6b7389",
          700: "#4d546b",
          800: "#363c50",
          900: "#1e2230",
          950: "#0f1219",
        },
        success: { 50: "#f0fdf4", 500: "#22c55e", 600: "#16a34a" },
        warning: { 50: "#fffbeb", 500: "#f59e0b", 600: "#d97706" },
        danger: { 50: "#fef2f2", 500: "#ef4444", 600: "#dc2626" },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 0 20px rgba(61, 82, 133, 0.12)",
        card: "0 1px 3px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover":
          "0 8px 25px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.03)",
        panel:
          "0 20px 60px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        shimmer: "shimmer 2s infinite linear",
        pulse_slow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
