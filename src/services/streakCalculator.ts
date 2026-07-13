import type { PracticeLogRow } from '../lib/supabase/types';
import { getLocalDateString, parseLocalDate, addDays } from './dates';
import type { PracticeLogPayload } from '../types/practiceEntry';
import { getPracticeIdsFromLog } from './practiceLogEntries';

type LogSlice = Pick<PracticeLogRow, 'log_date' | 'practices_logged'>;

function practicedOnDate(logs: LogSlice[], date: string): boolean {
  return logs.some((log) => log.log_date === date && log.practices_logged.length > 0);
}

export function computeStreaks(
  logs: LogSlice[],
  today: string
): { current: number; longest: number } {
  const dates = new Set(logs.map((l) => l.log_date));
  let longest = 0;
  let run = 0;
  const sorted = [...dates].sort();

  for (const date of sorted) {
    if (!practicedOnDate(logs, date)) continue;
    const prev = getLocalDateString(addDays(parseLocalDate(date), -1));
    if (sorted.includes(prev) && practicedOnDate(logs, prev)) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }

  let current = 0;
  let cursor = today;
  while (practicedOnDate(logs, cursor)) {
    current += 1;
    cursor = getLocalDateString(addDays(parseLocalDate(cursor), -1));
  }

  return { current, longest };
}

export function hasPracticeLoggedToday(
  logs: LogSlice[],
  today: string,
  practiceId: string
): boolean {
  return logs.some(
    (log) =>
      log.log_date === today &&
      getPracticeIdsFromLog(log.practices_logged as PracticeLogPayload[]).includes(practiceId)
  );
}
