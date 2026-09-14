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
  { path: '/articles', name: 'Articles', track: '.articles-motion-track', item: '.articles-entry-list > li', count: ARTICLE_DETAILS.length },
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
  for (const width of [390, 1440]) {
    await check(`First title entrance waits for the introduction at ${width}px`, async page => {
      await page.goto(base + '/', { waitUntil: 'load' });
      await page.getByRole('button', { name: 'Close portfolio introduction' }).waitFor();
      await page.waitForTimeout(600);
      assert.ok(await page.locator('.page-title-char').evaluateAll(chars => chars.every(char => getComputedStyle(char).transform === 'none')));
      await page.getByRole('button', { name: 'Close portfolio introduction' }).click();
      await page.waitForFunction(() => !document.documentElement.hasAttribute('data-welcome-preface')
        && [...document.querySelectorAll('.page-title-char')].some(char => /matrix/.test(getComputedStyle(char).transform)));
      await page.waitForTimeout(600);
      assert.ok(await page.locator('.page-title-char').evaluateAll(chars => chars.every(char => {
        const matrix = new DOMMatrix(getComputedStyle(char).transform);
        return Math.abs(matrix.m42) < .1;
      })));
    }, { viewport: { width, height: 1000 } });
  }
  await check('Introduction returns on every Projects arrival', async page => {
    await page.goto(base + '/', { waitUntil: 'load' });
    const close = page.getByRole('button', { name: 'Close portfolio introduction' });
    await close.waitFor();
    await close.click();
    await page.waitForFunction(() => !document.documentElement.hasAttribute('data-welcome-preface'));

    await page.goto(base + '/articles', { waitUntil: 'load' });
    assert.equal(await page.getByRole('button', { name: 'Close portfolio introduction' }).count(), 0);

    await page.goto(base + '/', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Close portfolio introduction' }).waitFor();
  });
  for (const width of [390, 820, 1440]) {
    await check(`Title characters animate in the painted route snapshots at ${width}px`, async page => {
      await page.addInitScript(() => {
        window.__titleFrames = [];
        addEventListener('pagereveal', event => {
          if (!event.viewTransition) return;
          event.viewTransition.ready.then(() => {
            const start = performance.now();
            const sample = () => {
              const glyphs = document.getAnimations().filter(animation => /^cf-letter-(exit|enter)$/.test(animation.animationName));
              window.__titleFrames.push(glyphs.map(animation => ({ name: animation.animationName, time: animation.currentTime })));
              if (performance.now() - start < 1000) requestAnimationFrame(sample);
            };
            requestAnimationFrame(sample);
          }).catch(() => {});
        });
      });
      await visit(page, '/');
      if (width < 600) await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
      await page.locator('.masthead-link').filter({ hasText: 'Articles' }).click();
      await page.waitForURL(base + '/articles');
      await page.waitForTimeout(1100);
      const frames = await page.evaluate(() => window.__titleFrames);
      for (const name of ['cf-letter-exit', 'cf-letter-enter']) {
        assert.ok(frames.some(frame => frame.filter(glyph => glyph.name === name && glyph.time > 0 && glyph.time < 1000).length > 1), `${name} actually advances through intermediate frames`);
        assert.ok(frames.some(frame => new Set(frame.filter(glyph => glyph.name === name).map(glyph => Math.round(glyph.time))).size > 2), `${name} staggers individual characters`);
      }
      assert.equal(await page.locator('.title .heading').getAttribute('aria-label'), 'Articles');
      assert.equal(await page.locator('[style*="view-transition-name"]').count(), 0, 'Glyph snapshots clean up');
    }, { viewport: { width, height: 1000 } });
  }
  await check('Motion profile preserves the 600px and 992px boundaries', async page => {
    for (const width of [599, 600, 991, 992]) {
      await page.setViewportSize({ width, height: 1000 });
      await visit(page, '/articles');
      if (width < 600) await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
      await page.locator('.masthead-link').filter({ hasText: 'History' }).click();
      await page.waitForURL(base + '/history');
      await page.waitForTimeout(1100);
      assert.equal(await page.evaluate(() => document.documentElement.dataset.transitionVerified), width < 600 ? 'phone-fade-through' : 'rail-sweep-up');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    }
  });
  for (const width of [320, 390, 430]) {
    await check(`Phone ${width} coordinated page and reading motion`, async page => {
      await visit(page, '/');
      await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
      await page.locator('.masthead-link').filter({ hasText: 'Articles' }).click();
      await page.waitForURL(base + '/articles');
      await page.waitForTimeout(900);
      assert.equal(await page.evaluate(() => document.documentElement.dataset.transitionVerified), 'phone-fade-through');
      assert.equal(await page.locator('.site-navigation__menu-toggle').getAttribute('aria-expanded'), 'false');
      assert.equal(await page.evaluate(() => document.documentElement.hasAttribute('data-phone-route')), false, 'Snapshots release their state');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.locator('[data-portfolio-detail-link]').first().click();
      await page.locator('.detail-view').waitFor();
      await page.waitForTimeout(650);
      assert.equal(await page.locator('.detail-unit').count(), 1);
      const settled = await page.locator('.detail-view').evaluate(view => ({
        opacity: getComputedStyle(view).opacity, transform: getComputedStyle(view).transform,
        hiddenText: [...view.querySelectorAll('p,h1,h3')].filter(node => getComputedStyle(node).visibility === 'hidden').length,
      }));
      assert.deepEqual(settled, { opacity: '1', transform: 'none', hiddenText: 0 }, 'Phone text and reading surface settle together');
      await page.locator('[data-site-detail-back]').click();
      await page.waitForURL(base + '/articles');
      await page.waitForTimeout(350);
      assert.equal(await page.locator('.detail-view').count(), 0);
      assert.equal(await page.locator('.articles-index').evaluate(node => node.style.opacity), '');
      await page.screenshot({ path: `${artifacts}/phone-${width}-motion-return.png` });
    }, { viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
  }
  await check('Phone motion preference change cancels entry cleanly', async page => {
    await visit(page, '/articles');
    await page.locator('[data-portfolio-detail-link]').first().click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(400);
    assert.equal(await page.locator('.detail-unit').count(), 1);
    assert.equal(await page.locator('.detail-view').evaluate(el => getComputedStyle(el).transform), 'none');
    assert.equal(await page.locator('.detail-view').evaluate(el => getComputedStyle(el).opacity), '1');
    await page.locator('[data-site-detail-back]').click();
    await page.waitForURL(base + '/articles');
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.detail-view').count(), 0);
  }, { viewport: { width: 390, height: 844 } });
  await check('Phone reduced-motion navigation remains immediate', async page => {
    await visit(page, '/');
    await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
    await page.locator('.masthead-link').filter({ hasText: 'History' }).click();
    await page.waitForURL(base + '/history');
    assert.equal(await page.evaluate(() => document.documentElement.hasAttribute('data-phone-route')), false);
    assert.equal(await page.locator('.biography-introduction').evaluate(node => getComputedStyle(node).visibility), 'visible');
  }, { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
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
        assert.equal(await page.locator(width < 600 ? '.site-navigation__menu-toggle' : '.masthead-links').isVisible(), true);
      }
    }, { viewport: { width, height: 900 }, isMobile: true, hasTouch: true });
  }
  for (const width of [320, 390]) {
    for (const route of routes.slice(0, 2)) {
      await check(`Phone ${width} isolated ${route.name} reading and return`, async page => {
        await visit(page, route.path);
        const card = page.locator('[data-portfolio-detail-link]').nth(2);
        await card.scrollIntoViewIfNeeded();
        const path = await card.getAttribute('href');
        const slug = await card.getAttribute('data-detail-slug');
        const savedScroll = await page.evaluate(() => scrollY);
        await card.click();
        await page.waitForTimeout(600);
        assert.equal(await page.locator('.detail-unit').count(), 1, 'Only the selected story is mounted');
        assert.equal(await page.locator('.detail-unit').getAttribute('data-detail-slug'), slug);
        assert.equal(await page.locator('.detail-view h1').count(), 1, 'Selected piece owns the reading heading');
        assert.equal(await page.evaluate(() => document.documentElement.dataset.detailMode), 'isolated');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        const entryTop = (await page.locator('.detail-view').boundingBox()).y;
        await page.mouse.wheel(0, -1000);
        await page.waitForTimeout(150);
        const upperBoundaryTop = (await page.locator('.detail-view').boundingBox()).y;
        assert.ok(
          Math.abs(upperBoundaryTop - entryTop) < 2,
          `Phone detail cannot scroll above its entry boundary: ${entryTop} -> ${upperBoundaryTop}`,
        );
        await page.screenshot({ path: `${artifacts}/phone-${width}-${route.name}-detail.png` });
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(800);
        assert.equal(new URL(page.url()).pathname, path, 'Reading to the end never advances to a different story');
        const lastBlock = page.locator('.detail-unit p, .detail-unit li').last();
        const lastBounds = await lastBlock.boundingBox();
        const closeBounds = await page.locator('[data-site-detail-back]').boundingBox();
        assert.ok(lastBounds.y + lastBounds.height < closeBounds.y, 'Final content clears the fixed Close bar');
        assert.ok(closeBounds.y - (lastBounds.y + lastBounds.height) < 160, 'Phone detail does not retain collection-height blank space');
        await page.locator('[data-site-detail-back]').click();
        await page.waitForTimeout(500);
        assert.equal(new URL(page.url()).pathname, route.path);
        assert.ok(Math.abs(await page.evaluate(() => scrollY) - savedScroll) < 2, 'Close restores the collection position');
        await page.goForward();
        await page.waitForTimeout(500);
        assert.equal(await page.locator('.detail-unit').count(), 1, 'Browser Forward reopens only that story');
        await page.goBack();
        await page.waitForTimeout(500);
        assert.ok(Math.abs(await page.evaluate(() => scrollY) - savedScroll) < 2, 'Browser Back restores position');
        await visit(page, path);
        assert.equal(await page.locator('.detail-unit').count(), 1, 'Direct URLs also isolate content');
        await page.reload();
        await page.waitForTimeout(500);
        assert.equal(await page.locator('.detail-unit').count(), 1, 'Reload retains isolated content');
        await page.setViewportSize({ width: 820, height: 900 });
        await page.waitForTimeout(700);
        assert.equal(await page.locator('.detail-unit').count(), route.name === 'Projects' ? CASE_STUDIES.length : ARTICLE_DETAILS.length, 'Tablet retains its full static document');
        await page.setViewportSize({ width, height: 760 });
        await page.waitForTimeout(700);
        assert.equal(await page.locator('.detail-unit').count(), 1, 'Returning to phone isolates the same item');
        assert.equal(await page.locator('.detail-unit').getAttribute('data-detail-slug'), slug);
        await page.locator('[data-site-detail-back]').click();
        await page.waitForURL(base + route.path);
      }, { viewport: { width, height: 760 }, isMobile: true, hasTouch: true });
    }
  }
  await check('Phone immediate Back cancels detail entry', async page => {
    await visit(page, '/articles');
    const link = page.locator('[data-portfolio-detail-link]').nth(3);
    await link.scrollIntoViewIfNeeded();
    const savedScroll = await page.evaluate(() => scrollY);
    await link.evaluate(el => { el.click(); history.back(); });
    await page.waitForTimeout(600);
    assert.equal(new URL(page.url()).pathname, '/articles');
    assert.equal(await page.locator('.detail-view').count(), 0);
    assert.equal(await page.locator('.articles-index').isVisible(), true);
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - savedScroll) < 2);
  }, { viewport: { width: 390, height: 844 } });
  await check('Phone reduced-motion isolated reading', async page => {
    await visit(page, ARTICLE_DETAILS[2].path);
    assert.equal(await page.locator('.detail-unit').count(), 1);
    assert.equal(await page.locator('.detail-view').evaluate(el => getComputedStyle(el).transform), 'none');
    await page.keyboard.press('Escape');
    await page.waitForURL(base + '/articles');
  }, { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
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
