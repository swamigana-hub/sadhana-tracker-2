import type { SupabaseClient } from '@supabase/supabase-js';
import type { PracticeLists, PracticeStatus } from './practiceInstances';
import { placementPracticeIds } from './practiceInstances';
import { setPracticeLists, getSetupComplete, getDisplayName } from './localStore';
import { insertAnalyticsEvent } from '../lib/supabase/analytics';
import { upsertDeviceSession } from '../lib/supabase/deviceSessions';

export interface ListChangeRecord {
  practiceId: string;
  previousStatus: PracticeStatus;
  newStatus: PracticeStatus;
}

function resolveDisplayNameForBackend(): string | null {
  const name = getDisplayName().trim();
  return name.length > 0 ? name : null;
}

export async function persistPracticeListChange(
  client: SupabaseClient | null,
  deviceId: string,
  lists: PracticeLists,
  change: ListChangeRecord
): Promise<void> {
  setPracticeLists(lists);

  if (!client) return;

  await insertAnalyticsEvent(client, {
    device_id: deviceId,
    event_name: 'practice_list_changed',
    properties: {
      practice_id: change.practiceId,
      previous_status: change.previousStatus,
      new_status: change.newStatus,
      timestamp: new Date().toISOString(),
    },
  });

  await upsertDeviceSession(client, {
    device_id: deviceId,
    setup_complete: getSetupComplete(),
    daily_practices: placementPracticeIds(lists.daily),
    other_practices: placementPracticeIds(lists.other),
    display_name: resolveDisplayNameForBackend(),
  });
}
