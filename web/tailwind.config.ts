import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design-to-Certificate palette — regulatory-grade dark theme.
        // Background #0A0A0F, surface step #11131A, primary text #FFFFFF,
        // accent #0EA5E9 (sky-500). Risk amber + medical green tuned for
        // status semantics, not branding.
        ink: {
          50:  "#f4f6fb",
          100: "#dde2ec",
          200: "#c4ccdc",
          300: "#9ba6ba",
          400: "#6f7a92",
          500: "#4a5470",
          600: "#33394d",
          700: "#1f2330",
          800: "#15171f",
          900: "#0d0f14",
          950: "#0A0A0F",
        },
        accent: {
          DEFAULT: "#0EA5E9", // sky-500 — primary product accent
          soft:    "#38bdf8", // sky-400 — hover / focus
          warm:    "#f59e0b", // amber-500 — attention / partial gaps
        },
        danger:  { DEFAULT: "#ef4444" },  // red-500 — critical
        warning: { DEFAULT: "#f59e0b" },  // amber-500
        success: { DEFAULT: "#10b981" },  // emerald-500
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
