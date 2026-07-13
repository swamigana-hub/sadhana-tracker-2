/**
 * Explicit practice ID → illustration filename map.
 * Filenames match PNGs in public/illustrations/ (sourced from practice-illustrations/).
 * Do not derive from display names — several IDs diverge from filenames.
 */
export const PRACTICE_ILLUSTRATION_FILES: Record<string, string> = {
  'achala-arpanam': 'achal-arpanam.png',
  'angamardana': 'angamardhana.png',
  'ardhasiddhasana': 'ardhasiddhasana.png',
  'aum-chanting': 'aum-chanting.png',
  'bhakti-sadhana': 'bhakti-sadhana.png',
  'bhastrika-kriya': 'bhastrika-kriya.png',
  'bhuta-shuddhi': 'bhuta-shuddhi.png',
  'breath-watching': 'breath-watching.png',
  'chit-shakti-health': 'cs-for-health.png',
  'chit-shakti-love': 'cs-for-love.png',
  'chit-shakti-peace': 'cs-for-peace.png',
  'chit-shakti-success': 'cs-for-success.png',
  'devi-sadhana': 'devi-sadhana.png',
  'directional-movements-arms': 'directional-movements-of-the-arms.png',
  'eye-care-practices': 'eye-practices.png',
  'guru-mahima': 'guru-mahima-1.png',
  'guru-pooja': 'guru-pooja.png',
  'infinity-meditation': 'infinity-meditation.png',
  'inner-engineering-crash-course': 'inner-engineering-crash-course.png',
  'isha-kriya': 'isha-kriya.png',
  'jala-neti': 'jala-neti.png',
  'knee-rotations': 'knee-rotations.png',
  'linga-bhairavi-arati': 'linga-bhairavi-arati.png',
  'living-soil-meditation': 'livting-soil-meditation.png',
  'mahamantra': 'mahamantra.png',
  'margazhi-mantra': 'margazhi-mantra.png',
  'nada-yoga': 'nada-yoga.png',
  'nadi-shuddhi': 'nadi-shuddhi.png',
  'namaskar-process': 'namaskar-process.png',
  'neck-practices': 'neck-practices.png',
  'rudraksha-diksha-sadhana': 'rudraksha-diksha-sadhana.png',
  'sadhgurus-presence': 'sadhguru-presense.png',
  'samyama': 'samyama.png',
  'shakti-chalana-kriya': 'shakti-chalana-kriya.png',
  'shambhavi-mahamudra-kriya': 'shambhavi-mahamudra-kriya.png',
  'shambhavi-mudra': 'shambhavi-mudra.png',
  'shanmuki-mudra': 'shanmukhi-mudra.png',
  'shiva-namaskar': 'shiva-namaskara.png',
  'shoonya': 'shoonya.png',
  'simha-kriya': 'simha-kriya.png',
  'squatting': 'squatting.png',
  'sukha-kriya': 'sukha-kriya.png',
  'surya-kriya': 'surya-kriya.png',
  'surya-shakti': 'surya-shakti.png',
  'thoppukarnam': 'thoppu-karnam.png',
  'yoga-namaskar': 'yoga-namaskar.png',
  'yogasanas': 'yogasanas.png',
};

/** Resolve public path for a practice illustration PNG. */
export function getIllustrationPath(practiceId: string): string {
  const filename = PRACTICE_ILLUSTRATION_FILES[practiceId];
  if (!filename) return `/illustrations/${practiceId}.png`;
  return `/illustrations/${filename}`;
}

export function hasIllustration(practiceId: string): boolean {
  return practiceId in PRACTICE_ILLUSTRATION_FILES;
}

export const WELCOME_CLUSTER_CENTER_ID = 'shambhavi-mahamudra-kriya';

/** Guru Pooja omitted from ring — no asset at welcome-cluster launch (see FEATURE_SPEC). */
export const WELCOME_RING_IDS = [
  'shakti-chalana-kriya',
  'surya-shakti',
  'sukha-kriya',
  'aum-chanting',
  'angamardana',
  'breath-watching',
  'shiva-namaskar',
] as const;
