import { describe, it, expect, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  fetchAllPracticeLogs,
  computeAdminSummary,
  deviceIdPrefix,
  formatPracticeNames,
  computeParticipantRows,
} from './adminQueries';
import type { DeviceSessionRow, PracticeLogRow } from './types';
describe('fetchAllPracticeLogs', () => {
  it('fetches all logs ordered by logged_at descending', async () => {
    const order = vi.fn().mockResolvedValue({ data: [], error: null });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn(() => ({ select }));
    const client = { from } as unknown as SupabaseClient;

    await fetchAllPracticeLogs(client);

    expect(from).toHaveBeenCalledWith('practice_logs');
    expect(order).toHaveBeenCalledWith('logged_at', { ascending: false });
  });
});

describe('computeAdminSummary', () => {
  it('computes participant count, session count, and date range', () => {
    const logs: PracticeLogRow[] = [
      {
        id: '1',
        device_id: 'aaa',
        log_date: '2026-06-01',
        logged_at: '2026-06-01T10:00:00Z',
        practices_logged: [],
        daily_practices_at_time: [],
        daily_count_at_time: 0,
        ring_state_before: 0,
        ring_state_after: 0,
        minutes_total: 10,
      },
      {
        id: '2',
        device_id: 'bbb',
        log_date: '2026-06-26',
        logged_at: '2026-06-26T10:00:00Z',
        practices_logged: [],
        daily_practices_at_time: [],
        daily_count_at_time: 0,
        ring_state_before: 0,
        ring_state_after: 0,
        minutes_total: 20,
      },
      {
        id: '3',
        device_id: 'aaa',
        log_date: '2026-06-15',
        logged_at: '2026-06-15T10:00:00Z',
        practices_logged: [],
        daily_practices_at_time: [],
        daily_count_at_time: 0,
        ring_state_before: 0,
        ring_state_after: 0,
        minutes_total: 5,
      },
    ];

    expect(computeAdminSummary(logs)).toEqual({
      totalParticipants: 2,
      totalLogSessions: 3,
      earliestLogDate: '2026-06-01',
      latestLogDate: '2026-06-26',
    });
  });
});

describe('deviceIdPrefix', () => {
  it('returns first 8 characters of device id', () => {
    expect(deviceIdPrefix('abcdef12-3456-7890-abcd-ef1234567890')).toBe('abcdef12');
  });
});

describe('formatPracticeNames', () => {
  it('maps ids to display names', () => {
    expect(formatPracticeNames(['guru-pooja', 'isha-kriya'])).toBe('Guru Pooja; Isha Kriya');
  });

  it('falls back to id when practice is unknown', () => {
    expect(formatPracticeNames(['unknown-practice'])).toBe('unknown-practice');
  });
});

describe('computeParticipantRows', () => {
  it('aggregates per-device stats from logs and sessions', () => {
    const sessions: DeviceSessionRow[] = [
      {
        id: 's1',
        device_id: 'device-aaa',
        created_at: '2026-06-01T08:00:00Z',
        setup_complete: true,
        daily_practices: ['guru-pooja', 'isha-kriya'],
        other_practices: ['aum-chanting'],
        display_name: null,
      },
    ];
    const logs: PracticeLogRow[] = [
      {
        id: '1',
        device_id: 'device-aaa',
        log_date: '2026-06-01',
        logged_at: '2026-06-01T10:00:00Z',
        practices_logged: ['guru-pooja'],
        daily_practices_at_time: ['guru-pooja', 'isha-kriya'],
        daily_count_at_time: 2,
        ring_state_before: 0,
        ring_state_after: 1,
        minutes_total: 6,
      },
      {
        id: '2',
        device_id: 'device-aaa',
        log_date: '2026-06-02',
        logged_at: '2026-06-02T10:00:00Z',
        practices_logged: ['isha-kriya'],
        daily_practices_at_time: ['guru-pooja', 'isha-kriya'],
        daily_count_at_time: 2,
        ring_state_before: 1,
        ring_state_after: 2,
        minutes_total: 14,
      },
    ];

    expect(computeParticipantRows(logs, sessions)).toEqual([
      {
        deviceIdPrefix: 'device-a',
        deviceId: 'device-aaa',
        setupDate: '2026-06-01T08:00:00Z',
        dailyCount: 2,
        otherCount: 1,
        daysLogged: 2,
        totalMinutes: 20,
        lastLogAt: '2026-06-02T10:00:00Z',
      },
    ]);
  });
});