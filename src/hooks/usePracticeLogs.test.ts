import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { usePracticeLogs } from './usePracticeLogs';
import { STORAGE_KEYS, getPendingLogs, setPracticeLists } from '../services/localStore';

function createMockClient(remote: unknown[] = []) {
  const insert = vi.fn().mockResolvedValue({ data: null, error: null });
  const updateEq = vi.fn().mockResolvedValue({ data: null, error: null });
  const update = vi.fn().mockReturnValue({ eq: updateEq });
  const order = vi.fn().mockResolvedValue({ data: remote, error: null });
  const eq = vi.fn().mockReturnValue({ order });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn(() => ({ insert, select, update }));
  return { client: { from } as unknown as SupabaseClient, insert, update, updateEq };
}

describe('usePracticeLogs', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads logs from localStorage on mount and backfills placement_instance_id', () => {
    const cached = [
      {
        id: 'cached-1',
        device_id: 'dev',
        log_date: '2026-06-26',
        logged_at: '2026-06-26T10:00:00Z',
        practices_logged: ['guru-pooja'],
        daily_practices_at_time: ['guru-pooja'],
        daily_count_at_time: 1,
        ring_state_before: 0,
        ring_state_after: 1,
        minutes_total: 6,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.practiceLogs, JSON.stringify(cached));

    const { result } = renderHook(() => usePracticeLogs('dev'));
    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0].placement_instance_id).toBeTruthy();
  });

  it('addLog appends locally and syncs to supabase', async () => {
    setPracticeLists({
      daily: [{ instanceId: 'instance-1', practiceId: 'guru-pooja' }],
      other: [],
    });
    const { client, insert } = createMockClient();
    const { result } = renderHook(() => usePracticeLogs('dev', client));

    let logResult: Awaited<ReturnType<typeof result.current.addLog>> | undefined;
    await act(async () => {
      logResult = await result.current.addLog({
        logDate: '2026-06-26',
        practiceIds: ['guru-pooja'],
        dailyPractices: ['guru-pooja'],
        placementInstanceId: 'instance-1',
      });
    });

    await waitFor(() => {
      expect(result.current.logs).toHaveLength(1);
    });

    expect(logResult?.ringIncreased).toBe(true);
    expect(result.current.logs[0].practices_logged).toEqual(['guru-pooja']);
    expect(result.current.logs[0].placement_instance_id).toBe('instance-1');
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ placement_instance_id: 'instance-1' })
    );
    expect(getPendingLogs()).toEqual([]);
  });

  it('does not increase ring for other-only practices', async () => {
    const { result } = renderHook(() => usePracticeLogs('dev', null));

    let logResult: Awaited<ReturnType<typeof result.current.addLog>> | undefined;
    await act(async () => {
      logResult = await result.current.addLog({
        logDate: '2026-06-26',
        practiceIds: ['aum-chanting'],
        dailyPractices: ['guru-pooja'],
        placementInstanceId: 'instance-other',
      });
    });

    expect(logResult?.ringIncreased).toBe(false);
    expect(logResult?.ring_state_after).toBe(0);
  });

  it('queues log when supabase insert fails', async () => {
    const insert = vi.fn().mockResolvedValue({ data: null, error: { message: 'offline' } });
    const updateEq = vi.fn().mockResolvedValue({ data: null, error: null });
    const update = vi.fn().mockReturnValue({ eq: updateEq });
    const order = vi.fn().mockResolvedValue({ data: [], error: null });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const client = { from: vi.fn(() => ({ insert, select, update })) } as unknown as SupabaseClient;

    const { result } = renderHook(() => usePracticeLogs('dev', client));

    await act(async () => {
      await result.current.addLog({
        logDate: '2026-06-26',
        practiceIds: ['guru-pooja'],
        dailyPractices: ['guru-pooja'],
        placementInstanceId: 'instance-queue',
      });
    });

    await waitFor(() => {
      expect(result.current.logs).toHaveLength(1);
    });
    expect(getPendingLogs()).toHaveLength(1);
  });

  it('syncFromBackend merges remote logs into local cache', async () => {
    const remote = [
      {
        id: 'remote-1',
        device_id: 'dev',
        log_date: '2026-06-25',
        logged_at: '2026-06-25T10:00:00Z',
        practices_logged: ['isha-kriya'],
        daily_practices_at_time: ['isha-kriya'],
        daily_count_at_time: 1,
        ring_state_before: 0,
        ring_state_after: 1,
        minutes_total: 14,
        placement_instance_id: null,
      },
    ];
    const { client } = createMockClient(remote);

    const { result } = renderHook(() => usePracticeLogs('dev', client));

    await act(async () => {
      await result.current.syncFromBackend();
    });

    await waitFor(() => {
      expect(result.current.logs).toHaveLength(1);
      expect(result.current.logs[0].placement_instance_id).toBeTruthy();
    });
  });
});
