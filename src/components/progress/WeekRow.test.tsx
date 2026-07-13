import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeekRow } from './WeekRow';

describe('WeekRow', () => {
  it('renders Monday label and 7 day tiles', () => {
    const days = Array.from({ length: 7 }, (_, i) => ({
      date: `2026-06-${22 + i}`,
      tileState: 'p25' as const,
      hasLogs: false,
    }));
    render(
      <WeekRow weekLabel="Jun 22" days={days} weekMinutes={30} isCurrentWeek={false} />
    );
    expect(screen.getByText('Jun 22')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/2026-06/)).toHaveLength(7);
  });
});
