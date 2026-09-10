import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('History shares the collection engine and its native/reduced-motion boundaries', async () => {
  const source = await read('src/site-motion.js');
  assert.match(source, /const HISTORY_PATH = "\/history"/);
  assert.match(source, /if \(isHistory\) mountPortraitArtwork\(\);/);
  assert.match(source, /dataset: "historyMotion",\s*expectedCount: 1,[\s\S]*?namespace: "history",\s*refreshClonesOnResize: true/);
  assert.match(source, /createContentLoop\(logicalItems, \{\s*\.\.\.routeLoop/);
  assert.match(source, /desktopMotion: "\(min-width: 992px\) and \(prefers-reduced-motion: no-preference\)"/);
  assert.match(source, /if \(isHistory\) document\.documentElement\.style\.removeProperty\('--history-loop-height'\)/);
  assert.match(source, /delete document\.documentElement\.dataset\.historyMotion/);
});

test('History loop captures its existing clipped viewport without native scroll compensation', async () => {
  const css = await read('src/biography.css');
  const source = await read('src/elevation/counterflow.js');
  assert.match(css, /html\[data-history-motion="running"\] \.biography-sweep-viewport\s*\{\s*position: fixed/);
  assert.match(css, /\.history-motion-track \{\s*row-gap: 64px;\s*will-change: transform/);
  assert.ok(source.includes("if(viewport?.querySelector('.history-motion-track')) return viewport;"));
});

test('History clones refresh after source resizing and are excluded from section counts', async () => {
  const source = await read('src/site-motion.js');
  const context = await read('src/elevation/index.js');
  assert.match(source, /if \(refreshClonesOnResize\) \{\s*prepareCloneSet\(cloneSetBefore, "before"\);\s*prepareCloneSet\(cloneSetAfter, "after"\);/);
  assert.match(source, /sizeObserver\?\.observe\(sourceSet\)/);
  assert.match(source, /sizeObserver\?\.disconnect\(\)/);
  assert.match(context, /historySections =[\s\S]*?filter\(node => !node\.closest\('\[aria-hidden="true"\]'\)\)/);
});

test('keyboard contact focus is absorbed into the loop without a second scroll offset', async () => {
  const source = await read('src/site-motion.js');
  const start = source.indexOf('  const onReadingViewportScroll =');
  const code = source.slice(start, source.indexOf("  field.addEventListener('scroll'", start));
  const field = { scrollTop: 4200 };
  const track = { y: -300 };
  let restarts = 0;
  const events = [];
  const context = vm.createContext({
    field, track, forwardCloneLinks: true, destroyed: false, distance: 5000,
    gsap: { getProperty: n => n.y, set: (n, values) => Object.assign(n, values) },
    startSegment: () => restarts++, CustomEvent,
    window: { dispatchEvent: event => events.push(event.type) },
  });
  vm.runInContext(`${code}\nonReadingViewportScroll();`, context);
  assert.equal(field.scrollTop, 0);
  assert.equal(track.y, -4500);
  assert.equal(restarts, 1);
  assert.deepEqual(events, ['portfolio:loop-progress']);
  vm.runInContext('onReadingViewportScroll();', context);
  assert.equal(restarts, 1, 'the reset scroll event cannot cause a rebuild loop');
  context.destroyed = true;
  field.scrollTop = 100;
  vm.runInContext('onReadingViewportScroll();', context);
  assert.equal(restarts, 1, 'teardown blocks pending scroll work');
});
