/** Daily quotes from Practice Quotes - Pre.csv — deterministic day-of-year rotation. */
export const DAILY_QUOTES: readonly string[] = [
  'Yoga is about plugging into an uninterrupted source of Energy.',
  'Body and Mind are miraculous instruments. But to make them soar, you must learn to hold them the right way.',
  'A disturbance is a disturbance only if you have not prepared yourself for it. When you do the necessary Inner Work, it becomes a stepping stone.',
  'Never do Sadhana for life. Do it only for today.',
  'To make your surroundings pleasant, you need cooperation. To make your body, mind, and energy pleasant is one hundred percent your business.',
  'If you have any Love in your heart for your children, the best thing you can do is not to teach them, but to work upon yourself.',
  'Breath and heartbeat are vital for the body. Being Meditative is vital for the Human Being.',
  'Yoga means Union. Yoga also means ultimate empowerment. If you are in union with everything, it is a tremendous empowerment.',
  'You cannot transform the world without transforming the Individual.',
  'The idea of Sadhana is not to go somewhere. It is to come to a state where you can simply Be here. What is here is everywhere – what is not here is nowhere.',
  'Yoga means obliterating the boundaries of your individuality to Experience Oneness with the universe.',
  'Yoga is about aligning yourself with the cosmic geometry. It is your choice to be either a piece of creation or part of the Source of Creation.',
  'There is no need to be perfect. What is important is that you are constantly Striving to Be Better.',
  'Whether it is easy or hard – never lose Focus on where you want to go.',
  'Yoga is not about fixing life. It is about becoming Fit for Life.',
  'Yoga works miraculously in Physical, Mental, and Spiritual dimensions. The only thing is, you have to do it.',
  'Meditation is a means to realize the beauty of your existence.',
  'Yoga means to become flexible – not just physically but in every way. That means wherever you are, you are fine.',
  'If you want to enjoy success, before you engineer situations, first of all you have to engineer yourself.',
  'Without the necessary energy, being aware is extremely difficult. That is why sadhana or Yogic practices – to stir up the energy.',
  'If you want inspiration, read a book. But if you really want to walk the spiritual path, the only way is to turn inward.',
  'Without transforming individual human beings, there will be no transformation in the world.',
  'If you are willing to strive, there is a way to go beyond all the limitations that are considered human.',
  'Do not settle for a limited experience of life. Where there is a limitation, there is a possibility of breaking it.',
  'Before we engineer the world, the most important engineering that needs to happen is that you engineer yourself the way you want yourself to be.',
  'Spiritual practice is like food. Food only works for those who eat it. Spiritual practice only works for those who do it.',
  'In mediocrity, there is comfort, but no joy. In going beyond your limits, there is joy, but maybe no comfort. You have to choose.',
  'Yoga is a technology. If you learn to use it, it works – no matter where you come from or what you believe in or do not believe in.',
  'The best thing you can do for your family, your children, society, and the world around you is to enhance yourself.',
  'Yoga is about rising to a new level of balance and competence in all aspects of life.',
  'The roots of the Divine are entrenched in this body. If you nurture the roots, how can you avoid the flowering.',
  'Only what you perceive, you know – the rest is all imagination. Yoga is the science of enhancing perception.',
  'The science of Yoga is not just about health and fitness. It is an ultimate solution for every aspect of human existence.',
  'All that moves will exhaust itself. Only that which is still, is for always. Meditation is essentially to move towards that stillness, to become like the core of existence.',
  'Your wellness and your illness, your joy and your misery, all come from within. If you want wellbeing, it is time to turn inward.',
  'Yoga is a way to produce a chemistry of blissfulness. Once you are blissful by your own nature, you can deal with outside situations effortlessly.',
  'The very source of creation is within you. You just need to strive to make the necessary contact with it.',
  'The quality of human life will only truly change when we change within ourselves.',
  'Yoga is not just an exercise. It is a process and system through which human beings can find their highest possible potential.',
  'If you truly want to celebrate my birth and yours, make this Yoga a Living Reality in your life and the lives of others.',
  'All that is needed for your Ultimate Liberation is to steadily stay on the path. Anyone who stays on the river naturally finds the ocean.',
  'You can use Yoga to get rid of your backache or improve your focus and peace of mind – or you can use it as a ladder to the Divine.',
  'There is a distance between possibility and reality. Do you have the courage and commitment to walk this distance?',
];

export function getQuoteForDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  const start = new Date(parsed.getFullYear(), 0, 0);
  const diff = parsed.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}
