import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const anchorModule = await import("../src/elevation/reading-anchor.js").catch(() => ({}));

test("reading anchors keep a normalized position inside a paragraph after reflow", () => {
  assert.equal(typeof anchorModule.captureReadingAnchor, "function");
  const anchor = anchorModule.captureReadingAnchor([
    { slug: "article-one", blockIndex: 2, top: -84, height: 200 },
    { slug: "article-one", blockIndex: 3, top: 140, height: 100 },
  ], 16);
  assert.deepEqual(anchor, { slug: "article-one", blockIndex: 2, progress: .5, viewportOffset: 0 });
  assert.equal(anchorModule.restoreReadingAnchor(anchor, [
    { slug: "article-one", blockIndex: 2, top: 5000, height: 400 },
  ], 80), 5120);
});

test("reading anchors preserve a visible block's offset below the reading inset", () => {
  assert.equal(typeof anchorModule.captureReadingAnchor, "function");
  const anchor = anchorModule.captureReadingAnchor([
    { slug: "case-one", blockIndex: 5, top: 125, height: 200 },
  ], 80);
  assert.equal(anchor.viewportOffset, 45);
  assert.equal(anchorModule.restoreReadingAnchor(anchor, [
    { slug: "case-one", blockIndex: 5, top: 900, height: 150 },
  ], 16), 839);
});

test("a gap after the final paragraph anchors its lower edge rather than the entry's beginning", () => {
  assert.equal(typeof anchorModule.captureReadingAnchor, "function");
  const anchor = anchorModule.captureReadingAnchor([
    { slug: "article-one", blockIndex: 9, top: -160, height: 100 },
  ], 16);
  assert.equal(anchor.progress, 1);
  assert.equal(anchor.viewportOffset, -76);
  assert.equal(anchorModule.restoreReadingAnchor(anchor, [
    { slug: "article-one", blockIndex: 9, top: 2500, height: 150 },
  ], 80), 2646);
});

test("reading anchors ignore zero-size blocks and never cross to another entry on restore", () => {
  assert.equal(typeof anchorModule.captureReadingAnchor, "function");
  assert.equal(anchorModule.captureReadingAnchor([{ slug: "one", blockIndex: 0, top: 0, height: 0 }], 16), null);
  const anchor = { slug: "one", blockIndex: 2, progress: .5, viewportOffset: 0 };
  assert.equal(anchorModule.restoreReadingAnchor(anchor, [{ slug: "two", blockIndex: 2, top: 500, height: 100 }], 16), null);
});

test("stable block measurements ignore animation transforms on every ancestor", () => {
  assert.equal(typeof anchorModule.layoutTop, "function");
  const root = { offsetTop: 30, offsetParent: null };
  const ancestor = { offsetTop: 200, offsetParent: root, getBoundingClientRect: () => ({ top: 9999 }) };
  assert.equal(anchorModule.layoutTop({ offsetTop: 45, offsetParent: ancestor }), 275);
});

async function loadLifecycle({ initialize = true } = {}) {
  const source = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  // Exercise the actual document lifecycle using browser event targets. Rendering
  // and media are deliberately outside this test; this route has no open detail.
  const executable = source
    .replace(/^import\s+[\s\S]*?;\n/gm, "")
    .replaceAll("import.meta.env.DEV", "false")
    .replace(/^export\s+\{[^}]*\};?\s*$/gm, "");
  class DocumentTarget extends EventTarget {
    readyState = "loading";
    addEventListener(type, listener, options) {
      super.addEventListener(type, listener, typeof options === "boolean" ? { capture: options } : options);
    }
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, typeof options === "boolean" ? { capture: options } : options);
    }
    querySelector() { return null; }
    querySelectorAll() { return []; }
  }
  const document = new DocumentTarget();
  const window = new EventTarget();
  window.location = { pathname: "/", search: "" };
  let activations = 0;
  let eventTarget = null;
  const context = vm.createContext({
    document, window, Event, URLSearchParams,
    history: { state: null, replaceState(state) { this.state = state; } },
    performance: { getEntriesByType: () => [{ type: "navigate" }] },
    detailFromPath: () => null,
    ARTICLE_DETAILS: [], CASE_STUDIES: [],
    ...anchorModule,
  });
  vm.runInContext(executable, context);
  if (initialize) document.dispatchEvent(new Event("DOMContentLoaded"));
  const activate = () => {
    const event = new Event("click");
    Object.defineProperty(event, "target", { value: eventTarget });
    event.button = 0;
    document.dispatchEvent(event);
  };
  eventTarget = { closest: () => { activations += 1; return null; } };
  return { context, window, activate, activations: () => activations };
}

test("cached documents regain detail-link and close listeners after pagehide/pageshow", async () => {
  const runtime = await loadLifecycle();
  runtime.activate();
  assert.equal(runtime.activations(), 2);
  const pagehide = new Event("pagehide");
  Object.assign(pagehide, { persisted: true });
  runtime.window.dispatchEvent(pagehide);
  runtime.activate();
  assert.equal(runtime.activations(), 2);
  const pageshow = new Event("pageshow");
  Object.assign(pageshow, { persisted: true });
  runtime.window.dispatchEvent(pageshow);
  runtime.activate();
  assert.equal(runtime.activations(), 4);
  runtime.window.dispatchEvent(pageshow);
  runtime.activate();
  assert.equal(runtime.activations(), 6, "repeated resume must not duplicate click handling");
});

