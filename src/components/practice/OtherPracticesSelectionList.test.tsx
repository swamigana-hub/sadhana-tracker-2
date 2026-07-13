import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OtherPracticesSelectionList } from './OtherPracticesSelectionList';

describe('OtherPracticesSelectionList', () => {
  it('shows Daily section collapsed by default with read-only rows when expanded', () => {
    render(
      <OtherPracticesSelectionList
        dailyIds={['guru-pooja', 'isha-kriya']}
        selectedIds={new Set()}
        onToggle={vi.fn()}
      />
    );

    const dailyHeader = screen.getByRole('button', { name: /Daily/i });
    expect(dailyHeader).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Guru Pooja')).not.toBeInTheDocument();

    fireEvent.click(dailyHeader);
    expect(screen.getByText('Guru Pooja')).toBeInTheDocument();
    expect(screen.getByText('Isha Kriya')).toBeInTheDocument();
  }, 10000);

  it('excludes daily practices from Commonly Practiced and does not duplicate', () => {
    render(
      <OtherPracticesSelectionList
        dailyIds={['guru-pooja']}
        selectedIds={new Set()}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText('Commonly Practiced')).toBeInTheDocument();
    expect(screen.getByText('All Practices (A to Z)')).toBeInTheDocument();
    expect(screen.queryByText('Guru Pooja')).not.toBeInTheDocument();
    expect(screen.getByText('Mahamantra')).toBeInTheDocument();
  });

  it('calls onToggle for selectable practices', () => {
    const onToggle = vi.fn();
    render(
      <OtherPracticesSelectionList
        dailyIds={['guru-pooja']}
        selectedIds={new Set()}
        onToggle={onToggle}
      />
    );

    fireEvent.click(screen.getByText('Mahamantra'));
    expect(onToggle).toHaveBeenCalledWith('mahamantra');
  });
});
