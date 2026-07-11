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
  about: {
    eyebrow: "04 / SOBRE MÍ",
    title: "Sobre mí",
    tagline: "creo, viajo, construyo.",
    portraitImage: IMAGES.heroPortrait,
    portraitCaption: "RETRATO · BUE",
    lead: "Soy Andy Albarracín, director creativo. Construyo ideas, viajo y creo sistemas con intención.",
    body: "Mi trabajo vive entre la dirección creativa, el documental y el diseño de sistemas — siempre en movimiento. Documento lo importante y diseño lo que importa. Creo que las mejores ideas nacen en tránsito, entre un lugar y otro.",
    originNote: "Esto empezó en 2010 como un blog — The Rise Plan. Aquellas notas siguen vivas en el Cuaderno, hoy parte de este archivo en tránsito.",
    values: [
      { title: "Claridad sobre el ruido.", body: "Menos ruido, más señal. Priorizo lo esencial." },
      { title: "Movimiento sobre destino.", body: "El camino importa más que la meta." },
      { title: "Detalles sobre decoración.", body: "Lo que importa está en los detalles, no en el adorno." },
      { title: "Humano, no llamativo.", body: "Diseño para personas, no para impresionar." },
    ],
    quote: { text: "No se trata de llegar primero,\nsino de ver más en el camino.", cite: "ANDY ALBARRACÍN" },
    featuredPostIds: [],
    featuredProjectIds: [],
  },
};
