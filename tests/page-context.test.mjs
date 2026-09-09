import test from 'node:test';
import assert from 'node:assert/strict';
import { pageContext, activeSectionIndex, documentProgress, collectionProgress } from '../src/elevation/page-context.js';

test('Home describes the practice without pretending it has scroll or reading progress', () => {
  const content = pageContext({ section: '/' });
  assert.equal(content.progress, false);
  assert.equal(content.count, 'Design practice');
  assert.doesNotMatch(content.hint, /scroll/i);
  assert.doesNotMatch(content.title, /independent|available|years/i);
});

test('collections and details share canonical names and counts but different reading cues', () => {
  for (const [section, name, total] of [['/projects', 'Obagi Care', 19], ['/articles', 'The Constraint Was the Brief', 11]]) {
    for (const detail of [true, false]) {
      const content = pageContext({ section, detail, name, index: 2, total });
      assert.equal(content.title, name);
      assert.equal(content.count, `03 / ${total}`);
      assert.equal(content.progress, true);
      assert.equal(content.hint, detail ? 'Scroll to continue' : 'Scroll to explore');
    }
  }
});

test('carousel progress advances within each item, reverses, and wraps by logical ordinal', () => {
  assert.equal(collectionProgress(0, 19, 380, 600, 380), 0);
  assert.equal(collectionProgress(2, 19, 80, 600, 380), 2.5 / 19);
  assert.ok(collectionProgress(2, 19, 180, 600, 380) < collectionProgress(2, 19, 80, 600, 380));
  assert.equal(collectionProgress(18, 19, -220, 600, 380), 1);
  assert.equal(collectionProgress(0, 19, 380, 600, 380), 0);
  assert.equal(collectionProgress(-1, 0, 0, 0, 380), 0);
});

test('History uses actual section labels and advances through nested sections', () => {
  assert.equal(activeSectionIndex([440, 800, 1200], 380), 0);
  assert.equal(activeSectionIndex([-300, 200, 360, 850], 380), 2);
  assert.equal(activeSectionIndex([-300, 390, 800], 380), 0);
  const content = pageContext({ section: '/history', name: 'Experience', index: 2, total: 9 });
  assert.equal(content.title, 'Experience');
  assert.equal(content.count, '03 / 09');
  assert.equal(content.progress, true);
  assert.equal(activeSectionIndex([-300, 620, 860], 380, true), 2);
  assert.equal(pageContext({section: '/history', name: 'Contact', index: 8, total: 9, atEnd: true}).hint, 'End of history');
});

test('History progress reflects document distance, including both endpoints and overscroll', () => {
  assert.equal(documentProgress(0, 3000, 1000), 0);
  assert.equal(documentProgress(1000, 3000, 1000), .5);
  assert.equal(documentProgress(2000, 3000, 1000), 1);
  assert.equal(documentProgress(-50, 3000, 1000), 0);
  assert.equal(documentProgress(2200, 3000, 1000), 1);
  assert.equal(documentProgress(0, 1000, 1000), 0);
});
