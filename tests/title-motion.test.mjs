import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { gsap } from 'gsap';
import { pageTitleForPath, titleCascadeTiming, titleSnapshotIndex } from '../src/elevation/title-motion-model.js';

test('the complete outgoing cascade clears before incoming letters start', () => {
  for (const width of [390, 768, 992, 1440, 1920]) {
    for (const count of [1, 7, 8, 32]) {
      const { exit, enter, incomingStart, total } = titleCascadeTiming(width, count, count);
      assert.ok(incomingStart > exit.duration + exit.amount);
      assert.ok(total < 1, 'the title fits the existing roughly one-second rail handoff');
      assert.ok(exit.amount >= 0 && enter.amount >= 0);
      assert.doesNotMatch(exit.ease + enter.ease, /back|bounce|elastic/);
    }
  }
});

test('snapshot names distinguish old/new letters and sort numeric positions', () => {
  assert.deepEqual(titleSnapshotIndex('::view-transition-old(cf-letter-out-10)'), { phase: 'exit', index: 10 });
  assert.deepEqual(titleSnapshotIndex('::view-transition-new(cf-letter-in-3)'), { phase: 'enter', index: 3 });
  assert.equal(titleSnapshotIndex('::view-transition-old(counterflow-media)'), null);
  assert.equal(titleSnapshotIndex(null), null);
});

const source = await readFile(new URL('../src/elevation/title-motion.js', import.meta.url), 'utf8');
function snapshotRuntime() {
  const snapshots = [];
  for (const [pseudo, slot, animationName] of [['old', 'out', 'cf-letter-exit'], ['new', 'in', 'cf-letter-enter']]) {
    for (let index = 7; index >= 0; index--) snapshots.push({
      animationName, effect: { pseudoElement: `::view-transition-${pseudo}(cf-letter-${slot}-${index})` },
      currentTime: 0, paused: false, finished: false, cancelled: false,
      pause() { this.paused = true; }, finish() { this.finished = true; }, cancel() { this.cancelled = true; },
    });
  }
  const rail = { animationName: 'cf-media-in', effect: { pseudoElement: '::view-transition-new(counterflow-media)' }, currentTime: 100 };
  let timeline;
  const context = vm.createContext({
    gsap: { registerPlugin() {}, timeline(config) { timeline = gsap.timeline({ ...config, paused: true }); return timeline; } },
    SplitText: {}, document: { documentElement: { dataset: {} }, getAnimations: () => [...snapshots, rail] },
    window: new EventTarget(), matchMedia: () => new EventTarget(), innerWidth: 1440,
    pageTitleForPath, titleCascadeTiming, titleSnapshotIndex,
  });
  vm.runInContext(source.replace(/^import\s+[^;]+;\n/gm, '').replaceAll('export ', ''), context);
  const cancel = context.animateCapturedTitleCharacters();
  return { snapshots, rail, timeline, cancel };
}

test('real GSAP timeline drives independently staggered snapshots, not the rail animation', () => {
  const runtime = snapshotRuntime();
  const outgoing = runtime.snapshots.filter(a => a.animationName === 'cf-letter-exit').reverse();
  const incoming = runtime.snapshots.filter(a => a.animationName === 'cf-letter-enter').reverse();
  runtime.timeline.time(.15);
  assert.ok(outgoing[0].currentTime > outgoing[7].currentTime);
  assert.ok(incoming.every(a => a.currentTime === 0));
  runtime.timeline.time(.55);
  assert.ok(outgoing.every(a => a.currentTime === 1000));
  assert.ok(incoming[0].currentTime > incoming[7].currentTime);
  assert.equal(runtime.rail.currentTime, 100);
  runtime.timeline.progress(1);
  assert.ok(runtime.snapshots.every(a => a.finished && a.currentTime === 1000));
  runtime.cancel();
});

test('Projects resolves before splitting even when the shared HTML still says Designer', () => {
  assert.equal(pageTitleForPath('/projects'), 'Projects');
  assert.equal(pageTitleForPath('/projects/'), 'Projects');
  assert.equal(pageTitleForPath('/'), 'Designer');
  assert.equal(pageTitleForPath('/case-studies/audible-sleep/'), 'Projects');
  assert.equal(pageTitleForPath('/articles/the-constraint-was-the-brief/'), 'Articles');
  assert.equal(pageTitleForPath('/history'), 'History');
});

test('Projects capture survives a later same-label route setup and repeat initialization', () => {
  let text = 'Designer';
  let writes = 0;
  let creates = 0;
  const children = new Set();
  const heading = {
    get textContent() { return text; },
    set textContent(value) { text = value; writes++; children.clear(); },
    querySelector() { return null; }, removeAttribute() {},
    contains: child => children.has(child),
  };
  const context = vm.createContext({
    gsap: { registerPlugin() {}, set() {} },
    SplitText: { create(element) {
      creates++;
      const chars = [...element.textContent].map(() => ({}));
      chars.forEach(char => children.add(char));
      return { elements: [element], chars, masks: chars.map(() => ({ style: {} })), kill() {} };
    } },
    document: { querySelector: () => heading }, location: { pathname: '/projects' },
    window: new EventTarget(), matchMedia: () => new EventTarget(),
    pageTitleForPath, titleCascadeTiming, titleSnapshotIndex,
  });
  vm.runInContext(source.replace(/^import\s+[^;]+;\n/gm, '').replaceAll('export ', ''), context);
  context.captureTitleCharacters('in');
  const first = context.ensureTitleCharacters();
  // This is the later DOMContentLoaded handler in the shared Home document.
  if (heading && heading.textContent !== 'Projects') heading.textContent = 'Projects';
  assert.equal(context.ensureTitleCharacters(), first);
  assert.equal(writes, 1);
  assert.equal(creates, 1);
  assert.equal(first.chars.length, 8);
  assert.ok(first.masks.every((mask, index) => mask.style.viewTransitionName === `cf-letter-in-${index}`));
});

test('late route chrome preserves already-split titles when their label is unchanged', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const detail = await readFile(new URL('../src/detail-state.js', import.meta.url), 'utf8');
  assert.match(html, /heading && heading\.textContent !== "Projects"/);
  assert.match(detail, /heading && heading\.textContent !== pageTitle/);
  assert.match(detail, /heading && heading\.textContent !== detail\.collectionHeading/);
});

test('interruption kills the title timeline and releases every paused snapshot', () => {
  const runtime = snapshotRuntime();
  runtime.timeline.time(.2);
  runtime.cancel();
  assert.ok(runtime.snapshots.every(a => a.cancelled));
  assert.equal(runtime.timeline.parent, null);
  assert.equal(runtime.rail.currentTime, 100);
});

test('mask clearance preserves line layout and removes the old full-title motion', async () => {
  const css = await readFile(new URL('../src/elevation/title-motion.css', import.meta.url), 'utf8');
  const counterflow = await readFile(new URL('../src/elevation/counterflow.css', import.meta.url), 'utf8');
  assert.match(css, /padding: \.14em \.06em/);
  assert.match(css, /margin: -\.14em -\.06em/);
  assert.match(css, /overflow: clip/);
  assert.doesNotMatch(counterflow, /counterflow-title|cf-title-out|cf-title-in/);
  assert.match(source, /desktopText === mobileText/);
  assert.match(source, /aria: 'auto'/);
  assert.match(source, /prefers-reduced-motion/);
});
