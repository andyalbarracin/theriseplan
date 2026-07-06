import type { AhoraContent } from "@/lib/types";
import { IMAGES } from "./images";

/* "Ahora" snapshot — transcribed from Ahora.dc.html (the prototype hard-codes
   this copy; kept as a settings module so it is data-driven and CMS-ready). */
export const AHORA_CONTENT: AhoraContent = {
  updated: "ACTUALIZADO · 28 MAY 2026 · BUENOS AIRES",
  intro:
    "Una foto de mi presente. Dónde estoy, qué construyo y qué ocupa mi cabeza ahora mismo.",
  accent: "lo que estoy haciendo hoy.",
  rows: [
    { label: "CONSTRUYENDO", value: "ZAIRE — documental en desarrollo sobre África Central.", emphasis: "ZAIRE" },
    { label: "DIRIGIENDO", value: "The Rise Plan — un sistema de disciplina y dirección creativa." },
    { label: "LEYENDO", value: "«La vida secreta de Walter Mitty» — otra vez." },
    { label: "PENSANDO", value: "En cómo los sistemas invisibles sostienen la creatividad." },
    { label: "UBICACIÓN", value: "Buenos Aires — disponible para proyectos globales." },
  ],
  closing: "todo esto, en movimiento.",
  image: IMAGES.cityWindow,
  imageTime: "18:40",
  imagePlace: "· CDMX",
  imageCorner: "CIUDAD · 18:40",
  statusLabel: "ESTADO ACTUAL",
  statusRoute: "BUE → CDG",
  statusChip: "EN TRÁNSITO",
};
