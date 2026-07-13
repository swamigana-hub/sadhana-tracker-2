import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePracticeListManagement } from './usePracticeListManagement';
import { AppDataProvider } from '../context/AppDataContext';
import * as practiceListChange from '../services/practiceListChange';
import { setPracticeLists, setSetupComplete, STORAGE_KEYS, getDailyPractices } from '../services/localStore';
import type { ReactNode } from 'react';

vi.mock('../services/deviceId', () => ({
  getOrCreateDeviceId: () => 'dev-test',
  DEVICE_ID_KEY: 'device_id',
}));

function wrapper({ children }: { children: ReactNode }) {
  return <AppDataProvider supabaseClient={null}>{children}</AppDataProvider>;
}

describe('usePracticeListManagement', () => {
  beforeEach(() => {
    localStorage.clear();
    setSetupComplete(true);
    setPracticeLists(['guru-pooja'], ['isha-kriya']);
    vi.restoreAllMocks();
  });

  it('opens menu with options for daily context', () => {
    const { result } = renderHook(() => usePracticeListManagement(), { wrapper });

    act(() => {
      result.current.openMenu('guru-pooja', 'daily', 100, 200);
    });

    expect(result.current.menu?.practiceId).toBe('guru-pooja');
    expect(result.current.contextMenuOptions.map((o) => o.label)).toEqual([
      'Move to my other practices',
      'Remove',
    ]);
  });

  it('opens menu with options for other context', () => {
    const { result } = renderHook(() => usePracticeListManagement(), { wrapper });

    act(() => {
      result.current.openMenu('isha-kriya', 'other', 100, 200);
    });

    expect(result.current.contextMenuOptions.map((o) => o.label)).toEqual([
      'Move to my daily practices',
      'Remove',
    ]);
  });

  it('opens menu with add options for all context', () => {
    const { result } = renderHook(() => usePracticeListManagement(), { wrapper });

    act(() => {
      result.current.openMenu('aum-chanting', 'all', 100, 200);
    });

    expect(result.current.contextMenuOptions.map((o) => o.label)).toEqual([
      'Add to my daily practices',
      'Add to my other practices',
    ]);
  });

  it('dismisses tooltip flag on first long press', () => {
    const { result } = renderHook(() => usePracticeListManagement(), { wrapper });

    act(() => {
      result.current.openMenu('guru-pooja', 'daily', 50, 50);
    });

    expect(localStorage.getItem(STORAGE_KEYS.practiceListTooltipDismissed)).toBe('true');
  });

  it('applies remove action and persists change', async () => {
    const persist = vi.spyOn(practiceListChange, 'persistPracticeListChange').mockResolvedValue();
    const { result } = renderHook(() => usePracticeListManagement(), { wrapper });
    const instanceId = getDailyPractices()[0].instanceId;

    act(() => {
      result.current.openMenu('guru-pooja', 'daily', 10, 10, instanceId);
    });

    await act(async () => {
      await result.current.applyAction('remove_from_daily');
    });

    expect(persist).toHaveBeenCalledWith(
      null,
      'dev-test',
      expect.objectContaining({
        daily: [],
        other: expect.arrayContaining([
          expect.objectContaining({ practiceId: 'isha-kriya' }),
        ]),
      }),
      expect.objectContaining({
        practiceId: 'guru-pooja',
        previousStatus: 'daily',
        newStatus: 'none',
      })
    );
    expect(result.current.menu).toBeNull();
  });
});
