/* Route helpers — single source for app URLs, and a mapper from the design
   export's `*.dc.html` links to real Next routes (used if any legacy href slips
   through from ported markup). */

export const routes = {
  home: "/",
  cuaderno: "/cuaderno",
  proyectos: "/proyectos",
  ahora: "/ahora",
  sobreMi: "/sobre-mi",
  hablemos: "/hablemos",
  login: "/login",
  dashboard: "/dashboard",
  post: (slug: string) => `/cuaderno/${slug}`,
  project: (slug: string) => `/proyectos/${slug}`,
  dash: {
    home: "/dashboard/home",
    cuaderno: "/dashboard/cuaderno",
    newPost: "/dashboard/cuaderno/new",
    editPost: (id: string) => `/dashboard/cuaderno/${id}`,
    proyectos: "/dashboard/proyectos",
    newProject: "/dashboard/proyectos/new",
    editProject: (id: string) => `/dashboard/proyectos/${id}`,
    media: "/dashboard/media",
    seo: "/dashboard/seo",
    navigation: "/dashboard/navigation",
    ajustes: "/dashboard/ajustes",
  },
} as const;

const DC_MAP: Record<string, string> = {
  "Homepage.dc.html": "/",
  "Cuaderno.dc.html": "/cuaderno",
  "Proyectos.dc.html": "/proyectos",
  "Ahora.dc.html": "/ahora",
  "Sobre-mi.dc.html": "/sobre-mi",
  "Hablemos.dc.html": "/hablemos",
  "Login.dc.html": "/login",
  "Dashboard.dc.html": "/dashboard",
  "Dashboard-Home.dc.html": "/dashboard/home",
  "Dashboard-Cuaderno.dc.html": "/dashboard/cuaderno",
  "Dashboard-Proyectos.dc.html": "/dashboard/proyectos",
  "Dashboard-Media.dc.html": "/dashboard/media",
  "Dashboard-SEO.dc.html": "/dashboard/seo",
  "Dashboard-Navigation.dc.html": "/dashboard/navigation",
  "Dashboard-Ajustes.dc.html": "/dashboard/ajustes",
};

/** Normalize a possibly-legacy `X.dc.html` href to an app route. */
export function toAppHref(href: string): string {
  if (!href) return "#";
  if (href.startsWith("/") || href.startsWith("http") || href.startsWith("#")) return href;
  const [file] = href.split("?");
  return DC_MAP[file] ?? href;
}
