import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isIosDevice,
  isIosSafari,
  isStandalonePwa,
  shouldShowIosInstallBanner,
} from './iosInstall';
import { setIosInstallBannerDismissed } from './localStore';

const IPHONE_SAFARI_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const IPHONE_CHROME_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1';
const DESKTOP_CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function mockUserAgent(ua: string): void {
  vi.stubGlobal('navigator', {
    ...navigator,
    userAgent: ua,
    platform: ua.includes('iPhone') ? 'iPhone' : 'Win32',
    maxTouchPoints: ua.includes('iPhone') ? 5 : 0,
    standalone: false,
  });
}

function mockStandalone(standalone: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query === '(display-mode: standalone)' && standalone,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
  vi.stubGlobal('navigator', {
    ...navigator,
    standalone,
  });
}

describe('iosInstall', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
    mockUserAgent(DESKTOP_CHROME_UA);
    mockStandalone(false);
  });

  it('detects iOS devices from user agent', () => {
    mockUserAgent(IPHONE_SAFARI_UA);
    expect(isIosDevice()).toBe(true);
  });

  it('detects iOS Safari but not Chrome on iOS', () => {
    mockUserAgent(IPHONE_SAFARI_UA);
    expect(isIosSafari()).toBe(true);

    mockUserAgent(IPHONE_CHROME_UA);
    expect(isIosSafari()).toBe(false);
  });

  it('detects standalone display mode', () => {
    mockStandalone(true);
    expect(isStandalonePwa()).toBe(true);

    mockStandalone(false);
    expect(isStandalonePwa()).toBe(false);
  });

  it('shows banner on iOS Safari when not standalone and not dismissed', () => {
    mockUserAgent(IPHONE_SAFARI_UA);
    mockStandalone(false);
    expect(shouldShowIosInstallBanner()).toBe(true);
  });

  it('hides banner when already installed', () => {
    mockUserAgent(IPHONE_SAFARI_UA);
    mockStandalone(true);
    expect(shouldShowIosInstallBanner()).toBe(false);
  });

  it('hides banner when dismissed in localStorage', () => {
    mockUserAgent(IPHONE_SAFARI_UA);
    setIosInstallBannerDismissed(true);
    expect(shouldShowIosInstallBanner()).toBe(false);
  });

  it('hides banner on non-iOS browsers', () => {
    mockUserAgent(DESKTOP_CHROME_UA);
    expect(shouldShowIosInstallBanner()).toBe(false);
  });
});
