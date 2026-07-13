import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatBox } from './StatBox';

describe('StatBox', () => {
  it('renders label and value', () => {
    render(<StatBox label="Days practiced" value={12} />);
    expect(screen.getByText('Days practiced')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
