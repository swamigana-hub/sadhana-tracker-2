import { describe, it, expect } from 'vitest';
import { placementsFromPracticeIds } from './practiceInstances';
import {
  backfillLogPlacementInstanceIds,
  mergePracticeLogs,
  reconcileLogPlacements,
  requirePlacementInstanceId,
} from './logPlacementBackfill';
import type { LocalPracticeLog } from '../types/local';

function makeLog(
  id: string,
  practices: string[],
  placementInstanceId?: string,
  loggedAt = '2026-06-26T10:00:00Z'
): LocalPracticeLog {
  return {
    id,
    device_id: 'dev',
    log_date: '2026-06-26',
    logged_at: loggedAt,
    practices_logged: practices,
    daily_practices_at_time: ['guru-pooja', 'guru-pooja'],
    daily_count_at_time: 2,
    ring_state_before: 0,
    ring_state_after: 1,
    minutes_total: 6,
    placement_instance_id: placementInstanceId,
  };
}

describe('logPlacementBackfill', () => {
  it('assigns distinct placement instance ids to legacy logs for duplicate placements', () => {
    const daily = placementsFromPracticeIds(['guru-pooja', 'guru-pooja']);
    const logs = [makeLog('a', ['guru-pooja']), makeLog('b', ['guru-pooja'], undefined, '2026-06-26T11:00:00Z')];

    const { logs: backfilled, changed } = backfillLogPlacementInstanceIds(logs, daily, []);

    expect(changed).toBe(true);
    expect(backfilled[0].placement_instance_id).toBe(daily[0].instanceId);
    expect(backfilled[1].placement_instance_id).toBe(daily[1].instanceId);
    expect(backfilled[0].placement_instance_id).not.toBe(backfilled[1].placement_instance_id);
  });

  it('prefers local placement_instance_id when remote is null', () => {
    const remote = makeLog('a', ['guru-pooja']);
    const local = makeLog('a', ['guru-pooja'], 'local-instance');

    expect(mergePracticeLogs(remote, local).placement_instance_id).toBe('local-instance');
  });

  it('prefers valid local placement_instance_id over orphaned remote id', () => {
    const daily = placementsFromPracticeIds(['guru-pooja']);
    const remote = makeLog('a', ['guru-pooja'], 'stale-server-uuid');
    const local = makeLog('a', ['guru-pooja'], daily[0].instanceId);

    expect(
      mergePracticeLogs(remote, local, daily, []).placement_instance_id
    ).toBe(daily[0].instanceId);
  });

  it('reassigns orphaned placement_instance_id to current placement slots', () => {
    const daily = placementsFromPracticeIds(['guru-pooja', 'isha-kriya']);
    const logs = [
      makeLog('a', ['guru-pooja'], 'stale-server-uuid-1'),
      makeLog('b', ['isha-kriya'], 'stale-server-uuid-2', '2026-06-26T11:00:00Z'),
    ];

    const { logs: reconciled, changed } = reconcileLogPlacements(logs, daily, []);

    expect(changed).toBe(true);
    expect(reconciled[0].placement_instance_id).toBe(daily[0].instanceId);
    expect(reconciled[1].placement_instance_id).toBe(daily[1].instanceId);
  });

  it('requires non-empty placement instance id', () => {
    expect(() => requirePlacementInstanceId('')).toThrow();
    expect(requirePlacementInstanceId('abc')).toBe('abc');
  });
});
