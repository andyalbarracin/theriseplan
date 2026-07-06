import type { NavSettings } from "@/lib/types";

export const NAV_SETTINGS: NavSettings = {
  main: [
    { label: "Inicio", url: "/", visible: true },
    { label: "Cuaderno", url: "/cuaderno", visible: true },
    { label: "Proyectos", url: "/proyectos", visible: true },
    { label: "Ahora", url: "/ahora", visible: true },
    { label: "Sobre mí", url: "/sobre-mi", visible: true },
    { label: "Hablemos", url: "/hablemos", visible: true },
  ],
  footerNav: ["Cuaderno", "Proyectos", "Ahora", "Sobre mí", "Hablemos"],
  socialOrder: ["Instagram", "LinkedIn", "YouTube", "Behance"],
};
