import {
  PRACTICES,
  getPracticeById,
  getPopularPractices,
  getOtherPractices,
  getSetupPopularPractices,
  getSetupStep1OtherPractices,
  sortByCanonicalOrder,
  calculateLogMinutes,
} from './practices';

describe('PRACTICES catalog', () => {
  it('contains exactly 47 practices', () => {
    expect(PRACTICES).toHaveLength(47);
  });

  it('does not include shiva-namaskar-extended', () => {
    expect(PRACTICES.find((p) => p.id === 'shiva-namaskar-extended')).toBeUndefined();
  });

  it('includes shiva-namaskar', () => {
    expect(getPracticeById('shiva-namaskar')?.durationMinutes).toBe(7);
  });
});

describe('getPopularPractices', () => {
  it('returns 12 practices in screenshot canonical order', () => {
    const popular = getPopularPractices();
    expect(popular).toHaveLength(12);
    expect(popular.map((p) => p.name)).toEqual([
      'Guru Pooja',
      'Inner Engineering Crash Course',
      'Mahamantra',
      'Bhuta Shuddhi',
      'Angamardana',
      'Surya Kriya',
      'Yogasanas',
      'Shakti Chalana Kriya',
      'Shambhavi Mahamudra Kriya',
      'Isha Kriya',
      'Breath Watching',
      'Samyama',
    ]);
  });
});

describe('getSetupPopularPractices', () => {
  it('appends Shoonya then Sadhguru\'s Presence after core popular list', () => {
    const setupPopular = getSetupPopularPractices();
    expect(setupPopular).toHaveLength(14);
    expect(setupPopular.at(-2)?.name).toBe('Shoonya');
    expect(setupPopular.at(-1)?.name).toBe("Sadhguru's Presence");
  });

  it('partitions all practices between setup popular and setup other on step 1', () => {
    const popularIds = new Set(getSetupPopularPractices().map((p) => p.id));
    const other = getSetupStep1OtherPractices();
    expect(popularIds.size + other.length).toBe(PRACTICES.length);
    other.forEach((p) => expect(popularIds.has(p.id)).toBe(false));
  });
});

describe('getOtherPractices', () => {
  it('returns 35 practices sorted alphabetically by name', () => {
    const other = getOtherPractices();
    expect(other).toHaveLength(35);
    const names = other.map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('does not include any popular practice', () => {
    const popularIds = new Set(getPopularPractices().map((p) => p.id));
    getOtherPractices().forEach((p) => {
      expect(popularIds.has(p.id)).toBe(false);
    });
  });
});

describe('sortByCanonicalOrder', () => {
  it('orders popular practices by canonicalOrder and others alphabetically', () => {
    const ids = ['yogasanas', 'aum-chanting', 'guru-pooja'];
    const sorted = sortByCanonicalOrder(ids);
    expect(sorted).toEqual(['guru-pooja', 'yogasanas', 'aum-chanting']);
  });
});

describe('calculateLogMinutes', () => {
  it('sums canonical durations for given practice IDs', () => {
    // guru-pooja (6) + isha-kriya (14) = 20
    expect(calculateLogMinutes(['guru-pooja', 'isha-kriya'])).toBe(20);
  });

  it('returns 0 for unknown IDs', () => {
    expect(calculateLogMinutes(['nonexistent'])).toBe(0);
  });
});
