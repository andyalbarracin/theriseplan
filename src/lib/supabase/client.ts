import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client. Returns null when env is not configured so the app
 * keeps running on the mock data source (see src/lib/cms). When credentials are
 * present, swap the cms query/mutation bodies for calls through this client.
 */
export function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

export const isSupabaseConfigured = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
