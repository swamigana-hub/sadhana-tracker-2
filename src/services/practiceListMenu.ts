import type { PracticeLists, PracticeStatus } from './practiceInstances';
import {
  countPlacements,
  addToDaily,
  addToOther,
  removeFromDaily,
  removeFromOther,
  moveDailyToOther,
  moveOtherToDaily,
  getStatus,
} from './practiceInstances';

export type ListMenuContext = 'daily' | 'other' | 'all';

export type ListMenuAction =
  | 'move_to_other'
  | 'move_to_daily'
  | 'remove_from_daily'
  | 'remove_from_other'
  | 'add_to_daily'
  | 'add_to_other';

export interface MenuOption {
  action: ListMenuAction;
  label: string;
}

export function getOverallStatus(lists: PracticeLists, practiceId: string): PracticeStatus {
  return getStatus(lists, practiceId);
}

export function getPracticeListMenuOptions(
  context: ListMenuContext,
  lists: PracticeLists,
  practiceId: string
): MenuOption[] {
  if (context === 'daily') {
    return [
      { action: 'move_to_other', label: 'Move to my other practices' },
      { action: 'remove_from_daily', label: 'Remove' },
    ];
  }

  if (context === 'other') {
    return [
      { action: 'move_to_daily', label: 'Move to my daily practices' },
      { action: 'remove_from_other', label: 'Remove' },
    ];
  }

  if (countPlacements(lists, practiceId) >= 2) {
    return [];
  }

  return [
    { action: 'add_to_daily', label: 'Add to my daily practices' },
    { action: 'add_to_other', label: 'Add to my other practices' },
  ];
}

export function applyListAction(
  lists: PracticeLists,
  instanceId: string | null,
  practiceId: string,
  action: ListMenuAction
): { lists: PracticeLists; previousStatus: PracticeStatus; newStatus: PracticeStatus } {
  const previousStatus = getOverallStatus(lists, practiceId);

  let next = lists;
  switch (action) {
    case 'move_to_other':
      if (instanceId) next = moveDailyToOther(lists, instanceId);
      break;
    case 'move_to_daily':
      if (instanceId) next = moveOtherToDaily(lists, instanceId);
      break;
    case 'remove_from_daily':
      if (instanceId) next = removeFromDaily(lists, instanceId);
      break;
    case 'remove_from_other':
      if (instanceId) next = removeFromOther(lists, instanceId);
      break;
    case 'add_to_daily':
      next = addToDaily(lists, practiceId);
      break;
    case 'add_to_other':
      next = addToOther(lists, practiceId);
      break;
  }

  return {
    lists: next,
    previousStatus,
    newStatus: getOverallStatus(next, practiceId),
  };
}
