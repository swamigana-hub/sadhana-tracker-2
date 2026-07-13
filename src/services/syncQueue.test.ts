import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { flushPendingLogs, enqueueFailedLog, registerSyncOnReconnect } from './syncQueue';
import {
  getPendingLogs,
  setPendingLogs,
  STORAGE_KEYS,
} from './localStore';
import type { LocalPracticeLog } from '../types/local';

function makeLog(id: string): LocalPracticeLog {
  return {
    id,
    device_id: 'dev-1',
    log_date: '2026-06-26',
    logged_at: '2026-06-26T10:00:00Z',
    practices_logged: ['guru-pooja'],
    daily_practices_at_time: ['guru-pooja'],
    daily_count_at_time: 1,
    ring_state_before: 0,
    ring_state_after: 1,
    minutes_total: 6,
    placement_instance_id: 'instance-pending',
  };
}

function createMockClient(insert = vi.fn().mockResolvedValue({ data: null, error: null })) {
  const from = vi.fn(() => ({ insert }));
  return { client: { from } as unknown as SupabaseClient, insert };
}

describe('enqueueFailedLog', () => {
  beforeEach(() => localStorage.clear());

  it('adds log to pending_logs queue', () => {
    const log = makeLog('fail-1');
    enqueueFailedLog(log);
    expect(getPendingLogs()).toEqual([log]);
  });
});

describe('flushPendingLogs', () => {
  beforeEach(() => localStorage.clear());

  it('inserts all pending logs and clears queue on success', async () => {
    const log1 = makeLog('p1');
    const log2 = makeLog('p2');
    setPendingLogs([log1, log2]);

    const { client, insert } = createMockClient();

    const result = await flushPendingLogs(client);

    expect(insert).toHaveBeenCalledTimes(2);
    expect(getPendingLogs()).toEqual([]);
    expect(result).toEqual({ flushed: 2, failed: 0 });
  });

  it('keeps failed logs in queue when insert errors', async () => {
    const log = makeLog('p1');
    setPendingLogs([log]);

    const insert = vi
      .fn()
      .mockResolvedValueOnce({ data: null, error: { message: 'network' } });
    const { client } = createMockClient(insert);

    const result = await flushPendingLogs(client);

    expect(getPendingLogs()).toEqual([log]);
    expect(result).toEqual({ flushed: 0, failed: 1 });
  });

  it('returns zero counts when queue is empty', async () => {
    const { client } = createMockClient();
    const result = await flushPendingLogs(client);
    expect(result).toEqual({ flushed: 0, failed: 0 });
  });
});

describe('STORAGE_KEYS', () => {
  it('uses pending_logs key', () => {
    expect(STORAGE_KEYS.pendingLogs).toBe('pending_logs');
  });
});

describe('registerSyncOnReconnect', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('navigator', { ...navigator, onLine: true });
  });

  it('flushes pending logs when browser goes online', async () => {
    setPendingLogs([makeLog('p1')]);
    const { client, insert } = createMockClient();

    registerSyncOnReconnect(client);
    window.dispatchEvent(new Event('online'));

    await vi.waitFor(() => {
      expect(insert).toHaveBeenCalled();
      expect(getPendingLogs()).toEqual([]);
    });
  });

  it('flushes pending logs when tab becomes visible', async () => {
    setPendingLogs([makeLog('p1')]);
    const { client, insert } = createMockClient();

    registerSyncOnReconnect(client);
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    });
    document.dispatchEvent(new Event('visibilitychange'));

    await vi.waitFor(() => {
      expect(insert).toHaveBeenCalled();
    });
  });

  it('does not flush while offline', () => {
    vi.stubGlobal('navigator', { ...navigator, onLine: false });
    setPendingLogs([makeLog('p1')]);
    const { client, insert } = createMockClient();

    registerSyncOnReconnect(client);
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(insert).not.toHaveBeenCalled();
    expect(getPendingLogs()).toHaveLength(1);
  });
});
