import type { SupabaseClient } from '@supabase/supabase-js';
import { upsertDeviceSessionSafe } from '../lib/supabase/deviceSessions';
import {
  setPracticeLists,
  setSetupComplete,
  getDisplayName,
  setDisplayName,
} from './localStore';
import {
  placementsFromPracticeIds,
  placementPracticeIds,
  type PracticeLists,
} from './practiceInstances';
import { snapshotDailyConfigForDate } from './dailyConfigSnapshots';
import { getLocalDateString } from './dates';
import { clearSetupDraft, getSetupDraftOther, setSetupDraftDaily } from './setupDraft';

export function persistSetupLocally(daily: string[], other: string[]): void {
  setPracticeLists(daily, other);
  setSetupComplete(true);
  snapshotDailyConfigForDate(getLocalDateString(new Date()), daily);
  clearSetupDraft();
}

export function persistDisplayName(name: string): void {
  setDisplayName(name);
}

export function resolveDisplayNameForBackend(): string | null {
  const name = getDisplayName().trim();
  return name.length > 0 ? name : null;
}

export function syncSetupToBackend(
  daily: string[],
  other: string[],
  deviceId: string,
  client: SupabaseClient | null
): void {
  if (!client) return;

  void upsertDeviceSessionSafe(client, {
    device_id: deviceId,
    setup_complete: true,
    daily_practices: daily,
    other_practices: other,
    display_name: resolveDisplayNameForBackend(),
  });
}

export function syncPracticeListsToBackend(
  lists: PracticeLists,
  deviceId: string,
  client: SupabaseClient | null,
  setupComplete = true
): void {
  if (!client) return;

  void upsertDeviceSessionSafe(client, {
    device_id: deviceId,
    setup_complete: setupComplete,
    daily_practices: placementPracticeIds(lists.daily),
    other_practices: placementPracticeIds(lists.other),
    display_name: resolveDisplayNameForBackend(),
  });
}

export function completeSetup(
  daily: string[],
  other: string[],
  deviceId: string,
  client: SupabaseClient | null
): void {
  persistSetupLocally(daily, other);
  syncSetupToBackend(daily, other, deviceId, client);
}

export function listsFromSetupIds(daily: string[], other: string[]): PracticeLists {
  return {
    daily: placementsFromPracticeIds(daily),
    other: placementsFromPracticeIds(other),
  };
}

/** Persist daily selections locally and retry backend sync without blocking setup flow. */
export function saveDailySelectionsOptimistic(
  daily: string[],
  deviceId: string,
  client: SupabaseClient | null
): void {
  setSetupDraftDaily(daily);
  syncPracticeListsToBackend(
    listsFromSetupIds(daily, getSetupDraftOther()),
    deviceId,
    client,
    false
  );
}
