import type { SupabaseClient } from '@supabase/supabase-js';
import type { DeviceSessionRow, PracticeLogRow } from './types';
import { getPracticeById } from '../../data/practices';
import type { PracticeLogPayload } from '../../types/practiceEntry';
import { getPracticeIdsFromLog } from '../../services/practiceLogEntries';

export async function fetchAllPracticeLogs(
  client: SupabaseClient
): Promise<PracticeLogRow[]> {
  const { data, error } = await client
    .from('practice_logs')
    .select('*')
    .order('logged_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchAllDeviceSessions(
  client: SupabaseClient
): Promise<DeviceSessionRow[]> {
  const { data, error } = await client.from('device_sessions').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface AdminSummary {
  totalParticipants: number;
  totalLogSessions: number;
  earliestLogDate: string | null;
  latestLogDate: string | null;
}

export function computeAdminSummary(logs: PracticeLogRow[]): AdminSummary {
  const deviceIds = new Set(logs.map((l) => l.device_id));
  const dates = logs.map((l) => l.log_date).sort();

  return {
    totalParticipants: deviceIds.size,
    totalLogSessions: logs.length,
    earliestLogDate: dates[0] ?? null,
    latestLogDate: dates[dates.length - 1] ?? null,
  };
}

export function deviceIdPrefix(deviceId: string): string {
  return deviceId.slice(0, 8);
}

export function formatPracticeNames(entries: PracticeLogPayload[]): string {
  return getPracticeIdsFromLog(entries)
    .map((id) => getPracticeById(id)?.name ?? id)
    .join('; ');
}

export interface ParticipantRow {
  deviceIdPrefix: string;
  deviceId: string;
  setupDate: string | null;
  dailyCount: number;
  otherCount: number;
  daysLogged: number;
  totalMinutes: number;
  lastLogAt: string | null;
}

export function computeParticipantRows(
  logs: PracticeLogRow[],
  sessions: DeviceSessionRow[]
): ParticipantRow[] {
  const sessionByDevice = new Map(sessions.map((s) => [s.device_id, s]));
  const logsByDevice = new Map<string, PracticeLogRow[]>();

  for (const log of logs) {
    const list = logsByDevice.get(log.device_id) ?? [];
    list.push(log);
    logsByDevice.set(log.device_id, list);
  }

  const deviceIds = new Set([
    ...sessions.map((s) => s.device_id),
    ...logs.map((l) => l.device_id),
  ]);

  return [...deviceIds]
    .map((deviceId) => {
      const deviceLogs = logsByDevice.get(deviceId) ?? [];
      const session = sessionByDevice.get(deviceId);
      const logDates = new Set(deviceLogs.map((l) => l.log_date));
      const lastLogAt =
        deviceLogs.length > 0
          ? deviceLogs.reduce(
              (max, log) => (log.logged_at > max ? log.logged_at : max),
              deviceLogs[0].logged_at
            )
          : null;

      return {
        deviceIdPrefix: deviceIdPrefix(deviceId),
        deviceId,
        setupDate: session?.created_at ?? null,
        dailyCount: session?.daily_practices.length ?? 0,
        otherCount: session?.other_practices.length ?? 0,
        daysLogged: logDates.size,
        totalMinutes: deviceLogs.reduce((sum, log) => sum + (log.minutes_total ?? 0), 0),
        lastLogAt,
      };
    })
    .sort((a, b) => (a.setupDate ?? '').localeCompare(b.setupDate ?? ''));
}
