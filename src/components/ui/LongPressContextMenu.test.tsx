import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LongPressContextMenu } from './LongPressContextMenu';

describe('LongPressContextMenu', () => {
  const options = [
    { label: 'Move to my other practices', onClick: vi.fn() },
    { label: 'Remove', onClick: vi.fn() },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders at most two options', () => {
    render(
      <LongPressContextMenu
        open
        x={100}
        y={200}
        options={[
          ...options,
          { label: 'Extra', onClick: vi.fn() },
        ]}
        onDismiss={() => {}}
      />
    );
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('calls option handler and dismisses', () => {
    const onDismiss = vi.fn();
    const onClick = vi.fn();
    render(
      <LongPressContextMenu
        open
        x={100}
        y={200}
        options={[{ label: 'Remove', onClick }]}
        onDismiss={onDismiss}
      />
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Remove' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('ignores backdrop dismiss immediately after open', () => {
    const onDismiss = vi.fn();
    render(
      <LongPressContextMenu open x={0} y={0} options={options} onDismiss={onDismiss} />
    );
    fireEvent.click(screen.getByTestId('menu-backdrop'));
    expect(onDismiss).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    fireEvent.click(screen.getByTestId('menu-backdrop'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
