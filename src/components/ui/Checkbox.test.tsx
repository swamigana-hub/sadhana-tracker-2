import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles via click when not locked', () => {
    const onChange = vi.fn();
    render(<Checkbox checked={false} onChange={onChange} label="Guru Pooja" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when locked', () => {
    const onChange = vi.fn();
    render(<Checkbox checked locked onChange={onChange} label="Guru Pooja" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
