import { describe, it, expect, beforeEach } from 'vitest';
import {
  clearSetupDraft,
  getSetupDraftDaily,
  getSetupDraftOther,
  setSetupDraftDaily,
  setSetupDraftOther,
} from './setupDraft';

describe('setupDraft', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists daily and other draft selections', () => {
    setSetupDraftDaily(['guru-pooja', 'yogasanas']);
    setSetupDraftOther(['isha-kriya']);

    expect(getSetupDraftDaily()).toEqual(['guru-pooja', 'yogasanas']);
    expect(getSetupDraftOther()).toEqual(['isha-kriya']);
  });

  it('clears draft selections', () => {
    setSetupDraftDaily(['guru-pooja']);
    setSetupDraftOther(['isha-kriya']);
    clearSetupDraft();

    expect(getSetupDraftDaily()).toEqual([]);
    expect(getSetupDraftOther()).toEqual([]);
  });
});
