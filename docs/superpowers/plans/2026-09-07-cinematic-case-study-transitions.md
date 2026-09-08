# Cinematic Case-Study Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reversible cinematic shared-image transitions between Projects and case studies plus scroll-driven boundary choreography between adjacent project case studies without changing approved layouts.

**Architecture:** Keep routing, history, native scrolling, and the circular detail sequence in `src/detail-state.js`. Add a pure motion-values module for deterministic progress calculations and a DOM/GSAP controller for rendering those values. Extend the current cloned-media overlay into symmetric entrance and return transitions, with all temporary state owned by one cancellable transition object.

**Tech Stack:** Vanilla JavaScript ES modules, GSAP 3.15, CSS, Vite, Node test runner, existing Sites packaging.

## Global Constraints

- Preserve all existing page geometry, typography, content, routes, history behavior, circular detail order, glass effects, center navigation, and project media mappings.
- Use GSAP; do not add Framer Motion, ScrollTrigger, or another dependency.
- Boundary motion is continuously scroll-driven, reversible, unpinned, and unsnapped.
- Animate case-study media plus title, metadata, and description; do not animate body paragraphs or split text into characters.
- Preserve 3:2 cover cropping; never stretch or visibly duplicate project media.
- Below 992px retain native static scrolling with reduced travel and no circular clones.
- Under `prefers-reduced-motion: reduce`, skip decorative spatial motion and preserve navigation, focus, and history behavior.
- Every temporary overlay, hidden native element, inline transform, opacity, clip, and `will-change` value must be restored on completion and cancellation.
- Article details are outside this feature and must retain current behavior.

---

### Task 1: Deterministic Motion Values

**Files:**
- Create: `src/detail-motion-values.js`
- Create: `tests/detail-motion-values.test.mjs`

**Interfaces:**
- Consumes: numeric boundary progress and viewport measurements.
- Produces: `clamp01(value)`, `rangeProgress(value, start, end)`, `boundaryProgress(nextMediaTop, viewportHeight)`, and `motionFrame(progress, compact)`.

- [ ] **Step 1: Write the failing value-model tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  boundaryProgress,
  clamp01,
  motionFrame,
  rangeProgress,
} from "../src/detail-motion-values.js";

test("clamp01 and rangeProgress clamp reversible progress", () => {
  assert.equal(clamp01(-1), 0);
  assert.equal(clamp01(2), 1);
  assert.equal(rangeProgress(.5, .25, .75), .5);
  assert.equal(rangeProgress(.1, .25, .75), 0);
  assert.equal(rangeProgress(.9, .25, .75), 1);
});

test("boundaryProgress maps the next media through the transition window", () => {
  assert.equal(boundaryProgress(900, 1000), 0);
  assert.equal(boundaryProgress(500, 1000), .5);
  assert.equal(boundaryProgress(100, 1000), 1);
});

