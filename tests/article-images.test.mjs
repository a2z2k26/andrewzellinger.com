import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { ARTICLE_IMAGES } from '../src/article-images.js';
import { ARTICLE_DETAILS } from '../src/article-content.js';

const root = new URL('../', import.meta.url);

test('eleven distinct artworks are assigned, leaving one spare and one duplicate original', async () => {
  const originals = (await readdir(new URL('assets/source/articles/', root))).filter(name => name.endsWith('.png'));
  const used = Object.values(ARTICLE_IMAGES).map(image => image.source);
  assert.equal(originals.length, 13);
  assert.equal(new Set(used).size, 11);
  assert.deepEqual(Object.keys(ARTICLE_IMAGES).sort(), ARTICLE_DETAILS.map(article => article.slug).sort());
  assert.deepEqual(originals.filter(name => !used.includes(name)).sort(), [
    'mixed-material-outtakes__company-of-one__option-4.png',
    'two-dollar-bill__option-2.png',
  ]);
  const hashes = new Map(await Promise.all(originals.map(async name => [
    name, createHash('sha256').update(await readFile(new URL(`assets/source/articles/${name}`, root))).digest('hex'),
  ])));
  assert.equal(new Set(hashes.values()).size, 12);
  assert.equal(new Set(used.map(name => hashes.get(name))).size, 11, 'unique filenames must not hide duplicate artwork');
  assert.equal(hashes.get('mixed-material-outtakes__company-of-one__option-4.png'), hashes.get('material-sculpture-set__reference-company-of-one.png'));
  assert.ok(!used.some(name => hashes.get(name) === hashes.get('two-dollar-bill__option-2.png')));
  const readme = await readFile(new URL('assets/source/articles/README.md', root), 'utf8');
  assert.match(readme, /11 assigned, 1 available/);
  for (const name of originals) assert.ok(readme.includes(name));
  for (const article of ARTICLE_DETAILS) {
    const image = ARTICLE_IMAGES[article.slug];
    assert.ok(originals.includes(image.source));
    assert.equal(article.media.src, image.src);
    assert.equal(article.media.decorative, true);
    const bytes = await readFile(new URL(`public${image.src}`, root));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    assert.ok(bytes.length < 600_000, `${article.slug} should be a web-sized derivative`);
    assert.ok(readme.includes(article.title));
  }
});

test('article artwork stays archived while public article surfaces render text only', async () => {
  const html = await readFile(new URL('articles/index.html', root), 'utf8');
  const index = await readFile(new URL('src/articles-index.js', root), 'utf8');
  const detail = await readFile(new URL('src/detail-state.js', root), 'utf8');
  const transitions = await readFile(new URL('src/elevation/counterflow.js', root), 'utf8');
  const articleUnitMarkup = detail.slice(
    detail.indexOf('const body = articleBodyMarkup(entry);'),
    detail.indexOf('function setMarkup'),
  );

  assert.doesNotMatch(html, /articles-entry__thumbnail|\/images\/articles\//);
  assert.doesNotMatch(index, /articles-entry__thumbnail|entry\.media\.src/);
  assert.doesNotMatch(articleUnitMarkup, /mediaMarkup\(entry\)|entry\.media\.src|detail-unit__media/);
  assert.doesNotMatch(transitions, /ARTICLE_DETAILS/);
  assert.match(transitions, /if\(path==='\/articles'\) return \[\];/);
  for (const article of ARTICLE_DETAILS) assert.ok(ARTICLE_IMAGES[article.slug], article.slug);
});
