import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { HOME_PORTRAIT_MARKS, portraitArtworkFor, portraitArtworkSize } from '../src/elevation/portrait-artwork-model.js';

test('fixed artwork is limited to Home and History', () => {
  assert.equal(portraitArtworkFor('/').kind, 'home');
  assert.equal(portraitArtworkFor('/history/').kind, 'history');
  for (const path of ['/projects', '/articles', '/case-studies/audible-sleep/', '/articles/example/']) assert.equal(portraitArtworkFor(path), null);
});

test('Home keeps ten screenshot positions with authored size variation and no random layout', () => {
  assert.equal(HOME_PORTRAIT_MARKS.length, 10);
  assert.deepEqual(HOME_PORTRAIT_MARKS.map(({x, y}) => [x, y]), [
    [.316, .13], [.5, .13], [.132, .294], [.5, .294], [.868, .294],
    [.316, .458], [.316, .622], [.132, .786], [.316, .786], [.868, .786],
  ]);
  assert.ok(HOME_PORTRAIT_MARKS.some(m => m.scale < 1));
  assert.ok(HOME_PORTRAIT_MARKS.some(m => m.scale > 1));
});

test('History preserves the exact Monument sizing formula and Home scales proportionally', () => {
  assert.equal(portraitArtworkSize('history', 688, 458.664), Math.min(688 * 1.65, 458.664 * 1.22));
  for (const kind of ['home', 'history']) {
    assert.equal(portraitArtworkSize(kind, 344, 476) * 2, portraitArtworkSize(kind, 688, 952));
  }
});

test('Home keeps separated glyph boxes across wide, tall and compact image frames', () => {
  for (const [width, height] of [[832, 858], [688, 952], [720, 900], [342, 427.5], [960, 440]]) {
    const base = portraitArtworkSize('home', width, height);
    // Geist A advance is below .75em; .85em is the actual authored line box.
    const boxes = HOME_PORTRAIT_MARKS.map(m => ({ x: m.x * width, y: m.y * height,
      width: base * m.scale * .75, height: base * m.scale * .85 }));
    boxes.forEach((a, i) => boxes.slice(i + 1).forEach(b => {
      assert.ok(Math.abs(a.x - b.x) >= (a.width + b.width) / 2 || Math.abs(a.y - b.y) >= (a.height + b.height) / 2);
    }));
  }
});

test('preserved static artwork stays disabled during the photo-only navigation trial', async () => {
  const [entry, source, css] = await Promise.all(['index.js', 'portrait-artwork.js', 'portrait-artwork.css']
    .map(file => readFile(new URL(`../src/elevation/${file}`, import.meta.url), 'utf8')));
  assert.match(entry, /import '\.\/portrait-artwork\.js'/);
  assert.match(source, /export const PORTRAIT_ARTWORK_ENABLED = false/);
  assert.match(source, /function mountPortraitArtwork\(\)\s*\{\s*if \(!PORTRAIT_ARTWORK_ENABLED\) return;/);
  assert.doesNotMatch(entry, /import '\.\/portrait-study\.js'/);
  assert.doesNotMatch(source, /from 'gsap'|Math\.random|setInterval|\.animate\(/);
  assert.doesNotMatch(source, /createElement\('(button|select|input)'\)|backgroundImage\s*=|\.src\s*=/);
  assert.match(source, /setAttribute\('aria-hidden', 'true'\)/);
  assert.match(source, /resize.disconnect\(\); layer.remove\(\)/);
  assert.match(source, /portrait-study-stage--history/);
  assert.match(css, /Geist-SemiBold\.woff2/);
  assert.match(css, /font-weight: 600/);
  assert.match(css, /mix-blend-mode: overlay/);
  assert.match(css, /overflow: clip !important/);
  assert.match(css, /pointer-events: none/);
  assert.doesNotMatch(css, /animation:|transition:/);
});
