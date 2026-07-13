import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminGate } from './AdminGate';

vi.mock('../../services/adminAuth', () => ({
  verifyAdminPassphrase: vi.fn((value: string) => value === 'study-secret'),
}));

describe('AdminGate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders passphrase form', () => {
    render(<AdminGate onAuthenticated={() => {}} />);
    expect(screen.getByLabelText('Passphrase')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('shows error for incorrect passphrase', () => {
    render(<AdminGate onAuthenticated={() => {}} />);
    fireEvent.change(screen.getByLabelText('Passphrase'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Incorrect passphrase.');
  });

  it('calls onAuthenticated for correct passphrase', () => {
    const onAuthenticated = vi.fn();
    render(<AdminGate onAuthenticated={onAuthenticated} />);
    fireEvent.change(screen.getByLabelText('Passphrase'), { target: { value: 'study-secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onAuthenticated).toHaveBeenCalledOnce();
  });
});
