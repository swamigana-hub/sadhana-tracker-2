import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DailyPracticeCard } from './DailyPracticeCard';

describe('DailyPracticeCard', () => {
  it('calls onLog when Log is clicked', () => {
    const onLog = vi.fn();
    render(
      <DailyPracticeCard
        practiceId="guru-pooja"
        name="Guru Pooja"
        completedToday={false}
        onLog={onLog}
        onLongPress={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Log Guru Pooja' }));
    expect(onLog).toHaveBeenCalledOnce();
  });

  it('shows completed state when logged today', () => {
    render(
      <DailyPracticeCard
        practiceId="guru-pooja"
        name="Guru Pooja"
        completedToday
        onLog={() => {}}
        onLongPress={() => {}}
      />
    );
    expect(screen.getByText('Logged today')).toBeInTheDocument();
  });
});
