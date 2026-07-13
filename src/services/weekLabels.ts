import { addDays, getLocalDateString, getMondayOfWeek, parseLocalDate } from './dates';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** Ordinal week-of-month (1-based) for the Monday that starts this week. */
export function getWeekOrdinalInMonth(monday: Date): number {
  const year = monday.getFullYear();
  const month = monday.getMonth();
  let ordinal = 0;
  let cursor = getMondayOfWeek(new Date(year, month, 1));

  while (cursor.getFullYear() === year && cursor.getMonth() === month) {
    ordinal++;
    if (getLocalDateString(cursor) === getLocalDateString(monday)) {
      return ordinal;
    }
    cursor = addDays(cursor, 7);
  }

  // Monday falls in this month but first Monday of month grid started earlier
  const monthStart = new Date(year, month, 1);
  const firstMonday = getMondayOfWeek(monthStart);
  ordinal = 1;
  cursor = firstMonday;
  while (cursor <= monday) {
    if (cursor.getMonth() === month) {
      if (getLocalDateString(cursor) === getLocalDateString(monday)) {
        return ordinal;
      }
      ordinal++;
    }
    cursor = addDays(cursor, 7);
  }
  return Math.max(ordinal, 1);
}

export function formatWeekLabel(
  mondayDate: string,
  today: string
): 'This week' | 'Last week' | string {
  const currentMonday = getLocalDateString(getMondayOfWeek(parseLocalDate(today)));
  const lastMonday = getLocalDateString(addDays(parseLocalDate(currentMonday), -7));

  if (mondayDate === currentMonday) return 'This week';
  if (mondayDate === lastMonday) return 'Last week';

  const monday = parseLocalDate(mondayDate);
  const month = MONTHS[monday.getMonth()];
  const weekNum = getWeekOrdinalInMonth(monday);
  return `${month} wk ${weekNum}`;
}

export const WEEKDAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
