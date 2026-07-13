/**
 * 45-quote reference set — deterministic day-of-year rotation (Section 1.1).
 * Replace with Practice Quotes - Pre.csv content when available.
 */
export const DAILY_QUOTES: readonly string[] = [
  'The only way out is in.',
  'If you resist change, you resist life.',
  'How deeply you touch another life is how rich your life is.',
  'The moment you realize you are mortal, you will not have time to be angry with anybody.',
  'If you want to know the nature of the universe, you must first know the nature of yourself.',
  'Your body is the closest thing to you. Taking care of it is not a duty — it is a privilege.',
  'The quality of your life is determined by how you experience every moment.',
  'If you are not willing to invest in yourself, who will?',
  'Discipline is not about control — it is about freedom.',
  'What you are willing to do determines what you can do.',
  'If you want to succeed, you must learn to manage your inner nature.',
  'The mind is a beautiful servant but a terrible master.',
  'Stillness is not the absence of movement — it is the absence of resistance.',
  'Every breath is a possibility.',
  'Your sadhana is not something you do — it is something you become.',
  'If you want to know the divine, you must be willing to dissolve.',
  'The body is a device — how you use it is up to you.',
  'Clarity is not something you achieve — it is something you allow.',
  'What you call "myself" is just a collection of habits.',
  'If you are not confused, you are not growing.',
  'The most beautiful moments in life are moments of utter involvement.',
  'To be human means to be capable of conscious action.',
  'Your experience of life is entirely your making.',
  'If you want to be successful, first learn to be joyful.',
  'The only thing that stands between you and your wellbeing is yourself.',
  'When you are truly joyful, you are willing to do whatever is needed.',
  'If you want to know life, you must pay attention.',
  'The significance of life is not in what you achieve, but in how you experience it.',
  'Your body is the most sophisticated gadget on the planet.',
  'If you are not willing to change, you are not willing to live.',
  'The moment you identify with something, you are trapped.',
  'What you need is not more time — it is more intensity.',
  'If you want to be free, you must be willing to be alone.',
  'The purpose of life is to know life in its entirety.',
  'Your thoughts and emotions are not you — they are something you are doing.',
  'If you are not ecstatic, you are not paying attention.',
  'The only bondage is your unwillingness to see things as they are.',
  'What you do with your body affects every aspect of your life.',
  'If you want to be healthy, you must be in tune with the earth.',
  'The mind is like a mirror — it reflects whatever you put before it.',
  'Your inner state determines the quality of your life, not your circumstances.',
  'If you are willing, life will open up in a million different ways.',
  'The most precious thing in life is life itself.',
  'What you call "stress" is just your inability to manage your own system.',
  'If you want to know the truth, you must be willing to look without conclusions.',
  'Every moment is a doorway to the divine — if you are willing to step through.',
];

export function getQuoteForDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  const start = new Date(parsed.getFullYear(), 0, 0);
  const diff = parsed.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % DAILY_QUOTES.length;
  return DAILY_QUOTES[index];
}
