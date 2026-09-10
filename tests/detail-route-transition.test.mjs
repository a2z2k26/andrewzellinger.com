import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("persistent navigation paints above body-level detail transition clones at every breakpoint", async () => {
  const base = await readFile(new URL("../public/css/site-base.css", import.meta.url), "utf8");
  const edition = await readFile(new URL("../src/elevation/styles.css", import.meta.url), "utf8");
  const detail = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");
  const navRule = base.match(/^\.nav\s*\{([^}]+)\}/m)?.[1];
  const navZ = Number(navRule?.match(/z-index:\s*(\d+)/)?.[1]);
  assert.match(navRule, /position:\s*fixed/);
  for (const className of ['detail-transition-media', 'article-transition-copy']) {
    const rules = [...detail.matchAll(new RegExp(`\\.${className}\\s*\\{([^}]+)\\}`, 'g'))];
    const cloneZ = rules.flatMap(match => [...match[1].matchAll(/z-index:\s*(\d+)/g)]).map(match => Number(match[1]));
    assert.ok(cloneZ.length > 0, `${className} has an explicit layer`);
    for (const z of cloneZ) assert.ok(navZ > z, `${className} must be below the navigation ancestor, not just the button`);
  }
  for (const match of edition.matchAll(/\.nav\s*\{([^}]+)\}/g)) {
    const override = match[1].match(/z-index:\s*(\d+)/);
    if (override) assert.ok(Number(override[1]) >= navZ, 'compact navigation must not fall below the shared layer');
  }
});

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
  assert.match(transition, /addLabel\("travel",\s*0\)/);
  assert.match(transition, /addLabel\("expand",\s*\.84\)/);
  assert.match(transition, /duration:\s*1\.2/);
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

