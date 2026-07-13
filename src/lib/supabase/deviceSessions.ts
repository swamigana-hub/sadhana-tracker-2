import type { SupabaseClient } from '@supabase/supabase-js';
import type { DeviceSessionRow, DeviceSessionUpsert } from './types';

export async function upsertDeviceSession(
  client: SupabaseClient,
  data: DeviceSessionUpsert
): Promise<void> {
  const { error } = await client.from('device_sessions').upsert(data, { onConflict: 'device_id' });
  if (error) throw new Error(error.message);
}

/** Background sync — never throws; returns false on failure. */
export async function upsertDeviceSessionSafe(
  client: SupabaseClient,
  data: DeviceSessionUpsert
): Promise<boolean> {
  try {
    await upsertDeviceSession(client, data);
    return true;
  } catch (err) {
    console.warn('[device_sessions] sync failed', err);
    return false;
  }
}

export async function fetchDeviceSession(
  client: SupabaseClient,
  deviceId: string
): Promise<DeviceSessionRow | null> {
  const { data, error } = await client
    .from('device_sessions')
    .select('*')
    .eq('device_id', deviceId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
