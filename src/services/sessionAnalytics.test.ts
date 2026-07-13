import { describe, it, expect } from 'vitest';
import { buildAppOpenedEvent, buildSessionDurationEvent } from './sessionAnalytics';

describe('sessionAnalytics', () => {
  const now = new Date(2026, 5, 28, 10, 0);

  it('builds app_opened with days_since_install', () => {
    const event = buildAppOpenedEvent('dev-1', '2026-06-26T08:00:00.000Z', now);
    expect(event).toEqual({
      device_id: 'dev-1',
      event_name: 'app_opened',
      properties: {
        timestamp: now.toISOString(),
        days_since_install: 2,
      },
    });
  });

  it('builds session_duration with duration_seconds', () => {
    const event = buildSessionDurationEvent('dev-1', 95, now);
    expect(event).toEqual({
      device_id: 'dev-1',
      event_name: 'session_duration',
      properties: {
        timestamp: now.toISOString(),
        duration_seconds: 95,
      },
    });
  });
});
