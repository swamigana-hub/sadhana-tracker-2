import { describe, it, expect, beforeEach } from 'vitest';
import { getOrCreateDeviceId, DEVICE_ID_KEY } from './deviceId';
import { STORAGE_KEYS } from './localStore';

describe('getOrCreateDeviceId', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates a UUID and persists it on first call', () => {
    const id = getOrCreateDeviceId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(localStorage.getItem(DEVICE_ID_KEY)).toBe(id);
  });

  it('returns the same id on subsequent calls', () => {
    const first = getOrCreateDeviceId();
    const second = getOrCreateDeviceId();
    expect(second).toBe(first);
  });

  it('records first_opened_at when creating a new device', () => {
    getOrCreateDeviceId();
    const stored = localStorage.getItem(STORAGE_KEYS.firstOpenedAt);
    expect(stored).toMatch(/^"\d{4}-\d{2}-\d{2}T/);
  });
});
