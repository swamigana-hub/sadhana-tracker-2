import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { insertPracticeLog, fetchPracticeLogsByDevice } from './practiceLogs';

function createMockClient() {
  const insert = vi.fn().mockResolvedValue({ data: null, error: null });
  const order = vi.fn().mockResolvedValue({ data: [], error: null });
  const eq = vi.fn().mockReturnValue({ order });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn((table: string) => {
    if (table === 'practice_logs') {
      return { insert, select };
    }
    throw new Error(`Unexpected table: ${table}`);
  });

  return { client: { from } as unknown as SupabaseClient, insert, eq, order };
}

describe('insertPracticeLog', () => {
  beforeEach(() => vi.clearAllMocks());

  it('inserts a log row with all required fields', async () => {
    const { client, insert } = createMockClient();
    const log = {
      device_id: 'dev-1',
      log_date: '2026-06-26',
      practices_logged: ['guru-pooja'],
      daily_practices_at_time: ['guru-pooja'],
      daily_count_at_time: 1,
      ring_state_before: 0,
      ring_state_after: 1,
      minutes_total: 6,
      placement_instance_id: 'instance-1',
    };

    await insertPracticeLog(client, log);

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ placement_instance_id: 'instance-1' })
    );
  });
});

describe('fetchPracticeLogsByDevice', () => {
  it('fetches logs ordered by logged_at descending', async () => {
    const { client, eq, order } = createMockClient();

    await fetchPracticeLogsByDevice(client, 'dev-1');

    expect(eq).toHaveBeenCalledWith('device_id', 'dev-1');
    expect(order).toHaveBeenCalledWith('logged_at', { ascending: false });
  });
});
