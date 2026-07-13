import { useCallback, useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  appendPracticeLog,
  getPracticeLists,
  getPracticeLogs,
  setPracticeLogs,
} from '../services/localStore';
import { enqueueFailedLog } from '../services/syncQueue';
import {
  insertPracticeLog,
  fetchPracticeLogsByDevice,
  updatePracticeLogPlacementInstanceId,
} from '../lib/supabase/practiceLogs';
import { insertAnalyticsEvent } from '../lib/supabase/analytics';
import { buildPracticeLoggedEvent } from '../services/practiceLoggedAnalytics';
import { computeRingStateAfterLog } from '../services/ringCalculator';
import { calculateLogMinutesForPractices } from '../services/minutesCalculator';
import {
  mergePracticeLogs,
  reconcileLogPlacements,
  requirePlacementInstanceId,
} from '../services/logPlacementBackfill';
import type { PracticeLogRow } from '../lib/supabase/types';
import type { LocalPracticeLog } from '../types/local';

function toLocalPracticeLog(log: PracticeLogRow): LocalPracticeLog {
  return {
    ...log,
    minutes_total: log.minutes_total ?? 0,
    placement_instance_id: log.placement_instance_id ?? undefined,
  };
}

function backfillStoredLogs(): LocalPracticeLog[] {
  const lists = getPracticeLists();
  const { logs } = reconcileLogPlacements(getPracticeLogs(), lists.daily, lists.other);
  setPracticeLogs(logs);
  return logs;
}

export interface AddLogParams {
  logDate: string;
  practiceIds: string[];
  dailyPractices: string[];
  placementInstanceId: string;
}

export interface AddLogResult {
  ring_state_before: number;
  ring_state_after: number;
  ringIncreased: boolean;
}

async function patchRemotePlacementInstanceIds(
  client: SupabaseClient,
  logs: LocalPracticeLog[],
  remote: PracticeLogRow[]
): Promise<void> {
  const remoteById = new Map(remote.map((log) => [log.id, log]));

  for (const log of logs) {
    const instanceId = log.placement_instance_id?.trim();
    if (!instanceId) continue;

    const remoteLog = remoteById.get(log.id);
    if (!remoteLog || remoteLog.placement_instance_id?.trim()) continue;

    try {
      await updatePracticeLogPlacementInstanceId(client, log.id, instanceId);
    } catch (err) {
      console.warn('[practice_logs] placement_instance_id patch failed', err);
    }
  }
}

export function usePracticeLogs(deviceId: string, client?: SupabaseClient | null) {
  const [logs, setLogs] = useState<LocalPracticeLog[]>(() => backfillStoredLogs());

  useEffect(() => {
    setPracticeLogs(logs);
  }, [logs]);

  const syncFromBackend = useCallback(async () => {
    if (!client) return;

    const remote = await fetchPracticeLogsByDevice(client, deviceId);
    const lists = getPracticeLists();
    const local = reconcileLogPlacements(
      getPracticeLogs(),
      lists.daily,
      lists.other
    ).logs;

    const byId = new Map<string, LocalPracticeLog>();
    for (const log of remote) {
      byId.set(log.id, toLocalPracticeLog(log));
    }
    for (const log of local) {
      const existing = byId.get(log.id);
      if (!existing) {
        byId.set(log.id, log);
        continue;
      }
      byId.set(log.id, mergePracticeLogs(existing, log, lists.daily, lists.other));
    }

    const merged = reconcileLogPlacements([...byId.values()], lists.daily, lists.other).logs.sort(
      (a, b) => b.logged_at.localeCompare(a.logged_at)
    );

    setLogs(merged);
    setPracticeLogs(merged);
    await patchRemotePlacementInstanceIds(client, merged, remote);
  }, [client, deviceId]);

  useEffect(() => {
    if (!client) return;
    void syncFromBackend();
  }, [client, syncFromBackend]);

  const addLog = useCallback(
    async ({
      logDate,
      practiceIds,
      dailyPractices,
      placementInstanceId,
    }: AddLogParams): Promise<AddLogResult> => {
      const instanceId = requirePlacementInstanceId(placementInstanceId);
      const existing = getPracticeLogs();
      const lists = getPracticeLists();
      const { ring_state_before, ring_state_after } = computeRingStateAfterLog(
        existing,
        logDate,
        lists.daily,
        lists.other,
        practiceIds,
        instanceId
      );

      const log: LocalPracticeLog = {
        id: crypto.randomUUID(),
        device_id: deviceId,
        log_date: logDate,
        logged_at: new Date().toISOString(),
        practices_logged: practiceIds,
        daily_practices_at_time: [...dailyPractices],
        daily_count_at_time: dailyPractices.length,
        ring_state_before,
        ring_state_after,
        minutes_total: calculateLogMinutesForPractices(practiceIds),
        placement_instance_id: instanceId,
      };

      appendPracticeLog(log);
      setLogs((prev) => [...prev, log]);

      if (client) {
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
            placement_instance_id: instanceId,
          });
          void insertAnalyticsEvent(client, buildPracticeLoggedEvent(log)).catch(() => {});
        } catch {
          enqueueFailedLog(log);
        }
      }

      return {
        ring_state_before,
        ring_state_after,
        ringIncreased: ring_state_after > ring_state_before,
      };
    },
    [client, deviceId]
  );

  return { logs, addLog, syncFromBackend, setLogs };
}
