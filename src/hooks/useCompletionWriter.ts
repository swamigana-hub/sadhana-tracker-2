import { useCallback } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  appendPracticeLog,
  getDailyPracticeIds,
  getPracticeLogs,
  getPracticeLists,
} from '../services/localStore';
import { enqueueFailedLog } from '../services/syncQueue';
import { insertPracticeLog } from '../lib/supabase/practiceLogs';
import { insertAnalyticsEvent } from '../lib/supabase/analytics';
import { buildPracticeLoggedEvent } from '../services/practiceLoggedAnalytics';
import { computeRingStateAfterLog } from '../services/ringCalculator';
import {
  getMinutesFromLog,
  getPracticeIdsFromLog,
  toLoggedEntries,
} from '../services/practiceLogEntries';
import type { LoggedPracticeEntry } from '../types/practiceEntry';
import type { LocalPracticeLog } from '../types/local';
import { recordRecentSession, recordRecentlyLogged } from '../services/recentSessions';
import { clearActiveSession, clearLogDraft } from '../services/sessionStore';

export interface CompletionWriterOptions {
  deviceId: string;
  client: SupabaseClient | null;
  onLogsChanged: (logs: LocalPracticeLog[]) => void;
}

async function persistLog(
  client: SupabaseClient | null,
  log: LocalPracticeLog
): Promise<void> {
  if (!client) return;
  try {
    await insertPracticeLog(client, {
      id: log.id,
      device_id: log.device_id,
      log_date: log.log_date,
      logged_at: log.logged_at,
      practices_logged: log.practices_logged,
      daily_practices_at_time: log.daily_practices_at_time,
      daily_count_at_time: log.daily_count_at_time,
      ring_state_before: log.ring_state_before,
      ring_state_after: log.ring_state_after,
      minutes_total: log.minutes_total,
      placement_instance_id: log.placement_instance_id ?? crypto.randomUUID(),
    });
    void insertAnalyticsEvent(client, buildPracticeLoggedEvent(log)).catch(() => {});
  } catch {
    enqueueFailedLog(log);
  }
}

function buildLog(
  deviceId: string,
  logDate: string,
  entries: LoggedPracticeEntry[]
): LocalPracticeLog {
  const practiceIds = getPracticeIdsFromLog(entries);
  const existing = getPracticeLogs();
  const lists = getPracticeLists();
  const dailyPractices = getDailyPracticeIds();
  const placementInstanceId = crypto.randomUUID();
  const { ring_state_before, ring_state_after } = computeRingStateAfterLog(
    existing,
    logDate,
    lists.daily,
    lists.other,
    practiceIds,
    placementInstanceId
  );

  return {
    id: crypto.randomUUID(),
    device_id: deviceId,
    log_date: logDate,
    logged_at: new Date().toISOString(),
    practices_logged: entries,
    daily_practices_at_time: [...dailyPractices],
    daily_count_at_time: dailyPractices.length,
    ring_state_before,
    ring_state_after,
    minutes_total: getMinutesFromLog(entries),
    placement_instance_id: placementInstanceId,
  };
}

export function useCompletionWriter({
  deviceId,
  client,
  onLogsChanged,
}: CompletionWriterOptions) {
  const completeSession = useCallback(
    (practiceIds: string[], logDate: string) => {
      const entries = toLoggedEntries(practiceIds);
      const log = buildLog(deviceId, logDate, entries);
      appendPracticeLog(log);
      onLogsChanged([...getPracticeLogs()]);
      recordRecentSession(practiceIds);
      clearActiveSession();
      void persistLog(client, log);
      return log;
    },
    [client, deviceId, onLogsChanged]
  );

  const logPractices = useCallback(
    (entries: LoggedPracticeEntry[], logDate: string) => {
      const log = buildLog(deviceId, logDate, entries);
      appendPracticeLog(log);
      onLogsChanged([...getPracticeLogs()]);
      recordRecentlyLogged(entries);
      clearLogDraft();
      void persistLog(client, log);
      return log;
    },
    [client, deviceId, onLogsChanged]
  );

  return { completeSession, logPractices };
}
