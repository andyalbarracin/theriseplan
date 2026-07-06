import type { CMSSnapshot } from "@/lib/types";
import { DEFAULTS } from "@/lib/data/seed";

/* =============================================================================
   CMS store — isomorphic.

   • Server: every read returns a fresh clone of the canonical seed (DEFAULTS).
     The server is the source of truth; public pages render from it (SSR + SEO).
   • Client: seeded once from DEFAULTS into localStorage ("aa_cms_v1"); the
     dashboard reads/writes this overlay so authoring feels real and persists
     across reloads. Structured for a drop-in Supabase swap (replace the bodies
     of the query/mutation functions with async Supabase calls).
   ============================================================================= */

const STORE_KEY = "aa_cms_v1";

export const clone = <T>(v: T): T =>
  typeof structuredClone === "function"
    ? structuredClone(v)
    : (JSON.parse(JSON.stringify(v)) as T);

const isBrowser = (): boolean =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

let cache: CMSSnapshot | null = null;

/** Back-fill fields added after a store was first seeded (localStorage persists
    across sessions). */
function migrate(snap: CMSSnapshot): CMSSnapshot {
  const d = DEFAULTS;
  if (!snap.home) snap.home = clone(d.home);
  if (!snap.home.heroOrigin) snap.home.heroOrigin = clone(d.home.heroOrigin);
  if (!Array.isArray(snap.home.heroDestinations) || !snap.home.heroDestinations.length) {
    snap.home.heroDestinations = clone(d.home.heroDestinations);
  }
  if (!snap.home.heroFade) snap.home.heroFade = clone(d.home.heroFade);
  if (!snap.ahora) snap.ahora = clone(d.ahora);
  if (snap.site?.theme) {
    if (snap.site.theme.headingScale == null) snap.site.theme.headingScale = 1;
    if (!snap.site.theme.heroAccent) snap.site.theme.heroAccent = "#9db8ec";
  }
  if (snap.version == null) snap.version = d.version;
  return snap;
}

function persist(): void {
  try {
    if (isBrowser() && cache) window.localStorage.setItem(STORE_KEY, JSON.stringify(cache));
  } catch {
    /* quota / privacy mode — ignore */
  }
}

/** The working snapshot. Server → fresh seed clone. Client → localStorage overlay. */
export function snapshot(): CMSSnapshot {
  if (!isBrowser()) return clone(DEFAULTS);
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) {
      cache = migrate(JSON.parse(raw) as CMSSnapshot);
      return cache;
    }
  } catch {
    /* ignore */
  }
  cache = clone(DEFAULTS);
  persist();
  return cache;
}

/** Persist the current in-memory snapshot (call after any mutation). */
export function commit(): void {
  persist();
}

/** Reset the client store back to the seed (used by the dashboard). */
export function resetStore(): CMSSnapshot {
  cache = clone(DEFAULTS);
  persist();
  return cache;
}
