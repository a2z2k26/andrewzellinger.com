import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('shared page chrome contains no title lockup implementation or reserved styling', async () => {
  const entry = await readFile(new URL('../src/elevation/index.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/elevation/styles.css', import.meta.url), 'utf8');
  const counterflow = await readFile(new URL('../src/elevation/counterflow.js', import.meta.url), 'utf8');

  for (const source of [entry, styles, counterflow]) {
    assert.doesNotMatch(source, /edition-context/);
    assert.doesNotMatch(source, /edition-reading/);
  }
  assert.doesNotMatch(entry, /pageContext|readingContextLayout|collectionProgress|documentProgress/);
});
