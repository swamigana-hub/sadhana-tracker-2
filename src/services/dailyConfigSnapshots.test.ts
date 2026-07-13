import { describe, it, expect, beforeEach } from 'vitest';
import {
  snapshotDailyConfigForDate,
  getDailyConfigForDate,
  getAllDailyConfigSnapshots,
} from './dailyConfigSnapshots';
import { aggregateWeeklyHeatmap } from './weeklyHeatmapAggregator';
import type { PracticeLogRow } from '../lib/supabase/types';

function makeLog(
  logDate: string,
  practices: string[],
  dailyAtTime: string[],
  dailyCount: number,
  loggedAt: string
): PracticeLogRow {
  return {
    id: loggedAt,
    device_id: 'dev',
    log_date: logDate,
    logged_at: loggedAt,
    practices_logged: practices,
    daily_practices_at_time: dailyAtTime,
    daily_count_at_time: dailyCount,
    ring_state_before: 0,
    ring_state_after: 0,
    minutes_total: 10,
  };
}

describe('dailyConfigSnapshots', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores per-date daily config without overwriting other dates', () => {
    snapshotDailyConfigForDate('2026-06-22', ['guru-pooja', 'isha-kriya']);
    snapshotDailyConfigForDate('2026-06-26', ['guru-pooja']);

    expect(getDailyConfigForDate('2026-06-22')).toEqual(['guru-pooja', 'isha-kriya']);
    expect(getDailyConfigForDate('2026-06-26')).toEqual(['guru-pooja']);
  });

  it('prefers stored config over stale log snapshot for historical days', () => {
    snapshotDailyConfigForDate('2026-06-22', ['guru-pooja', 'isha-kriya', 'mahamantra']);
    const logs = [
      makeLog('2026-06-22', ['guru-pooja'], ['guru-pooja'], 1, '2026-06-22T10:00:00Z'),
    ];

    const weeks = aggregateWeeklyHeatmap(logs, new Date(2026, 5, 26), getAllDailyConfigSnapshots());
    const mondayWeek = weeks.find((w) => w.mondayDate === '2026-06-22');
    const mondayTile = mondayWeek?.days.find((d) => d.date === '2026-06-22');

    expect(mondayTile?.tileState).toBe('p50');
  });
});
