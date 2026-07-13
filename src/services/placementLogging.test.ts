import { describe, it, expect, beforeEach } from 'vitest';
import {
  canLogPlacement,
  countDailyPlacementsLoggedToday,
  isPlacementLoggedToday,
} from './placementLogging';
import { placementsFromPracticeIds } from './practiceInstances';
import type { LocalPracticeLog } from '../types/local';

function makeLog(
  practices: string[],
  placementInstanceId?: string
): LocalPracticeLog {
  return {
    id: '1',
    device_id: 'dev',
    log_date: '2026-06-26',
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

describe('placementLogging', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('allows logging other placement when daily placement with same id was already logged', () => {
    const daily = placementsFromPracticeIds(['guru-pooja']);
    const other = placementsFromPracticeIds(['guru-pooja']);
    const logs = [makeLog(['guru-pooja'], daily[0].instanceId)];

    expect(isPlacementLoggedToday(logs, '2026-06-26', daily, other, daily[0].instanceId)).toBe(
      true
    );
    expect(canLogPlacement(logs, '2026-06-26', daily, other, other[0].instanceId)).toBe(true);
  });

  it('tracks independent completion for duplicate placements via placement_instance_id', () => {
    const daily = placementsFromPracticeIds(['guru-pooja', 'guru-pooja']);
    const logs = [makeLog(['guru-pooja'], daily[0].instanceId)];

    expect(canLogPlacement(logs, '2026-06-26', daily, [], daily[1].instanceId)).toBe(true);
    expect(isPlacementLoggedToday(logs, '2026-06-26', daily, [], daily[0].instanceId)).toBe(true);
    expect(isPlacementLoggedToday(logs, '2026-06-26', daily, [], daily[1].instanceId)).toBe(false);
  });

  it('counts logged daily placements independently', () => {
    const daily = placementsFromPracticeIds(['guru-pooja', 'guru-pooja']);
    const logs = [makeLog(['guru-pooja'], daily[0].instanceId)];

    expect(countDailyPlacementsLoggedToday(logs, '2026-06-26', daily, [])).toBe(1);
  });

  it('supports legacy logs without placement_instance_id', () => {
    const daily = placementsFromPracticeIds(['guru-pooja', 'guru-pooja']);
    const logs = [makeLog(['guru-pooja'])];

    expect(isPlacementLoggedToday(logs, '2026-06-26', daily, [], daily[0].instanceId)).toBe(true);
    expect(canLogPlacement(logs, '2026-06-26', daily, [], daily[1].instanceId)).toBe(true);
  });

  it('treats orphaned placement_instance_id as legacy for checkbox state', () => {
    const daily = placementsFromPracticeIds(['guru-pooja', 'isha-kriya', 'shoonya', 'yogasanas']);
    const logs = [
      makeLog(['guru-pooja'], 'stale-server-uuid-1'),
      makeLog(['isha-kriya'], 'stale-server-uuid-2'),
      makeLog(['shoonya'], 'stale-server-uuid-3'),
      makeLog(['yogasanas'], 'stale-server-uuid-4'),
    ];

    expect(isPlacementLoggedToday(logs, '2026-06-26', daily, [], daily[0].instanceId)).toBe(true);
    expect(isPlacementLoggedToday(logs, '2026-06-26', daily, [], daily[1].instanceId)).toBe(true);
    expect(isPlacementLoggedToday(logs, '2026-06-26', daily, [], daily[2].instanceId)).toBe(true);
    expect(isPlacementLoggedToday(logs, '2026-06-26', daily, [], daily[3].instanceId)).toBe(true);
  });
});
