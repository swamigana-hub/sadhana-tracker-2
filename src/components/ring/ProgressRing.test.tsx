import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressRing } from './ProgressRing';

describe('ProgressRing', () => {
  it('shows percentage in center and fraction plus minutes on the sides', () => {
    render(
      <ProgressRing numerator={3} denominator={5} minutesFillRatio={0.88} minutesToday={90} />
    );
    expect(screen.getByText('88')).toBeInTheDocument();
    expect(screen.getByText('% complete')).toBeInTheDocument();
    expect(screen.getByText('3/5')).toBeInTheDocument();
    expect(screen.getByText('practices')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('minutes')).toBeInTheDocument();
  });

  it('shows zero denominator without crashing', () => {
    render(
      <ProgressRing numerator={0} denominator={0} minutesFillRatio={0} minutesToday={0} />
    );
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('0/0')).toBeInTheDocument();
  });

  it('does not render meditator image', () => {
    const { container } = render(
      <ProgressRing numerator={1} denominator={2} minutesFillRatio={0.25} minutesToday={6} />
    );
    expect(container.querySelector('img')).toBeNull();
  });

  it('exposes progress for assistive tech', () => {
    render(
      <ProgressRing numerator={3} denominator={4} minutesFillRatio={0.75} minutesToday={45} />
    );
    expect(
      screen.getByRole('img', {
        name: '75% complete, 3 of 4 daily practices logged, 45 minutes today',
      })
    ).toBeInTheDocument();
  });

  it('applies celebrate class when ring increased', () => {
    const { container } = render(
      <ProgressRing
        numerator={2}
        denominator={3}
        minutesFillRatio={1}
        minutesToday={30}
        celebrate
      />
    );
    expect(container.firstChild).toHaveClass(/celebrate/);
  });
});
