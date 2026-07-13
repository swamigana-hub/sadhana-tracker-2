import { isIosInstallBannerDismissed } from './localStore';

export function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iPadOS13Plus =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) || iPadOS13Plus;
}

export function isIosSafari(): boolean {
  if (!isIosDevice()) return false;
  return !/CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent);
}

export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  const nav = navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

export function shouldShowIosInstallBanner(): boolean {
  return isIosSafari() && !isStandalonePwa() && !isIosInstallBannerDismissed();
}
