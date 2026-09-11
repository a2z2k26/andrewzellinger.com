import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { TEXT_MOTION } from "../src/elevation/text-motion-system.js";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("text motion uses one compact system of timing, distance, and cadence tokens", async () => {
  const styles = await readSource("../src/elevation/styles.css");

  assert.deepEqual(TEXT_MOTION.duration, {
    micro: .16,
    response: .24,
    reveal: .44,
    detail: .72,
    page: .85,
  });
  assert.deepEqual(TEXT_MOTION.stagger, { tight: .03, structural: .05 });
  assert.deepEqual(TEXT_MOTION.distance, { interactive: 4, reveal: 10 });
  for (const token of [
    "--motion-duration-micro: 160ms",
    "--motion-duration-response: 240ms",
    "--motion-duration-reveal: 440ms",
    "--motion-duration-detail: 720ms",
    "--motion-duration-page: 850ms",
    "--motion-stagger-tight: 30ms",
    "--motion-stagger-structural: 50ms",
    "--motion-distance-interactive: 4px",
    "--motion-distance-reveal: 10px",
  ]) assert.ok(styles.includes(token), token);
});

test("only page titles use character-level splitting", async () => {
  const [title, structural, detail, elevation] = await Promise.all([
    readSource("../src/elevation/title-motion.js"),
    readSource("../src/elevation/text-motion-system.js"),
    readSource("../src/detail-section-motion.js"),
    readSource("../src/elevation/index.js"),
  ]);

  assert.match(title, /SplitText/);
  for (const source of [structural, detail, elevation]) assert.doesNotMatch(source, /SplitText/);
});

test("collection copy settles as a staggered group without changing title color", async () => {
  const styles = await readSource("../src/elevation/styles.css");

  assert.match(styles, /\.works-detail-link :is\(\.heading-style-h2\.new, \.categories, \.works-project-description\)/);
  assert.match(styles, /\.articles-entry-link :is\(\.articles-entry__title, \.articles-entry__meta, \.articles-entry__excerpt\)/);
  assert.match(styles, /translate3d\(var\(--motion-distance-interactive\), 0, 0\)/);
  assert.match(styles, /transition-delay:\s*calc\(var\(--motion-stagger-tight\) \* 2\)/);
  assert.doesNotMatch(styles, /\.heading-style-h2\.new[^{}]*\{[^}]*transition-property:\s*[^;}]*color/s);
});

test("History reveals structural text only in compact motion-enabled layouts", async () => {
  const elevation = await readSource("../src/elevation/index.js");

  assert.match(elevation, /innerWidth < 992 && !shouldReduceMotion\(\)/);
  assert.match(elevation, /if \(nextMode === historyTextMode\) return;/);
  assert.match(elevation, /window\.addEventListener\("resize", onHistoryResize/);
  assert.match(elevation, /historyTextParts/);
  assert.match(elevation, /revealStructuralText/);
  assert.doesNotMatch(elevation, /target\.animate\(\[/);
});

test("navigation and contact text use directional, reduced-motion-safe responses", async () => {
  const [navigation, biography] = await Promise.all([
    readSource("../src/site-navigation/styles.css"),
    readSource("../src/biography.css"),
  ]);

  assert.match(navigation, /\.masthead-link \{[^}]*transition:\s*color var\(--motion-duration-micro/s);
  assert.match(navigation, /html:not\(\[data-edition-motion="reduced"\]\) \.site-navigation__back:is\(:hover, :focus-visible\) \.site-navigation__back-arrow \{ transform: translateX\(-3px\); \}/);
  assert.match(biography, /html:not\(\[data-edition-motion="reduced"\]\) \.biography-contact \.biography-contact__link:is\(:hover, :focus-visible\)[^}]*translateX\(var\(--motion-distance-interactive, 4px\)\)/s);
  assert.match(navigation, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(biography, /@media \(prefers-reduced-motion: no-preference\)/);
});
