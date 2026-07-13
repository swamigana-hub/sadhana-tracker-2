/**
 * Practice logging defaults — seeded from Practice details.pdf reference.
 * Cycle-based practices use cycles + derived duration; others use flat duration.
 */
export type PracticeDetailKind = 'duration' | 'cycles' | 'cycles-and-duration';

const CYCLE_PRACTICE_IDS = new Set([
  'shiva-namaskar',
  'surya-kriya',
  'surya-shakti',
  'shakti-chalana-kriya',
]);

/** Minutes per cycle for cycle-formula practices. */
const MINUTES_PER_CYCLE: Record<string, number> = {
  'shiva-namaskar': 1,
  'surya-kriya': 2,
  'surya-shakti': 1.5,
  'shakti-chalana-kriya': 45,
};

const DEFAULT_CYCLES: Record<string, number> = {
  'shiva-namaskar': 6,
  'surya-kriya': 6,
  'surya-shakti': 6,
  'shakti-chalana-kriya': 1,
};

export function getPracticeDetailKind(practiceId: string): PracticeDetailKind {
  if (CYCLE_PRACTICE_IDS.has(practiceId)) return 'cycles-and-duration';
  return 'duration';
}

export function getDefaultCycles(practiceId: string): number | undefined {
  return DEFAULT_CYCLES[practiceId];
}

export function getDefaultDurationMinutes(practiceId: string): number {
  const cycles = getDefaultCycles(practiceId);
  if (cycles != null && CYCLE_PRACTICE_IDS.has(practiceId)) {
    return durationFromCycles(practiceId, cycles);
  }
  return 0;
}

export function durationFromCycles(practiceId: string, cycles: number): number {
  const rate = MINUTES_PER_CYCLE[practiceId];
  if (rate == null) return 0;
  return Math.round(rate * cycles);
}
