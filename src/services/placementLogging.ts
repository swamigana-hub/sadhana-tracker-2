import type { PracticePlacement } from './practiceInstances';
import type { LocalPracticeLog } from '../types/local';
import { entryMatchesPracticeId } from './practiceLogEntries';

type LogSlice = Pick<LocalPracticeLog, 'log_date' | 'logged_at' | 'practices_logged' | 'placement_instance_id'>;

function allPlacements(daily: PracticePlacement[], other: PracticePlacement[]): PracticePlacement[] {
  return [...daily, ...other];
}

function knownPlacementInstanceIds(
  daily: PracticePlacement[],
  other: PracticePlacement[]
): Set<string> {
  return new Set(allPlacements(daily, other).map((p) => p.instanceId));
}

function placementsForPractice(
  daily: PracticePlacement[],
  other: PracticePlacement[],
  practiceId: string
): PracticePlacement[] {
  return allPlacements(daily, other).filter((p) => p.practiceId === practiceId);
}

/** Assign legacy logs (no placement_instance_id) to placement slots in log order. */
function occupiedPlacementIds(
  logs: LogSlice[],
  today: string,
  daily: PracticePlacement[],
  other: PracticePlacement[],
  practiceId: string
): Set<string> {
  const occupied = new Set<string>();
  const knownIds = knownPlacementInstanceIds(daily, other);
  const slots = placementsForPractice(daily, other, practiceId);
  const todayLogs = logs
    .filter((l) => l.log_date === today)
    .sort((a, b) => a.logged_at.localeCompare(b.logged_at));

  for (const log of todayLogs) {
    const instanceId = log.placement_instance_id?.trim();
    if (instanceId && knownIds.has(instanceId)) {
      occupied.add(instanceId);
      continue;
    }
    for (const entry of log.practices_logged) {
      if (!entryMatchesPracticeId(entry, practiceId)) continue;
      for (const slot of slots) {
        if (!occupied.has(slot.instanceId)) {
          occupied.add(slot.instanceId);
          break;
        }
      }
    }
  }

  return occupied;
}

export function isPlacementLoggedToday(
  logs: LogSlice[],
  today: string,
  daily: PracticePlacement[],
  other: PracticePlacement[],
  instanceId: string
): boolean {
  if (logs.some((l) => l.log_date === today && l.placement_instance_id === instanceId)) {
    return true;
  }

  const placement = allPlacements(daily, other).find((p) => p.instanceId === instanceId);
  if (!placement) return false;

  return occupiedPlacementIds(logs, today, daily, other, placement.practiceId).has(instanceId);
}

export function canLogPlacement(
  logs: LogSlice[],
  today: string,
  daily: PracticePlacement[],
  other: PracticePlacement[],
  instanceId: string
): boolean {
  return !isPlacementLoggedToday(logs, today, daily, other, instanceId);
}

export function countDailyPlacementsLoggedToday(
  logs: LogSlice[],
  today: string,
  daily: PracticePlacement[],
  other: PracticePlacement[]
): number {
  return daily.filter((placement) =>
    isPlacementLoggedToday(logs, today, daily, other, placement.instanceId)
  ).length;
}
