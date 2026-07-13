import type { SupabaseClient } from '@supabase/supabase-js';
import { insertPracticeLog } from '../lib/supabase/practiceLogs';
import {
  appendPendingLog,
  getPendingLogs,
  getPracticeLists,
  setPendingLogs,
} from './localStore';
import { reconcileLogPlacements, requirePlacementInstanceId } from './logPlacementBackfill';
import type { LocalPracticeLog } from '../types/local';

export function enqueueFailedLog(log: LocalPracticeLog): void {
  appendPendingLog(log);
}

function toInsertPayload(log: LocalPracticeLog) {
  return {
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
    placement_instance_id: requirePlacementInstanceId(log.placement_instance_id),
  };
}

function backfillPendingLogs(): LocalPracticeLog[] {
  const lists = getPracticeLists();
  return reconcileLogPlacements(getPendingLogs(), lists.daily, lists.other).logs;
}

export async function flushPendingLogs(
  client: SupabaseClient
): Promise<{ flushed: number; failed: number }> {
  const pending = backfillPendingLogs();
  if (pending.length > 0) setPendingLogs(pending);
  if (pending.length === 0) return { flushed: 0, failed: 0 };

  const remaining: LocalPracticeLog[] = [];
  let flushed = 0;

  for (const log of pending) {
    try {
      await insertPracticeLog(client, toInsertPayload(log));
      flushed++;
    } catch {
      remaining.push(log);
    }
  }

  setPendingLogs(remaining);
  return { flushed, failed: remaining.length };
}

export function registerSyncOnReconnect(
  client: SupabaseClient,
  onFlush?: (result: { flushed: number; failed: number }) => void
): () => void {
  const handler = () => {
    if (!navigator.onLine) return;
    void flushPendingLogs(client).then(onFlush);
  };

  window.addEventListener('online', handler);
  const onVisibility = () => {
    if (document.visibilityState === 'visible') handler();
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    window.removeEventListener('online', handler);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
