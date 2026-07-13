import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDailyPractices,
  getOtherPractices,
  getSetupComplete,
  setSetupComplete,
  getPracticeLogs,
  setPracticeLogs,
  getPendingLogs,
  setPendingLogs,
  appendPracticeLog,
  appendPendingLog,
  setPracticeLists,
  isPracticeListTooltipDismissed,
  setPracticeListTooltipDismissed,
  isIosInstallBannerDismissed,
  setIosInstallBannerDismissed,
  getFirstOpenedAt,
  setFirstOpenedAt,
} from './localStore';
import type { LocalPracticeLog } from '../types/local';

function makeLog(id: string): LocalPracticeLog {
  return {
    id,
    device_id: 'dev-1',
    log_date: '2026-06-26',
    logged_at: '2026-06-26T10:00:00Z',
    practices_logged: ['guru-pooja'],
    daily_practices_at_time: ['guru-pooja'],
    daily_count_at_time: 1,
    ring_state_before: 0,
    ring_state_after: 1,
    minutes_total: 6,
  };
}

describe('localStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reads and writes daily_practices as placements', () => {
    setPracticeLists(['guru-pooja'], []);
    expect(getDailyPractices()[0].practiceId).toBe('guru-pooja');
  });

  it('reads and writes other_practices as placements', () => {
    setPracticeLists([], ['isha-kriya']);
    expect(getOtherPractices()[0].practiceId).toBe('isha-kriya');
  });

  it('reads and writes setup_complete', () => {
    setSetupComplete(true);
    expect(getSetupComplete()).toBe(true);
  });

  it('defaults empty arrays when practice lists are unset', () => {
    expect(getDailyPractices()).toEqual([]);
    expect(getOtherPractices()).toEqual([]);
  });

  it('appends to practice logs cache', () => {
    const log = makeLog('log-1');
    appendPracticeLog(log);
    expect(getPracticeLogs()).toEqual([log]);
  });

  it('appends to pending_logs queue', () => {
    const log = makeLog('pending-1');
    appendPendingLog(log);
    expect(getPendingLogs()).toEqual([log]);
  });

  it('replaces practice logs when setPracticeLogs is called', () => {
    const logs = [makeLog('a'), makeLog('b')];
    setPracticeLogs(logs);
    expect(getPracticeLogs()).toEqual(logs);
  });

  it('clears pending logs when setPendingLogs is called', () => {
    appendPendingLog(makeLog('p1'));
    setPendingLogs([]);
    expect(getPendingLogs()).toEqual([]);
  });

  it('tracks practice list tooltip dismissed flag', () => {
    expect(isPracticeListTooltipDismissed()).toBe(false);
    setPracticeListTooltipDismissed(true);
    expect(isPracticeListTooltipDismissed()).toBe(true);
  });

  it('tracks iOS install banner dismissed flag', () => {
    expect(isIosInstallBannerDismissed()).toBe(false);
    setIosInstallBannerDismissed(true);
    expect(isIosInstallBannerDismissed()).toBe(true);
  });

  it('reads and writes first_opened_at', () => {
    setFirstOpenedAt('2026-06-26T10:00:00.000Z');
    expect(getFirstOpenedAt()).toBe('2026-06-26T10:00:00.000Z');
  });
});
