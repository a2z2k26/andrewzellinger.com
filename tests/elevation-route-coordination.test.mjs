import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { counterflowDirection } from '../src/elevation/counterflow-model.js';
import { pageContext, activeSectionIndex, documentProgress, collectionProgress, historyLoopPosition } from '../src/elevation/page-context.js';

const source = await readFile(new URL('../src/elevation/index.js', import.meta.url), 'utf8');
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

// Execute the actual elevation entry and its installed click handler. Only
// browser surfaces, animation time, and destination decode are controlled here;
// none of the route-selection/cancellation/commit logic is copied into the test.
function loadRouteCoordinator({ nativeCounterflow = true, reducedMotion = false, startPath = '/' } = {}) {
  const assignments = [], commits = [], preparations = [], animations = [];
  const timers = new Map();
  let nextTimer = 0;
  const location = { href: `https://portfolio.test${startPath}`, pathname: startPath, search: '', origin: 'https://portfolio.test',
    assign(url) { assignments.push(url); } };

  class Node extends EventTarget {
    constructor(tag = 'div') {
      super();
      this.tagName = tag.toUpperCase();
      this.children = [];
      this.attributes = new Map();
      this.dataset = {};
      this.style = { setProperty() {} };
      this.className = '';
      this.classList = { contains: name => this.className.split(' ').includes(name) };
      this.target = '';
    }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    hasAttribute(name) { return this.attributes.has(name); }
    removeAttribute(name) { this.attributes.delete(name); }
    set href(value) { this.setAttribute('href', value); }
    get href() { return new URL(this.getAttribute('href'), location.href).href; }
    append(...nodes) { for (const node of nodes) { node.parent = this; this.children.push(node); } }
    prepend(node) { node.parent = this; this.children.unshift(node); }
    remove() { if (this.parent) this.parent.children = this.parent.children.filter(node => node !== this); }
    querySelectorAll(selector) { return selector === 'a' ? this.children.filter(node => node.tagName === 'A') : []; }
    matches(selector) { return selector === '[data-portfolio-detail-link]' && this.hasAttribute('data-portfolio-detail-link'); }
    closest(selector) { return selector === 'a[href]' && this.tagName === 'A' ? this : null; }
    animate(keyframes, options) {
      const completion = deferred();
      const animation = { keyframes, options, cancelled: false, finished: completion.promise,
        finish: () => completion.resolve(),
        cancel() { this.cancelled = true; completion.reject(new Error('Animation cancelled')); } };
      animations.push(animation);
      return animation;
    }
  }
  const root = new Node(), body = new Node('body'), title = new Node(), rail = new Node();
  if (/^\/(case-studies|articles)\/[^/]+/.test(startPath)) root.className = 'detail-route';
  const document = Object.assign(new EventTarget(), {
    readyState: 'interactive', documentElement: root, body,
    createElement: tag => new Node(tag),
    querySelector(selector) {
      if (selector === '.edition-context') return body.children.find(node => node.className === 'edition-context') ?? null;
      if (selector === '.title .container-xlarge') return title;
      if (selector.includes('.index-static-field')) return rail;
      return null;
    },
    querySelectorAll: () => [],
  });
  const window = Object.assign(new EventTarget(), { location });
  class Observer { observe() {} disconnect() {} unobserve() {} }
  const context = vm.createContext({
    document, window, location, URL, URLSearchParams,
    innerWidth: 1440, innerHeight: 1000,
    PROJECTS: [], ARTICLE_DETAILS: [],
    pageContext, activeSectionIndex, documentProgress, collectionProgress, historyLoopPosition,
    ensureTitleCharacters() {},
    animateTitleCharacters: () => title.animate([], { duration: 240 }),
    matchMedia: () => Object.assign(new EventTarget(), { matches: reducedMotion }),
    MutationObserver: Observer, IntersectionObserver: Observer,
    requestAnimationFrame: () => 1, cancelAnimationFrame() {},
    setTimeout(callback, delay) { const id = ++nextTimer; timers.set(id, { callback, delay, cancelled: false }); return id; },
    clearTimeout(id) { if (timers.has(id)) timers.get(id).cancelled = true; },
    hasCounterflow: () => nativeCounterflow,
    isCounterflowPair: to => Boolean(counterflowDirection(location.href, to)),
    isCounterflowArrival: () => false,
    prepareCounterflow(to) { const pending = deferred(); preparations.push({ to, ...pending }); return pending.promise; },
    commitCounterflow(to, ready) { commits.push({ to, ready }); location.assign(to); },
    isUserMotionPaused: () => false, setUserMotionPaused() {}, subscribeMotionPause() {},
  });
  vm.runInContext(source.replace(/^import\s+[\s\S]*?;\n/gm, '').replaceAll('import.meta.env.DEV', 'false'), context);

  function click(href, properties = {}, attributes = {}) {
    const link = new Node('a');
    link.href = href;
    for (const [name, value] of Object.entries(attributes)) link.setAttribute(name, value);
    if (attributes.target) link.target = attributes.target;
    const event = new Event('click', { cancelable: true });
    Object.assign(event, { button: 0, ...properties });
    Object.defineProperty(event, 'target', { value: link });
    document.dispatchEvent(event);
    return event;
  }
  return { click, window, root, body, title, assignments, commits, preparations, timers,
    setNativeCounterflow: enabled => { nativeCounterflow = Boolean(enabled); },
    exits: () => animations.filter(animation => animation.options.duration === 240),
    loading: () => body.children.filter(node => node.className === 'edition-loading'),
  };
}

