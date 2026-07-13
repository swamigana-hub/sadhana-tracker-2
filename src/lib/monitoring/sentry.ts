/**
 * Optional Sentry integration — set VITE_SENTRY_DSN in Vercel env to enable.
 * Swami must create the Sentry project and supply the DSN.
 */
export function initMonitoring(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  void import('@sentry/react')
    .then((Sentry) => {
      Sentry.init({
        dsn,
        environment: import.meta.env.MODE,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: 0.2,
      });

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('sentry_test') === '1') {
          Sentry.captureException(new Error('Sadhana Tracker Sentry test error'));
        }
      }
    })
    .catch((err) => {
      console.warn('[monitoring] Sentry init failed', err);
    });
}

export function captureException(error: unknown): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  void import('@sentry/react')
    .then((Sentry) => {
      Sentry.captureException(error);
    })
    .catch(() => {});
}
