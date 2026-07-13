import type { SupabaseClient } from '@supabase/supabase-js';
import type { AnalyticsEventInsert } from './types';

export async function insertAnalyticsEvent(
  client: SupabaseClient,
  event: AnalyticsEventInsert
): Promise<void> {
  const { error } = await client.from('analytics_events').insert(event);
  if (error) throw new Error(error.message);
}