test('detail return restores focus before notifying the live collection to resume', async () => {
  const detail = await readFile(new URL('../src/detail-state.js', import.meta.url), 'utf8');
  const motion = await readFile(new URL('../src/site-motion.js', import.meta.url), 'utf8');
  assert.match(detail, /function finishCollectionReturn\(focusTarget\)\s*\{\s*focusTarget\?\.focus\(\{ preventScroll: true \}\);\s*window\.dispatchEvent\(new Event\('portfolio:collection-return-ready'\)\);/);
  const restore = detail.slice(detail.indexOf('async function restoreCollection'), detail.indexOf('function openDetail'));
  assert.equal(restore.match(/finishCollectionReturn\(focusTarget\)/g)?.length, 2, 'animated and missing-target returns both release the hold');
  assert.match(restore, /onComplete:\s*\(\) => \{\s*if \(operation !== routeOperation\) return;/);
  assert.match(motion, /addEventListener\('portfolio:collection-return-ready',[\s\S]*?activeCollectionLoop\?\.resumeAfterDetail\?\.\(\)/);
});

test("expanded project details reuse the canonical Projects lockup", async () => {
  const detail = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(detail, /detail-unit__project-lockup/);
  assert.match(detail, /heading-style-h2 new/);
  assert.match(detail, /display-inlineflex categories/);
  assert.match(detail, /works-meta-spacing/);
  assert.match(detail, /works-project-description/);
  assert.match(styles, /\.detail-unit__project-lockup \.works-media-spacing\s*\{[^}]*margin-bottom:\s*var\(--detail-project-description-section-gap\);/s);
  assert.match(styles, /\.detail-unit__project-lockup \.heading-style-h2\.new\s*\{[^}]*font-size:\s*24px;[^}]*line-height:\s*24px;/s);
  assert.match(styles, /\.detail-unit__project-lockup \.works-project-description\s*\{[^}]*font-size:\s*13px;[^}]*line-height:\s*22px;/s);
  assert.match(styles, /\.detail-unit__title\[tabindex\]:focus-visible\s*\{[^}]*outline:\s*none;/s);
});

test("detail navigation expands vertically and closes through the active project", async () => {
  const detail = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const transition = await readFile(new URL("../src/detail-route-transition.js", import.meta.url), "utf8");
  const motion = await readFile(new URL("../src/site-motion.js", import.meta.url), "utf8");

  assert.match(detail, /const expandedTop = detailTopInset\(\)/);
  assert.match(detail, /sourceCopyRect/);
  assert.match(detail, /nativeCopy:\s*targetCopy/);
  assert.match(detail, /expansionTarget:/);
  assert.match(detail, /const returnSlug = activeSlug/);
  assert.match(detail, /anchorSlug:\s*returnSlug/);
  assert.match(detail, /holdSeconds:\s*1\.35/);
  assert.match(detail, /revealTarget:\s*collectionField/);
  assert.match(transition, /runVerticalExpansion/);
  assert.doesNotMatch(detail, /sourceCopyVisual:\s*targetCopy/);
  assert.doesNotMatch(detail, /destinationCopy:/);
  assert.match(motion, /initialAnchor/);
  assert.match(motion, /anchorSlug/);
});

test("an interrupted detail rerender restores Projects atomically", async () => {
  const detail = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const popState = detail.slice(
    detail.indexOf("function onPopState"),
    detail.indexOf("function initializeDetailState"),
  );

  assert.ok(popState.indexOf("if (pendingDetailRender)") < popState.indexOf("if (activeDetail)"));
  assert.match(popState, /discardPendingDetailRender\(\{ restoreCollection: true \}\);\s*return;/);
  assert.match(detail, /if \(toggle && \(activeDetail \|\| pendingDetailRender\)\)/);
  assert.match(detail, /function destroyDetailView\(detail = activeDetail\)[\s\S]*?if \(activeDetail === detail\) activeDetail = null;/);
});

test("an orphaned detail state cannot leave a collection hidden after Back", async () => {
  const detail = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const popState = detail.slice(
    detail.indexOf("function onPopState"),
    detail.indexOf("function initializeDetailState"),
  );

  assert.match(detail, /function restoreOrphanedCollection\(state\)/);
  assert.match(popState, /if \(activeDetail\) \{\s*restoreCollection\(event\.state\);\s*return;\s*\}\s*restoreOrphanedCollection\(event\.state\);/s);
});

test("article close reloads its collection when a hot-reloaded detail shell has no index", async () => {
  const detail = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const restore = detail.slice(
    detail.indexOf("async function restoreCollection"),
    detail.indexOf("function openDetail"),
  );

  assert.match(restore, /if \(!collectionField\) \{/);
  assert.match(restore, /window\.location\.replace\(previous\.collectionCanonical\);/);
});

test("detail routes cannot leak a generic Detail heading into a collection", async () => {
  const detail = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const shell = await readFile(new URL("../detail-shell.html", import.meta.url), "utf8");

  assert.match(detail, /function collectionChromeFor\(entry\)/);
  assert.doesNotMatch(shell, /<h1 class="heading">Detail<\/h1>/);
});

test("article navigation expands the thumbnail while crossfading the header after travel", async () => {
  const detail = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const transition = await readFile(new URL("../src/detail-route-transition.js", import.meta.url), "utf8");

  assert.match(detail, /data-article-detail-header/);
  assert.match(detail, /\[data-project-card-copy\], \.articles-entry__body/);
  assert.match(detail, /sourceCopyVisual/);
  assert.match(detail, /nativeCopy:\s*targetHeader/);
  assert.match(detail, /copyMode:\s*"crossfade"/);
  assert.match(detail, /runArticleExitTransition/);
  assert.match(transition, /export function runArticleExitTransition/);
  assert.match(transition, /copyMode\s*=\s*"shared"/);
  assert.match(transition, /copyMode === "crossfade"/);
  assert.match(transition, /travel\+=1\.02/);
  assert.match(detail, /revealDuration:\s*isArticle \? \.42 : \.72/);
});
