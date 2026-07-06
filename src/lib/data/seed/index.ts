import type { CMSSnapshot } from "@/lib/types";
import { POSTS } from "./posts";
import { PROJECTS } from "./projects";
import { MEDIA } from "./media";
import { HOME_SETTINGS } from "./home";
import { SITE_SETTINGS } from "./site";
import { NAV_SETTINGS } from "./nav";
import { AHORA_CONTENT } from "./ahora";

export { IMAGES } from "./images";
export { AHORA_CONTENT } from "./ahora";

/** Canonical seed snapshot — the source of truth on the server and the initial
    state seeded into the client store on first load. */
export const DEFAULTS: CMSSnapshot = {
  version: 1,
  posts: POSTS,
  projects: PROJECTS,
  media: MEDIA,
  home: HOME_SETTINGS,
  site: SITE_SETTINGS,
  nav: NAV_SETTINGS,
  ahora: AHORA_CONTENT,
};
