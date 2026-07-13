import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { FirstUseTooltip } from './FirstUseTooltip';
import { STORAGE_KEYS } from '../../services/localStore';

describe('FirstUseTooltip', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows message when not dismissed', () => {
    render(<FirstUseTooltip onDismiss={() => {}} />);
    expect(screen.getByText('Hold any practice to manage it.')).toBeInTheDocument();
  });

  it('auto-dismisses after 3 seconds', () => {
    const onDismiss = vi.fn();
    render(<FirstUseTooltip onDismiss={onDismiss} />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('does not show when already dismissed in localStorage', () => {
    localStorage.setItem(STORAGE_KEYS.practiceListTooltipDismissed, 'true');
    render(<FirstUseTooltip onDismiss={() => {}} />);
    expect(screen.queryByText('Hold any practice to manage it.')).not.toBeInTheDocument();
  });
});
