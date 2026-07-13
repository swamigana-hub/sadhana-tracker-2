import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCompletionPercent,
  getDayTileState,
  getDayTileVisual,
  resolveDayTileVisual,
} from './dayTileState';

describe('getCompletionPercent', () => {
  it('returns 0 when daily count is 0', () => {
    expect(getCompletionPercent(0, 0)).toBe(0);
  });

  it('computes percent of distinct daily practices logged', () => {
    expect(getCompletionPercent(2, 5)).toBe(40);
  });

  it('can exceed 100 when more daily practices logged than count', () => {
    expect(getCompletionPercent(4, 3)).toBe(133);
  });
});

describe('getDayTileVisual', () => {
  it('maps percent bands to four orange shades plus overflow', () => {
    expect(getDayTileVisual(10)).toBe('p25');
    expect(getDayTileVisual(30)).toBe('p50');
    expect(getDayTileVisual(60)).toBe('p75');
    expect(getDayTileVisual(100)).toBe('p100');
    expect(getDayTileVisual(150)).toBe('p100plus');
  });
});

describe('resolveDayTileVisual', () => {
  it('returns before-tracking for dates prior to tracking start', () => {
    expect(
      resolveDayTileVisual({
        date: '2026-06-01',
        today: '2026-06-26',
        trackingStartDate: '2026-06-10',
        percent: 0,
        hasLogs: false,
      })
    ).toBe('before-tracking');
  });

  it('returns future for dates after today', () => {
    expect(
      resolveDayTileVisual({
        date: '2026-06-27',
        today: '2026-06-26',
        trackingStartDate: '2026-06-01',
        percent: 0,
        hasLogs: false,
      })
    ).toBe('future');
  });

  it('returns missed for past days with no logs', () => {
    expect(
      resolveDayTileVisual({
        date: '2026-06-20',
        today: '2026-06-26',
        trackingStartDate: '2026-06-01',
        percent: 0,
        hasLogs: false,
      })
    ).toBe('missed');
  });
});

describe('getDayTileState (legacy)', () => {
  it('returns state 1 for 0%', () => {
    expect(getDayTileState(0)).toBe(1);
  });

  it('returns state 6 for 100% or more (glow modifier only)', () => {
    expect(getDayTileState(100)).toBe(6);
    expect(getDayTileState(150)).toBe(6);
  });
});
