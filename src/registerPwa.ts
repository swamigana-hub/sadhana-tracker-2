export function registerPwa(): void {
  if (import.meta.env.MODE === 'test') return;

  void import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}
