import type {
  Post,
  Project,
  MediaAsset,
  SiteSettings,
  HomeSettings,
  NavSettings,
  AhoraContent,
} from "@/lib/types";
import { snapshot, commit } from "./store";

export const slugify = (s: string): string =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* ----- posts --------------------------------------------------------------- */
export function upsertPost(post: Post): Post {
  const s = snapshot();
  if (!post.id) post.id = "p" + Date.now();
  if (!post.slug) post.slug = slugify(post.title || "articulo");
  const i = s.posts.findIndex((x) => x.id === post.id);
  if (i >= 0) s.posts[i] = post;
  else s.posts.unshift(post);
  commit();
  return post;
}
export function deletePost(id: string): void {
  const s = snapshot();
  s.posts = s.posts.filter((x) => x.id !== id);
  commit();
}

/* ----- projects ------------------------------------------------------------ */
export function upsertProject(project: Project): Project {
  const s = snapshot();
  if (!project.id) project.id = "pr" + Date.now();
  if (!project.slug) project.slug = slugify(project.title || "proyecto");
  const i = s.projects.findIndex((x) => x.id === project.id);
  if (i >= 0) s.projects[i] = project;
  else s.projects.unshift(project);
  commit();
  return project;
}
export function deleteProject(id: string): void {
  const s = snapshot();
  s.projects = s.projects.filter((x) => x.id !== id);
  commit();
}

/* ----- media --------------------------------------------------------------- */
export function upsertMedia(asset: MediaAsset): MediaAsset {
  const s = snapshot();
  if (!asset.id) asset.id = "m" + Date.now();
  if (!asset.createdAt) asset.createdAt = new Date().toISOString();
  const i = s.media.findIndex((x) => x.id === asset.id);
  if (i >= 0) s.media[i] = asset;
  else s.media.unshift(asset);
  commit();
  return asset;
}
export function deleteMedia(id: string): void {
  const s = snapshot();
  s.media = s.media.filter((x) => x.id !== id);
  commit();
}

/* ----- settings ------------------------------------------------------------ */
export function updateSiteSettings(patch: Partial<SiteSettings>): SiteSettings {
  const s = snapshot();
  s.site = { ...s.site, ...patch };
  commit();
  return s.site;
}
export function updateHomeSettings(patch: Partial<HomeSettings>): HomeSettings {
  const s = snapshot();
  s.home = { ...s.home, ...patch };
  commit();
  return s.home;
}
export function updateNavSettings(patch: Partial<NavSettings>): NavSettings {
  const s = snapshot();
  s.nav = { ...s.nav, ...patch };
  commit();
  return s.nav;
}
export function updateAhoraContent(patch: Partial<AhoraContent>): AhoraContent {
  const s = snapshot();
  s.ahora = { ...s.ahora, ...patch };
  commit();
  return s.ahora;
}
