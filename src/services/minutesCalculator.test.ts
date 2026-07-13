import { describe, it, expect } from 'vitest';
import {
  sumMinutesTotal,
  sumTodayMinutes,
  calculateLogMinutesForPractices,
} from './minutesCalculator';
import type { PracticeLogRow } from '../lib/supabase/types';

function makeLog(minutes: number | null, logDate = '2026-06-26'): PracticeLogRow {
  return {
    id: '1',
    device_id: 'dev',
    log_date: logDate,
    logged_at: '2026-06-26T10:00:00Z',
    practices_logged: ['guru-pooja'],
    daily_practices_at_time: [],
    daily_count_at_time: 0,
    ring_state_before: 0,
    ring_state_after: 0,
    minutes_total: minutes,
  };
}

describe('sumMinutesTotal', () => {
  it('sums minutes_total across all logs, excluding null and zero', () => {
    const logs = [makeLog(10), makeLog(20), makeLog(null), makeLog(0)];
    expect(sumMinutesTotal(logs)).toBe(30);
  });
});

describe('sumTodayMinutes', () => {
  it('sums minutes_total for logs on the given date only', () => {
    const logs = [
      makeLog(10, '2026-06-26'),
      makeLog(15, '2026-06-26'),
      makeLog(5, '2026-06-25'),
    ];
    expect(sumTodayMinutes(logs, '2026-06-26')).toBe(25);
  });

  it('sums minutes when the same daily practice is logged twice same day', () => {
    const logs = [
      makeLog(6, '2026-06-26'),
      makeLog(6, '2026-06-26'),
    ];
    expect(sumTodayMinutes(logs, '2026-06-26')).toBe(12);
  });
});

describe('calculateLogMinutesForPractices', () => {
  it('delegates to practices catalog for canonical durations', () => {
    expect(calculateLogMinutesForPractices(['guru-pooja'])).toBe(6);
  });
});
