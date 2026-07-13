import { useCallback, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getPracticeLists, setPracticeLists } from '../services/localStore';
import {
  addToDaily as addToDailyService,
  addToOther as addToOtherService,
  removeFromDaily as removeFromDailyService,
  removeFromOther as removeFromOtherService,
  moveDailyToOther as moveDailyToOtherService,
  moveOtherToDaily as moveOtherToDailyService,
  getAllPracticesPoolIds,
  placementPracticeIds,
  placementsFromPracticeIds,
  type PracticeLists,
} from '../services/practiceInstances';
import { syncPracticeListsToBackend, resolveDisplayNameForBackend } from '../services/setupFlow';
import { upsertDeviceSession } from '../lib/supabase/deviceSessions';

export function usePracticeInstances() {
  const [lists, setLists] = useState<PracticeLists>(() => getPracticeLists());

  const persist = useCallback((next: PracticeLists) => {
    setPracticeLists(next);
    setLists(next);
  }, []);

  const updateLists = useCallback((updater: (current: PracticeLists) => PracticeLists) => {
    setLists((current) => {
      const next = updater(current);
      setPracticeLists(next);
      return next;
    });
  }, []);

  const addToDaily = useCallback(
    (practiceId: string) => updateLists((current) => addToDailyService(current, practiceId)),
    [updateLists]
  );

  const addToOther = useCallback(
    (practiceId: string) => updateLists((current) => addToOtherService(current, practiceId)),
    [updateLists]
  );

  const removeFromDaily = useCallback(
    (instanceId: string) => updateLists((current) => removeFromDailyService(current, instanceId)),
    [updateLists]
  );

  const removeFromOther = useCallback(
    (instanceId: string) => updateLists((current) => removeFromOtherService(current, instanceId)),
    [updateLists]
  );

  const moveDailyToOther = useCallback(
    (instanceId: string) => updateLists((current) => moveDailyToOtherService(current, instanceId)),
    [updateLists]
  );

  const moveOtherToDaily = useCallback(
    (instanceId: string) => updateLists((current) => moveOtherToDailyService(current, instanceId)),
    [updateLists]
  );

  const allPracticesPoolIds = getAllPracticesPoolIds(lists);

  const syncToBackend = useCallback(
    async (client: SupabaseClient, deviceId: string, setupComplete?: boolean) => {
      await upsertDeviceSession(client, {
        device_id: deviceId,
        setup_complete: setupComplete ?? false,
        daily_practices: placementPracticeIds(lists.daily),
        other_practices: placementPracticeIds(lists.other),
        display_name: resolveDisplayNameForBackend(),
      });
    },
    [lists]
  );

  const replaceLists = useCallback(
    (daily: string[] | PracticeLists, other?: string[]) => {
      if (Array.isArray(daily) && other !== undefined) {
        persist({ daily: placementsFromPracticeIds(daily), other: placementsFromPracticeIds(other) });
        return;
      }
      persist(daily as PracticeLists);
    },
    [persist]
  );

  const replaceListsOptimistic = useCallback(
    (next: PracticeLists, deviceId: string, client: SupabaseClient | null) => {
      persist(next);
      syncPracticeListsToBackend(next, deviceId, client);
    },
    [persist]
  );

  return {
    lists,
    daily: placementPracticeIds(lists.daily),
    other: placementPracticeIds(lists.other),
    dailyPlacements: lists.daily,
    otherPlacements: lists.other,
    allPracticesPoolIds,
    addToDaily,
    addToOther,
    removeFromDaily,
    removeFromOther,
    moveDailyToOther,
    moveOtherToDaily,
    replaceLists,
    replaceListsOptimistic,
    syncToBackend,
  };
}
