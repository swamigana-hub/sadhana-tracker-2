import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

if (!existsSync('.git') || process.env.CI || process.env.VERCEL) {
  process.exit(0);
}

execSync(
  'git config core.hooksPath .githooks && git config user.email swami.gana@sadhguru.org && git config user.name "Swami Gana"',
  { stdio: 'inherit' }
);
