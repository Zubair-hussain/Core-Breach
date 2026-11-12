#!/usr/bin/env node
/**
 * Pre-deploy check. Fails the build when the site would ship a broken reference:
 *  - every local src/href in the HTML pages points at a real file
 *  - every ES module import resolves, starting from the module entry points
 *  - every file the service worker pre-caches exists
 * Netlify runs this as the build command, so a broken deploy never goes live.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../public', import.meta.url)));
const errors = [];
const toFile = (urlPath, from = ROOT) =>
  urlPath.startsWith('/') ? join(ROOT, urlPath) : resolve(from, urlPath);

function checkPage(page) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  const modules = [];
  for (const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(https?:|mailto:|#|data:)/.test(ref)) continue;
    const file = toFile(ref.split(/[?#]/)[0]);
    const target = ref.endsWith('/') ? join(file, 'index.html') : file;
    if (!existsSync(target)) errors.push(`${page}: missing ${ref}`);
  }
  for (const m of html.matchAll(/<script type="module" src="([^"]+)"/g)) {
    const file = toFile(m[1]);
    if (existsSync(file)) modules.push(file);
  }
  return modules;
}

function checkModules(entries) {
  const seen = new Set();
  const queue = [...entries];
  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    const source = readFileSync(file, 'utf8');
    for (const m of source.matchAll(/^\s*import\s+(?:[^'"]*?\s+from\s+)?['"](\.[^'"]+)['"]/gm)) {
      const target = resolve(dirname(file), m[1]);
      if (!existsSync(target)) errors.push(`${file.slice(ROOT.length)}: cannot resolve ${m[1]}`);
      else queue.push(target);
    }
  }
  return seen.size;
}

function checkServiceWorker() {
  const sw = readFileSync(join(ROOT, 'sw.js'), 'utf8');
  const list = sw.match(/const SHELL = \[([^\]]*)\]/);
  if (!list) return errors.push('sw.js: SHELL list not found');
  for (const m of list[1].matchAll(/'([^']+)'/g)) {
    const path = m[1] === '/' ? '/index.html' : m[1];
    if (!existsSync(join(ROOT, path))) errors.push(`sw.js: pre-caches missing ${m[1]}`);
  }
}

const entries = [...checkPage('index.html'), ...checkPage('404.html')];
const moduleCount = checkModules(entries);
checkServiceWorker();

if (errors.length) {
  console.error(`Asset check failed:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`Asset check passed: 2 pages, ${moduleCount} modules, service worker cache list.`);
