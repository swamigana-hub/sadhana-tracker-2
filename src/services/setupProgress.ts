const WELCOME_SEEN_KEY = 'setup_welcome_seen';
const NAME_CAPTURED_KEY = 'setup_name_captured';

function readFlag(key: string): boolean {
  return localStorage.getItem(key) === 'true';
}

function writeFlag(key: string, value: boolean): void {
  localStorage.setItem(key, value === true ? 'true' : 'false');
}

export function getWelcomeSeen(): boolean {
  return readFlag(WELCOME_SEEN_KEY);
}

export function setWelcomeSeen(seen: boolean): void {
  writeFlag(WELCOME_SEEN_KEY, seen);
}

export function getNameCaptured(): boolean {
  return readFlag(NAME_CAPTURED_KEY);
}

export function setNameCaptured(captured: boolean): void {
  writeFlag(NAME_CAPTURED_KEY, captured);
}
