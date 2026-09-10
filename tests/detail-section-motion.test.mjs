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
  assert.match(motion, /ease:\s*"power2\.out"/);
  assert.match(motion, /observer\.unobserve\(section\)/);
  assert.doesNotMatch(motion, /ScrollTrigger|SplitText/);
});

test("section motion is prepared before paint and cleaned up with the detail view", async () => {
  const runtime = await readSource("../src/detail-state.js");

  assert.match(runtime, /createDetailSectionMotion/);
  assert.match(runtime, /const sectionMotion = createDetailSectionMotion\(\{[\s\S]*?view,[\s\S]*?enabled: circular,/);
  assert.match(runtime, /activeDetail = \{[\s\S]*?sectionMotion,/);
  assert.match(runtime, /sectionMotion\.start\(\)/);
  assert.match(runtime, /detail\.sectionMotion\?\.destroy\(\)/);
});

test("article prose reveals in authored groups without splitting individual lines", async () => {
  const motion = await readSource("../src/detail-section-motion.js");
  const runtime = await readSource("../src/detail-state.js");

  assert.match(motion, /\.detail-unit__article-opening, \.detail-unit__article-section/);
  assert.match(motion, /\.detail-unit__article-section h3/);
  assert.match(motion, /\.detail-unit__article-section-body/);
  assert.match(runtime, /sectionMotion\.start\(\)/);
  assert.doesNotMatch(motion, /SplitText|querySelectorAll\("span"\)/);
});

test("project sections omit the former divider and its animation state", async () => {
  const styles = await readSource("../src/detail-state.css");
  const motion = await readSource("../src/detail-section-motion.js");

  assert.match(styles, /\.detail-unit__section--project\s*\{[^}]*border-top:\s*0;[^}]*padding:\s*0;/s);
  assert.doesNotMatch(styles, /\.detail-unit__section--project(?::first-child)?::before/);
  assert.doesNotMatch(styles, /--detail-section-rule-progress/);
  assert.doesNotMatch(motion, /--detail-section-rule-progress|hasRule/);
});
