import { setFirstOpenedAt } from './localStore';

export const DEVICE_ID_KEY = 'device_id';

export function getOrCreateDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_KEY, id);
  setFirstOpenedAt(new Date().toISOString());
  return id;
}
