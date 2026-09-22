import { readdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';

const ROOT = process.cwd();
const SKIP = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage']);
const SOURCE_EXTS = new Set(['.js', '.mjs', '.cjs', '.html', '.css']);
const failures = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }
    if (!SOURCE_EXTS.has(extname(entry.name).toLowerCase())) continue;
    if ((await stat(full)).size === 0) failures.push(full.slice(ROOT.length + 1));
  }
}

await walk(ROOT);
if (failures.length) {
  console.error(`Empty source files found: ${failures.join(', ')}`);
  process.exit(1);
}
console.log('smoke:no-empty-source-files passed');
