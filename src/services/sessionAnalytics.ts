import type { SupabaseClient } from '@supabase/supabase-js';
import type { AnalyticsEventInsert } from '../lib/supabase/types';
import { insertAnalyticsEvent } from '../lib/supabase/analytics';
import { computeDaysSinceInstall } from './dates';
import { getFirstOpenedAt } from './localStore';

export function buildAppOpenedEvent(
  deviceId: string,
  firstOpenedAt: string,
  now: Date = new Date()
): AnalyticsEventInsert {
  return {
    device_id: deviceId,
    event_name: 'app_opened',
    properties: {
      timestamp: now.toISOString(),
      days_since_install: computeDaysSinceInstall(firstOpenedAt, now),
    },
  };
}

export function buildSessionDurationEvent(
  deviceId: string,
  durationSeconds: number,
  now: Date = new Date()
): AnalyticsEventInsert {
  return {
    device_id: deviceId,
    event_name: 'session_duration',
    properties: {
      timestamp: now.toISOString(),
      duration_seconds: durationSeconds,
    },
  };
}

export async function trackAppOpened(
  client: SupabaseClient,
  deviceId: string
): Promise<void> {
  await insertAnalyticsEvent(client, buildAppOpenedEvent(deviceId, getFirstOpenedAt()));
}

export async function trackSessionDuration(
  client: SupabaseClient,
  deviceId: string,
  durationSeconds: number
): Promise<void> {
  await insertAnalyticsEvent(
    client,
    buildSessionDurationEvent(deviceId, durationSeconds)
  );
}
