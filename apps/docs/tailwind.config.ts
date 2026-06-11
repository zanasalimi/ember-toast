import type { Config } from "tailwindcss";

/**
 * Midnight pro-tool identity — cinematic dark, not default-shadcn.
 *
 * - Near-black canvas, elevated graphite surfaces, warm off-white ink.
 * - ONE electric accent: ember/orange, brightened for dark and given a glow.
 * - Type pairing: an editorial serif for oversized display, a clean sans for body,
 *   JetBrains Mono for the spec-sheet labels and numbers. The pairing is the signal.
 *
 * Fonts are wired via next/font in app/layout.tsx, exposing the CSS variables below.
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
        base: "#09090B", // the page — near-black
        paper: "#16161A", // elevated surface: chips, controls
        surface: "#1C1C21", // a step brighter for raised panels
        ink: "#F4F2EC", // warm off-white text
        muted: "#8A8A93",
        faint: "#56565E",
        rule: "rgba(255,255,255,0.08)", // hairline rules on dark
        ember: {
          DEFAULT: "#FF6A1F", // brightened brand accent for dark
          soft: "rgba(255,106,31,0.12)",
          deep: "#E8590C",
          glow: "rgba(255,106,31,0.55)",
        },
      },
      fontFamily: {
        // Geist everywhere — heavy + tight for display, regular for body.
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Oversized, cinematic display scale.
        mega: ["clamp(3.5rem, 11vw, 8.5rem)", { lineHeight: "0.9", letterSpacing: "-0.035em" }],
        display: ["clamp(3rem, 7vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.025em" }],
        h1: ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        lede: ["clamp(1.125rem, 2vw, 1.5rem)", { lineHeight: "1.5" }],
      },
      maxWidth: {
        prose: "62ch",
        editorial: "78rem",
      },
      keyframes: {
        "rise-in": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.85" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.8s cubic-bezier(0.21,1.02,0.42,1) both",
        "glow-pulse": "glow-pulse 5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 26s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
