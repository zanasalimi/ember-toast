import type { Config } from "tailwindcss";

/**
 * Editorial identity, deliberately not default-shadcn.
 *
 * - High-contrast light: near-white paper, near-black ink. No zinc-on-white.
 * - ONE bold accent: warm ember/orange, used sparingly as the focal color.
 * - Type pairing: an editorial serif for display headings, a clean sans for body.
 *   The pairing is the signal — the opposite of Inter-everywhere.
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
        paper: "#FBFAF8", // warm off-white, not pure #fff — editorial warmth
        ink: "#0A0A0A",
        ember: {
          DEFAULT: "#E8590C", // the single bold accent
          soft: "#FFE9DC",
          deep: "#B23E00",
        },
        muted: "#6B6760",
        rule: "#E7E2DA", // hairline rules between editorial sections
      },
      fontFamily: {
        // Editorial serif display (Instrument Serif / Fraunces, loaded via next/font).
        serif: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        // Clean sans body.
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Generous editorial scale with intentional rhythm.
        display: ["clamp(3rem, 7vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        h1: ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        lede: ["1.375rem", { lineHeight: "1.45" }],
      },
      maxWidth: {
        prose: "68ch",
        editorial: "76rem",
      },
    },
  },
  plugins: [],
};

export default config;
