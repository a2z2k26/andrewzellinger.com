import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

let instance = 0;
const pauseURL = new URL("../src/elevation/motion-pause.js", import.meta.url);
const motionURL = new URL("../src/site-motion.js", import.meta.url);

async function freshPause() {
  const source = await readFile(pauseURL, "utf8").catch(() => null);
  assert.ok(source, "Collection motion needs a shared, reason-based pause controller");
  return import(`${pauseURL.href}?test=${instance++}`);
}

test("pause reasons compose, and releasing one cannot resume another", async () => {
  const pause = await freshPause();
  assert.equal(pause.isMotionPaused(), false);
  pause.setMotionPause("focus", true);
  pause.setMotionPause("navigation", true);
  pause.setMotionPause("focus", false);
  assert.equal(pause.isMotionPaused(), true);
  pause.setMotionPause("navigation", false);
  assert.equal(pause.isMotionPaused(), false);
});

test("an explicit user pause still permits direct input unless a hard pause applies", async () => {
  const pause = await freshPause();
  pause.setUserMotionPaused(true);
  assert.equal(pause.isUserMotionPaused(), true);
  assert.equal(pause.isMotionPaused(), true);
  assert.equal(pause.isMotionInputPaused(), false);
  pause.setMotionPause("focus", true);
  assert.equal(pause.isMotionInputPaused(), true);
  pause.setMotionPause("focus", false);
  assert.equal(pause.isMotionInputPaused(), false);
  assert.equal(pause.isMotionPaused(), true);
});

test("subscribers receive state changes, not duplicate writes, and can unsubscribe", async () => {
  const pause = await freshPause();
  const changes = [];
  const unsubscribe = pause.subscribeMotionPause((paused) => changes.push(paused));
  pause.setMotionPause("focus", true);
  pause.setMotionPause("focus", true);
  pause.setUserMotionPaused(true);
  pause.setMotionPause("focus", false);
  pause.setUserMotionPaused(false);
  unsubscribe();
  pause.setMotionPause("navigation", true);
  assert.deepEqual(changes, [true, true, true, false]);
});

