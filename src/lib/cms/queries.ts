import type {
  Post,
  Project,
  MediaAsset,
  SiteSettings,
  HomeSettings,
  NavSettings,
  AhoraContent,
  SEOFields,
  Stats,
  SEORow,
} from "@/lib/types";
import { snapshot, clone } from "./store";
import { isPublicPost, isPublicProject } from "./visibility";
import { seo } from "@/lib/data/seed/blocks";

/* ----- posts --------------------------------------------------------------- */
export function getPosts(opts: { includeAll?: boolean; category?: string } = {}): Post[] {
  const all = snapshot().posts;
  const list = opts.includeAll ? all : all.filter(isPublicPost);
  const filtered = opts.category ? list.filter((p) => p.category === opts.category) : list;
  return clone(filtered);
}
export function getPostBySlug(slug: string, opts: { includeAll?: boolean } = {}): Post | null {
  const p = snapshot().posts.find((x) => x.slug === slug);
  if (!p) return null;
  if (!opts.includeAll && !isPublicPost(p)) return null;
  return clone(p);
}
export function getPostById(id: string): Post | null {
  const p = snapshot().posts.find((x) => x.id === id);
  return p ? clone(p) : null;
}
export function getFeaturedPosts(): Post[] {
  return clone(snapshot().posts.filter((p) => isPublicPost(p) && p.featured));
}
export function getCategories(): string[] {
  return Array.from(new Set(snapshot().posts.map((p) => p.category)));
}

/* ----- projects ------------------------------------------------------------ */
export function getProjects(opts: { includeAll?: boolean } = {}): Project[] {
  const all = snapshot().projects;
  return clone(opts.includeAll ? all : all.filter(isPublicProject));
}
export function getProjectBySlug(slug: string, opts: { includeAll?: boolean } = {}): Project | null {
  const pr = snapshot().projects.find((x) => x.slug === slug);
  if (!pr) return null;
  if (!opts.includeAll && !isPublicProject(pr)) return null;
  return clone(pr);
}
export function getProjectById(id: string): Project | null {
  const pr = snapshot().projects.find((x) => x.id === id);
  return pr ? clone(pr) : null;
}
export function getFeaturedProject(): Project | null {
  const pr = snapshot().projects.find((x) => isPublicProject(x) && x.featured);
  return pr ? clone(pr) : null;
}

/* ----- media --------------------------------------------------------------- */
export function getMediaAssets(): MediaAsset[] {
  return clone(snapshot().media);
}
export function getMediaById(id: string): MediaAsset | null {
  const m = snapshot().media.find((x) => x.id === id);
  return m ? clone(m) : null;
}

/* ----- settings ------------------------------------------------------------ */
export function getSiteSettings(): SiteSettings {
  return clone(snapshot().site);
}
export function getHomeSettings(): HomeSettings {
  return clone(snapshot().home);
}
export function getNavSettings(): NavSettings {
  return clone(snapshot().nav);
}
export function getAhoraContent(): AhoraContent {
  return clone(snapshot().ahora);
}

/* ----- SEO overview (admin) ------------------------------------------------ */
function seoStatus(sf: SEOFields | undefined): {
  title: string;
  description: string;
  ogImage: string;
  missing: string[];
  ok: boolean;
} {
  const missing: string[] = [];
  if (!sf || !sf.title) missing.push("title");
  if (!sf || !sf.description) missing.push("description");
  if (!sf || !sf.ogImage) missing.push("ogImage");
  return {
    title: sf ? sf.title : "",
    description: sf ? sf.description : "",
    ogImage: sf ? sf.ogImage : "",
    missing,
    ok: missing.length === 0,
  };
}

export function getSEOOverview(): SEORow[] {
  const s = snapshot();
  const og = s.site.defaultOgImage;
  const rows: SEORow[] = [
    { scope: "Página", name: "Home", ...seoStatus(s.site.seo) },
    { scope: "Página", name: "Cuaderno", ...seoStatus(seo("Cuaderno — andyalbarracin.com", "Notas, ideas y reflexiones desde el camino.", og)) },
    { scope: "Página", name: "Proyectos", ...seoStatus(seo("Proyectos — andyalbarracin.com", "Sistemas, ideas y productos en construcción.", og)) },
    { scope: "Página", name: "Ahora", ...seoStatus(seo("Ahora — andyalbarracin.com", "", og)) },
    { scope: "Página", name: "Sobre mí", ...seoStatus(seo("Sobre mí — andyalbarracin.com", "Perfil creativo de Andy Albarracín.", og)) },
    { scope: "Página", name: "Hablemos", ...seoStatus(seo("Hablemos — andyalbarracin.com", "Colaboremos en tu próximo proyecto.", og)) },
  ];
  s.posts.forEach((p) => rows.push({ scope: "Artículo", name: p.title, ...seoStatus(p.seo) }));
  s.projects.filter(isPublicProject).forEach((pr) => rows.push({ scope: "Proyecto", name: pr.title, ...seoStatus(pr.seo) }));
  return rows;
}

/* ----- dashboard counts ---------------------------------------------------- */
export function getStats(): Stats {
  const s = snapshot();
  return {
    postsPublished: s.posts.filter((p) => p.status === "published").length,
    postsDrafts: s.posts.filter((p) => p.status === "draft").length,
    postsFeatured: s.posts.filter((p) => p.featured).length,
    projectsPublished: s.projects.filter(isPublicProject).length,
    projectsHidden: s.projects.filter((p) => p.visibility !== "public" || p.sensitive).length,
    media: s.media.length,
    homeModules: 5 + (s.home.fragments ? s.home.fragments.length : 0),
    seoWarnings: getSEOOverview().filter((r) => !r.ok).length,
  };
}

/* ----- sitemap route list -------------------------------------------------- */
export function getSitemapRoutes(): string[] {
  const s = snapshot();
  const routes = ["", "cuaderno", "proyectos", "ahora", "sobre-mi", "hablemos"];
  s.posts.filter(isPublicPost).forEach((p) => routes.push("cuaderno/" + p.slug));
  s.projects.filter(isPublicProject).forEach((pr) => routes.push("proyectos/" + pr.slug));
  return routes;
}
