import {
  placementsFromPracticeIds,
  placementPracticeIds,
  type PracticeLists,
} from './practiceInstances';

export function listsFrom(dailyIds: string[], otherIds: string[] = []): PracticeLists {
  return {
    daily: placementsFromPracticeIds(dailyIds),
    other: placementsFromPracticeIds(otherIds),
  };
}

export function dailyIdsFrom(lists: PracticeLists): string[] {
  return placementPracticeIds(lists.daily);
}

export function otherIdsFrom(lists: PracticeLists): string[] {
  return placementPracticeIds(lists.other);
}
