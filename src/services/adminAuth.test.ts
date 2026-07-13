import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isAdminAuthenticated,
  setAdminAuthenticated,
  verifyAdminPassphrase,
} from './adminAuth';

describe('adminAuth', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubEnv('VITE_ADMIN_PASS', 'study-secret');
  });

  it('verifies matching passphrase', () => {
    expect(verifyAdminPassphrase('study-secret')).toBe(true);
    expect(verifyAdminPassphrase('wrong')).toBe(false);
  });

  it('tracks authenticated state in sessionStorage', () => {
    expect(isAdminAuthenticated()).toBe(false);
    setAdminAuthenticated(true);
    expect(isAdminAuthenticated()).toBe(true);
    setAdminAuthenticated(false);
    expect(isAdminAuthenticated()).toBe(false);
  });
});
