import { getPracticeById } from '../data/practices';
import { computeDurationFromDetails } from '../data/practiceMasterDetails';
import type { LoggedPracticeEntry, PracticeLogPayload } from '../types/practiceEntry';

export function normalizePracticeEntry(entry: PracticeLogPayload): LoggedPracticeEntry {
  if (typeof entry === 'string') {
    return { practiceId: entry };
  }
  return entry;
}

export function getPracticeIdsFromLog(entries: PracticeLogPayload[]): string[] {
  return entries.map((entry) => normalizePracticeEntry(entry).practiceId);
}

export function entryMatchesPracticeId(entry: PracticeLogPayload, practiceId: string): boolean {
  return normalizePracticeEntry(entry).practiceId === practiceId;
}

export function resolveEntryMinutes(entry: PracticeLogPayload): number {
  const normalized = normalizePracticeEntry(entry);
  if (normalized.durationMinutes != null) return normalized.durationMinutes;
  const computed = computeDurationFromDetails(normalized.practiceId, {
    cycles: normalized.cycles,
    level: normalized.level,
    kapalabhatis: normalized.kapalabhatis,
  });
  if (computed > 0) return computed;
  return getPracticeById(normalized.practiceId)?.durationMinutes ?? 0;
}

export function getMinutesFromLog(entries: PracticeLogPayload[]): number {
  return entries.reduce((sum, entry) => sum + resolveEntryMinutes(entry), 0);
}

export function toLoggedEntries(
  practiceIds: string[],
  details?: Record<string, Partial<LoggedPracticeEntry>>
): LoggedPracticeEntry[] {
  return practiceIds.map((practiceId) => {
    const detail = details?.[practiceId];
    return {
      practiceId,
      cycles: detail?.cycles,
      durationMinutes: detail?.durationMinutes,
      level: detail?.level,
      kapalabhatis: detail?.kapalabhatis,
    };
  });
}

export function sessionSignature(practiceIds: string[]): string {
  return [...practiceIds].sort().join('|');
}
