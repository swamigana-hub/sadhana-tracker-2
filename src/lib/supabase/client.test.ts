import { describe, it, expect, vi, afterEach } from 'vitest';

describe('createSupabaseClient', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('throws when VITE_SUPABASE_URL is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-key');
    const { createSupabaseClient } = await import('./client');

    expect(() => createSupabaseClient()).toThrow('VITE_SUPABASE_URL');
  });

  it('creates a client when env vars are set', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
    const { createSupabaseClient } = await import('./client');

    const client = createSupabaseClient();
    expect(client).toBeDefined();
  });
});
