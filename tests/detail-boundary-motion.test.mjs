import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("detail scrolling owns a reversible project boundary controller", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const controller = await readFile(new URL("../src/detail-boundary-motion.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(runtime, /createBoundaryMotion\(\{ view, circular, reduceMotion, initialUnit \}\)/);
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

test("an expanded project card is not treated as an incoming scroll boundary", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const controller = await readFile(new URL("../src/detail-boundary-motion.js", import.meta.url), "utf8");

  assert.match(runtime, /setupDetailScroll\([\s\S]*?animateFromCard \? \{\s*initialUnit: selectedUnit,/);
  assert.match(runtime, /createBoundaryMotion\(\{ view, circular, reduceMotion, initialUnit \}\)/);
  assert.match(controller, /incoming\.unit !== initialUnit/);
});

test("entry anchoring masks earlier case-study content until the selected card clears its source position", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(runtime, /detail-expansion-curtain/);
  assert.match(runtime, /syncEntryCurtain/);
  assert.match(runtime, /currentY < entryScrollY/);
  assert.match(styles, /\.detail-expansion-curtain\s*\{[^}]*position:\s*fixed;[^}]*z-index:\s*90;[^}]*background:\s*#000;/s);
});
