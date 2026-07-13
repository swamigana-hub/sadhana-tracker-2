import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeeklyHeatmap } from './WeeklyHeatmap';
import type { HeatmapWeek } from '../../services/weeklyHeatmapAggregator';

function makeWeek(
  mondayDate: string,
  weekLabel: string,
  weekMinutes: number,
  isCurrentWeek: boolean
): HeatmapWeek {
  return {
    mondayDate,
    weekLabel,
    year: 2026,
    weekMinutes,
    isCurrentWeek,
    days: Array.from({ length: 7 }, (_, i) => ({
      date: `2026-06-${29 + i}`,
      tileState: 'p25' as const,
      hasLogs: false,
    })),
  };
}

const weeks: HeatmapWeek[] = [
  makeWeek('2026-06-29', 'This week', 246, true),
  makeWeek('2026-06-22', 'Last week', 74, false),
  makeWeek('2026-06-15', 'Jun wk 3', 312, false),
];

describe('WeeklyHeatmap', () => {
  it('shows week labels, weekday initials, and min header', () => {
    render(<WeeklyHeatmap weeks={weeks} />);
    expect(screen.getByText('This week')).toBeInTheDocument();
    expect(screen.getByText('Last week')).toBeInTheDocument();
    expect(screen.getByText('Jun wk 3')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getAllByText('S')).toHaveLength(2);
    expect(screen.getByText('min/week')).toBeInTheDocument();
  });

  it('shows bare minute totals for each week', () => {
    render(<WeeklyHeatmap weeks={weeks} />);
    expect(screen.getByText('246')).toBeInTheDocument();
    expect(screen.getByText('74')).toBeInTheDocument();
    expect(screen.getByText('312')).toBeInTheDocument();
  });

  it('shows so far only for the current week', () => {
    render(<WeeklyHeatmap weeks={weeks} />);
    expect(screen.getAllByText('so far')).toHaveLength(1);
  });

  it('uses a shared grid for weekday headers and minute totals', () => {
    const wideWeeks: HeatmapWeek[] = [
      makeWeek('2026-06-29', 'This week', 1240, true),
      makeWeek('2026-06-22', 'Last week', 45, false),
    ];
    const { container } = render(<WeeklyHeatmap weeks={wideWeeks} />);
    const heatmap = container.firstChild as HTMLElement;
    expect(heatmap.className).toMatch(/heatmap/);
    expect(screen.getByText('1,240')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('min/week')).toBeInTheDocument();
  });
});
