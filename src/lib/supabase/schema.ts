/**
 * Table names + a place to generate `Database` types from Supabase later
 * (`supabase gen types typescript`). The mock CMS in src/lib/cms mirrors these
 * shapes so switching data sources is a drop-in change.
 */
export const TABLES = {
  profiles: "profiles",
  posts: "posts",
  projects: "projects",
  mediaAssets: "media_assets",
  siteSettings: "site_settings",
  homeSettings: "home_settings",
  navigationSettings: "navigation_settings",
  seoSettings: "seo_settings",
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];
