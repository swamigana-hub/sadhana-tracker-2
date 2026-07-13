import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { persistPracticeListChange } from './practiceListChange';
import {
  setSetupComplete,
  getDailyPracticeIds,
  getOtherPracticeIds,
  appendPracticeLog,
  getPracticeLogs,
} from './localStore';
import { listsFrom } from './practiceInstances.testHelpers';
import type { LocalPracticeLog } from '../types/local';

function makeLog(): LocalPracticeLog {
  return {
    id: 'log-1',
    device_id: 'dev-1',
    log_date: '2026-06-26',
    logged_at: '2026-06-26T10:00:00Z',
    practices_logged: ['guru-pooja'],
    daily_practices_at_time: ['guru-pooja'],
    daily_count_at_time: 1,
    ring_state_before: 0,
    ring_state_after: 1,
    minutes_total: 6,
  };
}

describe('persistPracticeListChange', () => {
  beforeEach(() => {
    localStorage.clear();
    setSetupComplete(true);
  });

  it('upserts device session and inserts analytics event', async () => {
    const insert = vi.fn().mockResolvedValue({ data: null, error: null });
    const upsert = vi.fn().mockResolvedValue({ data: null, error: null });
    const from = vi.fn((table: string) => {
      if (table === 'analytics_events') return { insert };
      if (table === 'device_sessions') return { upsert };
      throw new Error(table);
    });
    const client = { from } as unknown as SupabaseClient;

    const lists = listsFrom(['guru-pooja'], []);
    await persistPracticeListChange(client, 'dev-1', lists, {
      practiceId: 'guru-pooja',
      previousStatus: 'daily',
      newStatus: 'none',
    });

    expect(insert).toHaveBeenCalled();
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        device_id: 'dev-1',
        setup_complete: true,
        daily_practices: ['guru-pooja'],
        display_name: null,
      }),
      { onConflict: 'device_id' }
    );
  });

  it('updates local lists even without supabase client', async () => {
    const lists = listsFrom([], ['isha-kriya']);
    await persistPracticeListChange(null, 'dev-1', lists, {
      practiceId: 'isha-kriya',
      previousStatus: 'other',
      newStatus: 'none',
    });
    expect(getDailyPracticeIds()).toEqual([]);
    expect(getOtherPracticeIds()).toEqual(['isha-kriya']);
  });

  it('does not remove historical practice logs when list changes', async () => {
    appendPracticeLog(makeLog());

    await persistPracticeListChange(null, 'dev-1', listsFrom([], []), {
      practiceId: 'guru-pooja',
      previousStatus: 'daily',
      newStatus: 'none',
    });

    expect(getPracticeLogs()).toHaveLength(1);
    expect(getPracticeLogs()[0].practices_logged).toEqual(['guru-pooja']);
  });
});
