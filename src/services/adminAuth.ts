const ADMIN_AUTH_KEY = 'admin_authenticated';

export function verifyAdminPassphrase(input: string): boolean {
  const expected = import.meta.env.VITE_ADMIN_PASS;
  if (!expected) return false;
  return input === expected;
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function setAdminAuthenticated(authenticated: boolean): void {
  if (authenticated) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  }
}
