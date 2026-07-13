import { describe, it, expect } from 'vitest';
import {
  getPracticeSlots,
  isInAllPracticesPool,
  getAllPracticesPoolIds,
  addToDaily,
  addToOther,
  removeFromDaily,
  removeFromOther,
  moveDailyToOther,
  moveOtherToDaily,
  countPlacements,
  placementPracticeIds,
} from './practiceInstances';
import { listsFrom, dailyIdsFrom, otherIdsFrom } from './practiceInstances.testHelpers';
import { PRACTICES } from '../data/practices';

const empty = listsFrom([], []);

describe('getPracticeSlots', () => {
  it('returns daily and other slot occupancy', () => {
    const lists = listsFrom(['guru-pooja'], ['isha-kriya']);
    expect(getPracticeSlots(lists, 'guru-pooja')).toEqual({ daily: true, other: false });
    expect(getPracticeSlots(lists, 'isha-kriya')).toEqual({ daily: false, other: true });
    expect(getPracticeSlots(lists, 'mahamantra')).toEqual({ daily: false, other: false });
  });
});

describe('countPlacements', () => {
  it('counts placements across daily and other', () => {
    const lists = listsFrom(['guru-pooja', 'guru-pooja'], ['guru-pooja']);
    expect(countPlacements(lists, 'guru-pooja')).toBe(3);
  });
});

describe('isInAllPracticesPool', () => {
  it('is true when fewer than two total placements', () => {
    expect(isInAllPracticesPool(listsFrom(['guru-pooja'], []), 'guru-pooja')).toBe(true);
    expect(isInAllPracticesPool(listsFrom([], []), 'guru-pooja')).toBe(true);
    expect(isInAllPracticesPool(listsFrom(['guru-pooja'], ['guru-pooja']), 'guru-pooja')).toBe(
      false
    );
  });
});

describe('getAllPracticesPoolIds', () => {
  it('excludes practices with two total placements', () => {
    const lists = listsFrom(['guru-pooja'], ['guru-pooja']);
    const pool = getAllPracticesPoolIds(lists);
    expect(pool).not.toContain('guru-pooja');
    expect(pool.length).toBe(PRACTICES.length - 1);
  });
});

describe('addToDaily', () => {
  it('adds a new placement even when practice is already in daily', () => {
    const lists = listsFrom(['guru-pooja'], []);
    const result = addToDaily(lists, 'guru-pooja');
    expect(placementPracticeIds(result.daily)).toEqual(['guru-pooja', 'guru-pooja']);
  });
});

describe('addToOther', () => {
  it('adds practice to other list', () => {
    const result = addToOther(empty, 'isha-kriya');
    expect(otherIdsFrom(result)).toEqual(['isha-kriya']);
  });
});

describe('removeFromDaily', () => {
  it('removes one placement by instanceId', () => {
    const lists = listsFrom(['guru-pooja', 'guru-pooja'], []);
    const removeId = lists.daily[0].instanceId;
    const result = removeFromDaily(lists, removeId);
    expect(dailyIdsFrom(result)).toEqual(['guru-pooja']);
  });
});

describe('removeFromOther', () => {
  it('removes one placement by instanceId without affecting daily', () => {
    const lists = listsFrom(['guru-pooja'], ['guru-pooja']);
    const removeId = lists.other[0].instanceId;
    const result = removeFromOther(lists, removeId);
    expect(otherIdsFrom(result)).toEqual([]);
    expect(dailyIdsFrom(result)).toEqual(['guru-pooja']);
  });
});

describe('moveDailyToOther', () => {
  it('transfers placement to other even when practice already exists there', () => {
    const lists = listsFrom(['guru-pooja'], ['guru-pooja']);
    const moveId = lists.daily[0].instanceId;
    const result = moveDailyToOther(lists, moveId);
    expect(dailyIdsFrom(result)).toEqual([]);
    expect(otherIdsFrom(result)).toEqual(['guru-pooja', 'guru-pooja']);
  });
});

describe('moveOtherToDaily', () => {
  it('transfers placement to daily even when practice already exists there', () => {
    const lists = listsFrom(['guru-pooja'], ['guru-pooja']);
    const moveId = lists.other[0].instanceId;
    const result = moveOtherToDaily(lists, moveId);
    expect(dailyIdsFrom(result)).toEqual(['guru-pooja', 'guru-pooja']);
    expect(otherIdsFrom(result)).toEqual([]);
  });
});
