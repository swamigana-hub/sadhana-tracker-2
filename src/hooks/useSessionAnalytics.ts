import { useEffect, useRef } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { trackAppOpened, trackSessionDuration } from '../services/sessionAnalytics';

export function useSessionAnalytics(
  deviceId: string,
  client: SupabaseClient | null
): void {
  const sentDuration = useRef(false);

  useEffect(() => {
    if (!client) return;

    const sessionStart = Date.now();
    sentDuration.current = false;

    void trackAppOpened(client, deviceId).catch(() => {});

    const sendDuration = () => {
      if (sentDuration.current) return;
      sentDuration.current = true;
      const durationSeconds = Math.round((Date.now() - sessionStart) / 1000);
      void trackSessionDuration(client, deviceId, durationSeconds).catch(() => {});
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendDuration();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', sendDuration);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', sendDuration);
    };
  }, [client, deviceId]);
}
