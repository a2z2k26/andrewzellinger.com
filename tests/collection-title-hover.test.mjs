import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('project and article collection titles do not dim or animate color on hover', async () => {
  const styles = await readFile(new URL('../src/elevation/styles.css', import.meta.url), 'utf8');
  assert.doesNotMatch(styles, /\.portfolio-detail-link:hover\s+\.heading-style-h2\.new\s*\{/);
  assert.doesNotMatch(styles, /\.works-detail-link:hover/);
  assert.match(styles, /\.articles-entry-link:hover/);
  assert.doesNotMatch(styles, /\.articles-entry__title\s*\{[^}]*transition:\s*color/);
  assert.doesNotMatch(styles, /\.works-motion-card\s+\.heading-style-h2\.new\s*\{[^}]*transition:\s*color/);
  assert.match(styles, /--edition-focus:\s*#9c9c9c/);
  assert.match(styles, /a:focus-visible,[\s\S]*?outline:\s*2px solid var\(--edition-focus\)/);
});
