import { describe, it, expect } from 'vitest';
import { getPracticeListMenuOptions, applyListAction } from './practiceListMenu';
import { listsFrom, dailyIdsFrom, otherIdsFrom } from './practiceInstances.testHelpers';
import { placementPracticeIds } from './practiceInstances';

const empty = listsFrom([], []);

describe('getPracticeListMenuOptions', () => {
  it('returns move and remove for daily context', () => {
    const lists = listsFrom(['guru-pooja'], []);
    const options = getPracticeListMenuOptions('daily', lists, 'guru-pooja');
    expect(options).toEqual([
      { action: 'move_to_other', label: 'Move to my other practices' },
      { action: 'remove_from_daily', label: 'Remove' },
    ]);
  });

  it('returns move and remove for other context', () => {
    const lists = listsFrom([], ['isha-kriya']);
    const options = getPracticeListMenuOptions('other', lists, 'isha-kriya');
    expect(options).toEqual([
      { action: 'move_to_daily', label: 'Move to my daily practices' },
      { action: 'remove_from_other', label: 'Remove' },
    ]);
  });

  it('returns both add options when total placements are below two', () => {
    expect(getPracticeListMenuOptions('all', empty, 'aum-chanting')).toEqual([
      { action: 'add_to_daily', label: 'Add to my daily practices' },
      { action: 'add_to_other', label: 'Add to my other practices' },
    ]);
    const lists = listsFrom(['guru-pooja'], []);
    expect(getPracticeListMenuOptions('all', lists, 'guru-pooja')).toEqual([
      { action: 'add_to_daily', label: 'Add to my daily practices' },
      { action: 'add_to_other', label: 'Add to my other practices' },
    ]);
  });

  it('returns no options when total placements equal two', () => {
    const lists = listsFrom(['guru-pooja'], ['guru-pooja']);
    expect(getPracticeListMenuOptions('all', lists, 'guru-pooja')).toEqual([]);
  });
});

describe('applyListAction', () => {
  it('remove from daily drops one placement', () => {
    const lists = listsFrom(['guru-pooja'], []);
    const instanceId = lists.daily[0].instanceId;
    const result = applyListAction(lists, instanceId, 'guru-pooja', 'remove_from_daily');
    expect(dailyIdsFrom(result.lists)).toEqual([]);
    expect(result.previousStatus).toBe('daily');
    expect(result.newStatus).toBe('none');
  });

  it('move from daily to other transfers placement', () => {
    const lists = listsFrom(['guru-pooja'], []);
    const instanceId = lists.daily[0].instanceId;
    const result = applyListAction(lists, instanceId, 'guru-pooja', 'move_to_other');
    expect(dailyIdsFrom(result.lists)).toEqual([]);
    expect(otherIdsFrom(result.lists)).toEqual(['guru-pooja']);
    expect(result.newStatus).toBe('other');
  });

  it('move to daily when daily already has placement adds second daily placement', () => {
    const lists = listsFrom(['guru-pooja'], ['guru-pooja']);
    const instanceId = lists.other[0].instanceId;
    const result = applyListAction(lists, instanceId, 'guru-pooja', 'move_to_daily');
    expect(dailyIdsFrom(result.lists)).toEqual(['guru-pooja', 'guru-pooja']);
    expect(otherIdsFrom(result.lists)).toEqual([]);
  });

  it('add to daily from all pool creates placement', () => {
    const result = applyListAction(empty, null, 'isha-kriya', 'add_to_daily');
    expect(placementPracticeIds(result.lists.daily)).toEqual(['isha-kriya']);
    expect(result.newStatus).toBe('daily');
  });
});
