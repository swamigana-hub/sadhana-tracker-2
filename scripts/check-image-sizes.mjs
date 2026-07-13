import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ILLUSTRATIONS_DIR = join(process.cwd(), 'public', 'illustrations');
const WARN_BYTES = 100 * 1024;
const CRITICAL_BYTES = 200 * 1024;

function walkPngs(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkPngs(full));
    else if (entry.name.toLowerCase().endsWith('.png')) files.push(full);
  }
  return files;
}

const pngs = walkPngs(ILLUSTRATIONS_DIR);
let total = 0;
let warnCount = 0;
let criticalCount = 0;

console.log(`PNG files under public/illustrations: ${pngs.length}\n`);

for (const file of pngs.sort()) {
  const bytes = statSync(file).size;
  total += bytes;
  const rel = file.replace(process.cwd() + '\\', '').replace(process.cwd() + '/', '');
  const kb = (bytes / 1024).toFixed(1);
  let flag = '';
  if (bytes >= CRITICAL_BYTES) {
    criticalCount++;
    flag = '  CRITICAL (>200KB)';
  } else if (bytes >= WARN_BYTES) {
    warnCount++;
    flag = '  WARN (>100KB)';
  }
  console.log(`${kb.padStart(7)} KB  ${rel}${flag}`);
}

console.log(`\nTotal: ${(total / 1024 / 1024).toFixed(2)} MB`);
console.log(`Warn (>100KB): ${warnCount}, Critical (>200KB): ${criticalCount}`);
