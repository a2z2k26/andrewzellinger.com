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

test("incoming project media is pre-armed before its first viewport-edge frame", async () => {
  const controller = await readFile(new URL("../src/detail-boundary-motion.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(controller, /BOUNDARY_PENDING_CLASS/);
  assert.match(controller, /nextRect\.top >= window\.innerHeight/);
  assert.match(controller, /classList\.add\(BOUNDARY_PENDING_CLASS\)/);
  assert.match(controller, /classList\.remove\(BOUNDARY_PENDING_CLASS\)/);
  assert.match(styles, /\.detail-unit__media--boundary-pending\s*\{[^}]*clip-path:\s*inset\(100% 0 0 0\);/s);
});

test("article boundaries animate the incoming chapter without moving the completed article", async () => {
  const controller = await readFile(new URL("../src/detail-boundary-motion.js", import.meta.url), "utf8");

  assert.match(controller, /detail-view--project[\s\S]*detail-view--article/);
  assert.match(controller, /const animateOutgoing = view\?\.classList\.contains\("detail-view--project"\)/);
  assert.match(controller, /if \(animateOutgoing\) \{[\s\S]*pair\.outgoing\.media/);
  assert.match(controller, /gsap\.set\(pair\.incoming\.media/);
  assert.match(controller, /gsap\.set\(pair\.incoming\.titles/);
});

test("entry motion places the selected project at the canvas top without an intermediate curtain", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(runtime, /const expandedTop = detailTopInset\(\)/);
  assert.doesNotMatch(runtime, /detail-expansion-curtain|syncEntryCurtain|entryScrollY/);
  assert.doesNotMatch(styles, /\.detail-expansion-curtain/);
});
