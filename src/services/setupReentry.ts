const REENTRY_KEY = 'setup_reentry';

export function setSetupReentry(active: boolean): void {
  if (active) {
    localStorage.setItem(REENTRY_KEY, '1');
    return;
  }
  localStorage.removeItem(REENTRY_KEY);
}

export function isSetupReentry(): boolean {
  return localStorage.getItem(REENTRY_KEY) === '1';
}
