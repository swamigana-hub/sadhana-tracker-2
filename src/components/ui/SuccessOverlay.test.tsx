import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuccessOverlay } from './SuccessOverlay';

describe('SuccessOverlay', () => {
  it('renders when visible', () => {
    render(<SuccessOverlay visible />);
    expect(screen.getByRole('status')).toHaveTextContent('Logged');
  });

  it('is hidden when not visible', () => {
    render(<SuccessOverlay visible={false} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