test('page chrome adds neither title metadata nor secondary navigation on any page type', () => {
  for (const startPath of ['/', '/projects', '/articles', '/history', '/case-studies/audible-sleep/', '/articles/the-constraint-was-the-brief/']) {
    const runtime = loadRouteCoordinator({ startPath });
    assert.equal(runtime.title.children.length, 0, `${startPath}: no extra text above the authored heading`);
    assert.equal(runtime.body.children.filter(node => node.tagName === 'NAV').length, 0, `${startPath}: no secondary navigation`);
    assert.equal(runtime.body.children.filter(node => node.className === 'edition-motion-toggle').length, 0, 'visible pause control stays removed');
  }
});

test('all remaining page states share context and scrolling progress', () => {
  for (const startPath of ['/', '/projects', '/projects/', '/articles', '/history', '/case-studies/audible-sleep/', '/articles/the-constraint-was-the-brief/']) {
    const runtime = loadRouteCoordinator({ startPath });
    const context = runtime.body.children.find(node => node.className === 'edition-context');
    assert.ok(context, `${startPath}: contextual text is present`);
    assert.deepEqual(Array.from(context.children, node => node.className), ['edition-context__count', 'edition-context__title']);
    assert.ok(context.children.find(node => node.className === 'edition-context__title').textContent);
    const reading = runtime.body.children.find(node => node.className === 'edition-reading');
    assert.equal(reading.hidden, false, startPath);
    if (startPath === '/') assert.equal(runtime.root.dataset.editionSection, 'projects');
  }
});

test('Projects and Articles both omit the visible pause control', () => {
  for (const startPath of ['/projects', '/projects/', '/articles', '/articles/']) {
    const runtime = loadRouteCoordinator({ startPath });
    assert.equal(runtime.body.children.some(node => node.className === 'edition-motion-toggle'), false);
  }
});

test('case-study logo links prepare the landing-page sweep without starting the old fade', async () => {
  const runtime = loadRouteCoordinator({ startPath: '/case-studies/andrew-eccles/' });
  assert.equal(runtime.click('/').defaultPrevented, true);
  assert.equal(runtime.preparations.length, 1, 'the landing page must enter the native sweep path');
  assert.equal(runtime.exits().length, 0, 'the old departure fade must not run');
  runtime.preparations[0].resolve(true);
  await flushPromises();
  assert.deepEqual(runtime.commits, [{ to: 'https://portfolio.test/', ready: true }]);
});

test('new eligible route cancels both stale fallback completion and its queued safety callback', async () => {
  const runtime = loadRouteCoordinator({ nativeCounterflow: false });
  assert.equal(runtime.click('/articles').defaultPrevented, true);
  const oldAnimations = runtime.exits();
  const oldTimer = [...runtime.timers.values()][0];
  assert.equal(oldAnimations.length, 2);
  assert.equal(oldTimer.delay, 600);

  runtime.click('/history');
  assert.ok(oldAnimations.every(animation => animation.cancelled));
  assert.equal(oldTimer.cancelled, true);
  // Even a timer already queued before clearTimeout must be harmless.
  oldTimer.callback();
  oldAnimations.forEach(animation => animation.finish());
  await flushPromises();
  assert.deepEqual(runtime.assignments, []);

  runtime.exits().slice(2).forEach(animation => animation.finish());
  await flushPromises();
  [...runtime.timers.values()][1].callback();
  assert.deepEqual(runtime.assignments, ['https://portfolio.test/history']);
});

