import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DayTile } from './DayTile';

describe('DayTile', () => {
  it('applies visual state classes', () => {
    const { container, rerender } = render(<DayTile state="future" />);
    expect(container.firstChild).toHaveClass(/future/);

    rerender(<DayTile state="missed" />);
    expect(container.firstChild).toHaveClass(/missed/);

    rerender(<DayTile state="p100plus" />);
    expect(container.firstChild).toHaveClass(/p100plus/);
    expect(container.firstChild).toHaveClass(/glow/);
  });
});
