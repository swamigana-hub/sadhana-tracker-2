import { PRACTICES, getPracticeById } from '../data/practices';

export type PracticeStatus = 'daily' | 'other' | 'none';

export interface PracticePlacement {
  instanceId: string;
  practiceId: string;
}

export interface PracticeLists {
  daily: PracticePlacement[];
  other: PracticePlacement[];
}

export function createPlacement(practiceId: string): PracticePlacement {
  return { instanceId: crypto.randomUUID(), practiceId };
}

export function placementsFromPracticeIds(ids: string[]): PracticePlacement[] {
  return ids.map((id) => createPlacement(id));
}

export function placementPracticeIds(placements: PracticePlacement[]): string[] {
  return placements.map((p) => p.practiceId);
}

export function normalizePlacementArray(raw: unknown): PracticePlacement[] {
  if (!Array.isArray(raw)) return [];
  if (raw.length === 0) return [];
  if (typeof raw[0] === 'string') {
    return (raw as string[]).map((id) => createPlacement(id));
  }
  return (raw as PracticePlacement[]).filter(
    (p) => p && typeof p.instanceId === 'string' && typeof p.practiceId === 'string'
  );
}

export interface PracticeSlots {
  daily: boolean;
  other: boolean;
}

export function getPracticeSlots(lists: PracticeLists, practiceId: string): PracticeSlots {
  return {
    daily: lists.daily.some((p) => p.practiceId === practiceId),
    other: lists.other.some((p) => p.practiceId === practiceId),
  };
}

export function countPlacements(lists: PracticeLists, practiceId: string): number {
  return (
    lists.daily.filter((p) => p.practiceId === practiceId).length +
    lists.other.filter((p) => p.practiceId === practiceId).length
  );
}

export function isInAllPracticesPool(lists: PracticeLists, practiceId: string): boolean {
  return countPlacements(lists, practiceId) < 2;
}

export function getAllPracticesPoolIds(lists: PracticeLists): string[] {
  return PRACTICES.filter((p) => isInAllPracticesPool(lists, p.id)).map((p) => p.id);
}

export function addToDaily(lists: PracticeLists, practiceId: string): PracticeLists {
  return { ...lists, daily: [...lists.daily, createPlacement(practiceId)] };
}

export function addToOther(lists: PracticeLists, practiceId: string): PracticeLists {
  return { ...lists, other: [...lists.other, createPlacement(practiceId)] };
}

export function removeFromDaily(lists: PracticeLists, instanceId: string): PracticeLists {
  return { ...lists, daily: lists.daily.filter((p) => p.instanceId !== instanceId) };
}

export function removeFromOther(lists: PracticeLists, instanceId: string): PracticeLists {
  return { ...lists, other: lists.other.filter((p) => p.instanceId !== instanceId) };
}

export function moveDailyToOther(lists: PracticeLists, instanceId: string): PracticeLists {
  const placement = lists.daily.find((p) => p.instanceId === instanceId);
  if (!placement) return lists;
  return {
    daily: lists.daily.filter((p) => p.instanceId !== instanceId),
    other: [...lists.other, placement],
  };
}

export function moveOtherToDaily(lists: PracticeLists, instanceId: string): PracticeLists {
  const placement = lists.other.find((p) => p.instanceId === instanceId);
  if (!placement) return lists;
  return {
    daily: [...lists.daily, placement],
    other: lists.other.filter((p) => p.instanceId !== instanceId),
  };
}

export function getStatus(lists: PracticeLists, practiceId: string): PracticeStatus {
  if (lists.daily.some((p) => p.practiceId === practiceId)) return 'daily';
  if (lists.other.some((p) => p.practiceId === practiceId)) return 'other';
  return 'none';
}

export function findPlacement(
  lists: PracticeLists,
  instanceId: string
): { list: 'daily' | 'other'; placement: PracticePlacement } | null {
  const inDaily = lists.daily.find((p) => p.instanceId === instanceId);
  if (inDaily) return { list: 'daily', placement: inDaily };
  const inOther = lists.other.find((p) => p.instanceId === instanceId);
  if (inOther) return { list: 'other', placement: inOther };
  return null;
}

export function sortPlacements(placements: PracticePlacement[]): PracticePlacement[] {
  return [...placements].sort((a, b) => {
    const oa = getPracticeById(a.practiceId)?.canonicalOrder ?? 9999;
    const ob = getPracticeById(b.practiceId)?.canonicalOrder ?? 9999;
    if (oa !== ob) return oa - ob;
    return a.instanceId.localeCompare(b.instanceId);
  });
}
