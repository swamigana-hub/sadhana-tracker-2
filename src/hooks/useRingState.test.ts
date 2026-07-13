import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRingState } from './useRingState';
import { placementsFromPracticeIds } from '../services/practiceInstances';
import type { LocalPracticeLog } from '../types/local';

function makeLog(
  practices: string[],
  placementInstanceId: string,
  date = '2026-06-26'
): LocalPracticeLog {
  return {
    id: '1',
    device_id: 'dev',
    log_date: date,
    logged_at: '2026-06-26T10:00:00Z',
    practices_logged: practices,
    daily_practices_at_time: ['guru-pooja', 'isha-kriya'],
    daily_count_at_time: 2,
    ring_state_before: 0,
    ring_state_after: 1,
    minutes_total: 6,
    placement_instance_id: placementInstanceId,
  };
}

describe('useRingState', () => {
  it('derives numerator and denominator from daily placements and today logs', () => {
    const dailyPlacements = placementsFromPracticeIds(['guru-pooja', 'isha-kriya']);
    const logs = [makeLog(['guru-pooja'], dailyPlacements[0].instanceId)];
    const { result } = renderHook(() =>
      useRingState(dailyPlacements, [], logs, '2026-06-26')
    );
    expect(result.current).toEqual({ numerator: 1, denominator: 2, minutesFillRatio: 0.3 });
  });
});
