import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Playfair_Display,
  Inter,
  Over_the_Rainbow,
  Space_Mono,
  Cormorant_Garamond,
  Libre_Baskerville,
  Work_Sans,
  Caveat,
} from "next/font/google";
import "./globals.css";

/* ----- Fonts (self-hosted via next/font; exposed as CSS variables) --------- */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
const overTheRainbow = Over_the_Rainbow({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-otr",
  display: "swap",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-cormorant-src",
  display: "swap",
});
const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-baskerville-src",
  display: "swap",
});
const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-worksans-src",
  display: "swap",
});
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-caveat-src",
  display: "swap",
});

const fontVars = [
  playfair.variable,
  inter.variable,
  overTheRainbow.variable,
  spaceMono.variable,
  cormorant.variable,
  baskerville.variable,
  workSans.variable,
  caveat.variable,
].join(" ");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://andyalbarracin.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "andyalbarracin.com — Ideas en tránsito",
    template: "%s — andyalbarracin.com",
  },
  description:
    "Archivo personal de un director creativo que construye, viaja y crea en movimiento.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "andyalbarracin.com",
    title: "andyalbarracin.com — Ideas en tránsito",
    description:
      "Archivo personal de un director creativo que construye, viaja y crea en movimiento.",
    images: [{ url: "/images/airport-hero.png", width: 1400, height: 1180 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "andyalbarracin.com — Ideas en tránsito",
    description:
      "Archivo personal de un director creativo que construye, viaja y crea en movimiento.",
    images: ["/images/airport-hero.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
