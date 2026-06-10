import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
// The library's own stylesheet, dogfooded for the docs' toasts. The single
// <Toaster/> lives inside the playground so its live controls drive the props;
// mounting a second one here would double-subscribe the shared store and render
// every toast twice.
import "@embertoast/react/styles.css";

/**
 * Editorial type pairing, loaded via next/font and exposed as CSS variables the
 * tailwind config keys off:
 *   Instrument Serif → --font-display (the display/serif headings)
 *   Inter            → --font-body    (clean sans body)
 *   JetBrains Mono   → --font-mono    (code + the eyebrow labels)
 * Instrument Serif ships a single 400 weight by design — its character is the
 * point, the opposite of Inter-everywhere.
 */
const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "embertoast — a headless toast primitive for React",
    template: "%s · embertoast",
  },
  description:
    "Call toast() from anywhere; one mounted <Toaster/> renders it. Promise-aware, swipe-dismissable, FLIP reflow, accessible, zero runtime deps.",
  openGraph: {
    title: "embertoast",
    description: "A headless-first toast primitive for React.",
    url: siteUrl,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
