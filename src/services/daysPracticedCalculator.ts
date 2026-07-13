import type { PracticeLogRow } from '../lib/supabase/types';

export function countDaysPracticed(logs: Pick<PracticeLogRow, 'log_date'>[]): number {
  return new Set(logs.map((log) => log.log_date)).size;
}
