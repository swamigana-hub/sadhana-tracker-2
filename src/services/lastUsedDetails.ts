import { getPracticeById } from '../data/practices';
import {
  computeDurationFromDetails,
  getPracticeLogConfig,
  type YogasanasLevel,
} from '../data/practiceMasterDetails';

const STORAGE_KEY = 'last_used_details_v2';

type LastUsedMap = Record<
  string,
  {
    cycles?: number;
    durationMinutes?: number;
    level?: YogasanasLevel;
    kapalabhatis?: number;
  }
>;

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
  durationMinutes?: number;
  level?: YogasanasLevel;
  kapalabhatis?: number;
} {
  const stored = readMap()[practiceId];
  const config = getPracticeLogConfig(practiceId);
  const practice = getPracticeById(practiceId);
  const durationField = config.fields.find((f) => f.type === 'duration');
  const cyclesField = config.fields.find((f) => f.type === 'cycles');
  const levelField = config.fields.find((f) => f.type === 'level');
  const kapalabhatisField = config.fields.find((f) => f.type === 'kapalabhatis');

  const level = (stored?.level ?? levelField?.defaultValue ?? 'beginner') as YogasanasLevel;
  const cycles = stored?.cycles ?? (cyclesField?.defaultValue as number | undefined);
  const kapalabhatis =
    stored?.kapalabhatis ?? (kapalabhatisField?.defaultValue as number | undefined);

  const durationMinutes =
    stored?.durationMinutes ??
    (computeDurationFromDetails(practiceId, { cycles, level, kapalabhatis }) ||
      (durationField?.defaultValue as number | undefined) ||
      practice?.durationMinutes ||
      0);

  return { cycles, durationMinutes, level, kapalabhatis };
}

export function saveLastUsedDetails(
  practiceId: string,
  details: {
    cycles?: number;
    durationMinutes?: number;
    level?: YogasanasLevel;
    kapalabhatis?: number;
  }
): void {
  const map = readMap();
  map[practiceId] = { ...map[practiceId], ...details };
  writeMap(map);
}
