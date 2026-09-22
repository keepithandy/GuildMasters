import { readFile } from 'node:fs/promises';

const raw = await readFile('package.json', 'utf8');
let pkg;
try {
  pkg = JSON.parse(raw);
} catch (error) {
  console.error(`package.json is not valid JSON: ${error.message}`);
  process.exit(1);
}

const failures = [];
if (!pkg.name || typeof pkg.name !== 'string') failures.push('missing package name');
if (!pkg.version || typeof pkg.version !== 'string') failures.push('missing package version');
if (!pkg.scripts || typeof pkg.scripts !== 'object') failures.push('missing scripts object');

if (failures.length) {
  console.error(`package.json smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('smoke:package-json passed');
