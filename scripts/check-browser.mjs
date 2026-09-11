import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import { CASE_STUDIES, ARTICLE_DETAILS } from '../src/detail-content.js';

// Exercise the actual bundled HTML, not Vite's development module graph.
const root = resolve('dist/client');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    let path = resolve(root, `.${decodeURIComponent(new URL(req.url, 'http://localhost').pathname)}`);
    if (!path.startsWith(root + '/') && path !== root) throw new Error('Invalid path');
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    res.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream');
    res.end(await readFile(path));
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = process.env.BROWSER_BASE_URL || `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}), headless: true });
const artifacts = process.env.BROWSER_ARTIFACTS || '/tmp/portfolio-browser-check';
await mkdir(artifacts, { recursive: true });
let failures = 0;
const routes = [
  { path: '/', name: 'Projects', track: '.works-motion-track', item: '.works-motion-card', count: 19 },
  { path: '/articles', name: 'Articles', track: '.articles-motion-track', item: '.articles-entry-list > li', count: 11 },
  { path: '/history', name: 'History', track: '.history-motion-track', item: '.biography-sweep-content', count: 1 },
];
async function check(name, run, options = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, ...options });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  try {
    await run(page);
    assert.deepEqual(errors, [], 'No runtime or asset errors');
    console.log(`PASS ${name}`);
  } catch (e) {
    failures++;
    console.error(`FAIL ${name}: ${e.message}`);
    await page.screenshot({ path: `${artifacts}/${name.replaceAll(/[^a-z0-9]+/gi, '-')}.png` });
  } finally { await page.close(); }
}
async function visit(page, path) {
  await page.goto(base + path, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const welcomeClose = page.getByRole('button', { name: 'Close portfolio introduction' });
  if (await welcomeClose.count()) {
    await welcomeClose.click();
    await page.waitForTimeout(350);
  }
}
async function assertMoving(page, track) {
  await page.mouse.move(100, 100);
  await page.waitForTimeout(120);
  const element = page.locator(track);
  await element.waitFor({ timeout: 3000 });
  const before = (await element.boundingBox()).y;
  await page.waitForTimeout(600);
  const after = (await element.boundingBox()).y;
  assert.ok(after < before - 15, `Upward autoplay: ${before} -> ${after}`);
}
async function clickVisibleCard(page) {
  const target = await page.locator('[data-portfolio-detail-link]').evaluateAll(nodes => {
    for (const n of nodes) {
      if (n.closest('[inert], [hidden]')) continue;
      const r = n.getBoundingClientRect();
      const top = Math.max(30, r.top), bottom = Math.min(innerHeight - 30, r.bottom);
      if (bottom - top > 80 && r.right > 0 && r.left < innerWidth)
        return { href: n.getAttribute('href'), x: r.left + Math.min(100, r.width / 2), y: top + 40 };
    }
  });
  assert.ok(target, 'A collection card is visible in the rail');
  await page.mouse.click(target.x, target.y);
  return target.href;
}
try {
  for (const route of routes) {
    await check(`${route.name} desktop autoplay and reverse`, async page => {
      await visit(page, route.path);
      await assertMoving(page, route.track);
      assert.equal(await page.locator(route.item).evaluateAll(nodes => nodes.filter(n => !n.closest('[aria-hidden="true"]')).length), route.count);
      await page.mouse.move(1150, 400);
      const before = (await page.locator(route.track).boundingBox()).y;
      await page.mouse.wheel(0, 180);
      await page.waitForTimeout(100);
      const after = (await page.locator(route.track).boundingBox()).y;
      await page.waitForTimeout(200);
      const settled = (await page.locator(route.track).boundingBox()).y;
      const distance = await page.locator(route.track).evaluate(n => n.children[1].offsetTop - n.children[0].offsetTop);
      const delta = after - before;
      const unwrapped = delta < -distance / 2 ? delta + distance : delta;
      assert.ok(unwrapped > 0, `Reverse input: ${before} -> ${after}`);
      assert.ok(Math.abs(settled - after) < 1, `Hovered carousel coasts after wheel input: ${after} -> ${settled}`);
    });
  }
  for (const route of routes.slice(0, 2)) {
    await check(`${route.name} detail entry close and browser back`, async page => {
      await visit(page, route.path);
      const target = await clickVisibleCard(page);
      await page.waitForURL(base + target);
      await page.locator('.detail-view').waitFor();
      await page.waitForTimeout(1800);
      assert.equal(await page.locator('.masthead-links').isVisible(), true);
      await page.mouse.move(1100, 700);
      const oldScroll = await page.evaluate(() => scrollY);
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(300);
      assert.notEqual(await page.evaluate(() => scrollY), oldScroll, 'Detail supports native scrolling');
      await page.locator('[data-site-detail-back]').click();
      await page.waitForURL(base + route.path);
      await page.waitForTimeout(2200);
      await assertMoving(page, route.track);
      await clickVisibleCard(page);
      await page.waitForTimeout(2000);
      await page.goBack();
      await page.waitForTimeout(2200);
      await assertMoving(page, route.track);
    });
  }
  await check('Desktop masthead route cycle', async page => {
    await visit(page, '/');
    for (const route of [routes[1], routes[2], routes[0]]) {
      await page.locator('.masthead-link').filter({ hasText: route.name }).click();
      await page.waitForURL(base + route.path);
      await page.waitForTimeout(1800);
      assert.equal((await page.locator('h1').textContent()).trim(), route.name);
      assert.equal(await page.evaluate(() => document.documentElement.dataset.transitionVerified), 'rail-sweep-up', 'Native rail/title transition actually ran');
      await assertMoving(page, route.track);
    }
  });
  for (const width of [390, 820]) {
    await check(`Compact ${width} navigation and detail close`, async page => {
      for (const route of routes) {
        await visit(page, route.path);
        assert.equal(await page.locator(route.track).count(), 0, 'Compact stays native');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No horizontal overflow');
        if (route.name === 'History') continue;
        await page.locator('[data-portfolio-detail-link]').first().click();
        await page.waitForTimeout(1200);
        assert.equal(await page.locator('.detail-view').isVisible(), true);
        await page.locator('[data-site-detail-back]').click();
        await page.waitForURL(base + route.path);
        assert.equal(await page.locator('.masthead-links').isVisible(), true);
      }
    }, { viewport: { width, height: 900 }, isMobile: true, hasTouch: true });
  }
  await check('Reduced motion collections', async page => {
    for (const route of routes) {
      await visit(page, route.path);
      assert.equal(await page.locator(route.track).count(), 0);
      assert.equal(await page.locator(route.item).count(), route.count, 'Native content is present');
    }
  }, { reducedMotion: 'reduce' });
  for (const entry of [...CASE_STUDIES, ...ARTICLE_DETAILS]) {
    await check(`Direct ${entry.slug}`, async page => {
      await visit(page, entry.path);
      assert.equal(await page.locator('[data-detail-set="source"] .detail-unit').count(), entry.kind === 'project' ? CASE_STUDIES.length : ARTICLE_DETAILS.length);
      assert.equal(await page.locator('[data-site-detail-back]').isVisible(), true);
      assert.ok(await page.locator(`[data-detail-set="source"] [data-detail-slug="${entry.slug}"]`).count());
    });
  }
} finally {
  await browser.close();
  await new Promise(r => server.close(r));
}
process.exitCode = failures ? 1 : 0;
