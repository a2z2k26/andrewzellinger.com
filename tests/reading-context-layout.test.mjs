import test from 'node:test';
import assert from 'node:assert/strict';
import { readingContextLayout } from '../src/elevation/reading-context-layout.js';

test('the reading block has equal space to the title and clock', () => {
  const layout = readingContextLayout(546, 964, 78);
  assert.deepEqual(layout, { top: 703, ruleTop: 806 });
  assert.equal(layout.top - 546, 964 - (layout.ruleTop + 1));
});

test('centering adapts to short screens and wrapping project names', () => {
  for (const [titleBottom, clockTop, textHeight] of [[384,684,78], [546,964,102], [667,1164,126]]) {
    const { top, ruleTop } = readingContextLayout(titleBottom, clockTop, textHeight);
    assert.equal(top - titleBottom, clockTop - (ruleTop + 1));
    assert.equal(ruleTop - (top + textHeight), 25);
  }
});

test('the Home introduction centers without space for an absent progress rule', () => {
  for (const height of [78, 102, 126]) {
    const { top } = readingContextLayout(546, 964, height, false);
    assert.equal(top - 546, 964 - top - height);
  }
});
