/* =============================================================================
   Archivo:     client.ts
   Ruta:        web/src/lib/cms/client.ts
   Modificado:  2026-07-06
   Descripcion: Capa de datos del DASHBOARD (navegador). Lee y ESCRIBE en Supabase
                usando el cliente autenticado (la sesion viaja en cookies, asi las
                politicas RLS de "editor" permiten ver/guardar todo).

                Si Supabase no esta activo (o no hay sesion), cae de forma segura a
                las funciones mock/localStorage de ./queries y ./mutations, para que
                el panel siga siendo usable como demo sin base de datos.

                Todas las funciones son async. El resto del dashboard las consume
                con el hook useAsyncData (lecturas) y con await (guardados).
   ============================================================================= */
import type { Post, Project, MediaAsset, Stats, SEORow, SiteSettings, HomeSettings, NavSettings } from "@/lib/types";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { rowToPost, rowToProject, rowToMedia, postToRow, projectToRow, mediaToRow } from "./mappers";
import { isPublicProject } from "./visibility";
import * as seed from "./queries";
import * as local from "./mutations";
import { getSiteSettings, getHomeSettings, getNavSettings } from "./queries";

/** ¿Escribimos/leemos contra Supabase? Se activa con solo tener las credenciales
    (URL + ANON), salvo que se fuerce "mock" con NEXT_PUBLIC_DATA_SOURCE=mock. */
function active(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_DATA_SOURCE !== "mock"
  );
}

/** Cliente autenticado del navegador (o null si no hay credenciales). */
function sb() {
  return active() ? createBrowserSupabase() : null;
}

