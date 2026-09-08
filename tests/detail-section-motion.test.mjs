import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { SECTION_REVEAL } from "../src/detail-section-motion.js";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("project narrative sections use one restrained in-view choreography", async () => {
  const motion = await readSource("../src/detail-section-motion.js");

  assert.equal(SECTION_REVEAL.offsetY, 12);
  assert.ok(SECTION_REVEAL.totalDuration <= .7);
  assert.match(motion, /new IntersectionObserver/);
  assert.match(motion, /--detail-section-rule-progress/);
  assert.match(motion, /ease:\s*"power2\.out"/);
  assert.match(motion, /observer\.unobserve\(section\)/);
  assert.doesNotMatch(motion, /ScrollTrigger|SplitText/);
});

test("section motion is prepared before paint and cleaned up with the detail view", async () => {
  const runtime = await readSource("../src/detail-state.js");

  assert.match(runtime, /createDetailSectionMotion/);
  assert.match(runtime, /const sectionMotion = createDetailSectionMotion\(\{[\s\S]*?view,[\s\S]*?enabled: entry\.kind === "project" && circular,/);
  assert.match(runtime, /activeDetail = \{[\s\S]*?sectionMotion,/);
  assert.match(runtime, /sectionMotion\.start\(\)/);
  assert.match(runtime, /detail\.sectionMotion\?\.destroy\(\)/);
});

test("project rules draw from left to right without changing reduced-motion paint", async () => {
  const styles = await readSource("../src/detail-state.css");

  assert.match(styles, /\.detail-unit__section--project\s*\{[^}]*--detail-section-rule-progress:\s*1;[^}]*border-top-color:\s*transparent;[^}]*position:\s*relative;/s);
  assert.match(styles, /\.detail-unit__section--project::before\s*\{[^}]*transform:\s*scaleX\(var\(--detail-section-rule-progress\)\);[^}]*transform-origin:\s*left center;/s);
});
