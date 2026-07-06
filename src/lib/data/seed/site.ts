import type { SiteSettings } from "@/lib/types";
import { IMAGES } from "./images";
import { seo } from "./blocks";

export const SITE_SETTINGS: SiteSettings = {
  siteName: "andyalbarracin.com",
  domain: "andyalbarracin.com",
  monogram: "AA",
  wordmark: "andyalbarracin.com",
  logoUrl: "",
  faviconUrl: "",
  defaultOgImage: IMAGES.airportHero,
  language: "es",
  contactEmail: "hola@andyalbarracin.com",
  socialLinks: [
    { platform: "Instagram", url: "#", visible: true },
    { platform: "LinkedIn", url: "#", visible: true },
    { platform: "YouTube", url: "#", visible: true },
    { platform: "Behance", url: "#", visible: true },
  ],
  footerQuote: "gracias por estar aquí. — andy x",
  copyrightText: "© 2026 andyalbarracin.com — Todos los derechos reservados.",
  footerTagline:
    "Director creativo construyendo ideas, viajes y sistemas con intención.",
  theme: {
    paper: "#F4F2EF",
    obsidian: "#0D0D0E",
    charcoal: "#1B1D20",
    blue: "#2F5DAA",
    slate: "#6E7C8B",
    tape: "#DCCEB6",
    fontSerif: "Playfair Display",
    fontSans: "Inter",
    fontHand: "Over the Rainbow",
    heroAccent: "#9db8ec",
    headingScale: 1,
  },
  seo: seo(
    "andyalbarracin.com — Ideas en tránsito",
    "Archivo personal de un director creativo que construye, viaja y crea en movimiento.",
    IMAGES.airportHero
  ),
};
