import type { PracticeLogPayload } from '../types/practiceEntry';
import { getPracticeIdsFromLog } from './practiceLogEntries';

const STORAGE_KEY = 'recent_sessions_v2';

export interface RecentSession {
  id: string;
  practiceIds: string[];
  completedAt: string;
}

function readSessions(): RecentSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentSession[]) : [];
  } catch {
    return [];
  }
}

function writeSessions(sessions: RecentSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function recordRecentSession(practiceIds: string[]): void {
  if (practiceIds.length === 0) return;
  const signature = [...practiceIds].sort().join('|');
  const existing = readSessions().filter(
    (s) => [...s.practiceIds].sort().join('|') !== signature
  );
  const session: RecentSession = {
    id: crypto.randomUUID(),
    practiceIds: [...practiceIds],
    completedAt: new Date().toISOString(),
  };
  writeSessions([session, ...existing].slice(0, 3));
}

export function getRecentSessions(): RecentSession[] {
  return readSessions().slice(0, 3);
}

export interface RecentLogged {
  id: string;
  entries: PracticeLogPayload[];
  loggedAt: string;
}

const LOGGED_KEY = 'recent_logged_v2';

function readLogged(): RecentLogged[] {
  try {
    const raw = localStorage.getItem(LOGGED_KEY);
    return raw ? (JSON.parse(raw) as RecentLogged[]) : [];
  } catch {
    return [];
  }
}

function writeLogged(items: RecentLogged[]): void {
  localStorage.setItem(LOGGED_KEY, JSON.stringify(items));
}

export function recordRecentlyLogged(entries: PracticeLogPayload[]): void {
  if (entries.length === 0) return;
  const signature = getPracticeIdsFromLog(entries).sort().join('|');
  const existing = readLogged().filter(
    (item) => getPracticeIdsFromLog(item.entries).sort().join('|') !== signature
  );
  const item: RecentLogged = {
    id: crypto.randomUUID(),
    entries,
    loggedAt: new Date().toISOString(),
  };
  writeLogged([item, ...existing].slice(0, 3));
}

export function getRecentlyLogged(): RecentLogged[] {
  return readLogged().slice(0, 3);
}
