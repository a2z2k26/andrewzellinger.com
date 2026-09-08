import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import {
  PROJECTS,
  projectCardDescription,
  projectCardTags,
} from "../src/project-content.js";

const expectedTitles = [
  "Audible Sleep",
  "Turner Media",
  "Obagi Care",
  "WeWork Studio",
  "Android Wear",
  "Live Auctioneers",
  "Andrew Eccles",
  "Proctor & Gamble",
  "Modern Age",
  "Fi Collar",
  "Thompson Reuters",
  "Gero Timer",
  "Foursquare Brand",
  "Amazon Fire TV",
  "PwC Audit",
  "NW Mutual",
  "McDonalds Kiosk",
  "Avantos",
  "Positive Brand",
];

test("case-study titles retain canonical project capitalization", () => {
  assert.deepEqual(PROJECTS.map(({ title }) => title), expectedTitles);
});

test("detail routes retain their collection's visible page headings", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");

  assert.match(runtime, /heading\.textContent = entry\.kind === "project" \? "Selected work" : "Writing samples"/);
  assert.doesNotMatch(runtime, /entry\.kind === "project" \? "Case study"/);
});

test("Projects cards and case-study headers share one metadata projection", () => {
  for (const project of PROJECTS) {
    assert.deepEqual(
      projectCardTags(project),
      [project.metadata.client, project.metadata.role, project.metadata.year].filter(Boolean),
      project.slug,
    );
    assert.equal(projectCardDescription(project), project.summary, project.slug);
  }
});

test("project details reuse the Projects lockup while articles retain the editorial header", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(runtime, /heading-style-h2 new detail-unit__title detail-unit__title--project/);
  assert.match(runtime, /detail-unit__title detail-unit__title--\$\{entry\.kind\}/);
  assert.match(runtime, /projectCardTags\(entry\)/);
  assert.match(runtime, /projectCardDescription\(entry\)/);
  assert.match(runtime, /escapeHtml\(entry\.title\)/);
  assert.doesNotMatch(runtime, /entry\.title\.(?:toUpperCase|toLowerCase)\(/);
  assert.match(styles, /\.detail-unit__project-lockup \.heading-style-h2\.new\s*\{[^}]*font-size:\s*24px;[^}]*line-height:\s*24px;[^}]*text-transform:\s*none;/s);
  assert.match(styles, /\.detail-unit__title--article\s*\{[^}]*font-size:\s*32px;[^}]*line-height:\s*32px;[^}]*text-transform:\s*none;/s);
  assert.doesNotMatch(styles, /\.detail-unit__title--project,\s*\.detail-unit__title--article/);
  assert.doesNotMatch(styles, /\.detail-unit__title--article\s*\{[^}]*text-transform:\s*uppercase;/s);
  assert.match(styles, /\.detail-unit__project-lockup \.display-inlineflex\.categories\s*\{[^}]*font-family:\s*var\(--fonts--family-mono\);[^}]*font-size:\s*12px;[^}]*line-height:\s*13px;[^}]*letter-spacing:\s*\.36px;[^}]*text-transform:\s*uppercase;/s);
  assert.match(styles, /\.detail-unit__lede--article\s*\{[^}]*font-family:\s*"Geist",\s*sans-serif;[^}]*font-size:\s*13px;[^}]*line-height:\s*24px;[^}]*letter-spacing:\s*0;[^}]*text-transform:\s*uppercase;/s);
});

test("detail headers render exactly one collection description", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");

  assert.match(runtime, /const lede = isProject \? projectCardDescription\(entry\) : entry\.summary/);
  assert.doesNotMatch(runtime, /sourceSummary|detail-unit__source-summary/);
});

test("project sections and continuous article bodies use sentence-case Geist typography", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(runtime, /detail-unit__section-body detail-unit__section-body--project/);
  assert.match(styles, /\.detail-unit__section-body--project p\s*\{[^}]*color:\s*var\(--swatches--light-1\);[^}]*font-family:\s*"Geist",\s*sans-serif;[^}]*font-size:\s*13px;[^}]*font-weight:\s*400;[^}]*line-height:\s*24px;[^}]*letter-spacing:\s*-0\.01em;[^}]*text-transform:\s*none;/s);
  assert.match(styles, /\.detail-unit__section--project \.detail-unit__section-label\s*\{[^}]*color:\s*#9c9c9c;[^}]*opacity:\s*1;/s);
  assert.match(styles, /\.detail-unit__article-body\s*\{[^}]*font-family:\s*"Geist",\s*sans-serif;[^}]*font-size:\s*13px;[^}]*font-weight:\s*400;[^}]*line-height:\s*24px;[^}]*letter-spacing:\s*-0\.01em;[^}]*text-transform:\s*none;/s);
});