/* ----- posts (lecturas incluyen borradores: RLS de editor) ------------------ */
export async function listPosts(): Promise<Post[]> {
  const client = sb();
  if (!client) return seed.getPosts({ includeAll: true });
  const { data, error } = await client.from("posts").select("*").order("published_at", { ascending: false, nullsFirst: false });
  if (error || !data) return seed.getPosts({ includeAll: true });
  return data.map(rowToPost);
}
export async function getPost(id: string): Promise<Post | null> {
  const client = sb();
  if (!client) return seed.getPostById(id);
  const { data, error } = await client.from("posts").select("*").eq("id", id).maybeSingle();
  if (error) return seed.getPostById(id);
  return data ? rowToPost(data) : null;
}
export async function savePost(post: Post): Promise<Post> {
  const p = withDefaults(post, "p");
  const client = sb();
  if (!client) return local.upsertPost(p);
  const { data, error } = await client.from("posts").upsert(postToRow(p)).select().single();
  if (error) throw new Error(error.message);
  return rowToPost(data);
}
export async function removePost(id: string): Promise<void> {
  const client = sb();
  if (!client) return local.deletePost(id);
  const { error } = await client.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ----- projects ------------------------------------------------------------- */
export async function listProjects(): Promise<Project[]> {
  const client = sb();
  if (!client) return seed.getProjects({ includeAll: true });
  const { data, error } = await client.from("projects").select("*");
  if (error || !data) return seed.getProjects({ includeAll: true });
  return data.map(rowToProject);
}
export async function getProject(id: string): Promise<Project | null> {
  const client = sb();
  if (!client) return seed.getProjectById(id);
  const { data, error } = await client.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) return seed.getProjectById(id);
  return data ? rowToProject(data) : null;
}
export async function saveProject(project: Project): Promise<Project> {
  const p = withDefaults(project, "pr");
  const client = sb();
  if (!client) return local.upsertProject(p);
  const { data, error } = await client.from("projects").upsert(projectToRow(p)).select().single();
  if (error) throw new Error(error.message);
  return rowToProject(data);
}
export async function removeProject(id: string): Promise<void> {
  const client = sb();
  if (!client) return local.deleteProject(id);
  const { error } = await client.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ----- media --------------------------------------------------------------- */
export async function listMedia(): Promise<MediaAsset[]> {
  const client = sb();
  if (!client) return seed.getMediaAssets();
  const { data, error } = await client.from("media_assets").select("*").order("created_at", { ascending: false });
  if (error || !data) return seed.getMediaAssets();
  return data.map(rowToMedia);
}
export async function saveMedia(asset: MediaAsset): Promise<MediaAsset> {
  const m: MediaAsset = { ...asset, id: asset.id || "m" + Date.now(), createdAt: asset.createdAt || new Date().toISOString() };
  const client = sb();
  if (!client) return local.upsertMedia(m);
  const { data, error } = await client.from("media_assets").upsert(mediaToRow(m)).select().single();
  if (error) throw new Error(error.message);
  return rowToMedia(data);
}
export async function removeMedia(id: string): Promise<void> {
  const client = sb();
  if (!client) return local.deleteMedia(id);
  const { error } = await client.from("media_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Sube un archivo a Supabase Storage (bucket publico "media") y registra el
    asset. Sin Supabase, cae a guardar el archivo como data-URL (base64). */
export async function uploadMedia(file: File): Promise<MediaAsset> {
  const base: MediaAsset = {
    id: "",
    url: "",
    filename: file.name,
    alt: "",
    caption: "",
    type: "landscape",
    size: Math.round(file.size / 1024),
    createdAt: new Date().toISOString(),
    usedIn: [],
  };
  const client = sb();
  if (!client) {
    return local.upsertMedia({ ...base, url: await fileToDataUrl(file) });
  }
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}-${safe}`;
  const { error: upErr } = await client.storage.from("media").upload(path, file, { cacheControl: "3600", upsert: false });
  if (upErr) {
    throw new Error(
      `No se pudo subir a Storage (${upErr.message}). ` +
        `Verificá que exista un bucket PÚBLICO llamado "media" en Supabase → Storage.`
    );
  }
  const { data: pub } = client.storage.from("media").getPublicUrl(path);
  return saveMedia({ ...base, url: pub.publicUrl });
}

/** Lee un File del navegador como data-URL (fallback sin Storage). */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

/* ----- settings (site / home / nav) ----------------------------------------
   Se guardan como un objeto jsonb en la columna `data` de cada tabla
   *_settings (fila unica id='default'). Lectura: merge del seed con lo guardado
   (tolera campos nuevos). Escritura: upsert del objeto completo. */
async function readSettings<T extends object>(table: string, fallback: T): Promise<T> {
  const client = sb();
  if (!client) return fallback;
  const { data, error } = await client.from(table).select("data").eq("id", "default").maybeSingle();
  if (error || !data?.data) return fallback;
  return { ...fallback, ...(data.data as T) };
}
async function writeSettings<T extends object>(table: string, merged: T): Promise<T> {
  const client = sb();
  if (!client) return merged;
  const { error } = await client.from(table).upsert({ id: "default", data: merged });
  if (error) throw new Error(error.message);
  return merged;
}

export async function getSiteSettingsClient(): Promise<SiteSettings> {
  return readSettings("site_settings", getSiteSettings());
}
export async function updateSiteSettingsClient(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  if (!sb()) return local.updateSiteSettings(patch);
  const merged = { ...(await getSiteSettingsClient()), ...patch };
  return writeSettings("site_settings", merged);
}

export async function getHomeSettingsClient(): Promise<HomeSettings> {
  return readSettings("home_settings", getHomeSettings());
}
export async function updateHomeSettingsClient(patch: Partial<HomeSettings>): Promise<HomeSettings> {
  if (!sb()) return local.updateHomeSettings(patch);
  const merged = { ...(await getHomeSettingsClient()), ...patch };
  return writeSettings("home_settings", merged);
}

export async function getNavSettingsClient(): Promise<NavSettings> {
  return readSettings("navigation_settings", getNavSettings());
}
export async function updateNavSettingsClient(patch: Partial<NavSettings>): Promise<NavSettings> {
  if (!sb()) return local.updateNavSettings(patch);
  const merged = { ...(await getNavSettingsClient()), ...patch };
  return writeSettings("navigation_settings", merged);
}

/* ----- resumenes del panel (stats + SEO) -----------------------------------
   Se calculan en el cliente a partir de las listas de la base. Los datos de
   settings (site/home) todavia salen del seed hasta que se muevan a la base. */
export async function getStatsClient(): Promise<Stats> {
  const [posts, projects, media] = await Promise.all([listPosts(), listProjects(), listMedia()]);
  const home = getHomeSettings();
  const seoWarnings = seoRows(posts, projects).filter((r) => !r.ok).length;
  return {
    postsPublished: posts.filter((p) => p.status === "published").length,
    postsDrafts: posts.filter((p) => p.status === "draft").length,
    postsFeatured: posts.filter((p) => p.featured).length,
    projectsPublished: projects.filter(isPublicProject).length,
    projectsHidden: projects.filter((p) => p.visibility !== "public" || p.sensitive).length,
    media: media.length,
    homeModules: 5 + (home.fragments ? home.fragments.length : 0),
    seoWarnings,
  };
}
export async function getDashboardData(): Promise<{ stats: Stats; posts: Post[]; projects: Project[] }> {
  const [posts, projects] = await Promise.all([listPosts(), listProjects()]);
  const stats = await getStatsClient();
  return { stats, posts, projects };
}
export async function getSEOOverviewClient(): Promise<SEORow[]> {
  const [posts, projects] = await Promise.all([listPosts(), listProjects()]);
  return seoRows(posts, projects);
}

/* ----- helpers ------------------------------------------------------------- */
function seoStatus(sf: { title?: string; description?: string; ogImage?: string } | undefined) {
  const missing: string[] = [];
  if (!sf?.title) missing.push("title");
  if (!sf?.description) missing.push("description");
  if (!sf?.ogImage) missing.push("ogImage");
  return { title: sf?.title ?? "", description: sf?.description ?? "", ogImage: sf?.ogImage ?? "", missing, ok: missing.length === 0 };
}
function seoRows(posts: Post[], projects: Project[]): SEORow[] {
  const site = getSiteSettings();
  const og = site.defaultOgImage;
  const rows: SEORow[] = [
    { scope: "Página", name: "Home", ...seoStatus(site.seo) },
    { scope: "Página", name: "Cuaderno", ...seoStatus({ title: "Cuaderno — andyalbarracin.com", description: "Notas, ideas y reflexiones desde el camino.", ogImage: og }) },
    { scope: "Página", name: "Proyectos", ...seoStatus({ title: "Proyectos — andyalbarracin.com", description: "Sistemas, ideas y productos en construcción.", ogImage: og }) },
    { scope: "Página", name: "Sobre mí", ...seoStatus({ title: "Sobre mí — andyalbarracin.com", description: "Perfil creativo de Andy Albarracín.", ogImage: og }) },
  ];
  posts.forEach((p) => rows.push({ scope: "Artículo", name: p.title, ...seoStatus(p.seo) }));
  projects.filter(isPublicProject).forEach((pr) => rows.push({ scope: "Proyecto", name: pr.title, ...seoStatus(pr.seo) }));
  return rows;
}

/** Completa id/slug faltantes al crear un item nuevo. */
function withDefaults<T extends { id: string; slug: string; title: string }>(item: T, prefix: string): T {
  const id = item.id || prefix + Date.now();
  const slug = item.slug || local.slugify(item.title || prefix);
  return { ...item, id, slug };
}
