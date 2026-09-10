import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readingContextLayout } from '../src/elevation/reading-context-layout.js';

test('the reading block starts exactly 32px below the page title', () => {
  const layout = readingContextLayout(546, 78);
  assert.deepEqual(layout, { top: 578, ruleTop: 681 });
  assert.equal(layout.top - 546, 32);
});

test('wrapped context text grows downward without changing the title gap', () => {
  for (const [titleBottom, textHeight] of [[384,78], [546,102], [667,126]]) {
    const { top, ruleTop } = readingContextLayout(titleBottom, textHeight);
    assert.equal(top - titleBottom, 32);
    assert.equal(ruleTop - (top + textHeight), 25);
  }
});

test('context placement is independent of the progress rule and text height', () => {
  for (const height of [78, 102, 126]) {
    const { top } = readingContextLayout(546, height);
    assert.equal(top, 578);
  }
});

test('context follows the enlarged desktop title offset 32px above center', () => {
  for (const viewportHeight of [640, 900, 1200]) {
    const titleBottom = viewportHeight * .5 - 32 + 116 * .98 / 2;
    for (const contextHeight of [60, 88, 116]) {
      const { top, ruleTop } = readingContextLayout(titleBottom, contextHeight);
      assert.ok(Math.abs(top - titleBottom - 32) < .001);
      assert.ok(ruleTop + 1.5 < viewportHeight - 36);
    }
  }
});

test('context uses shared 12px labels, 20px names, and a subtly heavier progress rule', async () => {
  const styles = await readFile(new URL('../src/elevation/styles.css', import.meta.url), 'utf8');
  assert.match(styles, /--edition-context-label-size:\s*12px/);
  assert.match(styles, /--edition-context-title-size:\s*20px/);
  assert.match(styles, /--edition-reading-thickness:\s*1\.5px/);
  assert.match(styles, /\.edition-context__count\s*\{[^}]*font-size:\s*var\(--edition-context-label-size\);[^}]*line-height:\s*1\.5;[^}]*font-weight:\s*400;/);
  assert.doesNotMatch(styles, /\.edition-context__hint/);
  assert.match(styles, /\.edition-context__title\s*\{[^}]*font-size:\s*var\(--edition-context-title-size\);[^}]*font-weight:\s*500;[^}]*line-height:\s*1\.4;/);
  assert.match(styles, /\.edition-reading\s*\{[^}]*width:\s*96px;[^}]*height:\s*var\(--edition-reading-thickness\)/);
  assert.match(styles, /\.edition-reading__fill\s*\{[^}]*height:\s*100%;[^}]*transform:\s*scaleX\(var\(--edition-reading\)\)/);
});
