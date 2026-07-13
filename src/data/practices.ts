export interface Practice {
  id: string;
  name: string;
  durationMinutes: number;
  popular: boolean;
  canonicalOrder?: number;
}

export const PRACTICES: Practice[] = [
  // Popular — canonical order matches Sadhguru App screenshot
  { id: 'guru-pooja', name: 'Guru Pooja', durationMinutes: 6, popular: true, canonicalOrder: 1 },
  { id: 'inner-engineering-crash-course', name: 'Inner Engineering Crash Course', durationMinutes: 2, popular: true, canonicalOrder: 2 },
  { id: 'mahamantra', name: 'Mahamantra', durationMinutes: 21, popular: true, canonicalOrder: 3 },
  { id: 'bhuta-shuddhi', name: 'Bhuta Shuddhi', durationMinutes: 10, popular: true, canonicalOrder: 4 },
  { id: 'angamardana', name: 'Angamardana', durationMinutes: 40, popular: true, canonicalOrder: 5 },
  { id: 'surya-kriya', name: 'Surya Kriya', durationMinutes: 12, popular: true, canonicalOrder: 6 },
  { id: 'yogasanas', name: 'Yogasanas', durationMinutes: 60, popular: true, canonicalOrder: 7 },
  { id: 'shakti-chalana-kriya', name: 'Shakti Chalana Kriya', durationMinutes: 45, popular: true, canonicalOrder: 8 },
  { id: 'shambhavi-mahamudra-kriya', name: 'Shambhavi Mahamudra Kriya', durationMinutes: 21, popular: true, canonicalOrder: 9 },
  { id: 'isha-kriya', name: 'Isha Kriya', durationMinutes: 14, popular: true, canonicalOrder: 10 },
  { id: 'breath-watching', name: 'Breath Watching', durationMinutes: 40, popular: true, canonicalOrder: 11 },
  { id: 'samyama', name: 'Samyama', durationMinutes: 30, popular: true, canonicalOrder: 12 },

  // Other practices — alphabetical by name
  { id: 'achala-arpanam', name: 'Achala Arpanam', durationMinutes: 12, popular: false },
  { id: 'ardhasiddhasana', name: 'Ardhasiddhasana', durationMinutes: 30, popular: false },
  { id: 'aum-chanting', name: 'AUM Chanting', durationMinutes: 20, popular: false },
  { id: 'bhakti-sadhana', name: 'Bhakti Sadhana', durationMinutes: 13, popular: false },
  { id: 'bhastrika-kriya', name: 'Bhastrika Kriya', durationMinutes: 12, popular: false },
  { id: 'chit-shakti-health', name: 'Chit Shakti for Health', durationMinutes: 19, popular: false },
  { id: 'chit-shakti-love', name: 'Chit Shakti for Love', durationMinutes: 17, popular: false },
  { id: 'chit-shakti-peace', name: 'Chit Shakti for Peace', durationMinutes: 19, popular: false },
  { id: 'chit-shakti-success', name: 'Chit Shakti for Success', durationMinutes: 19, popular: false },
  { id: 'devi-sadhana', name: 'Devi Sadhana', durationMinutes: 8, popular: false },
  { id: 'directional-movements-arms', name: 'Directional Movements of the Arms', durationMinutes: 6, popular: false },
  { id: 'eye-care-practices', name: 'Eye Care Practices', durationMinutes: 10, popular: false },
  { id: 'guru-mahima', name: 'Guru Mahima', durationMinutes: 6, popular: false },
  { id: 'infinity-meditation', name: 'Infinity Meditation', durationMinutes: 15, popular: false },
  { id: 'jala-neti', name: 'Jala Neti', durationMinutes: 10, popular: false },
  { id: 'knee-rotations', name: 'Knee Rotations', durationMinutes: 2, popular: false },
  { id: 'linga-bhairavi-arati', name: 'Linga Bhairavi Arati', durationMinutes: 2, popular: false },
  { id: 'living-soil-meditation', name: 'Living Soil Meditation', durationMinutes: 12, popular: false },
  { id: 'margazhi-mantra', name: 'Margazhi Mantra', durationMinutes: 15, popular: false },
  { id: 'nada-yoga', name: 'Nada Yoga', durationMinutes: 6, popular: false },
  { id: 'nadi-shuddhi', name: 'Nadi Shuddhi', durationMinutes: 5, popular: false },
  { id: 'namaskar-process', name: 'Namaskar Process', durationMinutes: 4, popular: false },
  { id: 'neck-practices', name: 'Neck Practices', durationMinutes: 7, popular: false },
  { id: 'rudraksha-diksha-sadhana', name: 'Rudraksha Diksha Sadhana', durationMinutes: 4, popular: false },
  { id: 'sadhgurus-presence', name: "Sadhguru's Presence", durationMinutes: 10, popular: false },
  { id: 'shanmuki-mudra', name: 'Shanmuki Mudra', durationMinutes: 16, popular: false },
  { id: 'shambhavi-mudra', name: 'Shambhavi Mudra', durationMinutes: 4, popular: false },
  { id: 'shiva-namaskar', name: 'Shiva Namaskar', durationMinutes: 7, popular: false },
  { id: 'shoonya', name: 'Shoonya', durationMinutes: 15, popular: false },
  { id: 'simha-kriya', name: 'Simha Kriya', durationMinutes: 3, popular: false },
  { id: 'squatting', name: 'Squatting', durationMinutes: 1, popular: false },
  { id: 'sukha-kriya', name: 'Sukha Kriya', durationMinutes: 20, popular: false },
  { id: 'surya-shakti', name: 'Surya Shakti', durationMinutes: 9, popular: false },
  { id: 'thoppukarnam', name: 'Thoppukarnam', durationMinutes: 2, popular: false },
  { id: 'yoga-namaskar', name: 'Yoga Namaskar', durationMinutes: 4, popular: false },
];

