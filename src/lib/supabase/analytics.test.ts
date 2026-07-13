import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { insertAnalyticsEvent } from './analytics';

function createMockClient() {
  const insert = vi.fn().mockResolvedValue({ data: null, error: null });
  const from = vi.fn(() => ({ insert }));

  return { client: { from } as unknown as SupabaseClient, insert };
}

describe('insertAnalyticsEvent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('inserts event with device_id, event_name, and properties', async () => {
    const { client, insert } = createMockClient();

    await insertAnalyticsEvent(client, {
      device_id: 'dev-1',
      event_name: 'app_opened',
      properties: { timestamp: '2026-06-26T00:00:00Z', days_since_install: 0 },
    });

    expect(insert).toHaveBeenCalledWith({
      device_id: 'dev-1',
      event_name: 'app_opened',
      properties: { timestamp: '2026-06-26T00:00:00Z', days_since_install: 0 },
    });
  });
});