test("the user preference survives a fresh page module without persisting transient reasons", async () => {
  const storage = new Map();
  const previousWindow = globalThis.window;
  globalThis.window = {
    sessionStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
  };
  try {
    const first = await freshPause();
    first.setUserMotionPaused(true);
    first.setMotionPause("navigation", true);
    const second = await freshPause();
    assert.equal(second.isUserMotionPaused(), true);
    assert.equal(second.isMotionInputPaused(), false);
    second.setUserMotionPaused(false);
    assert.equal((await freshPause()).isMotionPaused(), false);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test("blocked session storage cannot break pause controls", async () => {
  const previousWindow = globalThis.window;
  globalThis.window = { get sessionStorage() { throw new Error("storage blocked"); } };
  try {
    const pause = await freshPause();
    assert.doesNotThrow(() => pause.setUserMotionPaused(true));
    assert.equal(pause.isMotionPaused(), true);
    assert.doesNotThrow(() => pause.setUserMotionPaused(false));
    assert.equal(pause.isMotionPaused(), false);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test("document visibility pauses and resumes without clearing the user's preference", async () => {
  const previousDocument = globalThis.document;
  const document = new EventTarget();
  document.hidden = false;
  globalThis.document = document;
  try {
    const pause = await freshPause();
    document.hidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
    assert.equal(pause.isMotionInputPaused(), true);
    pause.setUserMotionPaused(true);
    document.hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    assert.equal(pause.isMotionInputPaused(), false);
    assert.equal(pause.isMotionPaused(), true);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});

test("the collection loop pauses its existing position and handles direct input without a coast", async () => {
  const source = await readFile(motionURL, "utf8");
  assert.match(source, /subscribeMotionPause\(applyPause\)/);
  assert.match(source, /loopTween\?\.paused\(isMotionPaused\(\)\)/);
  assert.match(source, /if \(isMotionInputPaused\(\)\) return;/);
  assert.match(source, /if \(isUserMotionPaused\(\)\) \{[\s\S]*?gsap\.set\(track, \{ y: nextY \}\);[\s\S]*?return;/);
  assert.match(source, /field\.addEventListener\("focusin", onFocusIn\)/);
  assert.match(source, /field\.removeEventListener\("focusin", onFocusIn\)/);
  assert.match(source, /unsubscribePause\(\)/);
});

test("runtime restoration runs once on bfcache return and does not miss interactive documents", async () => {
  const source = await readFile(motionURL, "utf8");
  const lifecycle = source.slice(source.indexOf("export function initSiteMotion"))
    .replace("export function", "function");
  const document = Object.assign(new EventTarget(), {
    readyState: "interactive",
    documentElement: { dataset: {} },
  });
  const window = new EventTarget();
  let starts = 0;
  let cleanups = 0;
  const context = vm.createContext({
    document, window,
    currentPath: () => "",
    isDetailPath: () => false,
    NATIVE_SCROLL_PATHS: new Set([""]),
    MOBILE_NATIVE_PATHS: new Set([""]),
    WORKS_PATH: "/projects", ARTICLES_PATH: "/articles",
    REDUCED_MOTION_QUERY: "reduce", FORCE_REDUCED_MOTION: false,
    destroyActiveRuntime: null,
    gsap: {
      matchMedia() {
        starts++;
        return {
          add(_queries, callback) { callback({ conditions: { desktopMotion: true } }); },
          revert() { cleanups++; },
        };
      },
    },
  });
  vm.runInContext(lifecycle, context);
  assert.equal(starts, 1, "interactive documents must initialize immediately");
  const originalDestroy = context.destroyActiveRuntime;
  window.dispatchEvent(new Event("pagehide"));
  originalDestroy();
  assert.equal(cleanups, 1, "teardown is idempotent");
  assert.equal(context.destroyActiveRuntime, null);
  const restore = Object.assign(new Event("pageshow"), { persisted: true });
  window.dispatchEvent(restore);
  window.dispatchEvent(restore);
  assert.equal(starts, 2, "a bfcache page rebuilds its runtime only once");
  window.dispatchEvent(new Event("pageshow"));
  assert.equal(starts, 2, "normal pageshow does not duplicate initial setup");
});

test("paused direct input moves by the input amount, with transient reasons freezing the same position", async () => {
  const pause = await freshPause();
  const source = await readFile(motionURL, "utf8");
  const inputCode = source.slice(source.indexOf("  const handleInput ="), source.indexOf("  const onResize ="));
  const track = { y: -300 };
  let segments = 0;
  let coasts = 0;
  const progressEvents = [];
  const context = vm.createContext({
    ...pause, track, distance: 1000, direction: -1,
    CustomEvent,
    window: { dispatchEvent: event => progressEvents.push(event.type) },
    field: { getBoundingClientRect: () => ({ left: 500, right: 1000, top: 0, bottom: 800 }) },
    setDirection(value) { context.direction = value > 0 ? 1 : -1; },
    startSegment() { segments++; },
    gsap: {
      getProperty: (target, property) => target[property],
      set: (target, properties) => Object.assign(target, properties),
      delayedCall() { coasts++; },
    },
  });
  vm.runInContext(`${inputCode}\nglobalThis.handleInput = handleInput;`, context);
  pause.setUserMotionPaused(true);
  context.handleInput({ direction: 1, magnitude: 48, source: "keyboard" });
  assert.equal(track.y, -252);
  assert.equal(segments, 1);
  assert.equal(coasts, 0);
  assert.deepEqual(progressEvents, ['portfolio:loop-progress']);
  pause.setMotionPause("navigation", true);
  context.handleInput({ direction: -1, magnitude: 80, source: "keyboard" });
  assert.equal(track.y, -252, "navigation preserves the exact paused position");
  assert.equal(segments, 1);
  pause.setMotionPause("navigation", false);
  context.handleInput({ direction: -1, magnitude: 80, source: "wheel", x: 100, y: 200 });
  assert.equal(track.y, -252, "wheel outside the field does not move the paused collection");
  context.handleInput({ direction: -1, magnitude: 80, source: "wheel", x: 750, y: 200 });
  assert.equal(track.y, -332);
  assert.equal(coasts, 0);
  assert.equal(progressEvents.length, 2, 'only actual direct movement refreshes collection progress');
});

test("rail-sweep arrival clears residual impulse and sets upward direction without clearing pauses", async () => {
  const pause = await freshPause();
  const source = await readFile(motionURL, "utf8");
  const start = source.indexOf("  const resetForArrival =");
  assert.ok(start >= 0, "The active collection needs an arrival reset independent of user direction input");
  const resetCode = source.slice(start, source.indexOf("  const setDirection =", start));
  let kills = 0;
  const segments = [];
  const context = vm.createContext({
    destroyed: false, direction: 1, speedState: { multiplier: 18 },
    settleCall: { kill() { kills++; } },
    decayTween: { kill() { kills++; } },
    startCall: { kill() { kills++; } },
    startSegment() { segments.push({ direction: context.direction, paused: pause.isMotionPaused() }); },
  });
  pause.setUserMotionPaused(true);
  pause.setMotionPause("focus", true);
  pause.setMotionPause("navigation", true);
  vm.runInContext(`${resetCode}\nresetForArrival();`, context);
  assert.equal(context.direction, -1);
  assert.equal(context.speedState.multiplier, 1);
  assert.equal(kills, 3);
  assert.equal(context.settleCall, null);
  assert.equal(context.decayTween, null);
  assert.equal(context.startCall, null);
  assert.deepEqual(segments, [{ direction: -1, paused: true }]);
  pause.setMotionPause("navigation", false);
  assert.equal(pause.isUserMotionPaused(), true);
  assert.equal(pause.isMotionInputPaused(), true, "the focused collection is still held");
});

test("rail-sweep arrival queues before loop startup and resets cached running loops once", async () => {
  const source = await readFile(motionURL, "utf8");
  const start = source.indexOf("function applyPendingRailSweepArrival");
  assert.ok(start >= 0, "Arrival coordination must survive the event arriving before the collection exists");
  const arrivalCode = source.slice(start, source.indexOf("function startWhenReady", start));
  const document = { documentElement: { dataset: {} } };
  const context = vm.createContext({
    document,
    currentPath: () => "/projects",
    WORKS_PATH: "/projects", ARTICLES_PATH: "/articles",
    pendingRailSweepArrival: false, activeCollectionLoop: null,
  });
  let resets = 0;
  vm.runInContext(arrivalCode, context);
  context.onRailSweepArrival();
  assert.equal(context.pendingRailSweepArrival, true);
  context.activeCollectionLoop = { resetForArrival() { resets++; } };
  context.applyPendingRailSweepArrival();
  assert.equal(resets, 1);
  assert.equal(context.pendingRailSweepArrival, false);
  context.applyPendingRailSweepArrival();
  assert.equal(resets, 1, "consumed arrivals do not override later user directions");
  context.onRailSweepArrival();
  assert.equal(resets, 2, "a cached active loop receives the next arrival immediately");
  document.documentElement.dataset.railSweep = "up";
  context.applyPendingRailSweepArrival();
  assert.equal(resets, 3, "the active marker handles a pagereveal that preceded module setup");
  delete document.documentElement.dataset.railSweep;
  context.currentPath = () => "/articles/the-constraint-was-the-brief";
  context.onRailSweepArrival();
  assert.equal(resets, 3, "detail navigation is untouched");
});

async function loadSmoothScrolling() {
  const pause = await freshPause();
  const source = await readFile(motionURL, "utf8");
  const smoothCode = source.slice(source.indexOf("function createSmoothScrolling"), source.indexOf("function createContentLoop"));
  const tweens = [], inputs = [];
  const window = Object.assign(new EventTarget(), {
    scrollY: 200, innerHeight: 800,
    scrollTo(_x, y) { this.scrollY = y; },
  });
  const context = vm.createContext({
    ...pause, window,
    document: { documentElement: { scrollHeight: 4000 } },
    WheelEvent: { DOM_DELTA_LINE: 1, DOM_DELTA_PAGE: 2 },
    HTMLElement: class {},
    clampScroll: value => Math.max(0, Math.min(3200, value)),
    gsap: {
      to(target, options) {
        const tween = { target, options, killed: false,
          kill() { this.killed = true; },
          advance(y) { if (!this.killed) { target.y = y; options.onUpdate(); } },
        };
        tweens.push(tween);
        return tween;
      },
    },
  });
  vm.runInContext(smoothCode, context);
  const destroy = context.createSmoothScrolling(input => inputs.push(input));
  const dispatch = (type, properties = {}) => {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, properties);
    window.dispatchEvent(event);
    return event;
  };
  return { pause, window, tweens, inputs, destroy, dispatch };
}

test("hard pause kills active smooth scrolling and blocks wheel/key displacement until resume", async () => {
  const runtime = await loadSmoothScrolling();
  runtime.dispatch("wheel", { deltaY: 100, deltaX: 0, deltaMode: 0 });
  runtime.tweens[0].advance(230);
  runtime.pause.setMotionPause("navigation", true);
  assert.equal(runtime.tweens[0].killed, true, "the in-flight tween must stop before a frozen snapshot can diverge");
  assert.equal(runtime.dispatch("wheel", { deltaY: 200, deltaX: 0, deltaMode: 0 }).defaultPrevented, true);
  assert.equal(runtime.dispatch("keydown", { key: "PageDown" }).defaultPrevented, true);
  assert.equal(runtime.tweens.length, 1);
  assert.equal(runtime.inputs.length, 1);
  assert.equal(runtime.window.scrollY, 230);
  runtime.window.scrollY = 410; // Browser restoration can adjust the target while frozen.
  runtime.pause.setMotionPause("navigation", false);
  runtime.dispatch("keydown", { key: "ArrowDown" });
  assert.equal(runtime.tweens[1].options.y, 458, "resume uses the actual restored scroll position, not the old target");
  runtime.destroy();
});

test("user autoplay pause permits browsing while transient pause preserves native shortcuts", async () => {
  const runtime = await loadSmoothScrolling();
  runtime.pause.setUserMotionPaused(true);
  runtime.dispatch("wheel", { deltaY: 100, deltaX: 0, deltaMode: 0 });
  assert.equal(runtime.tweens.length, 1);
  assert.equal(runtime.tweens[0].options.y, 300);
  runtime.pause.setMotionPause("navigation", true);
  assert.equal(runtime.dispatch("wheel", { ctrlKey: true, deltaY: 100, deltaX: 0, deltaMode: 0 }).defaultPrevented, false);
  assert.equal(runtime.dispatch("keydown", { ctrlKey: true, key: "Home" }).defaultPrevented, false);
  assert.equal(runtime.dispatch("keydown", { metaKey: true, key: "ArrowLeft" }).defaultPrevented, false);
  assert.equal(runtime.dispatch("keydown", { key: "Tab" }).defaultPrevented, false);
  assert.equal(runtime.tweens.length, 1);
  runtime.pause.setMotionPause("navigation", false);
  assert.equal(runtime.pause.isUserMotionPaused(), true);
  runtime.dispatch("keydown", { key: "ArrowDown" });
  assert.equal(runtime.tweens.length, 2);
  runtime.destroy();
});

test("the desktop smooth runtime freezes one-finger scrolling while allowing pinch gestures", async () => {
  const runtime = await loadSmoothScrolling();
  runtime.pause.setMotionPause("navigation", true);
  runtime.dispatch("touchstart", { touches: [{ clientX: 700, clientY: 400 }] });
  const move = runtime.dispatch("touchmove", { touches: [{ clientX: 700, clientY: 300 }] });
  assert.equal(move.defaultPrevented, true);
  assert.equal(runtime.inputs.length, 0);
  const pinch = runtime.dispatch("touchmove", { touches: [{ clientX: 650, clientY: 350 }, { clientX: 750, clientY: 350 }] });
  assert.equal(pinch.defaultPrevented, false);
  runtime.destroy();
});
