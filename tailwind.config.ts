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
          50: "#eff4ff",
          100: "#dbe6ff",
          200: "#c0d4ff",
          300: "#97b6ff",
          400: "#6790fd",
          500: "#3b6bf6",
          600: "#2556eb",
          700: "#1d44cf",
          800: "#1e3ba6",
          900: "#1e3683",
          950: "#16224f",
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
        glow: "0 0 0 4px rgba(37, 86, 235, 0.10)",
        card: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.04)",
        "card-hover":
          "0 4px 16px rgba(16,24,40,0.06), 0 2px 6px rgba(16,24,40,0.04)",
        panel:
          "0 24px 70px rgba(16,24,40,0.12), 0 10px 24px rgba(16,24,40,0.06)",
        "btn-brand": "0 1px 2px rgba(16,24,40,0.10), 0 2px 6px rgba(37,86,235,0.18)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        shimmer: "shimmer 2s infinite linear",
        pulse_slow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-pan": "gradientPan 6s ease infinite",
        float: "float 5s ease-in-out infinite",
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
        gradientPan: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
