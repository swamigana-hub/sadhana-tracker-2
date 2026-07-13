const DRAFT_DAILY_KEY = 'setup_draft_daily';
const DRAFT_OTHER_KEY = 'setup_draft_other';

function readIds(key: string): string[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]): void {
  localStorage.setItem(key, JSON.stringify(ids));
}

export function getSetupDraftDaily(): string[] {
  return readIds(DRAFT_DAILY_KEY);
}

export function setSetupDraftDaily(ids: string[]): void {
  writeIds(DRAFT_DAILY_KEY, ids);
}

export function getSetupDraftOther(): string[] {
  return readIds(DRAFT_OTHER_KEY);
}

export function setSetupDraftOther(ids: string[]): void {
  writeIds(DRAFT_OTHER_KEY, ids);
}

export function clearSetupDraft(): void {
  localStorage.removeItem(DRAFT_DAILY_KEY);
  localStorage.removeItem(DRAFT_OTHER_KEY);
}
