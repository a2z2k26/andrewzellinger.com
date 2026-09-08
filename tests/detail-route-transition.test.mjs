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

test("the collection loop preserves its phase across detail navigation", async () => {
  const motion = await readFile(new URL("../src/site-motion.js", import.meta.url), "utf8");

  assert.match(motion, /loopSnapshots/);
  assert.match(motion, /phase/);
  assert.match(motion, /initialSnapshot/);
});