const practiceById = new Map(PRACTICES.map((p) => [p.id, p]));

export function getPracticeById(id: string): Practice | undefined {
  return practiceById.get(id);
}

export function getPopularPractices(): Practice[] {
  return PRACTICES.filter((p) => p.popular).sort(
    (a, b) => (a.canonicalOrder ?? 0) - (b.canonicalOrder ?? 0)
  );
}

/** Setup step 1 & 2 Popular section — core popular list + Shoonya, then Sadhguru's Presence last. */
const SETUP_POPULAR_TAIL_IDS = ['shoonya', 'sadhgurus-presence'] as const;

export function getSetupPopularPractices(): Practice[] {
  const core = getPopularPractices();
  const tail = SETUP_POPULAR_TAIL_IDS.map((id) => getPracticeById(id)).filter(
    (p): p is Practice => p !== undefined
  );
  return [...core, ...tail];
}

export function isSetupPopularPractice(practiceId: string): boolean {
  return getSetupPopularPractices().some((p) => p.id === practiceId);
}

export function getSetupStep1OtherPractices(): Practice[] {
  const popularIds = new Set(getSetupPopularPractices().map((p) => p.id));
  return PRACTICES.filter((p) => !popularIds.has(p.id)).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function getSetupStep2OtherPractices(excludeIds: Set<string>): Practice[] {
  return getSetupStep1OtherPractices().filter((p) => !excludeIds.has(p.id));
}

export function getOtherPractices(): Practice[] {
  return PRACTICES.filter((p) => !p.popular).sort((a, b) => a.name.localeCompare(b.name));
}

export function sortByCanonicalOrder(ids: string[]): string[] {
  return [...ids].sort((a, b) => {
    const pa = practiceById.get(a);
    const pb = practiceById.get(b);
    if (pa?.popular && pb?.popular) {
      return (pa.canonicalOrder ?? 0) - (pb.canonicalOrder ?? 0);
    }
    if (pa?.popular) return -1;
    if (pb?.popular) return 1;
    return (pa?.name ?? a).localeCompare(pb?.name ?? b);
  });
}

export function calculateLogMinutes(practiceIds: string[]): number {
  return practiceIds.reduce((sum, id) => sum + (practiceById.get(id)?.durationMinutes ?? 0), 0);
}
