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
  assert.match(detail, /closestDetailUnit\(previous\.view, activeSlug\)/);
  assert.match(detail, /pendingDetailRender/);
  assert.match(detail, /operation !== routeOperation/);
  assert.match(detail, /focus\(\{ preventScroll: true \}\)/);
  assert.match(transition, /duration:\s*\.7/);
  assert.match(transition, /ease:\s*"power3\.inOut"/);
  assert.doesNotMatch(transition, /detail-transition-copy/);
  assert.match(transition, /glass-proxy-media-ready/);
  assert.match(transition, /glass-proxy-text-ready/);
  assert.match(transition, /aria-hidden/);
  assert.match(transition, /const cancel =/);
  assert.match(collection, /dataset\.projectCardCopy/);
});

test("the collection loop preserves its phase across detail navigation", async () => {
  const motion = await readFile(new URL("../src/site-motion.js", import.meta.url), "utf8");

  assert.match(motion, /loopSnapshots/);
  assert.match(motion, /phase/);
  assert.match(motion, /initialSnapshot/);
});

test("expanded project details reuse the canonical Projects lockup", async () => {
  const detail = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(detail, /detail-unit__project-lockup/);
  assert.match(detail, /heading-style-h2 new/);
  assert.match(detail, /display-inlineflex categories/);
  assert.match(detail, /works-meta-spacing/);
  assert.match(detail, /works-project-description/);
  assert.match(styles, /\.detail-unit__project-lockup \.works-media-spacing\s*\{[^}]*margin-bottom:\s*32px;/s);
  assert.match(styles, /\.detail-unit__project-lockup \.heading-style-h2\.new\s*\{[^}]*font-size:\s*24px;[^}]*line-height:\s*24px;/s);
  assert.match(styles, /\.detail-unit__project-lockup \.works-project-description\s*\{[^}]*font-size:\s*13px;[^}]*line-height:\s*22px;/s);
});

test("detail navigation expands vertically and closes through the active project", async () => {
  const detail = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const transition = await readFile(new URL("../src/detail-route-transition.js", import.meta.url), "utf8");
  const motion = await readFile(new URL("../src/site-motion.js", import.meta.url), "utf8");

  assert.match(detail, /sourceRect\?\.top/);
  assert.match(detail, /const returnSlug = activeSlug/);
  assert.match(detail, /anchorSlug:\s*returnSlug/);
  assert.match(transition, /runVerticalExpansion/);
  assert.doesNotMatch(detail, /sourceCopyVisual/);
  assert.doesNotMatch(detail, /destinationCopy:/);
  assert.match(motion, /initialAnchor/);
  assert.match(motion, /anchorSlug/);
});
