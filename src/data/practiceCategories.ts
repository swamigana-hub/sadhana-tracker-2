export type PracticeCategory =
  | 'yoga-kriya'
  | 'meditation'
  | 'chanting'
  | 'chit-shakti'
  | 'gurus-grace';

export const PRACTICE_CATEGORY_LABELS: Record<PracticeCategory, string> = {
  'yoga-kriya': 'Yoga & Kriya',
  meditation: 'Meditation',
  chanting: 'Chanting',
  'chit-shakti': 'Chit Shakti',
  'gurus-grace': "Guru's Grace",
};

/** Category display order in setup step 2. */
export const PRACTICE_CATEGORY_ORDER: PracticeCategory[] = [
  'yoga-kriya',
  'meditation',
  'chanting',
  'chit-shakti',
  'gurus-grace',
];

export const PRACTICE_CATEGORIES: Record<string, PracticeCategory> = {
  'guru-pooja': 'gurus-grace',
  'inner-engineering-crash-course': 'gurus-grace',
  mahamantra: 'chanting',
  'bhuta-shuddhi': 'yoga-kriya',
  angamardana: 'yoga-kriya',
  'surya-kriya': 'yoga-kriya',
  yogasanas: 'yoga-kriya',
  'shakti-chalana-kriya': 'yoga-kriya',
  'shambhavi-mahamudra-kriya': 'yoga-kriya',
  'isha-kriya': 'meditation',
  'breath-watching': 'meditation',
  samyama: 'meditation',
  'achala-arpanam': 'gurus-grace',
  ardhasiddhasana: 'yoga-kriya',
  'aum-chanting': 'chanting',
  'bhakti-sadhana': 'chanting',
  'bhastrika-kriya': 'yoga-kriya',
  'chit-shakti-health': 'chit-shakti',
  'chit-shakti-love': 'chit-shakti',
  'chit-shakti-peace': 'chit-shakti',
  'chit-shakti-success': 'chit-shakti',
  'devi-sadhana': 'gurus-grace',
  'directional-movements-arms': 'yoga-kriya',
  'eye-care-practices': 'yoga-kriya',
  'guru-mahima': 'gurus-grace',
  'infinity-meditation': 'meditation',
  'jala-neti': 'yoga-kriya',
  'knee-rotations': 'yoga-kriya',
  'linga-bhairavi-arati': 'gurus-grace',
  'living-soil-meditation': 'meditation',
  'margazhi-mantra': 'chanting',
  'nada-yoga': 'meditation',
  'nadi-shuddhi': 'yoga-kriya',
  'namaskar-process': 'yoga-kriya',
  'neck-practices': 'yoga-kriya',
  'rudraksha-diksha-sadhana': 'gurus-grace',
  'sadhgurus-presence': 'gurus-grace',
  'shanmuki-mudra': 'yoga-kriya',
  'shambhavi-mudra': 'yoga-kriya',
  'shiva-namaskar': 'yoga-kriya',
  shoonya: 'meditation',
  'simha-kriya': 'yoga-kriya',
  squatting: 'yoga-kriya',
  'sukha-kriya': 'yoga-kriya',
  'surya-shakti': 'yoga-kriya',
  thoppukarnam: 'yoga-kriya',
  'yoga-namaskar': 'yoga-kriya',
};

export function getPracticeCategory(practiceId: string): PracticeCategory {
  return PRACTICE_CATEGORIES[practiceId] ?? 'yoga-kriya';
}
