import { createContext, useContext, useMemo, useEffect, useRef, type ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getOrCreateDeviceId } from '../services/deviceId';
import { useTodayDate } from '../hooks/useTodayDate';
import { usePracticeLogs } from '../hooks/usePracticeLogs';
import { usePracticeInstances } from '../hooks/usePracticeInstances';
import { useRingState } from '../hooks/useRingState';
import { registerSyncOnReconnect } from '../services/syncQueue';
import { useSessionAnalytics } from '../hooks/useSessionAnalytics';
import { countDaysPracticed } from '../services/daysPracticedCalculator';
import { sumMinutesTotal, sumTodayMinutes } from '../services/minutesCalculator';
import { aggregateWeeklyHeatmap } from '../services/weeklyHeatmapAggregator';
import { addDays, getLocalDateString, parseLocalDate } from '../services/dates';
import {
  getAllDailyConfigSnapshots,
  snapshotDailyConfigForDate,
  getDailyConfigForDate,
} from '../services/dailyConfigSnapshots';

export interface AppDataContextValue {
  deviceId: string;
  today: string;
  logs: ReturnType<typeof usePracticeLogs>['logs'];
  daily: string[];
  other: string[];
  lists: ReturnType<typeof usePracticeInstances>['lists'];
  allPracticesPoolIds: string[];
  ring: ReturnType<typeof useRingState>;
  todayMinutes: number;
  totalMinutes: number;
  daysPracticed: number;
  heatmapWeeks: ReturnType<typeof aggregateWeeklyHeatmap>;
  addLog: ReturnType<typeof usePracticeLogs>['addLog'];
  setLogs: ReturnType<typeof usePracticeLogs>['setLogs'];
  practiceInstances: ReturnType<typeof usePracticeInstances>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({
  children,
  supabaseClient,
}: {
  children: ReactNode;
  supabaseClient: SupabaseClient | null;
}) {
  const deviceId = useMemo(() => getOrCreateDeviceId(), []);
  const today = useTodayDate();
  const { logs, addLog, setLogs } = usePracticeLogs(deviceId, supabaseClient);
  const practiceInstances = usePracticeInstances();
  const { daily, other, lists, allPracticesPoolIds, dailyPlacements, otherPlacements } =
    practiceInstances;
  const ring = useRingState(dailyPlacements, otherPlacements, logs, today);

  const prevTodayRef = useRef(today);
  useEffect(() => {
    const prevToday = prevTodayRef.current;
    if (prevToday !== today) {
      const yesterday = getLocalDateString(addDays(parseLocalDate(today), -1));
      if (!getDailyConfigForDate(yesterday) && daily.length > 0) {
        snapshotDailyConfigForDate(yesterday, daily);
      }
      prevTodayRef.current = today;
    }
    snapshotDailyConfigForDate(today, daily);
  }, [today, daily]);

  useSessionAnalytics(deviceId, supabaseClient);

  useEffect(() => {
    if (!supabaseClient) return;
    return registerSyncOnReconnect(supabaseClient);
  }, [supabaseClient]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      deviceId,
      today,
      logs,
      daily,
      other,
      lists,
      allPracticesPoolIds,
      ring,
      todayMinutes: sumTodayMinutes(logs, today),
      totalMinutes: sumMinutesTotal(logs),
      daysPracticed: countDaysPracticed(logs),
      heatmapWeeks: aggregateWeeklyHeatmap(
        logs,
        parseLocalDate(today),
        getAllDailyConfigSnapshots()
      ),
      addLog,
      setLogs,
      practiceInstances,
    }),
    [
      deviceId,
      today,
      logs,
      daily,
      other,
      lists,
      allPracticesPoolIds,
      ring,
      addLog,
      setLogs,
      practiceInstances,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
