import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { usePracticeInstances } from './usePracticeInstances';
import { STORAGE_KEYS } from '../services/localStore';

describe('usePracticeInstances', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads daily and other lists from localStorage', () => {
    localStorage.setItem(STORAGE_KEYS.dailyPractices, JSON.stringify(['guru-pooja']));
    localStorage.setItem(STORAGE_KEYS.otherPractices, JSON.stringify(['isha-kriya']));

    const { result } = renderHook(() => usePracticeInstances());
    expect(result.current.daily).toEqual(['guru-pooja']);
    expect(result.current.other).toEqual(['isha-kriya']);
  });

  it('addToDaily updates state and localStorage', () => {
    const { result } = renderHook(() => usePracticeInstances());

    act(() => {
      result.current.addToDaily('guru-pooja');
    });

    expect(result.current.daily).toEqual(['guru-pooja']);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.dailyPractices)!);
    expect(stored[0].practiceId).toBe('guru-pooja');
  });

  it('syncToBackend calls upsert with current lists', async () => {
    const upsert = vi.fn().mockResolvedValue({ data: null, error: null });
    const client = { from: vi.fn(() => ({ upsert })) } as unknown as SupabaseClient;

    const { result } = renderHook(() => usePracticeInstances());

    act(() => {
      result.current.addToDaily('guru-pooja');
    });

    await act(async () => {
      await result.current.syncToBackend(client, 'dev-1');
    });

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        device_id: 'dev-1',
        daily_practices: ['guru-pooja'],
        other_practices: [],
        display_name: null,
      }),
      { onConflict: 'device_id' }
    );
  });
});
