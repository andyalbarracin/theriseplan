/* =============================================================================
   Archivo:     ssr.ts
   Ruta:        web/src/lib/cms/ssr.ts
   Modificado:  2026-07-06
   Descripcion: Capa de LECTURA para las paginas publicas (Server Components).
                Cuando NEXT_PUBLIC_DATA_SOURCE = "supabase" y hay credenciales,
                lee el contenido (posts, proyectos, media) desde la base de datos
                Supabase. Si no, o si algo falla, cae de forma segura al contenido
                de ejemplo (seed) — la app nunca se rompe por una lectura.

                RLS (seguridad de fila) ya limita al publico a ver solo lo
                publicado/publico, asi que estas consultas usan la clave anonima
                y no necesitan cookies (funcionan en build, SSR y sitemap).

                Para agregar un dato nuevo: crea aca una funcion `...SSR` que
                consulte Supabase y, en el `catch`, devuelva la version seed.
   ============================================================================= */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Post, Project, MediaAsset, HomeSettings } from "@/lib/types";
import { rowToPost, rowToProject, rowToMedia } from "./mappers";
import { isPublicPost, isPublicProject } from "./visibility";
import * as seed from "./queries"; // fallback sincronico (contenido de ejemplo)

/** ¿Debemos leer desde Supabase? Se activa SOLO con tener las credenciales
    (URL + ANON), a menos que se fuerce "mock" con NEXT_PUBLIC_DATA_SOURCE=mock.
    Asi, en produccion basta con configurar las dos variables NEXT_PUBLIC_SUPABASE_*. */
function supabaseActive(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_DATA_SOURCE !== "mock"
  );
}

/** Cliente anonimo server-side (sin cookies). Se crea una sola vez. */
let _client: SupabaseClient | null = null;
function db(): SupabaseClient | null {
  if (!supabaseActive()) return null;
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        auth: { persistSession: false },
        // Sin caché: cada lectura trae el estado ACTUAL de la base (así los
        // cambios del dashboard se ven en el sitio sin esperar un redeploy).
        global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
      }
    );
  }
  return _client;
}

/* ----- posts --------------------------------------------------------------- */
export async function getPostsSSR(opts: { category?: string } = {}): Promise<Post[]> {
  const client = db();
  if (!client) return seed.getPosts(opts);
  try {
    let q = client.from("posts").select("*").order("published_at", { ascending: false, nullsFirst: false });
    if (opts.category) q = q.eq("category", opts.category);
    const { data, error } = await q;
    if (error || !data) throw error;
    // RLS ya filtra a publicado/publico; el filtro extra es defensa en profundidad.
    return data.map(rowToPost).filter(isPublicPost);
  } catch {
    return seed.getPosts(opts);
  }
}

export async function getPostBySlugSSR(slug: string): Promise<Post | null> {
  const client = db();
  if (!client) return seed.getPostBySlug(slug);
  try {
    const { data, error } = await client.from("posts").select("*").eq("slug", slug).limit(1).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const post = rowToPost(data);
    return isPublicPost(post) ? post : null;
  } catch {
    return seed.getPostBySlug(slug);
  }
}

export async function getPostByIdSSR(id: string): Promise<Post | null> {
  const client = db();
  if (!client) return seed.getPostById(id);
  try {
    const { data, error } = await client.from("posts").select("*").eq("id", id).limit(1).maybeSingle();
    if (error) throw error;
    return data ? rowToPost(data) : null;
  } catch {
    return seed.getPostById(id);
  }
}

/* ----- projects ------------------------------------------------------------ */
export async function getProjectsSSR(): Promise<Project[]> {
  const client = db();
  if (!client) return seed.getProjects();
  try {
    const { data, error } = await client.from("projects").select("*");
    if (error || !data) throw error;
    return data.map(rowToProject).filter(isPublicProject);
  } catch {
    return seed.getProjects();
  }
}

export async function getProjectBySlugSSR(slug: string): Promise<Project | null> {
  const client = db();
  if (!client) return seed.getProjectBySlug(slug);
  try {
    const { data, error } = await client.from("projects").select("*").eq("slug", slug).limit(1).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const project = rowToProject(data);
    return isPublicProject(project) ? project : null;
  } catch {
    return seed.getProjectBySlug(slug);
  }
}

export async function getFeaturedProjectSSR(): Promise<Project | null> {
  const projects = await getProjectsSSR();
  return projects.find((p) => p.featured) ?? null;
}

/* ----- media --------------------------------------------------------------- */
export async function getMediaAssetsSSR(): Promise<MediaAsset[]> {
  const client = db();
  if (!client) return seed.getMediaAssets();
  try {
    const { data, error } = await client.from("media_assets").select("*");
    if (error || !data) throw error;
    return data.map(rowToMedia);
  } catch {
    return seed.getMediaAssets();
  }
}

/* ----- settings (home) -----------------------------------------------------
   La configuracion de Home se guarda en home_settings.data (jsonb). Si no hay
   fila todavia, se usa el seed. Se hace merge con el seed para tolerar campos
   nuevos agregados despues. */
export async function getHomeSettingsSSR(): Promise<HomeSettings> {
  const client = db();
  const fallback = seed.getHomeSettings();
  if (!client) return fallback;
  try {
    const { data, error } = await client.from("home_settings").select("data").eq("id", "default").maybeSingle();
    if (error) throw error;
    return data?.data ? { ...fallback, ...(data.data as HomeSettings) } : fallback;
  } catch {
    return fallback;
  }
}

/* ----- sitemap ------------------------------------------------------------- */
export async function getSitemapRoutesSSR(): Promise<string[]> {
  const routes = ["", "cuaderno", "proyectos", "ahora", "sobre-mi", "hablemos"];
  const [posts, projects] = await Promise.all([getPostsSSR(), getProjectsSSR()]);
  posts.forEach((p) => routes.push("cuaderno/" + p.slug));
  projects.forEach((pr) => routes.push("proyectos/" + pr.slug));
  return routes;
}
