import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLogFeedback } from './useLogFeedback';

describe('useLogFeedback', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows success overlay then hides after 800ms', () => {
    const { result } = renderHook(() => useLogFeedback());

    act(() => {
      result.current.flashSuccess(false);
    });
    expect(result.current.showSuccess).toBe(true);
    expect(result.current.ringCelebrate).toBe(false);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(result.current.showSuccess).toBe(false);
  });

  it('sets ringCelebrate when ring increased', () => {
    const { result } = renderHook(() => useLogFeedback());

    act(() => {
      result.current.flashSuccess(true);
    });
    expect(result.current.ringCelebrate).toBe(true);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(result.current.ringCelebrate).toBe(false);
  });
});