test('Counterflow intent cancels an older fallback before destination preparation completes', async () => {
  const runtime = loadRouteCoordinator({ nativeCounterflow: false });
  runtime.click('/articles');
  const timer = [...runtime.timers.values()][0];
  runtime.setNativeCounterflow(true);
  runtime.click('/history');
  timer.callback();
  await flushPromises();
  assert.deepEqual(runtime.assignments, []);
  assert.equal(runtime.preparations.length, 1);
  runtime.preparations[0].resolve(true);
  await flushPromises();
  assert.deepEqual(runtime.commits, [{ to: 'https://portfolio.test/history', ready: true }]);
  assert.deepEqual(runtime.assignments, ['https://portfolio.test/history']);
});

test('delayed Counterflow preparation cannot commit after a newer fallback intent', async () => {
  const runtime = loadRouteCoordinator();
  runtime.click('/history');
  assert.equal(runtime.root.dataset.transitionPhase, 'prepare');
  assert.equal(runtime.loading().length, 1);
  runtime.setNativeCounterflow(false);
  runtime.click('/articles');
  assert.equal(runtime.loading().length, 0);
  runtime.preparations[0].resolve(true);
  await flushPromises();
  assert.deepEqual(runtime.commits, []);
  runtime.exits().forEach(animation => animation.finish());
  await flushPromises();
  assert.deepEqual(runtime.assignments, ['https://portfolio.test/articles']);
});

test('a second Counterflow preparation supersedes the first even when it resolves later', async () => {
  const runtime = loadRouteCoordinator();
  runtime.click('/history');
  runtime.click('/history');
  assert.equal(runtime.preparations.length, 2);
  assert.equal(runtime.loading().length, 1);
  runtime.preparations[1].resolve(false);
  await flushPromises();
  runtime.preparations[0].resolve(true);
  await flushPromises();
  assert.deepEqual(runtime.commits, [{ to: 'https://portfolio.test/history', ready: false }]);
  assert.equal(runtime.loading().length, 0);
});

test('same-route click cancels a pending fallback without forcing a reload', async () => {
  const runtime = loadRouteCoordinator({ nativeCounterflow: false });
  runtime.click('/articles');
  const timer = [...runtime.timers.values()][0];
  assert.equal(runtime.click('/').defaultPrevented, false);
  timer.callback();
  runtime.exits().forEach(animation => animation.finish());
  await flushPromises();
  assert.deepEqual(runtime.assignments, []);
});

test('same-route click cancels a pending Counterflow decode and removes its loading cue', async () => {
  const runtime = loadRouteCoordinator();
  runtime.click('/history');
  runtime.click('/');
  runtime.preparations[0].resolve(true);
  await flushPromises();
  assert.deepEqual(runtime.commits, []);
  assert.deepEqual(runtime.assignments, []);
  assert.equal(runtime.loading().length, 0);
  assert.equal(runtime.root.dataset.transitionPhase, 'idle');
});

test('modified, external, hash, download, and new-tab links retain native navigation', async () => {
  const runtime = loadRouteCoordinator();
  for (const [href, properties, attributes] of [
    ['/history', { metaKey: true }], ['/history', { ctrlKey: true }],
    ['/history', { shiftKey: true }], ['/history', { altKey: true }],
    ['/history', { button: 1 }], ['https://elsewhere.test/history'],
    ['/history#selected'], ['/history', {}, { download: 'portfolio' }],
    ['/history', {}, { target: '_blank' }],
    ['/history', {}, { 'data-portfolio-detail-link': '' }],
  ]) assert.equal(runtime.click(href, properties, attributes).defaultPrevented, false);
  await flushPromises();
  assert.equal(runtime.preparations.length, 0);
  assert.equal(runtime.timers.size, 0);
  assert.deepEqual(runtime.assignments, []);
});

