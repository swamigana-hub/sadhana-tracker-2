import type { PracticeLogRow } from '../lib/supabase/types';
import { calculateLogMinutes } from '../data/practices';
import type { PracticePlacement } from './practiceInstances';
import {
  countDailyPlacementsLoggedToday,
  isPlacementLoggedToday,
} from './placementLogging';

type LogSlice = Pick<
  PracticeLogRow,
  'log_date' | 'logged_at' | 'practices_logged' | 'placement_instance_id'
>;

export function getDistinctDailyLoggedToday(
  logs: LogSlice[],
  today: string,
  dailyPracticeIds: string[]
): number {
  const dailySet = new Set(dailyPracticeIds);
  const logged = new Set<string>();

  for (const log of logs) {
    if (log.log_date !== today) continue;
    for (const entry of log.practices_logged) {
      const id = typeof entry === 'string' ? entry : entry.practiceId;
      if (dailySet.has(id)) logged.add(id);
    }
  }

  return logged.size;
}

function getDailyMinutesLoggedTodayForPlacements(
  logs: LogSlice[],
  today: string,
  dailyPlacements: PracticePlacement[],
  otherPlacements: PracticePlacement[]
): number {
  let total = 0;
  for (const placement of dailyPlacements) {
    if (
      isPlacementLoggedToday(
        logs,
        today,
        dailyPlacements,
        otherPlacements,
        placement.instanceId
      )
    ) {
      total += calculateLogMinutes([placement.practiceId]);
    }
  }
  return total;
}

export function getRingDisplayState(
  dailyPlacements: PracticePlacement[],
  otherPlacements: PracticePlacement[],
  logs: LogSlice[],
  today: string
): { numerator: number; denominator: number; minutesFillRatio: number } {
  const dailyPracticeIds = dailyPlacements.map((placement) => placement.practiceId);
  const numerator = countDailyPlacementsLoggedToday(
    logs,
    today,
    dailyPlacements,
    otherPlacements
  );
  const denominator = dailyPlacements.length;
  const scheduledMinutes = calculateLogMinutes(dailyPracticeIds);
  const loggedMinutes = getDailyMinutesLoggedTodayForPlacements(
    logs,
    today,
    dailyPlacements,
    otherPlacements
  );

  return {
    numerator,
    denominator,
    minutesFillRatio:
      scheduledMinutes === 0 ? 0 : Math.min(loggedMinutes / scheduledMinutes, 1),
  };
}

export function getDailyMinutesLoggedToday(
  logs: LogSlice[],
  today: string,
  dailyPracticeIds: string[]
): number {
  const dailySet = new Set(dailyPracticeIds);
  const loggedIds = new Set<string>();

  for (const log of logs) {
    if (log.log_date !== today) continue;
    for (const entry of log.practices_logged) {
      const id = typeof entry === 'string' ? entry : entry.practiceId;
      if (dailySet.has(id)) loggedIds.add(id);
    }
  }

  return calculateLogMinutes([...loggedIds]);
}

export function computeRingStateAfterLog(
  existingLogs: LogSlice[],
  logDate: string,
  dailyPlacements: PracticePlacement[],
  otherPlacements: PracticePlacement[],
  newPracticeIds: string[],
  placementInstanceId: string
): { ring_state_before: number; ring_state_after: number } {
  const ring_state_before = countDailyPlacementsLoggedToday(
    existingLogs,
    logDate,
    dailyPlacements,
    otherPlacements
  );

  const simulatedLog: LogSlice = {
    log_date: logDate,
    logged_at: new Date().toISOString(),
    practices_logged: newPracticeIds,
    placement_instance_id: placementInstanceId,
  };

  const ring_state_after = countDailyPlacementsLoggedToday(
    [...existingLogs, simulatedLog],
    logDate,
    dailyPlacements,
    otherPlacements
  );

  return { ring_state_before, ring_state_after };
}
