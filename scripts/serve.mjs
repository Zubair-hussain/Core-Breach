#!/usr/bin/env node
/**
 * Zero-dependency static server for local play and development.
 * ES modules don't load from file://, so open the game through this instead of double-clicking index.html.
 *
 *   npm start            -> http://localhost:8080
 *   PORT=3000 npm start  -> http://localhost:3000
 */
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../public', import.meta.url)));
const PORT = Number(process.env.PORT) || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  const file = normalize(join(ROOT, pathname));
  // Refuse anything that escapes the public folder, such as /../package.json
  if (!file.startsWith(ROOT)) return null;
  try {
    const stat = statSync(file);
    return stat.isDirectory() ? join(file, 'index.html') : file;
  } catch {
    return undefined;
  }
}

const server = createServer((req, res) => {
  const file = resolvePath(req.url);
  if (file === null) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  const target = file ?? join(ROOT, '404.html');
  res.writeHead(file ? 200 : 404, {
    'Content-Type': TYPES[extname(target)] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  createReadStream(target).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Core Breach running at http://localhost:${PORT}`);
});
