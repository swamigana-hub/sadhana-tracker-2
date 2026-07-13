import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PracticeRow } from './PracticeRow';

describe('PracticeRow', () => {
  it('renders practice name and toggles on click', () => {
    const onToggle = vi.fn();
    render(
      <PracticeRow
        practiceId="guru-pooja"
        name="Guru Pooja"
        selected={false}
        onToggle={onToggle}
      />
    );
    fireEvent.click(screen.getByText('Guru Pooja'));
    expect(onToggle).toHaveBeenCalled();
  });

  it('does not show a Daily badge', () => {
    render(
      <PracticeRow
        practiceId="guru-pooja"
        name="Guru Pooja"
        selected
        onToggle={vi.fn()}
      />
    );
    expect(screen.queryByText('Daily')).not.toBeInTheDocument();
  });
});
