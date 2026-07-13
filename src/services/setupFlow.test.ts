import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { completeSetup, persistSetupLocally, syncSetupToBackend } from './setupFlow';
import {
  getDailyPracticeIds,
  getOtherPracticeIds,
  getSetupComplete,
  STORAGE_KEYS,
} from './localStore';
import * as deviceSessions from '../lib/supabase/deviceSessions';

describe('completeSetup', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists daily and other lists and marks setup complete locally', () => {
    completeSetup(['guru-pooja'], ['isha-kriya'], 'dev-1', null);

    expect(getDailyPracticeIds()).toEqual(['guru-pooja']);
    expect(getOtherPracticeIds()).toEqual(['isha-kriya']);
    expect(getSetupComplete()).toBe(true);
  });

  it('syncs device session in background when supabase client is provided', async () => {
    const safe = vi.spyOn(deviceSessions, 'upsertDeviceSessionSafe').mockResolvedValue(true);

    syncSetupToBackend(['guru-pooja'], [], 'dev-1', {} as SupabaseClient);

    await vi.waitFor(() => {
      expect(safe).toHaveBeenCalledWith({} as SupabaseClient, {
        device_id: 'dev-1',
        setup_complete: true,
        daily_practices: ['guru-pooja'],
        other_practices: [],
        display_name: null,
      });
    });
  });

  it('never throws when device_sessions sync fails (e.g. RLS)', async () => {
    vi.spyOn(deviceSessions, 'upsertDeviceSessionSafe').mockResolvedValue(false);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => {
      completeSetup(['guru-pooja'], ['isha-kriya'], 'dev-1', {} as SupabaseClient);
    }).not.toThrow();

    expect(getSetupComplete()).toBe(true);
    expect(getDailyPracticeIds()).toEqual(['guru-pooja']);
    expect(localStorage.getItem(STORAGE_KEYS.setupComplete)).toBe('true');

    await vi.waitFor(() => {
      expect(deviceSessions.upsertDeviceSessionSafe).toHaveBeenCalled();
    });

    warn.mockRestore();
  });

  it('persistSetupLocally is independent of supabase', () => {
    persistSetupLocally(['guru-pooja'], ['aum-chanting']);
    expect(getSetupComplete()).toBe(true);
    expect(getOtherPracticeIds()).toEqual(['aum-chanting']);
  });
});
