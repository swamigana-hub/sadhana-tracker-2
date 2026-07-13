import type { PracticePlacement } from './practiceInstances';
import type { LocalPracticeLog } from '../types/local';

function allPlacements(daily: PracticePlacement[], other: PracticePlacement[]): PracticePlacement[] {
  return [...daily, ...other];
}

export function isKnownPlacementInstanceId(
  instanceId: string | null | undefined,
  daily: PracticePlacement[],
  other: PracticePlacement[]
): boolean {
  const trimmed = instanceId?.trim();
  if (!trimmed) return false;
  return allPlacements(daily, other).some((p) => p.instanceId === trimmed);
}

function occupiedOnDate(logs: LocalPracticeLog[], date: string): Set<string> {
  const occupied = new Set<string>();
  for (const log of logs) {
    if (log.log_date !== date) continue;
    if (log.placement_instance_id) occupied.add(log.placement_instance_id);
  }
  return occupied;
}

function slotsForPractice(
  daily: PracticePlacement[],
  other: PracticePlacement[],
  practiceId: string
): PracticePlacement[] {
  return [...daily, ...other].filter((p) => p.practiceId === practiceId);
}

/** Assign placement_instance_id to legacy logs using current placement slots (chronological). */
export function backfillLogPlacementInstanceIds(
  logs: LocalPracticeLog[],
  daily: PracticePlacement[],
  other: PracticePlacement[]
): { logs: LocalPracticeLog[]; changed: boolean } {
  const sorted = [...logs].sort((a, b) => a.logged_at.localeCompare(b.logged_at));
  const byId = new Map(logs.map((log) => [log.id, { ...log }]));
  let changed = false;

  for (const log of sorted) {
    const entry = byId.get(log.id);
    if (!entry || entry.placement_instance_id) continue;

    const first = entry.practices_logged[0];
    const practiceId = typeof first === 'string' ? first : first?.practiceId;
    const occupied = occupiedOnDate([...byId.values()], entry.log_date);

    let assigned: string | null = null;
    if (practiceId) {
      for (const slot of slotsForPractice(daily, other, practiceId)) {
        if (!occupied.has(slot.instanceId)) {
          assigned = slot.instanceId;
          break;
        }
      }
    }

    entry.placement_instance_id = assigned ?? crypto.randomUUID();
    changed = true;
  }

  return { logs: changed ? [...byId.values()] : logs, changed };
}

/** Clear stale placement_instance_id values, then backfill legacy/orphaned logs. */
export function reconcileLogPlacements(
  logs: LocalPracticeLog[],
  daily: PracticePlacement[],
  other: PracticePlacement[]
): { logs: LocalPracticeLog[]; changed: boolean } {
  if (daily.length === 0 && other.length === 0) {
    return backfillLogPlacementInstanceIds(logs, daily, other);
  }

  let changed = false;
  const normalized = logs.map((log) => {
    if (isKnownPlacementInstanceId(log.placement_instance_id, daily, other)) return log;
    if (!log.placement_instance_id?.trim()) return log;
    changed = true;
    const { placement_instance_id: _drop, ...rest } = log;
    return rest as LocalPracticeLog;
  });

  const backfilled = backfillLogPlacementInstanceIds(normalized, daily, other);
  return { logs: backfilled.logs, changed: changed || backfilled.changed };
}

export function mergePracticeLogs(
  remote: LocalPracticeLog,
  local: LocalPracticeLog,
  daily: PracticePlacement[] = [],
  other: PracticePlacement[] = []
): LocalPracticeLog {
  const remoteId = remote.placement_instance_id?.trim();
  const localId = local.placement_instance_id?.trim();

  if (daily.length === 0 && other.length === 0) {
    return {
      ...remote,
      minutes_total: remote.minutes_total ?? local.minutes_total ?? 0,
      placement_instance_id: localId || remoteId || undefined,
    };
  }

  const remoteValid = isKnownPlacementInstanceId(remoteId, daily, other);
  const localValid = isKnownPlacementInstanceId(localId, daily, other);

  const placement_instance_id = localValid
    ? localId
    : remoteValid
      ? remoteId
      : undefined;

  return {
    ...remote,
    minutes_total: remote.minutes_total ?? local.minutes_total ?? 0,
    placement_instance_id,
  };
}

export function requirePlacementInstanceId(instanceId: string | null | undefined): string {
  const trimmed = instanceId?.trim();
  if (!trimmed) {
    throw new Error('placement_instance_id is required for practice logs');
  }
  return trimmed;
}