test("environment rerenders use the saved reading anchor instead of only the current slug", async () => {
  const source = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  assert.match(source, /renderDetail\(visibleEntry,\s*\{\s*readingAnchor\s*\}\)/);
  assert.match(source, /restoreReadingAnchor/);
  assert.match(source, /if \(!readingAnchor && focusTarget\?\.isConnected\)/);
});

test("a cached document interrupted while closing cannot retain detail paint on the collection URL", async () => {
  const runtime = await loadLifecycle();
  runtime.window.location.pathname = "/articles";
  let removed = false;
  const collection = { hidden: true };
  const classes = new Set(["detail-route"]);
  runtime.context.document.documentElement = {
    classList: { remove: (name) => classes.delete(name) },
    dataset: {},
  };
  runtime.window.scrollTo = () => {};
  runtime.context.requestAnimationFrame = (callback) => callback();
  runtime.context.detailFixture = {
    view: { remove: () => { removed = true; } },
    reduceMotionQuery: { removeEventListener() {} },
    readingAnchor: { slug: "one", blockIndex: 2, progress: .5, viewportOffset: 0 },
    collectionNodes: [collection],
    collectionHeading: "Articles",
    collectionTitle: "Andrew Zellinger • Articles",
    collectionCanonical: "/articles",
  };
  vm.runInContext("activeDetail = detailFixture", runtime.context);
  const pagehide = new Event("pagehide");
  Object.assign(pagehide, { persisted: true });
  runtime.window.dispatchEvent(pagehide);
  assert.equal(removed, false, "suspension should preserve the cached document's last paint");
  const pageshow = new Event("pageshow");
  Object.assign(pageshow, { persisted: true });
  runtime.window.dispatchEvent(pageshow);
  assert.equal(removed, true);
  assert.equal(collection.hidden, false);
  assert.equal(classes.has("detail-route"), false);
});

test("non-cached pagehide saves the reading anchor without changing collection-return fields", async () => {
  const runtime = await loadLifecycle();
  const anchor = { slug: "one", blockIndex: 4, progress: .3, viewportOffset: 0 };
  const state = {
    unrelated: "retained",
    portfolioCollection: { route: "/articles", scrollY: 320 },
    portfolioDetail: { slug: "one", sourceRoute: "/articles", sourceScrollY: 320, originSlug: "first", returnable: true },
  };
  runtime.context.history.state = state;
  runtime.context.detailFromPath = () => ({ slug: "one" });
  runtime.context.detailFixture = {
    view: { remove() {} },
    reduceMotionQuery: { removeEventListener() {} },
    readingAnchor: anchor,
  };
  vm.runInContext("activeDetail = detailFixture", runtime.context);
  const pagehide = new Event("pagehide");
  Object.assign(pagehide, { persisted: false });
  runtime.window.dispatchEvent(pagehide);
  assert.deepEqual(runtime.context.history.state.portfolioDetail.readingAnchor, anchor);
  assert.deepEqual(JSON.parse(JSON.stringify(runtime.context.history.state)), {
    ...state, portfolioDetail: { ...state.portfolioDetail, readingAnchor: anchor },
  });
});

test("a new document created by Back uses the saved anchor instead of focusing the detail header", async () => {
  const runtime = await loadLifecycle({ initialize: false });
  const anchor = { slug: "one", blockIndex: 4, progress: .3, viewportOffset: 0 };
  runtime.window.location.pathname = "/articles/one/";
  runtime.context.performance.getEntriesByType = () => [{ type: "back_forward" }];
  runtime.context.history.state = { portfolioDetail: { slug: "one", readingAnchor: anchor, returnable: true } };
  runtime.context.detailFromPath = () => ({ slug: "one", kind: "article", collectionPath: "/articles", path: "/articles/one/" });
  runtime.context.renderCalls = [];
  vm.runInContext("renderDetail = (entry, options) => renderCalls.push(options)", runtime.context);
  runtime.context.document.dispatchEvent(new Event("DOMContentLoaded"));
  assert.deepEqual(runtime.context.renderCalls[0].readingAnchor, anchor);
});

test("saved reading anchors are limited to history/reload navigation and their matching slug", () => {
  assert.equal(typeof anchorModule.readingAnchorForNavigation, "function");
  const anchor = { slug: "one", blockIndex: 4, progress: .3, viewportOffset: 0 };
  assert.equal(anchorModule.readingAnchorForNavigation(anchor, "one", "back_forward"), anchor);
  assert.equal(anchorModule.readingAnchorForNavigation(anchor, "one", "reload"), anchor);
  assert.equal(anchorModule.readingAnchorForNavigation(anchor, "one", "navigate"), null);
  assert.equal(anchorModule.readingAnchorForNavigation(anchor, "two", "back_forward"), null);
  assert.equal(anchorModule.readingAnchorForNavigation({ ...anchor, progress: NaN }, "one", "back_forward"), null);
});
