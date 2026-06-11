import type { Config } from "tailwindcss";

/**
 * Clean light product identity — calm, roomy, white panels on a soft grey field.
 * One ember accent. Geist throughout, set bold + tight for headlines. The opposite
 * of dark-cinematic: clarity, whitespace, hairline borders, gentle shadows.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#ECECEF", // the soft grey field the panel floats on
        paper: "#FFFFFF", // panels + cards
        surface: "#F4F4F6", // subtle grey for chips, inputs, controls
        ink: "#15151A", // near-black text
        muted: "#6B6B74",
        faint: "#9C9CA4",
        rule: "rgba(18,18,24,0.08)", // hairline rules on light
        ember: {
          DEFAULT: "#E8590C",
          soft: "#FFEDE2",
          deep: "#B23E00",
        },
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        mega: ["clamp(2.5rem, 5.2vw, 3.85rem)", { lineHeight: "1.04", letterSpacing: "-0.03em" }],
        display: ["clamp(2.25rem, 4vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        h1: ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        lede: ["clamp(1.0625rem, 1.6vw, 1.25rem)", { lineHeight: "1.6" }],
      },
      maxWidth: {
        prose: "54ch",
        editorial: "72rem",
      },
      keyframes: {
        "rise-in": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.7s cubic-bezier(0.21,1.02,0.42,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
