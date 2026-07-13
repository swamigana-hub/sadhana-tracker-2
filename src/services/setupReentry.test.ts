import { describe, it, expect, beforeEach } from 'vitest';
import { setSetupReentry, isSetupReentry } from './setupReentry';

describe('setupReentry', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  beforeEach(() => {
    localStorage.clear();
  });

  it('tracks setup re-entry mode', () => {
    expect(isSetupReentry()).toBe(false);
    setSetupReentry(true);
    expect(isSetupReentry()).toBe(true);
    setSetupReentry(false);
    expect(isSetupReentry()).toBe(false);
  });
});
