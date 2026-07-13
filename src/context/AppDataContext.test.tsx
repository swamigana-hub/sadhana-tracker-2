import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AppDataProvider, useAppData } from '../context/AppDataContext';
import { STORAGE_KEYS } from '../services/localStore';
import type { ReactNode } from 'react';

vi.mock('../services/deviceId', () => ({
  getOrCreateDeviceId: () => 'test-device-id',
  DEVICE_ID_KEY: 'device_id',
}));

function wrapper({ children }: { children: ReactNode }) {
  return <AppDataProvider supabaseClient={null}>{children}</AppDataProvider>;
}

describe('AppDataContext', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.dailyPractices, JSON.stringify(['guru-pooja']));
  });

  it('provides device id, today, practice lists, and logs', () => {
    const { result } = renderHook(() => useAppData(), { wrapper });

    expect(result.current.deviceId).toBe('test-device-id');
    expect(result.current.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.current.daily).toEqual(['guru-pooja']);
    expect(result.current.logs).toEqual([]);
    expect(result.current.ring).toEqual({ numerator: 0, denominator: 1, minutesFillRatio: 0 });
  });
});