test("motionFrame resolves outgoing and incoming media and copy", () => {
  assert.deepEqual(motionFrame(0, false), {
    outgoingMediaScale: 1,
    outgoingMediaY: 0,
    outgoingShade: 0,
    outgoingCopyY: 0,
    outgoingCopyOpacity: 1,
    incomingMediaScale: 1.04,
    incomingMediaY: 40,
    incomingReveal: 0,
    incomingTitleY: 24,
    incomingTitleOpacity: 0,
    incomingMetaY: 18,
    incomingMetaOpacity: 0,
    incomingLedeY: 14,
    incomingLedeOpacity: 0,
  });
  const end = motionFrame(1, false);
  assert.equal(end.outgoingMediaScale, .96);
  assert.equal(end.outgoingCopyOpacity, 0);
  assert.equal(end.incomingMediaScale, 1);
  assert.equal(end.incomingMediaY, 0);
  assert.equal(end.incomingReveal, 1);
  assert.equal(end.incomingTitleOpacity, 1);
  assert.equal(end.incomingMetaOpacity, 1);
  assert.equal(end.incomingLedeOpacity, 1);
  assert.ok(motionFrame(.5, true).incomingMediaY < motionFrame(.5, false).incomingMediaY);
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `node --test tests/detail-motion-values.test.mjs`

Expected: FAIL because `src/detail-motion-values.js` does not exist.

- [ ] **Step 3: Implement the pure value model**

```js
export function clamp01(value) {
  return Math.min(1, Math.max(0, Number(value) || 0));
}

export function rangeProgress(value, start, end) {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

export function boundaryProgress(nextMediaTop, viewportHeight) {
  const height = Math.max(1, viewportHeight);
  const start = height * .9;
  const end = height * .1;
  return clamp01((start - nextMediaTop) / (start - end));
}

const mix = (from, to, progress) => from + ((to - from) * progress);

export function motionFrame(progress, compact = false) {
  const value = clamp01(progress);
  const outgoingCopy = rangeProgress(value, 0, .35);
  const outgoingMedia = rangeProgress(value, .15, .7);
  const incomingMedia = rangeProgress(value, .3, 1);
  const title = rangeProgress(value, .65, .9);
  const meta = rangeProgress(value, .7, .95);
  const lede = rangeProgress(value, .75, 1);
  const distanceFactor = compact ? .5 : 1;

  return {
    outgoingMediaScale: mix(1, .96, outgoingMedia),
    outgoingMediaY: mix(0, -20 * distanceFactor, outgoingMedia),
    outgoingShade: mix(0, .22, outgoingMedia),
    outgoingCopyY: mix(0, -20 * distanceFactor, outgoingCopy),
    outgoingCopyOpacity: mix(1, 0, outgoingCopy),
    incomingMediaScale: mix(1.04, 1, incomingMedia),
    incomingMediaY: mix(40 * distanceFactor, 0, incomingMedia),
    incomingReveal: incomingMedia,
    incomingTitleY: mix(24 * distanceFactor, 0, title),
    incomingTitleOpacity: title,
    incomingMetaY: mix(18 * distanceFactor, 0, meta),
    incomingMetaOpacity: meta,
    incomingLedeY: mix(14 * distanceFactor, 0, lede),
    incomingLedeOpacity: lede,
  };
}
```

- [ ] **Step 4: Run the focused test**

Run: `node --test tests/detail-motion-values.test.mjs`

Expected: 3 tests pass.

- [ ] **Step 5: Commit the value model**

```bash
git add src/detail-motion-values.js tests/detail-motion-values.test.mjs
git commit -m "Add case-study motion value model"
```

---

### Task 2: Scroll-Driven Boundary Controller

**Files:**
- Create: `src/detail-boundary-motion.js`
- Modify: `src/detail-state.js`
- Modify: `src/detail-state.css`
- Create: `tests/detail-boundary-motion.test.mjs`

**Interfaces:**
- Consumes: `createBoundaryMotion({ view, circular, reduceMotion })` arguments and the value functions from Task 1.
- Produces: a controller with `render()`, `measure()`, `isTransitioning()`, `clear()`, and `destroy()`.

- [ ] **Step 1: Write the failing controller-contract test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("detail scrolling owns a reversible project boundary controller", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const controller = await readFile(new URL("../src/detail-boundary-motion.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(runtime, /createBoundaryMotion\(\{ view, circular, reduceMotion \}\)/);
  assert.match(runtime, /boundaryMotion\.render\(\)/);
  assert.match(runtime, /boundaryMotion\.measure\(\)/);
  assert.match(runtime, /boundaryMotion\.destroy\(\)/);
  assert.match(controller, /boundaryProgress\(nextRect\.top, window\.innerHeight\)/);
  assert.match(controller, /motionFrame\(progress, compact\)/);
  assert.match(controller, /gsap\.set/);
  assert.match(styles, /\.detail-unit__media-shade/);
  assert.match(styles, /clip-path:/);
  assert.doesNotMatch(controller, /ScrollTrigger/);
});
```

- [ ] **Step 2: Run the contract test and verify failure**

Run: `node --test tests/detail-boundary-motion.test.mjs`

Expected: FAIL because the boundary controller does not exist.

- [ ] **Step 3: Add media-shade markup and boundary selectors**

In `mediaMarkup(entry)`, place one decorative shade inside each media frame:

```js
return `<div class="media-background-holder landscape detail-unit__media detail-unit__media--placeholder" role="img" aria-label="${escapeHtml(label)}"${source}>
  <span class="detail-unit__media-shade" aria-hidden="true"></span>
</div>`;
```

Add `data-detail-motion-copy` to the project copy wrapper, and add specific hooks to its title, metadata, and description without changing their semantic elements:

```js
<div class="detail-unit__copy detail-unit__copy--${entry.kind}" data-detail-motion-copy>
  <h2 class="${titleClass}" data-detail-motion-title tabindex="-1">${escapeHtml(entry.title)}</h2>
  <div class="${metaClass}" data-detail-motion-meta>...</div>
  <p class="${ledeClass}" data-detail-motion-lede>...</p>
```

- [ ] **Step 4: Implement `createBoundaryMotion`**

Implement a controller that caches adjacent project-unit pairs, chooses the pair whose next media is inside the 10–90% viewport transition window, clears the previous pair before switching, and applies `motionFrame` using `gsap.set`. Its render path must:

```js
const progress = boundaryProgress(nextRect.top, window.innerHeight);
const frame = motionFrame(progress, compact);

gsap.set(pair.outgoing.media, {
  y: frame.outgoingMediaY,
  scale: frame.outgoingMediaScale,
  transformOrigin: "50% 50%",
});
gsap.set(pair.outgoing.shade, { opacity: frame.outgoingShade });
gsap.set(pair.outgoing.header, {
  y: frame.outgoingCopyY,
  opacity: frame.outgoingCopyOpacity,
});
gsap.set(pair.incoming.media, {
  y: frame.incomingMediaY,
  scale: frame.incomingMediaScale,
  clipPath: `inset(${(1 - frame.incomingReveal) * 100}% 0 0 0)`,
  transformOrigin: "50% 50%",
});
gsap.set(pair.incoming.title, {
  y: frame.incomingTitleY,
  opacity: frame.incomingTitleOpacity,
});
gsap.set(pair.incoming.meta, {
  y: frame.incomingMetaY,
  opacity: frame.incomingMetaOpacity,
});
gsap.set(pair.incoming.lede, {
  y: frame.incomingLedeY,
  opacity: frame.incomingLedeOpacity,
});
```

`clear()` and `destroy()` must clear `transform`, `opacity`, `clip-path`, and `will-change` from every touched node. Return `isTransitioning()` only while a pair is inside the open interval `(0, 1)`.

- [ ] **Step 5: Wire the controller into `setupDetailScroll`**

Create it only for project detail views. Call `render()` inside the existing animation-frame scroll handler after circular wrapping, `measure()` after every detail measurement, and `destroy()` with the scroll runtime. When wrapping, call `clear()` before the synchronous scroll correction and `render()` on the following frame so equivalent source/clone units receive fresh state.

- [ ] **Step 6: Add motion-only CSS**

```css
.detail-unit__media {
  position: relative;
  overflow: hidden;
}

.detail-unit__media-shade {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: #000;
  opacity: 0;
}

html[data-detail-boundary-motion="active"] .detail-unit__media,
html[data-detail-boundary-motion="active"] [data-detail-motion-title],
html[data-detail-boundary-motion="active"] [data-detail-motion-meta],
html[data-detail-boundary-motion="active"] [data-detail-motion-lede] {
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .detail-unit__media,
  [data-detail-motion-title],
  [data-detail-motion-meta],
  [data-detail-motion-lede] {
    transform: none !important;
    opacity: 1 !important;
    clip-path: none !important;
  }
}
```

- [ ] **Step 7: Run focused and full source tests**

Run: `node --test tests/detail-motion-values.test.mjs tests/detail-boundary-motion.test.mjs tests/detail-title-capitalization.test.mjs tests/article-detail-system.test.mjs`

Expected: all focused tests pass and article-detail assertions remain unchanged.

- [ ] **Step 8: Commit the boundary controller**

```bash
git add src/detail-boundary-motion.js src/detail-state.js src/detail-state.css tests/detail-boundary-motion.test.mjs
git commit -m "Add scroll-driven case-study boundaries"
```

---

### Task 3: Symmetric Shared-Image Route Transitions

**Files:**
- Create: `src/detail-route-transition.js`
- Modify: `src/detail-state.js`
- Modify: `src/detail-state.css`
- Modify: `index.html`
- Modify: `scripts/mirror-source.mjs`
- Create: `tests/detail-route-transition.test.mjs`

**Interfaces:**
- Consumes: `runRouteTransition({ direction, mediaVisual, mediaFrom, mediaTo, copyVisual, nativeTarget, reduceMotion, onComplete })`.
- Produces: `{ timeline, cancel() }`, where `cancel()` restores native visibility and removes every overlay.

- [ ] **Step 1: Write the failing route-transition contract test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("project route transitions share media in both directions", async () => {
  const detail = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const transition = await readFile(new URL("../src/detail-route-transition.js", import.meta.url), "utf8");
  const collection = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(detail, /direction:\s*"enter"/);
  assert.match(detail, /direction:\s*"return"/);
  assert.match(detail, /originSlug/);
  assert.match(detail, /focus\(\{ preventScroll: true \}\)/);
  assert.match(transition, /duration:\s*\.7/);
  assert.match(transition, /ease:\s*"power3\.inOut"/);
  assert.match(transition, /detail-transition-copy/);
  assert.match(transition, /aria-hidden/);
  assert.match(transition, /cancel\(\)/);
  assert.match(collection, /dataset\.projectCardCopy/);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test tests/detail-route-transition.test.mjs`

Expected: FAIL because the route-transition module does not exist.

- [ ] **Step 3: Extract a symmetric transition runner**

Move overlay creation and rectangle interpolation out of `runEntranceTransition` into `src/detail-route-transition.js`. Both directions use the same fixed overlay and transform math:

```js
const delta = {
  x: mediaFrom.left - mediaTo.left,
  y: mediaFrom.top - mediaTo.top,
  scaleX: mediaFrom.width / mediaTo.width,
  scaleY: mediaFrom.height / mediaTo.height,
};

gsap.set(overlay, {
  x: delta.x,
  y: delta.y,
  scaleX: delta.scaleX,
  scaleY: delta.scaleY,
  transformOrigin: "0 0",
});

timeline.to(overlay, {
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
  duration: .7,
  ease: "power3.inOut",
});
```

For entry, animate the cloned collection copy down 12px and out while revealing the detail title, metadata, and lede from their approved offsets during the final third. For return, fade the detail header first, restore and position the collection, then run the media morph toward the card and reveal the card copy. Decorative clones must have `aria-hidden="true"` and no role or accessible label.

The returned `cancel()` must kill the timeline, remove media and copy overlays, restore `nativeTarget.style.visibility`, clear header/card inline properties, and invoke completion exactly once.

- [ ] **Step 4: Add a stable project-card copy hook**

Immediately after creating `copySpacing` in both `index.html` and `scripts/mirror-source.mjs`, add the same non-visual data hook:

```js
const copySpacing = makeElement("div", "margin-bottom space-medium");
copySpacing.dataset.projectCardCopy = "";
```

- [ ] **Step 5: Capture entry source media and copy**

In `openDetail(link)`, capture:

```js
const sourceMedia = link.querySelector(".media-background-holder, .articles-entry__thumbnail");
const sourceCopy = link.querySelector("[data-project-card-copy]");
const sourceVisual = sourceMedia?.cloneNode(true) ?? null;
const sourceCopyVisual = sourceCopy?.cloneNode(true) ?? null;
```

Pass both clones and the source rectangle into `renderDetail`. Limit the cinematic transition to project entries; articles retain their existing immediate/fade behavior.

- [ ] **Step 6: Defer focus until entry completion**

Replace the immediate title focus with the transition completion callback. Fallback and reduced-motion paths focus on the next animation frame. Cancelled entrances must never focus a removed element.

- [ ] **Step 7: Implement reverse restoration**

Before destroying the detail view, capture the active source-set unit's media clone and rectangle. Restore collection nodes, dispatch the existing route-change event, set the saved scroll position, and wait two animation frames. Resolve the visible card with:

```js
const originCard = [...document.querySelectorAll(
  `[data-portfolio-detail-link][data-detail-slug="${originSlug}"]`,
)].find((element) => !element.closest("[aria-hidden='true']"));
```

If the card and its media rectangle exist, run the transition with `direction: "return"`. Otherwise restore focus and native visibility immediately. Resume the collection loop and focus the card only after the overlay lands.

- [ ] **Step 8: Add route-overlay styling**

```css
.detail-transition-media,
.detail-transition-copy {
  position: fixed !important;
  z-index: 120;
  pointer-events: none;
}

.detail-transition-media {
  overflow: hidden;
  background-color: #2b2b2b;
  will-change: transform;
}

.detail-transition-copy {
  z-index: 121;
  will-change: transform, opacity;
}
```

Clear every inline motion property after completion. Preserve the existing reduced-motion rule that prevents overlay display.

- [ ] **Step 9: Run focused route tests**

Run: `node --test tests/detail-route-transition.test.mjs tests/detail-title-capitalization.test.mjs tests/article-detail-system.test.mjs`

Expected: all tests pass.

- [ ] **Step 10: Commit shared route transitions**

```bash
git add src/detail-route-transition.js src/detail-state.js src/detail-state.css index.html scripts/mirror-source.mjs tests/detail-route-transition.test.mjs
git commit -m "Add reversible project detail transitions"
```

---

### Task 4: Regression, Responsive QA, and Final Tuning

**Files:**
- Modify: `AGENTS.md`
- Modify: focused transition files only if QA identifies defects.
- Test: `tests/*.test.mjs`

**Interfaces:**
- Consumes: completed value, boundary, and route-transition modules.
- Produces: verified desktop, mobile, circular, return, direct-load, and reduced-motion behavior.

- [ ] **Step 1: Run all automated checks**

Run:

```bash
git diff --check
node --test --test-reporter=dot tests/*.test.mjs
npm run build
npm run test:sites
```

Expected: zero diff errors, all repository tests pass, Vite produces the required Sites artifacts, and all 7 Sites tests pass. The existing Vite large-chunk warning may remain non-failing.

- [ ] **Step 2: Run explicit browser QA on desktop**

Use the retained local preview and verify `/projects`, a project opened from its visible source card, at least two forward and reverse case-study boundaries, one circular wrap, Close, browser Back, rapid direction reversal, and resize during motion. Record no completion claim unless the rendered interaction was directly observed.

Expected: no layout change, duplicate media, native-background flash, stale transform, focus loss, URL error, or circular jump.

- [ ] **Step 3: Run mobile and reduced-motion QA**

At a width below 992px, verify native scrolling, reduced transform distances, one static source set, direct-loaded details, Close fallback, and touch-compatible progression. Repeat with `?motion=reduce` and confirm there are no overlays, masks, scale effects, parallax, or staggered reveals.

Expected: navigation and focus remain correct and content stays readable without decorative motion.

- [ ] **Step 4: Tune only named motion constants**

If QA requires tuning, adjust only the named distance, stage, shade, and duration constants in the new motion modules. Do not change layout CSS, case-study spacing, type, copy, media mapping, glass behavior, or scroll mode.

- [ ] **Step 5: Record the accepted motion behavior**

Add one durable `AGENTS.md` decision describing the approved shared-frame entrance, scroll-driven boundary choreography, reverse return, responsive reduction, and reduced-motion fallback. Do not include temporary tuning experiments.

- [ ] **Step 6: Repeat all automated checks after tuning or documentation changes**

Run the four commands from Step 1 again.

Expected: all checks remain green.

- [ ] **Step 7: Commit the verified feature**

```bash
git add AGENTS.md src/detail-motion-values.js src/detail-boundary-motion.js src/detail-route-transition.js src/detail-state.js src/detail-state.css tests/detail-motion-values.test.mjs tests/detail-boundary-motion.test.mjs tests/detail-route-transition.test.mjs
git commit -m "Finalize cinematic case-study transitions"
```
