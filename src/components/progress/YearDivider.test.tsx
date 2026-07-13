import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YearDivider } from './YearDivider';

describe('YearDivider', () => {
  it('renders year label', () => {
    render(<YearDivider year={2026} />);
    expect(screen.getByText('2026')).toBeInTheDocument();
  });
});