test("project details retain one primary media surface and omit Process media", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.doesNotMatch(runtime, /PROCESS_PLACEHOLDER_SRC|detail-unit__section--process|detail-unit__process-image|>Process</);
  assert.doesNotMatch(styles, /detail-unit__process-image/);
  await assert.rejects(
    access(new URL("../public/images/process-placeholder.svg", import.meta.url)),
    { code: "ENOENT" },
  );
});

test("expanded projects use collection spacing while article details stay unchanged", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(runtime, /detail-unit__copy detail-unit__copy--\$\{entry\.kind\}/);
  assert.match(runtime, /detail-unit__sections detail-unit__sections--project/);
  assert.match(styles, /--detail-article-media-title-gap:\s*44px;/);
  assert.doesNotMatch(styles, /--detail-project-media-title-gap/);
  assert.match(styles, /--detail-project-description-section-gap:\s*64px;/);
  assert.match(styles, /\.detail-unit__copy\s*\{[^}]*padding-top:\s*20px;/s);
  assert.match(styles, /\.detail-unit__copy--article\s*\{[^}]*padding-top:\s*var\(--detail-article-media-title-gap\);/s);
  assert.match(styles, /\.detail-unit__project-lockup \.works-media-spacing\s*\{[^}]*margin-bottom:\s*32px;/s);
  assert.match(styles, /\.detail-unit__sections\s*\{[^}]*padding-top:\s*40px;/s);
  assert.match(styles, /\.detail-unit__sections--project\s*\{[^}]*padding-top:\s*var\(--detail-project-description-section-gap\);/s);
  assert.match(runtime, /detail-unit__section--project-\$\{section\.label\.toLowerCase\(\)\}/);
  assert.match(styles, /--detail-project-section-copy-edge-gap:\s*52px;/);
  assert.match(styles, /--detail-project-section-label-inset:\s*28px;/);
  assert.doesNotMatch(styles, /--detail-project-text-to-divider-gap/);
  assert.match(styles, /\.detail-unit__section\s*\{[^}]*padding-bottom:\s*27px;/s);
  assert.match(styles, /\.detail-unit__section--project-context,\s*\.detail-unit__section--project-work\s*\{[^}]*padding-bottom:\s*var\(--detail-project-section-copy-edge-gap\);/s);
  assert.match(styles, /\.detail-unit__section--project\s*\{[^}]*align-items:\s*baseline;[^}]*padding-top:\s*var\(--detail-project-section-copy-edge-gap\);/s);
  assert.doesNotMatch(styles, /\.detail-unit__section--project \.detail-unit__section-body--project\s*\{[^}]*margin-top:/s);
  assert.match(styles, /@media screen and \(max-width:\s*767px\)[\s\S]*\.detail-unit__section--project\s*\{[^}]*align-items:\s*stretch;[^}]*padding-top:\s*var\(--detail-project-section-label-inset\);/s);
  assert.match(runtime, /detail-unit__section--project detail-unit__section--project-\$\{section\.label\.toLowerCase\(\)\}/);
  assert.match(styles, /--detail-project-section-body-shift:\s*80px;/);
  assert.match(styles, /\.detail-unit__section--project\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*calc\(\(100% - var\(--structure--grid-row-gap\)\) \/ 3 - var\(--detail-project-section-body-shift\)\)\)\s*minmax\(0,\s*1fr\);/s);
  assert.match(runtime, /detail-set detail-set--\$\{name\} detail-set--\$\{kind\}/);
  assert.match(runtime, /detail-view detail-view--\$\{kind\}/);
  assert.match(styles, /--detail-project-inter-unit-gap:\s*144px;/);
  assert.match(styles, /--detail-article-inter-unit-gap:\s*64px;/);
  assert.match(styles, /\.detail-set\.detail-set--project\s*\{[^}]*gap:\s*var\(--detail-project-inter-unit-gap\);/s);
  assert.match(styles, /\.detail-view--project \.detail-sets\s*\{[^}]*gap:\s*var\(--detail-project-inter-unit-gap\);/s);
  assert.match(styles, /\.detail-set\.detail-set--article,\s*\.detail-view--article \.detail-sets\s*\{[^}]*gap:\s*var\(--detail-article-inter-unit-gap\);/s);
});
