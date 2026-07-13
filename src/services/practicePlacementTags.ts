import type { PracticeLists } from './practiceInstances';

export type PlacementTagLabel = 'Daily' | 'Other';

export function getAllListPlacementTag(
  lists: PracticeLists,
  practiceId: string
): PlacementTagLabel | null {
  const inDaily = lists.daily.some((p) => p.practiceId === practiceId);
  const inOther = lists.other.some((p) => p.practiceId === practiceId);
  if (inDaily) return 'Daily';
  if (inOther) return 'Other';
  return null;
}
