import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IosInstallBanner } from './IosInstallBanner';
import { setIosInstallBannerDismissed } from '../../services/localStore';

vi.mock('../../services/iosInstall', () => ({
  shouldShowIosInstallBanner: vi.fn(() => true),
}));

import { shouldShowIosInstallBanner } from '../../services/iosInstall';

const mockShouldShow = vi.mocked(shouldShowIosInstallBanner);

describe('IosInstallBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    mockShouldShow.mockReturnValue(true);
  });

  it('renders install instructions when eligible', () => {
    render(<IosInstallBanner />);
    expect(screen.getByRole('region', { name: 'Install app' })).toBeInTheDocument();
    expect(screen.getByText(/Add to Home Screen/i)).toBeInTheDocument();
  });

  it('does not render when not eligible', () => {
    mockShouldShow.mockReturnValue(false);
    render(<IosInstallBanner />);
    expect(screen.queryByRole('region', { name: 'Install app' })).not.toBeInTheDocument();
  });

  it('dismisses and persists flag on Got it', () => {
    render(<IosInstallBanner />);
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
    expect(screen.queryByRole('region', { name: 'Install app' })).not.toBeInTheDocument();
    expect(localStorage.getItem('ios_install_banner_dismissed')).toBe('true');
  });

  it('does not show again after prior dismiss', () => {
    setIosInstallBannerDismissed(true);
    mockShouldShow.mockReturnValue(false);
    render(<IosInstallBanner />);
    expect(screen.queryByRole('region', { name: 'Install app' })).not.toBeInTheDocument();
  });
});
