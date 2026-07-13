import type { SupabaseClient } from '@supabase/supabase-js';
import type { PracticeLogInsert, PracticeLogRow } from './types';

export async function insertPracticeLog(
  client: SupabaseClient,
  log: PracticeLogInsert
): Promise<void> {
  const { error } = await client.from('practice_logs').insert(log);
  if (error) throw new Error(error.message);
}

export async function updatePracticeLogPlacementInstanceId(
  client: SupabaseClient,
  logId: string,
  placementInstanceId: string
): Promise<void> {
  const { error } = await client
    .from('practice_logs')
    .update({ placement_instance_id: placementInstanceId })
    .eq('id', logId);

  if (error) throw new Error(error.message);
}

export async function fetchPracticeLogsByDevice(
  client: SupabaseClient,
  deviceId: string
): Promise<PracticeLogRow[]> {
  const { data, error } = await client
    .from('practice_logs')
    .select('*')
    .eq('device_id', deviceId)
    .order('logged_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
