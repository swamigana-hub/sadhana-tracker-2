import type { AnalyticsEventInsert } from '../lib/supabase/types';
import type { LocalPracticeLog } from '../types/local';
import { getPracticeIdsFromLog } from './practiceLogEntries';

export function buildPracticeLoggedEvent(log: LocalPracticeLog): AnalyticsEventInsert {
  const dailySet = new Set(log.daily_practices_at_time);
  const practiceIds = getPracticeIdsFromLog(log.practices_logged);
  const dailyPracticesLogged = practiceIds.filter((id) => dailySet.has(id));

  return {
    device_id: log.device_id,
    event_name: 'practice_logged',
    properties: {
      log_date: log.log_date,
      practices_logged: log.practices_logged,
      daily_practices_logged: dailyPracticesLogged,
      daily_count: log.daily_count_at_time,
      ring_state_before: log.ring_state_before,
      ring_state_after: log.ring_state_after,
      timestamp: log.logged_at,
    },
  };
}
