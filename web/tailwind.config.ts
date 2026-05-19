import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme — clinical, regulatory-grade.
        // bg #F8F8FA · surface #FFFFFF · ink #0A0A0F · accent sky-500
        surface: {
          DEFAULT: "#FFFFFF",
          subtle:  "#F8F8FA",   // page background
          muted:   "#F2F2F5",   // pressed / hover surface
          sunken:  "#EBECEF",   // tracks, separators
        },
        ink: {
          50:  "#F8F8FA",
          100: "#F1F2F5",
          200: "#E5E7EB",
          300: "#CBD0DA",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2330",
          900: "#0F1115",
          950: "#0A0A0F",
        },
        accent: {
          DEFAULT: "#0EA5E9",   // sky-500
          soft:    "#38BDF8",   // sky-400
          deep:    "#0284C7",   // sky-600
        },
        danger:  { DEFAULT: "#DC2626", soft: "#FEE2E2" },
        warning: { DEFAULT: "#D97706", soft: "#FEF3C7" },
        success: { DEFAULT: "#059669", soft: "#D1FAE5" },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["'Inter Tight'", "Inter", "ui-sans-serif", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 240ms ease-out",
        "slide-up": "slideUp 360ms ease-out",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:   { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp:  { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulseSoft:{ "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
      },
    },
  },
  plugins: [],
};
export default config;
