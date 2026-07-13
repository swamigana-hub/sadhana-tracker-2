/** Schedule chip labels for All Practices (Daily, Other, counts). */
import type { PracticeLists } from './practiceInstances';

export function getScheduleChips(lists: PracticeLists, practiceId: string): string[] {
  const dailyCount = lists.daily.filter((p) => p.practiceId === practiceId).length;
  const otherCount = lists.other.filter((p) => p.practiceId === practiceId).length;
  const chips: string[] = [];
  if (dailyCount === 1) chips.push('Daily');
  else if (dailyCount > 1) chips.push(`Daily ×${dailyCount}`);
  if (otherCount === 1) chips.push('Other');
  else if (otherCount > 1) chips.push(`Other ×${otherCount}`);
  return chips;
}