test('ordinary external navigation cancels an internal decode instead of being overwritten later', async () => {
  const runtime = loadRouteCoordinator();
  runtime.click('/history');
  assert.equal(runtime.click('https://elsewhere.test/').defaultPrevented, false);
  runtime.preparations[0].resolve(true);
  await flushPromises();
  assert.deepEqual(runtime.commits, []);
  assert.deepEqual(runtime.assignments, []);
  assert.equal(runtime.loading().length, 0);
});

test('ordinary external navigation cancels a pending fallback animation and timer', async () => {
  const runtime = loadRouteCoordinator({ nativeCounterflow: false });
  runtime.click('/articles');
  const timer = [...runtime.timers.values()][0];
  assert.equal(runtime.click('https://elsewhere.test/').defaultPrevented, false);
  timer.callback();
  runtime.exits().forEach(animation => animation.finish());
  await flushPromises();
  assert.deepEqual(runtime.assignments, []);
});

test('same-document hash navigation cancels an older route preparation', async () => {
  const runtime = loadRouteCoordinator();
  runtime.click('/history');
  assert.equal(runtime.click('/#selected').defaultPrevented, false);
  runtime.preparations[0].resolve(true);
  await flushPromises();
  assert.deepEqual(runtime.commits, []);
  assert.deepEqual(runtime.assignments, []);
});

test('modified, new-tab, and download activations do not cancel the current page intent', async () => {
  const runtime = loadRouteCoordinator();
  runtime.click('/history');
  for (const [href, properties, attributes] of [
    ['/articles', { metaKey: true }], ['/history', { ctrlKey: true }],
    ['https://elsewhere.test/', { shiftKey: true }], ['/articles', { button: 1 }],
    ['/history', {}, { target: '_blank' }], ['/articles', {}, { download: 'portfolio' }],
  ]) assert.equal(runtime.click(href, properties, attributes).defaultPrevented, false);
  assert.equal(runtime.loading().length, 1);
  runtime.preparations[0].resolve(true);
  await flushPromises();
  assert.deepEqual(runtime.assignments, ['https://portfolio.test/history']);
});

test('reduced-motion route changes use native navigation without preparation or delayed callbacks', () => {
  const runtime = loadRouteCoordinator({ reducedMotion: true });
  assert.equal(runtime.click('/history').defaultPrevented, false);
  assert.equal(runtime.click('/articles').defaultPrevented, false);
  assert.equal(runtime.preparations.length, 0);
  assert.equal(runtime.timers.size, 0);
  assert.deepEqual(runtime.assignments, []);
});

for (const [path, label] of [['/', 'Projects'], ['/articles', 'Articles'], ['/history', 'History']]) {
  test(`native ${label} navigation shows its destination label and commits after preparation`, async () => {
    const runtime = loadRouteCoordinator({ startPath: path === '/' ? '/history' : '/' });
    assert.equal(runtime.click(path).defaultPrevented, true);
    assert.equal(runtime.loading().length, 1);
    assert.equal(runtime.loading()[0].textContent, `Preparing ${label}`);
    assert.equal(runtime.loading()[0].getAttribute('role'), 'status');
    assert.equal(runtime.preparations.length, 1);
    assert.equal(runtime.exits().length, 0);
    assert.equal(runtime.timers.size, 0);
    runtime.preparations[0].resolve(true);
    await flushPromises();
    assert.equal(runtime.loading().length, 0);
    assert.deepEqual(runtime.commits, [{ to: `https://portfolio.test${path}`, ready: true }]);
  });
}

test('pagehide cancels a pending preparation before a cached page can commit it later', async () => {
  const runtime = loadRouteCoordinator();
  runtime.click('/history');
  runtime.window.dispatchEvent(new Event('pagehide'));
  runtime.preparations[0].resolve(true);
  await flushPromises();
  assert.deepEqual(runtime.commits, []);
  assert.equal(runtime.loading().length, 0);
});

test('a newer History preparation supersedes Articles without committing stale destination work', async () => {
  const runtime = loadRouteCoordinator();
  runtime.click('/articles');
  runtime.click('/history');
  assert.equal(runtime.preparations.length, 2);
  assert.equal(runtime.loading().length, 1);
  assert.equal(runtime.loading()[0].textContent, 'Preparing History');
  runtime.preparations[0].resolve(true);
  await flushPromises();
  assert.deepEqual(runtime.commits, []);
  runtime.preparations[1].resolve(true);
  await flushPromises();
  assert.deepEqual(runtime.assignments, ['https://portfolio.test/history']);
});
