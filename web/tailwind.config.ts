import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Compliance-grade palette — calm, trustworthy, with one warm accent
        // for "agent is alive" affordances.
        ink: {
          50:  "#f6f7f9",
          100: "#eceef2",
          200: "#d4d8e0",
          300: "#aeb5c2",
          400: "#7c8597",
          500: "#525c70",
          600: "#3a4458",
          700: "#2a3245",
          800: "#1c2333",
          900: "#0f1422",
          950: "#080b15",
        },
        accent: {
          DEFAULT: "#22d3ee", // cyan-400 — agent action / live-feed pulses
          warm:    "#fb923c", // orange-400 — risk / HITL pending
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
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
