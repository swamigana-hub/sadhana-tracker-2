import type { LocalPracticeLog, PendingPracticeLog } from '../types/local';
import {
  normalizePlacementArray,
  placementsFromPracticeIds,
  placementPracticeIds,
  type PracticeLists,
  type PracticePlacement,
} from './practiceInstances';

export const STORAGE_KEYS = {
  dailyPractices: 'daily_practices',
  otherPractices: 'other_practices',
  setupComplete: 'setup_complete',
  displayName: 'display_name',
  practiceLogs: 'practice_logs',
  pendingLogs: 'pending_logs',
  practiceListTooltipDismissed: 'practice_list_tooltip_dismissed',
  iosInstallBannerDismissed: 'ios_install_banner_dismissed',
  firstOpenedAt: 'first_opened_at',
} as const;

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getDailyPractices(): PracticePlacement[] {
  return normalizePlacementArray(readJson(STORAGE_KEYS.dailyPractices, []));
}

export function setDailyPractices(placements: PracticePlacement[]): void {
  writeJson(STORAGE_KEYS.dailyPractices, placements);
}

export function getOtherPractices(): PracticePlacement[] {
  return normalizePlacementArray(readJson(STORAGE_KEYS.otherPractices, []));
}

export function setOtherPractices(placements: PracticePlacement[]): void {
  writeJson(STORAGE_KEYS.otherPractices, placements);
}

/** Daily practice IDs (duplicates allowed) for ring/minutes calculations. */
export function getDailyPracticeIds(): string[] {
  return placementPracticeIds(getDailyPractices());
}

/** Other practice IDs (duplicates allowed). */
export function getOtherPracticeIds(): string[] {
  return placementPracticeIds(getOtherPractices());
}

export function getSetupComplete(): boolean {
  return readJson(STORAGE_KEYS.setupComplete, false);
}

export function setSetupComplete(complete: boolean): void {
  writeJson(STORAGE_KEYS.setupComplete, complete);
}

export function getPracticeLogs(): LocalPracticeLog[] {
  return readJson(STORAGE_KEYS.practiceLogs, []);
}

export function setPracticeLogs(logs: LocalPracticeLog[]): void {
  writeJson(STORAGE_KEYS.practiceLogs, logs);
}

export function appendPracticeLog(log: LocalPracticeLog): void {
  setPracticeLogs([...getPracticeLogs(), log]);
}

export function getPendingLogs(): PendingPracticeLog[] {
  return readJson(STORAGE_KEYS.pendingLogs, []);
}

export function setPendingLogs(logs: PendingPracticeLog[]): void {
  writeJson(STORAGE_KEYS.pendingLogs, logs);
}

export function appendPendingLog(log: PendingPracticeLog): void {
  setPendingLogs([...getPendingLogs(), log]);
}

export function isPracticeListTooltipDismissed(): boolean {
  return readJson(STORAGE_KEYS.practiceListTooltipDismissed, false);
}

export function setPracticeListTooltipDismissed(dismissed: boolean): void {
  writeJson(STORAGE_KEYS.practiceListTooltipDismissed, dismissed);
}

export function isIosInstallBannerDismissed(): boolean {
  return readJson(STORAGE_KEYS.iosInstallBannerDismissed, false);
}

export function setIosInstallBannerDismissed(dismissed: boolean): void {
  writeJson(STORAGE_KEYS.iosInstallBannerDismissed, dismissed);
}

export function getFirstOpenedAt(): string {
  const stored = readJson<string | null>(STORAGE_KEYS.firstOpenedAt, null);
  if (stored) return stored;
  const now = new Date().toISOString();
  writeJson(STORAGE_KEYS.firstOpenedAt, now);
  return now;
}

export function setFirstOpenedAt(isoTimestamp: string): void {
  writeJson(STORAGE_KEYS.firstOpenedAt, isoTimestamp);
}

export function getDisplayName(): string {
  return readJson(STORAGE_KEYS.displayName, '');
}

export function setDisplayName(name: string): void {
  writeJson(STORAGE_KEYS.displayName, name.trim());
}

export function getPracticeLists(): PracticeLists {
  return { daily: getDailyPractices(), other: getOtherPractices() };
}

export function setPracticeLists(lists: PracticeLists): void;
export function setPracticeLists(daily: string[], other: string[]): void;
export function setPracticeLists(
  listsOrDaily: PracticeLists | string[],
  other?: string[]
): void {
  if (Array.isArray(listsOrDaily)) {
    setDailyPractices(placementsFromPracticeIds(listsOrDaily));
    setOtherPractices(placementsFromPracticeIds(other ?? []));
    return;
  }
  setDailyPractices(listsOrDaily.daily);
  setOtherPractices(listsOrDaily.other);
}
