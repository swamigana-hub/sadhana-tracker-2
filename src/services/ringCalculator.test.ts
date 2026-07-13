import { describe, it, expect } from 'vitest';
import {
  getDistinctDailyLoggedToday,
  getRingDisplayState,
  getDailyMinutesLoggedToday,
  computeRingStateAfterLog,
} from './ringCalculator';
import { placementsFromPracticeIds } from './practiceInstances';
import type { PracticeLogRow } from '../lib/supabase/types';

function makeLog(
  overrides: Partial<PracticeLogRow> & Pick<PracticeLogRow, 'log_date' | 'practices_logged'>
): PracticeLogRow {
  return {
    id: '1',
    device_id: 'dev',
    logged_at: '2026-06-26T10:00:00Z',
    daily_practices_at_time: ['guru-pooja', 'isha-kriya'],
    daily_count_at_time: 2,
    ring_state_before: 0,
    ring_state_after: 0,
    minutes_total: 10,
    ...overrides,
  };
}

describe('getDistinctDailyLoggedToday', () => {
  const daily = ['guru-pooja', 'isha-kriya', 'mahamantra'];

  it('counts distinct daily IDs logged on the given date', () => {
    const logs = [
      makeLog({ log_date: '2026-06-26', practices_logged: ['guru-pooja'] }),
      makeLog({ log_date: '2026-06-26', practices_logged: ['guru-pooja', 'aum-chanting'] }),
      makeLog({ log_date: '2026-06-25', practices_logged: ['guru-pooja'] }),
    ];
    expect(getDistinctDailyLoggedToday(logs, '2026-06-26', daily)).toBe(1);
  });
});

describe('getRingDisplayState', () => {
  it('returns placement counts and minutes-based fill ratio', () => {
    const dailyPlacements = placementsFromPracticeIds(['guru-pooja', 'isha-kriya']);
    const logs = [
      makeLog({
        log_date: '2026-06-26',
        practices_logged: ['guru-pooja'],
        placement_instance_id: dailyPlacements[0].instanceId,
      }),
    ];
    expect(
      getRingDisplayState(dailyPlacements, [], logs, '2026-06-26')
    ).toEqual({
      numerator: 1,
      denominator: 2,
      minutesFillRatio: 6 / 20,
    });
  });

  it('counts duplicate daily placements independently', () => {
    const dailyPlacements = placementsFromPracticeIds(['guru-pooja', 'guru-pooja']);
    const logs = [
      makeLog({
        log_date: '2026-06-26',
        practices_logged: ['guru-pooja'],
        placement_instance_id: dailyPlacements[0].instanceId,
      }),
    ];
    expect(getRingDisplayState(dailyPlacements, [], logs, '2026-06-26')).toEqual({
      numerator: 1,
      denominator: 2,
      minutesFillRatio: 6 / 12,
    });
  });
});

describe('getDailyMinutesLoggedToday', () => {
  it('sums minutes for distinct daily practices logged today', () => {
    const daily = ['guru-pooja', 'isha-kriya'];
    const logs = [
      makeLog({ log_date: '2026-06-26', practices_logged: ['guru-pooja', 'guru-pooja'] }),
      makeLog({ log_date: '2026-06-26', practices_logged: ['isha-kriya'] }),
    ];
    expect(getDailyMinutesLoggedToday(logs, '2026-06-26', daily)).toBe(20);
  });
});

describe('computeRingStateAfterLog', () => {
  it('computes before and after ring state for a new daily log', () => {
    const dailyPlacements = placementsFromPracticeIds(['guru-pooja', 'isha-kriya']);
    const existing = [
      makeLog({
        log_date: '2026-06-26',
        practices_logged: ['guru-pooja'],
        placement_instance_id: dailyPlacements[0].instanceId,
      }),
    ];
    const result = computeRingStateAfterLog(
      existing,
      '2026-06-26',
      dailyPlacements,
      [],
      ['isha-kriya'],
      dailyPlacements[1].instanceId
    );
    expect(result).toEqual({ ring_state_before: 1, ring_state_after: 2 });
  });

  it('increases ring when logging a duplicate daily placement', () => {
    const dailyPlacements = placementsFromPracticeIds(['guru-pooja', 'guru-pooja']);
    const existing = [
      makeLog({
        log_date: '2026-06-26',
        practices_logged: ['guru-pooja'],
        placement_instance_id: dailyPlacements[0].instanceId,
      }),
    ];
    const result = computeRingStateAfterLog(
      existing,
      '2026-06-26',
      dailyPlacements,
      [],
      ['guru-pooja'],
      dailyPlacements[1].instanceId
    );
    expect(result).toEqual({ ring_state_before: 1, ring_state_after: 2 });
  });
});
