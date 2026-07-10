/* =============================================================================
   Archivo:     mappers.ts
   Ruta:        web/src/lib/cms/mappers.ts
   Modificado:  2026-07-06
   Descripcion: Convierte las FILAS de Supabase (snake_case, columnas jsonb) en
                los objetos de dominio tipados de la app (camelCase: Post,
                Project, MediaAsset). Un solo lugar para el "traductor" DB→app,
                asi el resto del codigo nunca ve nombres de columnas crudos.

                Regla: siempre devolvemos valores seguros (nunca null donde el
                tipo espera string/array), para que las paginas no rompan aunque
                un post importado venga con campos vacios.
   ============================================================================= */
import type { Post, Project, MediaAsset, ContentBlock, SEOFields } from "@/lib/types";

/* Helpers para leer jsonb/columnas con un valor por defecto seguro. */
const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const bool = (v: unknown): boolean => v === true;

/** SEO seguro: si la fila trae {} o null, completa los campos requeridos. */
function toSeo(v: unknown): SEOFields {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return {
    title: str(o.title),
    description: str(o.description),
    ogImage: str(o.ogImage),
    canonical: str(o.canonical),
    twitterImage: str(o.twitterImage),
  };
}

/* Tipos "laxos" de las filas: solo lo que leemos. Evita depender de tipos
   generados por Supabase y mantiene el mapper legible. */
type PostRow = Record<string, unknown>;
type ProjectRow = Record<string, unknown>;
type MediaRow = Record<string, unknown>;

/** Fila public.posts → Post. */
export function rowToPost(r: PostRow): Post {
  return {
    id: str(r.id),
    title: str(r.title),
    slug: str(r.slug),
    subtitle: str(r.subtitle) || undefined,
    excerpt: str(r.excerpt) || undefined,
    category: str(r.category),
    type: (str(r.type) || "archivo") as Post["type"],
    status: (str(r.status) || "draft") as Post["status"],
    visibility: (str(r.visibility) || "public") as Post["visibility"],
    featured: bool(r.featured),
    heroImage: str(r.hero_image),
    gallery: arr<string>(r.gallery),
    bodyBlocks: arr<ContentBlock>(r.body_blocks),
    seo: toSeo(r.seo),
    location: (r.location as Post["location"]) ?? null,
    publishedAt: str(r.published_at) || undefined,
    readingTime: typeof r.reading_time === "number" ? r.reading_time : undefined,
    related: arr<string>(r.related),
    // ----- campos de importacion (posts heredados de WordPress) --------------
    originalHtml: str(r.original_html) || undefined,
    tags: arr<string>(r.tags),
    source: str(r.source) || undefined,
    legacyWpId: typeof r.legacy_wp_id === "number" ? r.legacy_wp_id : undefined,
    heroFeatured: bool(r.hero_featured),
    heroCode: str(r.hero_code) || undefined,
    heroTicket: (r.hero_ticket && typeof r.hero_ticket === "object" ? r.hero_ticket : undefined) as Post["heroTicket"],
  };
}

/** Fila public.projects → Project. */
export function rowToProject(r: ProjectRow): Project {
  return {
    id: str(r.id),
    title: str(r.title),
    slug: str(r.slug),
    subtitle: str(r.subtitle) || undefined,
    shortDescription: str(r.short_description),
    longDescription: str(r.long_description) || undefined,
    type: str(r.type),
    status: (str(r.status) || "draft") as Project["status"],
    visibility: (str(r.visibility) || "public") as Project["visibility"],
    sensitive: bool(r.sensitive),
    featured: bool(r.featured),
    heroImage: str(r.hero_image),
    gallery: arr<string>(r.gallery),
    tags: arr<string>(r.tags),
    technologies: arr<string>(r.technologies),
    links: arr<{ label: string; url: string }>(r.links),
    role: str(r.role) || undefined,
    timeline: str(r.timeline) || undefined,
    blocks: arr<ContentBlock>(r.blocks),
    seo: toSeo(r.seo),
  };
}

/** Fila public.media_assets → MediaAsset. */
export function rowToMedia(r: MediaRow): MediaAsset {
  return {
    id: str(r.id),
    url: str(r.url),
    filename: str(r.filename),
    alt: str(r.alt),
    caption: str(r.caption),
    type: (str(r.type) || "landscape") as MediaAsset["type"],
    size: typeof r.size === "number" ? r.size : 0,
    createdAt: str(r.created_at),
    usedIn: arr<string>(r.used_in),
  };
}

/* =============================================================================
   MAPPERS INVERSOS (app → fila de Supabase)
   Usados al GUARDAR desde el dashboard: convierten el objeto de dominio
   (camelCase) en la fila snake_case que espera la base. Las columnas jsonb se
   pasan como objetos/arrays JS (supabase-js las serializa solo).
   ============================================================================= */

/** Post → fila public.posts (para insert/upsert). */
export function postToRow(p: Post): Record<string, unknown> {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    subtitle: p.subtitle ?? null,
    excerpt: p.excerpt ?? null,
    category: p.category ?? null,
    type: p.type,
    status: p.status,
    visibility: p.visibility,
    featured: p.featured,
    hero_image: p.heroImage ?? null,
    gallery: p.gallery ?? [],
    body_blocks: p.bodyBlocks ?? [],
    original_html: p.originalHtml ?? null,
    tags: p.tags ?? [],
    source: p.source ?? "native",
    legacy_wp_id: p.legacyWpId ?? null,
    seo: p.seo ?? {},
    location: p.location ?? null,
    published_at: p.publishedAt || null, // date: "" → null
    reading_time: p.readingTime ?? null,
    related: p.related ?? [],
    hero_featured: p.heroFeatured ?? false,
    hero_code: p.heroCode ?? null,
    hero_ticket: p.heroTicket ?? {},
    updated_at: new Date().toISOString(),
  };
}

/** Project → fila public.projects (para insert/upsert). */
export function projectToRow(p: Project): Record<string, unknown> {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    subtitle: p.subtitle ?? null,
    short_description: p.shortDescription ?? null,
    long_description: p.longDescription ?? null,
    type: p.type ?? null,
    status: p.status,
    visibility: p.visibility,
    sensitive: p.sensitive,
    featured: p.featured,
    hero_image: p.heroImage ?? null,
    gallery: p.gallery ?? [],
    tags: p.tags ?? [],
    technologies: p.technologies ?? [],
    links: p.links ?? [],
    role: p.role ?? null,
    timeline: p.timeline ?? null,
    blocks: p.blocks ?? [],
    seo: p.seo ?? {},
    updated_at: new Date().toISOString(),
  };
}

/** MediaAsset → fila public.media_assets (para insert/upsert). */
export function mediaToRow(m: MediaAsset): Record<string, unknown> {
  return {
    id: m.id,
    url: m.url,
    filename: m.filename ?? null,
    alt: m.alt ?? null,
    caption: m.caption ?? null,
    type: m.type ?? null,
    size: m.size ?? null,
    used_in: m.usedIn ?? [],
    created_at: m.createdAt || new Date().toISOString(),
  };
}
