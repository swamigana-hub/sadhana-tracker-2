import { useCallback, useRef, useState } from 'react';

const SUCCESS_MS = 800;

export function useLogFeedback() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [ringCelebrate, setRingCelebrate] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashSuccess = useCallback((ringIncreased: boolean) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowSuccess(true);
    setRingCelebrate(ringIncreased);

    timerRef.current = setTimeout(() => {
      setShowSuccess(false);
      setRingCelebrate(false);
      timerRef.current = null;
    }, SUCCESS_MS);
  }, []);

  return { showSuccess, ringCelebrate, flashSuccess };
}
