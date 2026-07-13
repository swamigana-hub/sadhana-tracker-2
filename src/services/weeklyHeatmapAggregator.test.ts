import { describe, it, expect } from 'vitest';
import { aggregateWeeklyHeatmap, getRollingSevenDayStrip } from './weeklyHeatmapAggregator';
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

describe('aggregateWeeklyHeatmap', () => {
  it('groups days by Monday-start weeks, most recent week first', () => {
    const logs = [
      makeLog('2026-06-22', ['guru-pooja'], ['guru-pooja', 'isha-kriya'], 2, '2026-06-22T10:00:00Z'),
      makeLog('2026-06-23', ['isha-kriya'], ['guru-pooja', 'isha-kriya'], 2, '2026-06-23T10:00:00Z'),
      makeLog('2026-06-15', ['guru-pooja'], ['guru-pooja'], 1, '2026-06-15T10:00:00Z'),
    ];

    const weeks = aggregateWeeklyHeatmap(logs, new Date(2026, 5, 26));

    expect(weeks.length).toBeGreaterThanOrEqual(2);
    expect(weeks[0].mondayDate).toBe('2026-06-22');
    expect(weeks[0].days).toHaveLength(7);
  });

  it('uses most recent log snapshot per date for tile state', () => {
    const logs = [
      makeLog('2026-06-22', ['guru-pooja'], ['guru-pooja', 'isha-kriya'], 2, '2026-06-22T08:00:00Z'),
      makeLog('2026-06-22', ['isha-kriya'], ['guru-pooja', 'isha-kriya'], 2, '2026-06-22T18:00:00Z'),
    ];

    const weeks = aggregateWeeklyHeatmap(logs, new Date(2026, 5, 26));
    const mondayWeek = weeks.find((w) => w.mondayDate === '2026-06-22');
    const mondayTile = mondayWeek?.days.find((d) => d.date === '2026-06-22');

    expect(mondayTile?.tileState).toBe('p100');
  });

  it('includes year on week when Monday is in that year', () => {
    const logs = [
      makeLog('2026-01-05', ['guru-pooja'], ['guru-pooja'], 1, '2026-01-05T10:00:00Z'),
    ];
    const weeks = aggregateWeeklyHeatmap(logs, new Date(2026, 0, 10));
    expect(weeks[0].year).toBe(2026);
  });

  it('uses log snapshot daily_count for historical days, not current list', () => {
    const logs = [
      makeLog(
        '2026-06-22',
        ['guru-pooja'],
        ['guru-pooja', 'isha-kriya', 'mahamantra'],
        3,
        '2026-06-22T10:00:00Z'
      ),
    ];

    const weeks = aggregateWeeklyHeatmap(logs, new Date(2026, 5, 26));
    const mondayWeek = weeks.find((w) => w.mondayDate === '2026-06-22');
    const mondayTile = mondayWeek?.days.find((d) => d.date === '2026-06-22');

    expect(mondayTile?.tileState).toBe('p50');
  });
});

describe('getRollingSevenDayStrip', () => {
  it('returns seven days ending today, oldest first', () => {
    const logs = [
      makeLog('2026-07-03', ['guru-pooja'], ['guru-pooja'], 1, '2026-07-03T10:00:00Z'),
    ];
    const strip = getRollingSevenDayStrip(logs, '2026-07-05');
    expect(strip).toHaveLength(7);
    expect(strip[0].date).toBe('2026-06-29');
    expect(strip[6].date).toBe('2026-07-05');
    expect(strip[4].tileState).not.toBe('future');
    expect(strip[0].tileState).toBe('before-tracking');
  });
});
