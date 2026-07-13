import { calculateLogMinutes } from '../data/practices';
import type { PracticeLogRow } from '../lib/supabase/types';

export function sumMinutesTotal(logs: Pick<PracticeLogRow, 'minutes_total'>[]): number {
  return logs.reduce((sum, log) => {
    if (log.minutes_total == null || log.minutes_total === 0) return sum;
    return sum + log.minutes_total;
  }, 0);
}

export function sumTodayMinutes(
  logs: Pick<PracticeLogRow, 'log_date' | 'minutes_total'>[],
  today: string
): number {
  return sumMinutesTotal(logs.filter((log) => log.log_date === today));
}

export function calculateLogMinutesForPractices(practiceIds: string[]): number {
  return calculateLogMinutes(practiceIds);
}
