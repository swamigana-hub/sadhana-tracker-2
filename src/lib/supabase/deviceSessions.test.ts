import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { upsertDeviceSession, fetchDeviceSession } from './deviceSessions';

function createMockClient() {
  const upsert = vi.fn().mockResolvedValue({ data: null, error: null });
  const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn((table: string) => {
    if (table === 'device_sessions') {
      return { upsert, select };
    }
    throw new Error(`Unexpected table: ${table}`);
  });

  return { client: { from } as unknown as SupabaseClient, upsert, eq, maybeSingle };
}

describe('upsertDeviceSession', () => {
  beforeEach(() => vi.clearAllMocks());

  it('upserts device session with onConflict device_id', async () => {
    const { client, upsert } = createMockClient();

    await upsertDeviceSession(client, {
      device_id: 'abc-123',
      setup_complete: true,
      daily_practices: ['guru-pooja'],
      other_practices: ['isha-kriya'],
    });

    expect(upsert).toHaveBeenCalledWith(
      {
        device_id: 'abc-123',
        setup_complete: true,
        daily_practices: ['guru-pooja'],
        other_practices: ['isha-kriya'],
      },
      { onConflict: 'device_id' }
    );
  });

  it('throws when supabase returns an error', async () => {
    const { client, upsert } = createMockClient();
    upsert.mockResolvedValue({ data: null, error: { message: 'db error' } });

    await expect(
      upsertDeviceSession(client, {
        device_id: 'abc',
        setup_complete: true,
        daily_practices: [],
        other_practices: [],
      })
    ).rejects.toThrow('db error');
  });
});

describe('fetchDeviceSession', () => {
  it('fetches session by device_id', async () => {
    const { client, eq, maybeSingle } = createMockClient();
    const row = { device_id: 'abc', setup_complete: true };
    maybeSingle.mockResolvedValue({ data: row, error: null });

    const result = await fetchDeviceSession(client, 'abc');

    expect(eq).toHaveBeenCalledWith('device_id', 'abc');
    expect(result).toEqual(row);
  });
});
