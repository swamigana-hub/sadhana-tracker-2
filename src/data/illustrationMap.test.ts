import {
  getIllustrationPath,
  hasIllustration,
  PRACTICE_ILLUSTRATION_FILES,
} from './illustrationMap';
import { PRACTICES } from './practices';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ILLUSTRATIONS_DIR = join(process.cwd(), 'public', 'illustrations');

describe('illustrationMap', () => {
  it('resolves mapped illustration path from practice ID', () => {
    expect(getIllustrationPath('thoppukarnam')).toBe('/illustrations/thoppu-karnam.png');
    expect(getIllustrationPath('shiva-namaskar')).toBe('/illustrations/shiva-namaskara.png');
    expect(getIllustrationPath('chit-shakti-health')).toBe('/illustrations/cs-for-health.png');
    expect(getIllustrationPath('guru-pooja')).toBe('/illustrations/guru-pooja.png');
    expect(getIllustrationPath('living-soil-meditation')).toBe(
      '/illustrations/livting-soil-meditation.png'
    );
    expect(getIllustrationPath('inner-engineering-crash-course')).toBe(
      '/illustrations/inner-engineering-crash-course.png'
    );
  });

  it('falls back to practice ID filename when unmapped', () => {
    expect(getIllustrationPath('unknown-practice')).toBe('/illustrations/unknown-practice.png');
  });

  it('maps every practice to an illustration', () => {
    for (const practice of PRACTICES) {
      expect(hasIllustration(practice.id), practice.id).toBe(true);
    }
  });

  it('has a PNG on disk for every mapped illustration', () => {
    const filenames = new Set(Object.values(PRACTICE_ILLUSTRATION_FILES));
    for (const filename of filenames) {
      expect(existsSync(join(ILLUSTRATIONS_DIR, filename)), `missing ${filename}`).toBe(
        true
      );
    }
  });
});
