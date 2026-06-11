import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
// The library's own stylesheet, dogfooded for the docs' toasts. The single
// <Toaster/> lives inside the playground so its live controls drive the props;
// mounting a second one here would double-subscribe the shared store and render
// every toast twice.
import "@embertoast/react/styles.css";

/**
 * Geist — a confident geometric grotesk, set heavy and tight for the display
 * headlines and used as the single sans. Geist Mono carries the spec-sheet labels
 * and code. Bundled with the `geist` package, exposing the CSS variables below.
 */

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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
