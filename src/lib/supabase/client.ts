import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let singleton: SupabaseClient | null = null;

export function createSupabaseClient(): SupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error('VITE_SUPABASE_URL is not configured');
  }
  if (!key) {
    throw new Error('VITE_SUPABASE_ANON_KEY is not configured');
  }

  return createClient(url, key);
}

/** Lazily initialized singleton for app use. */
export function getSupabase(): SupabaseClient {
  if (!singleton) {
    singleton = createSupabaseClient();
  }
  return singleton;
}

/** Returns null when env vars are not configured (offline / local-only). */
export function tryGetSupabase(): SupabaseClient | null {
  try {
    return getSupabase();
  } catch {
    return null;
  }
}
