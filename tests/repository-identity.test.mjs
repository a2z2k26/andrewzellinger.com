import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import test from 'node:test';

test('package and lockfile use the canonical repository identity', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
  const lock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url)));
  assert.equal(pkg.name, 'andrewzellinger.com');
  assert.equal(lock.name, pkg.name);
  assert.equal(lock.packages[''].name, pkg.name);
  assert.equal(pkg.scripts.test, 'node --test tests/*.test.mjs');
});

test('all route shells use the neutral base stylesheet and canonical title', async () => {
  for (const file of ['index.html', 'articles/index.html', 'info/index.html', 'detail-shell.html']) {
    const html = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.ok(html.includes('/css/site-base.css'), file);
    assert.match(html, /<title>Andrew Zellinger/);
  }
  const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(home.includes('/js/site-vendor.js'));
  await access(new URL('../public/css/site-base.css', import.meta.url));
  await access(new URL('../public/js/site-vendor.js', import.meta.url));
});
