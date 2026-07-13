import { useMemo } from 'react';
import { getRingDisplayState } from '../services/ringCalculator';
import type { PracticePlacement } from '../services/practiceInstances';
import type { LocalPracticeLog } from '../types/local';

export function useRingState(
  dailyPlacements: PracticePlacement[],
  otherPlacements: PracticePlacement[],
  logs: LocalPracticeLog[],
  today: string
) {
  return useMemo(
    () => getRingDisplayState(dailyPlacements, otherPlacements, logs, today),
    [dailyPlacements, otherPlacements, logs, today]
  );
}
