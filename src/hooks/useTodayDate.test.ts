import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodayDate } from './useTodayDate';

describe('useTodayDate', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns local date as YYYY-MM-DD', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 26, 12, 0, 0));
    const { result } = renderHook(() => useTodayDate());
    expect(result.current).toBe('2026-06-26');
    vi.useRealTimers();
  });

  it('updates when visibility changes to visible', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 26, 23, 59, 0));
    const { result } = renderHook(() => useTodayDate());
    expect(result.current).toBe('2026-06-26');

    vi.setSystemTime(new Date(2026, 5, 27, 0, 1, 0));
    act(() => {
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: 'visible',
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current).toBe('2026-06-27');
    vi.useRealTimers();
  });
});
