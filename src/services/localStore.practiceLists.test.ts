import { describe, it, expect, beforeEach } from 'vitest';
import {
  STORAGE_KEYS,
  getDailyPractices,
  setDailyPractices,
  getOtherPractices,
  getDailyPracticeIds,
  getDisplayName,
  setDisplayName,
  setPracticeLists,
} from './localStore';
import { placementsFromPracticeIds } from './practiceInstances';

describe('localStore practice lists', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('migrates legacy string arrays to placements on read', () => {
    localStorage.setItem(STORAGE_KEYS.dailyPractices, JSON.stringify(['guru-pooja']));
    const daily = getDailyPractices();
    expect(daily).toHaveLength(1);
    expect(daily[0].practiceId).toBe('guru-pooja');
    expect(daily[0].instanceId).toBeTruthy();
  });

  it('reads and writes placement arrays', () => {
    const placements = placementsFromPracticeIds(['guru-pooja']);
    setDailyPractices(placements);
    expect(getDailyPracticeIds()).toEqual(['guru-pooja']);
  });

  it('setPracticeLists accepts string arrays for setup', () => {
    setPracticeLists(['guru-pooja'], ['isha-kriya']);
    expect(getOtherPractices()[0].practiceId).toBe('isha-kriya');
  });

  it('reads and writes display name', () => {
    setDisplayName('Swami');
    expect(getDisplayName()).toBe('Swami');
  });
});
