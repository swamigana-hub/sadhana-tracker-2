import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders primary label and calls onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Get started</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Next
      </Button>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders secondary variant', () => {
    render(
      <Button variant="secondary" onClick={() => {}}>
        Skip
      </Button>
    );
    expect(screen.getByRole('button', { name: 'Skip' })).toHaveClass(/secondary/);
  });
});
