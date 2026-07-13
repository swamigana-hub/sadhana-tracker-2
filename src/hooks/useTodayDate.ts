import { useEffect, useState } from 'react';
import { getLocalDateString } from '../services/dates';

export function useTodayDate(): string {
  const [today, setToday] = useState(() => getLocalDateString());

  useEffect(() => {
    const refresh = () => setToday(getLocalDateString());
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return today;
}
