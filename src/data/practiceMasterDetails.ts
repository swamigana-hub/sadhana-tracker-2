/**
 * Practice log detail config — sourced from Practice Master CSV.
 * Non-duration fields always precede duration in multi-step sheets.
 */

export type YogasanasLevel = 'beginner' | 'advanced';

export type LogDetailFieldType = 'cycles' | 'duration' | 'level' | 'kapalabhatis';

export interface LogDetailField {
  type: LogDetailFieldType;
  label: string;
  options?: number[];
  max?: number;
  defaultValue: number | YogasanasLevel;
}

export interface PracticeLogConfig {
  requiresSheet: boolean;
  fields: LogDetailField[];
}

function range(start: number, end: number, step: number): number[] {
  const out: number[] = [];
  for (let n = start; n <= end; n += step) out.push(n);
  return out;
}

const YOGA_NAMASKAR_CYCLES = [
  1, 3, 5, 7, 9, 11, 18, 21, 33,
  ...range(34, 112, 1),
];

const SURYA_SHAKTI_CYCLES = [1, 3, 6, 12, 21, 24, 33, 48, 64, 84, 96, 108];

const LOG_CONFIG: Record<string, PracticeLogConfig> = {
  mahamantra: {
    requiresSheet: true,
    fields: [{ type: 'duration', label: 'Duration (minutes)', options: [10, 20, 21, 30, 40, 50, 60], defaultValue: 21 }],
  },
  'nadi-shuddhi': {
    requiresSheet: true,
    fields: [{ type: 'duration', label: 'Duration (minutes)', options: range(4, 60, 5), defaultValue: 4 }],
  },
  'achala-arpanam': {
    requiresSheet: true,
    fields: [{ type: 'duration', label: 'Duration (minutes)', options: [12, 15, 18, 21], defaultValue: 12 }],
  },
  'devi-sadhana': {
    requiresSheet: true,
    fields: [
      { type: 'cycles', label: 'Cycles', options: [1, 3, 6, 9, 11], defaultValue: 1 },
      { type: 'duration', label: 'Duration (minutes)', defaultValue: 8 },
    ],
  },
  'yoga-namaskar': {
    requiresSheet: true,
    fields: [
      { type: 'cycles', label: 'Cycles', options: YOGA_NAMASKAR_CYCLES, max: 112, defaultValue: 3 },
      { type: 'duration', label: 'Duration (minutes)', defaultValue: 12 },
    ],
  },
  'surya-kriya': {
    requiresSheet: true,
    fields: [
      { type: 'cycles', label: 'Cycles', options: [1, 3, 6, 7, 9, 11, 12, 18, 21, 24, 33, 36], defaultValue: 1 },
      { type: 'duration', label: 'Duration (minutes)', defaultValue: 12 },
    ],
  },
  'surya-shakti': {
    requiresSheet: true,
    fields: [
      { type: 'cycles', label: 'Cycles', options: SURYA_SHAKTI_CYCLES, defaultValue: 3 },
      { type: 'duration', label: 'Duration (minutes)', defaultValue: 8 },
    ],
  },
  yogasanas: {
    requiresSheet: true,
    fields: [
      { type: 'level', label: 'Level', defaultValue: 'beginner' },
      { type: 'duration', label: 'Duration (minutes)', defaultValue: 50 },
    ],
  },
  'shakti-chalana-kriya': {
    requiresSheet: true,
    fields: [
      { type: 'kapalabhatis', label: 'Kapalabhatis', defaultValue: 100 },
      { type: 'duration', label: 'Duration (minutes)', defaultValue: 43 },
    ],
  },
  'sukha-kriya': {
    requiresSheet: true,
    fields: [{ type: 'duration', label: 'Duration (minutes)', options: range(10, 60, 5), defaultValue: 20 }],
  },
  ardhasiddhasana: {
    requiresSheet: true,
    fields: [{ type: 'duration', label: 'Duration (minutes)', options: range(10, 160, 10), defaultValue: 30 }],
  },
  'aum-chanting': {
    requiresSheet: true,
    fields: [{ type: 'duration', label: 'Duration (minutes)', options: [10, 20, 30, 40, 50, 60], defaultValue: 20 }],
  },
  'bhakti-sadhana': {
    requiresSheet: true,
    fields: [{ type: 'duration', label: 'Duration (minutes)', options: range(5, 60, 5), defaultValue: 13 }],
  },
  samyama: {
    requiresSheet: true,
    fields: [{ type: 'duration', label: 'Duration (minutes)', options: range(10, 160, 10), defaultValue: 30 }],
  },
  'breath-watching': {
    requiresSheet: true,
    fields: [{ type: 'duration', label: 'Duration (minutes)', options: range(10, 160, 10), defaultValue: 40 }],
  },
  'shiva-namaskar': {
    requiresSheet: true,
    fields: [
      { type: 'cycles', label: 'Cycles', options: [12, 21, 24, 33, 42, 48, 56, 64, 84, 96, 108], defaultValue: 12 },
      { type: 'duration', label: 'Duration (minutes)', defaultValue: 3 },
    ],
  },
};

const YOGASANAS_DURATION: Record<YogasanasLevel, number> = {
  beginner: 50,
  advanced: 40,
};

export function getPracticeLogConfig(practiceId: string): PracticeLogConfig {
  return LOG_CONFIG[practiceId] ?? { requiresSheet: false, fields: [] };
}

export function computeDurationFromDetails(
  practiceId: string,
  details: {
    cycles?: number;
    durationMinutes?: number;
    level?: YogasanasLevel;
    kapalabhatis?: number;
  }
): number {
  if (details.durationMinutes != null) return details.durationMinutes;

  switch (practiceId) {
    case 'devi-sadhana':
      return (details.cycles ?? 1) * 8;
    case 'yoga-namaskar':
      return (details.cycles ?? 3) * 4;
    case 'surya-kriya':
      return (details.cycles ?? 1) * 12;
    case 'surya-shakti':
      return 5 + (details.cycles ?? 3);
    case 'yogasanas':
      return YOGASANAS_DURATION[details.level ?? 'beginner'];
    case 'shakti-chalana-kriya':
      return Math.round((details.kapalabhatis ?? 100) * (2 / 60)) + 40;
    case 'shiva-namaskar':
      return Math.round(((details.cycles ?? 12) * 15) / 60) + 2;
    default:
      return 0;
  }
}

export function defaultDurationForField(
  practiceId: string,
  field: LogDetailField,
  partial: { cycles?: number; level?: YogasanasLevel; kapalabhatis?: number }
): number | YogasanasLevel {
  if (field.type === 'level') return (field.defaultValue as YogasanasLevel) ?? 'beginner';
  if (field.type === 'duration') {
    return computeDurationFromDetails(practiceId, {
      cycles: partial.cycles,
      level: partial.level,
      kapalabhatis: partial.kapalabhatis,
    }) || (field.defaultValue as number);
  }
  return field.defaultValue as number;
}

export function durationOptionsForField(field: LogDetailField): number[] {
  if (field.options?.length) return field.options;
  if (field.type === 'duration') return range(5, 120, 5);
  return [];
}
