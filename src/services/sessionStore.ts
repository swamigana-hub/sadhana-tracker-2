import type { YogasanasLevel } from '../data/practiceMasterDetails';

const STORAGE_KEY = 'active_session_v2';

export interface ActiveSession {
  practiceIds: string[];
  startedAt: string;
  currentIndex: number;
}

export function getActiveSession(): ActiveSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveSession;
    if (!parsed.currentIndex && parsed.currentIndex !== 0) {
      parsed.currentIndex = 0;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setActiveSession(practiceIds: string[]): void {
  const session: ActiveSession = {
    practiceIds: [...practiceIds],
    startedAt: new Date().toISOString(),
    currentIndex: 0,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function updateActiveSessionIndex(index: number): void {
  const session = getActiveSession();
  if (!session) return;
  session.currentIndex = index;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearActiveSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export interface LogDraftEntry {
  practiceId: string;
  configured: boolean;
  cycles?: number;
  durationMinutes?: number;
  level?: YogasanasLevel;
  kapalabhatis?: number;
}

const DRAFT_KEY = 'log_draft_v2';

export function getLogDraft(): LogDraftEntry[] {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as LogDraftEntry[]) : [];
  } catch {
    return [];
  }
}

export function setLogDraft(draft: LogDraftEntry[]): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearLogDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}

export function draftToEntries(draft: LogDraftEntry[]) {
  return draft
    .filter((d) => d.configured)
    .map((d) => ({
      practiceId: d.practiceId,
      cycles: d.cycles,
      durationMinutes: d.durationMinutes,
      level: d.level,
      kapalabhatis: d.kapalabhatis,
    }));
}
