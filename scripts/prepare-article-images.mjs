import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ARTICLE_IMAGES } from '../src/article-images.js';

const root = new URL('../', import.meta.url);
mkdirSync(new URL('public/images/articles/', root), { recursive: true });
let originalBytes = 0, servedBytes = 0;
for (const image of Object.values(ARTICLE_IMAGES)) {
  const original = fileURLToPath(new URL(`Article-Image/${image.source}`, root));
  const served = fileURLToPath(new URL(`public${image.src}`, root));
  execFileSync('cwebp', ['-quiet', '-q', '90', '-m', '6', original, '-o', served]);
  originalBytes += statSync(original).size;
  servedBytes += statSync(served).size;
}
console.log(JSON.stringify({ images: Object.keys(ARTICLE_IMAGES).length, originalBytes, servedBytes }));
