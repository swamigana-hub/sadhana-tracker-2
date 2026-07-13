import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSessionAnalytics } from './useSessionAnalytics';
import { setFirstOpenedAt } from '../services/localStore';

const trackAppOpened = vi.fn().mockResolvedValue(undefined);
const trackSessionDuration = vi.fn().mockResolvedValue(undefined);

vi.mock('../services/sessionAnalytics', () => ({
  trackAppOpened: (...args: unknown[]) => trackAppOpened(...args),
  trackSessionDuration: (...args: unknown[]) => trackSessionDuration(...args),
}));

function createMockClient() {
  return { from: vi.fn() } as unknown as import('@supabase/supabase-js').SupabaseClient;
}

describe('useSessionAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    setFirstOpenedAt('2026-06-26T08:00:00.000Z');
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 28, 10, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('tracks app_opened on mount when client is present', () => {
    const client = createMockClient();
    renderHook(() => useSessionAnalytics('dev-1', client));
    expect(trackAppOpened).toHaveBeenCalledWith(client, 'dev-1');
  });

  it('does not track when client is null', () => {
    renderHook(() => useSessionAnalytics('dev-1', null));
    expect(trackAppOpened).not.toHaveBeenCalled();
  });

  it('tracks session_duration when tab becomes hidden', () => {
    const client = createMockClient();
    renderHook(() => useSessionAnalytics('dev-1', client));

    act(() => {
      vi.advanceTimersByTime(45_000);
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: 'hidden',
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(trackSessionDuration).toHaveBeenCalledWith(client, 'dev-1', 45);
  });
});
