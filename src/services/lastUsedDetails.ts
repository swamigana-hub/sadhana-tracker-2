import { getPracticeById } from '../data/practices';
import { getDefaultCycles, getDefaultDurationMinutes } from '../data/practiceDetails';

const STORAGE_KEY = 'last_used_details_v2';

type LastUsedMap = Record<string, { cycles?: number; durationMinutes?: number }>;

function readMap(): LastUsedMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LastUsedMap) : {};
  } catch {
    return {};
  }
}

function writeMap(map: LastUsedMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getLastUsedDetails(practiceId: string): {
  cycles?: number;
  durationMinutes: number;
} {
  const stored = readMap()[practiceId];
  const practice = getPracticeById(practiceId);
  const defaultDuration =
    practice?.durationMinutes ?? getDefaultDurationMinutes(practiceId);
  return {
    cycles: stored?.cycles ?? getDefaultCycles(practiceId),
    durationMinutes: stored?.durationMinutes ?? defaultDuration,
  };
}

export function saveLastUsedDetails(
  practiceId: string,
  details: { cycles?: number; durationMinutes?: number }
): void {
  const map = readMap();
  map[practiceId] = { ...map[practiceId], ...details };
  writeMap(map);
}
