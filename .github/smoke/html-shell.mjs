import { access, readFile } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');
const failures = [];

if (!/<!doctype html>/i.test(html)) failures.push('missing <!doctype html>');
if (!/<meta[^>]+name=["']viewport["']/i.test(html)) failures.push('missing viewport meta');
if (!/<script\b/i.test(html)) failures.push('missing script entry');

for (const match of html.matchAll(/(?:src|href)=["']([^"'#?]+)["']/gi)) {
  const target = match[1];
  if (/^(?:https?:|mailto:|tel:|data:)/i.test(target)) continue;
  try {
    await access(target.replace(/^\.\//, ''));
  } catch {
    failures.push(`missing local asset: ${target}`);
  }
}

if (failures.length) {
  console.error(`HTML shell smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('smoke:html-shell passed');
