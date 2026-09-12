import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import * as model from '../src/elevation/counterflow-model.js';

const source = await readFile(new URL('../src/elevation/counterflow.js', import.meta.url), 'utf8');

function detailSweep() {
  const nodes = [];
  const node = (rect = {}) => {
    const attributes = new Map();
    const result = {
      style: { setProperty(name, value) { this[name] = value; }, removeProperty(name) {
        delete this[name]; if (name === 'view-transition-name') delete this.viewTransitionName;
      } }, dataset: {},
      getBoundingClientRect: () => rect,
      getAttribute: name => attributes.get(name) ?? null,
      setAttribute(name, value) { attributes.set(name, value); },
      removeAttribute(name) { attributes.delete(name); if (name === 'style') this.style = {}; },
    };
    nodes.push(result);
    return result;
  };
  const root = node(), title = node(), view = node({ height: 90000 });
  const rail = node({ left: 728, top: -32000, width: 688, height: 90000 });
  const content = node(), hiddenCollection = node();
  rail.querySelector = selector => selector === '.detail-sets' ? content : null;
  view.querySelector = selector => selector === '.detail-rail' ? rail : null;
  root.classList = { contains: name => name === 'detail-route' };
  const document = {
    documentElement: root,
    querySelector(selector) {
      if (selector === '.title') return title;
      if (selector === '.detail-view--project') return view;
      if (selector.includes('.works-motion-field')) return hiddenCollection;
      return null;
    },
    querySelectorAll: () => nodes.filter(item => item.style.viewTransitionName),
  };
  const location = { href: 'https://portfolio.test/case-studies/andrew-eccles/', pathname: '/case-studies/andrew-eccles/' };
  const window = Object.assign(new EventTarget(), { onpageswap: null, onpagereveal: null });
  const pauses = [];
  const context = vm.createContext({
    isPhone: () => false,
    ...model, document, window, location, innerWidth: 1440, innerHeight: 1000, URL,
    matchMedia: () => Object.assign(new EventTarget(), { matches: false }),
    setMotionPause: (...args) => pauses.push(args),
    captureTitleCharacters: phase => { title.dataset.characterCapture = phase; },
    animateCapturedTitleCharacters: () => () => {},
    setTimeout: () => 1, clearTimeout() {}, PROJECTS: [],
  });
  vm.runInContext(source.replace(/^import\s+[^;]+;\n/gm, '').replaceAll('export ', ''), context);
  let skipped = false;
  const transition = { ready: Promise.resolve(), finished: new Promise(() => {}), skipTransition() { skipped = true; } };
  const event = new Event('pageswap');
  Object.assign(event, { activation: { entry: { url: 'https://portfolio.test/' } }, viewTransition: transition });
  window.dispatchEvent(event);
  return { root, title, view, rail, content, hiddenCollection, pauses, window, skipped: () => skipped };
}

test('case-study departure captures the visible rail, not its hidden collection or entire long document', () => {
  const result = detailSweep();
  assert.equal(result.skipped(), false, 'the case-study Home sweep must not be skipped');
  assert.equal(result.rail.style.viewTransitionName, 'counterflow-media');
  assert.equal(result.hiddenCollection.style.viewTransitionName, undefined);
  assert.equal(result.rail.style.height, '952px');
  assert.equal(result.rail.style.left, '728px');
  assert.equal(result.content.style.transform, 'translateY(-32024px)');
  assert.equal(result.view.style.minHeight, '90000px');
  assert.equal(result.title.style.viewTransitionName, undefined, 'do not flatten the title into one snapshot');
  assert.equal(result.title.dataset.characterCapture, 'out');
  assert.equal(result.root.dataset.counterflow, 'up');
  assert.deepEqual(result.pauses, [['navigation', true]]);
  result.window.dispatchEvent(new Event('resize'));
  assert.equal(result.rail.style.position, undefined);
  assert.equal(result.content.style.transform, undefined);
  assert.equal(result.view.style.minHeight, undefined);
  assert.equal(result.root.dataset.counterflow, undefined);
  assert.deepEqual(result.pauses.at(-1), ['navigation', false]);
});
