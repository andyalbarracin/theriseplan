-- =============================================================================
-- andyalbarracin.com — initial schema (draft)
-- Mirrors the mock CMS in src/lib/cms so switching to Supabase is a drop-in.
-- Run with the Supabase CLI: `supabase db push` (or paste into the SQL editor).
-- =============================================================================

create extension if not exists "pgcrypto";

-- ----- profiles (1 row per auth user; the editor) ---------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  role text default 'editor',
  created_at timestamptz default now()
);

-- ----- posts (Cuaderno) ------------------------------------------------------
create table if not exists public.posts (
  id text primary key,
  title text not null,
  slug text unique not null,
  subtitle text,
  excerpt text,
  category text,
  type text check (type in ('cronica','ensayo','video','reflexion','proyecto')),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  visibility text not null default 'public' check (visibility in ('public','private','hidden')),
  featured boolean not null default false,
  hero_image text,
  gallery jsonb default '[]'::jsonb,
  body_blocks jsonb default '[]'::jsonb,
  seo jsonb default '{}'::jsonb,
  location jsonb,
  published_at date,
  reading_time int,
  related jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- ----- projects (Proyectos) --------------------------------------------------
create table if not exists public.projects (
  id text primary key,
  title text not null,
  slug text unique not null,
  subtitle text,
  short_description text,
  long_description text,
  type text,
  status text not null default 'draft' check (status in ('active','building','paused','archived','draft')),
  visibility text not null default 'public' check (visibility in ('public','private','hidden')),
  sensitive boolean not null default false,
  featured boolean not null default false,
  hero_image text,
  gallery jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  technologies jsonb default '[]'::jsonb,
  links jsonb default '[]'::jsonb,
  role text,
  timeline text,
  blocks jsonb default '[]'::jsonb,
  seo jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ----- media assets ----------------------------------------------------------
create table if not exists public.media_assets (
  id text primary key,
  url text not null,
  filename text,
  alt text,
  caption text,
  type text check (type in ('portrait','landscape')),
  size int,
  used_in jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- ----- singleton settings (id = 'default') ----------------------------------
create table if not exists public.site_settings (id text primary key default 'default', data jsonb not null);
create table if not exists public.home_settings (id text primary key default 'default', data jsonb not null);
create table if not exists public.navigation_settings (id text primary key default 'default', data jsonb not null);
create table if not exists public.seo_settings (id text primary key default 'default', data jsonb not null);

-- ----- Row Level Security ----------------------------------------------------
alter table public.posts enable row level security;
alter table public.projects enable row level security;
alter table public.media_assets enable row level security;
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.home_settings enable row level security;
alter table public.navigation_settings enable row level security;
alter table public.seo_settings enable row level security;

-- Public may read only published+public posts.
create policy "posts public read" on public.posts for select
  using (status = 'published' and visibility = 'public');

-- Public may read only public, non-sensitive, non-draft projects (ELVA stays hidden).
create policy "projects public read" on public.projects for select
  using (visibility = 'public' and sensitive = false and status <> 'draft');

create policy "media public read" on public.media_assets for select using (true);
create policy "site read" on public.site_settings for select using (true);
create policy "home read" on public.home_settings for select using (true);
create policy "nav read" on public.navigation_settings for select using (true);

-- Authenticated editors get full access (tighten to profile.role = 'editor' as needed).
create policy "posts editor all" on public.posts for all to authenticated using (true) with check (true);
create policy "projects editor all" on public.projects for all to authenticated using (true) with check (true);
create policy "media editor all" on public.media_assets for all to authenticated using (true) with check (true);
create policy "site editor all" on public.site_settings for all to authenticated using (true) with check (true);
create policy "home editor all" on public.home_settings for all to authenticated using (true) with check (true);
create policy "nav editor all" on public.navigation_settings for all to authenticated using (true) with check (true);
create policy "seo editor all" on public.seo_settings for all to authenticated using (true) with check (true);
create policy "profiles self read" on public.profiles for select to authenticated using (auth.uid() = id);
