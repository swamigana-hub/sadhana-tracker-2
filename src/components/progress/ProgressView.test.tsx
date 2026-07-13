import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressView } from './ProgressView';
import type { HeatmapWeek } from '../../services/weeklyHeatmapAggregator';

const weeks: HeatmapWeek[] = [
  {
    mondayDate: '2026-06-22',
    weekLabel: 'Jun wk 4',
    year: 2026,
    weekMinutes: 60,
    isCurrentWeek: false,
    days: Array.from({ length: 7 }, (_, i) => ({
      date: `2026-06-${22 + i}`,
      tileState: 'future' as const,
      hasLogs: false,
    })),
  },
  {
    mondayDate: '2026-06-29',
    weekLabel: 'This week',
    year: 2026,
    weekMinutes: 12,
    isCurrentWeek: true,
    days: Array.from({ length: 7 }, (_, i) => ({
      date: `2026-06-${29 + i}`,
      tileState: 'future' as const,
      hasLogs: false,
    })),
  },
];

describe('ProgressView', () => {
  it('renders stat boxes and stacked week rows', () => {
    render(
      <ProgressView
        daysPracticed={5}
        totalMinutes={120}
        heatmapWeeks={weeks}
        today="2026-07-04"
      />
    );
    expect(screen.getByText('My practice progress')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('Total days')).toBeInTheDocument();
    expect(screen.getByText('Total minutes')).toBeInTheDocument();
    expect(screen.getByText('This week')).toBeInTheDocument();
    expect(screen.getByText('Jun wk 4')).toBeInTheDocument();
  });
});
