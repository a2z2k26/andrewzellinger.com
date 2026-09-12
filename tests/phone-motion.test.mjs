import test from 'node:test';
import assert from 'node:assert/strict';
import { PHONE_MOTION, isPhoneWidth, phoneCSSVariables } from '../src/motion/profile.js';

test('phone profile stops at 600px and preserves tablet/desktop ownership', () => {
  for (const width of [320, 390, 430, 599]) assert.equal(isPhoneWidth(width), true);
  for (const width of [600, 820, 991, 992, 1440]) assert.equal(isPhoneWidth(width), false);
});
test('phone interaction sequences fit their complete budget, including stagger and return', () => {
  assert.ok(PHONE_MOTION.duration.reading + PHONE_MOTION.stagger * 2 <= .6);
  assert.ok(PHONE_MOTION.duration.exit + PHONE_MOTION.duration.feedback <= .32);
  assert.ok(PHONE_MOTION.duration.route <= .4);
  const css = phoneCSSVariables();
  assert.equal(css['--phone-motion-response'], `${PHONE_MOTION.duration.response * 1000}ms`);
  assert.equal(css['--phone-distance-reveal'], `${PHONE_MOTION.distance.reveal}px`);
  assert.equal(css['--phone-motion-route'], '360ms');
});

import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function readingRuntime(reduce = false) {
  const source = await readFile(new URL('../src/motion/phone.js', import.meta.url), 'utf8');
  const window = new EventTarget();
  const preference = Object.assign(new EventTarget(), { matches: reduce });
  const resets = [];
  const timelines = [];
  const context = vm.createContext({
    window, innerWidth: 390, innerHeight: 844, motion: PHONE_MOTION, isPhoneWidth, phoneCSSVariables,
    matchMedia: () => preference,
    document: { documentElement: { dataset: {}, style: { setProperty() {} } } },
    gsap: { set: (node, values) => resets.push({ node, values }), timeline(options) {
      const timeline = { options, killed: false, fromTo() { return this; }, to() { return this; }, kill() { this.killed = true; } };
      timelines.push(timeline); return timeline;
    } },
  });
  vm.runInContext(source.replace(/^import\s+[^;]+;\n/gm, '').replaceAll('export ', ''), context);
  return { context, window, preference, resets, timelines, view: { querySelectorAll: () => [] } };
}
test('resize cancels a phone entrance, resolves its waiter and cannot fire stale completion', async () => {
  const runtime = await readingRuntime();
  let completions = 0;
  const handle = runtime.context.animatePhoneReading(runtime.view, true, false, () => completions++);
  runtime.window.dispatchEvent(new Event('resize'));
  await handle.finished;
  assert.equal(runtime.timelines[0].killed, true);
  assert.equal(completions, 0);
  const resets = runtime.resets.length;
  runtime.window.dispatchEvent(new Event('resize'));
  handle.cancel();
  assert.equal(runtime.resets.length, resets, 'Cancellation removes listeners and is idempotent');
});
test('reduced motion completes synchronously without creating a timeline', async () => {
  const runtime = await readingRuntime(true);
  let completions = 0;
  const handle = runtime.context.animatePhoneReading(runtime.view, true, false, () => completions++);
  await handle.finished;
  assert.equal(completions, 1);
  assert.equal(runtime.timelines.length, 0);
  handle.cancel();
  assert.equal(completions, 1);
});
