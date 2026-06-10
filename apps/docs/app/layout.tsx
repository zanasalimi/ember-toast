import type { Metadata } from "next";
import "./globals.css";
// import { Toaster } from "@embertoast/react";
// import "@embertoast/react/styles.css";

// TODO(M6): load the editorial font pairing via next/font:
//   Instrument_Serif / Fraunces  → --font-display
//   Inter (or Geist)             → --font-body
//   a mono                       → --font-mono
// Expose them as CSS variables on <html> so tailwind.config picks them up.

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
    <html lang="en">
      <body>
        {children}
        {/* The docs dogfood the library for their own notifications. */}
        {/* TODO(M6): <Toaster position="bottom-right" closeButton /> */}
      </body>
    </html>
  );
}
