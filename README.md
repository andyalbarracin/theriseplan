# andyalbarracin.com — *Ideas en tránsito*

Personal archive of a creative director — editorial + airport/travel/boarding-pass
visual language. A production **Next.js (App Router) + React + TypeScript** app with
a full **CMS-ready dashboard**, built as a faithful implementation of the approved
Claude Design prototype (`VFinal - HTML/`).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first tokens in `src/app/globals.css`)
- **next/font** — Playfair Display (serif), Inter (sans), Over the Rainbow (hand), Space Mono, + Cormorant Garamond / Libre Baskerville / Work Sans / Caveat
- **framer-motion** (menu overlay, hovers) · **react-hook-form + zod** (forms)
- **@supabase/supabase-js + @supabase/ssr** — wired but optional (mock by default)
- **Playwright** — smoke tests

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm typecheck    # tsc --noEmit
pnpm lint
pnpm test         # Playwright smoke tests (needs: pnpm exec playwright install)
```

> The app runs with **zero configuration** — all content comes from the mock CMS.
> Copy `.env.example` → `.env.local` only when connecting Supabase.

## Routes

**Public** — `/` · `/cuaderno` · `/cuaderno/[slug]` · `/proyectos` · `/proyectos/[slug]` · `/ahora` · `/sobre-mi` · `/hablemos` · `/login`

**Dashboard (CMS)** — `/dashboard` · `/dashboard/home` · `/dashboard/cuaderno` (+ `/new`, `/[id]`) · `/dashboard/proyectos` (+ `/new`, `/[id]`) · `/dashboard/media` · `/dashboard/seo` · `/dashboard/navigation` · `/dashboard/ajustes`

## Visual fidelity — "exact reproduction"

The desktop is a **fixed 1440px composition scaled to fit** the viewport (as the
prototype does), with a **purpose-built mobile layout** for the homepage:

- `components/layout/ScaledStage.tsx` — homepage: measured `transform: scale(min(1, vw/1440))` + separate mobile branch (breakpoint 860px).
- `components/layout/FitCanvas.tsx` — interior/admin pages: CSS `zoom` fit-to-width (port of `responsive-fit.js`).

Design tokens (colours, fonts, paper grain, boarding pass, film strip, seal, route
map) are ported to match the prototype pixel-for-pixel.

## Data / CMS architecture

`src/lib/` mirrors the prototype's `data.js`, typed and split for a Supabase swap:

- `types.ts` — `Post`, `Project`, `MediaAsset`, `ContentBlock`, `SiteSettings`, `HomeSettings`, `NavSettings`, …
- `data/seed/*` — seed content (8 posts, 6 projects incl. hidden **ELVA**, 20 media, home/site/nav/ahora settings)
- `cms/` — one API surface (`getPosts`, `getPostBySlug`, `getProjects`, `getFeaturedProject`, `getMediaAssets`, `getSiteSettings`, `getHomeSettings`, `getSEOOverview`, `getStats`, `getSitemapRoutes`, `upsert*`, `delete*`, `update*Settings`, `resetStore`)
  - **Server** → canonical seed (SSR + SEO).
  - **Client** → `localStorage` overlay (`aa_cms_v1`) so dashboard edits persist and feel real.
  - `visibility.ts` gates every public query — drafts / private / hidden / sensitive content never reach a public page.

### Supabase-ready

`src/lib/supabase/{client,server,schema}.ts` + `supabase/migrations/0001_init.sql`
(tables `profiles, posts, projects, media_assets, *_settings` with RLS: public read
of published/public rows, authenticated write). Nothing is required to run — replace
the bodies of the `cms` query/mutation functions with Supabase calls when ready.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://andyalbarracin.com
```

## Notes

- **Auth**: `/login` is real UI; the dashboard is an **open mock** for now (Supabase auth is scaffolded, not enforced). Gate it via `middleware.ts` + `createServerSupabase()` when going live.
- Images live in `public/images/` (reused from the design export). `next.config.ts` uses `images.unoptimized` (all assets are local + pre-sized).
- `VFinal - HTML/` is the original Claude Design export, kept for reference and excluded from the build.

## Structure

```
src/
  app/                     # routes (public + dashboard) + sitemap/robots
  components/
    layout/  public/  admin/  motion/   # UI, split by surface
  lib/
    types.ts  routes.ts
    data/seed/*            # seed content
    cms/*                  # query/mutation API (mock now, Supabase later)
    supabase/*             # client/server/schema
    utils/*
  hooks/                   # useViewport, useClientData
public/images/*            # curated dummy assets
supabase/migrations/*      # schema draft
tests/                     # Playwright smoke tests
```
