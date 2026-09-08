import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { ARTICLE_DETAILS } from "../src/article-content.js";

const legacyBody = [
  "Temporary article copy. This paragraph establishes the intended editorial measure and reading rhythm; it should be replaced by Andrew's authored introduction.",
  "Temporary article copy. This section reserves space for the central position, supporting examples, and the practical implications of the idea without inventing a finished argument.",
  "Temporary article copy. References, counterpoints, and a closing synthesis will live here once the real draft and supporting sources are available.",
];

test("article records use one shared index/detail source with flexible ordered bodies", async () => {
  const indexRuntime = await readFile(new URL("../src/articles-index.js", import.meta.url), "utf8");
  const detailContent = await readFile(new URL("../src/detail-content.js", import.meta.url), "utf8");

  assert.equal(ARTICLE_DETAILS.length, 10);
  assert.equal(new Set(ARTICLE_DETAILS.map(({ slug }) => slug)).size, 10);
  for (const article of ARTICLE_DETAILS) {
    assert.equal(article.kind, "article");
    assert.equal(article.collectionPath, "/articles");
    assert.equal(article.path, `/articles/${article.slug}/`);
    assert.ok(article.meta.length >= 2);
    assert.ok(article.body.length > 0);
    assert.equal("sections" in article, false);
  }

  const [companyOfOne, ...temporaryArticles] = ARTICLE_DETAILS;
  assert.equal(companyOfOne.slug, "company-of-one");
  assert.equal(companyOfOne.title, "Company of One");
  assert.deepEqual(companyOfOne.meta, ["Andrew Zellinger", "Jun 2nd 2026"]);
  assert.match(companyOfOne.summary, /^I spent years building agent systems the wrong way/);
  assert.equal(companyOfOne.body.filter((block) => block.type === "heading").length, 8);
  assert.equal(companyOfOne.body.filter((block) => block.type === "paragraph").length, 16);
  assert.equal(companyOfOne.body[0].text, "At its worst, my agents waited in line");
  assert.match(companyOfOne.body.at(-1).text, /the only success metric that ever mattered\.$/);
  temporaryArticles.forEach((article) => assert.deepEqual(article.body, legacyBody));

  assert.match(indexRuntime, /import \{ ARTICLE_DETAILS \} from "\.\/article-content\.js"/);
  assert.match(indexRuntime, /entry\.meta\.map/);
  assert.match(indexRuntime, /entry\.summary/);
  assert.match(detailContent, /import \{ ARTICLE_DETAILS \} from "\.\/article-content\.js"/);
});

test("Article Detail renders semantic paragraphs without fixed section labels", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(runtime, /entry\.body\.map\(articleBodyBlockMarkup\)/);
  assert.match(runtime, /block\?\.type === "heading"/);
  assert.match(runtime, /<h3>\$\{escapeHtml\(block\.text\)\}<\/h3>/);
  assert.match(runtime, /class="detail-unit__article-body"/);
  assert.doesNotMatch(runtime, />Opening<|>Argument<|>Notes</);
  assert.match(styles, /\.detail-unit__article-body\s*\{[^}]*margin-left:\s*calc\(\(100% - var\(--structure--grid-row-gap\)\) \/ 3 - var\(--detail-project-section-body-shift\) \+ var\(--structure--grid-row-gap\)\);[^}]*padding-top:\s*var\(--detail-project-description-section-gap\);/s);
  assert.match(styles, /\.detail-unit__article-body p \+ p\s*\{[^}]*margin-top:\s*24px;/s);
  assert.match(styles, /\.detail-unit__article-body h3\s*\{[^}]*margin:\s*48px 0 0;[^}]*font-family:\s*var\(--fonts--family-display\);[^}]*font-size:\s*24px;[^}]*line-height:\s*24px;/s);
  assert.match(styles, /\.detail-unit__article-body h3:first-child\s*\{[^}]*margin-top:\s*0;/s);
  assert.match(styles, /@media screen and \(max-width:\s*767px\)[\s\S]*?\.detail-unit__article-body\s*\{[^}]*margin-left:\s*0;/s);
});

test("details keep their current collection navigation and visible headings active", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");

  assert.match(runtime, /entry\.kind === "project" \? "Selected work" : "Writing samples"/);
  assert.match(runtime, /const activeCollection = entry\.kind === "project" \? "\/projects" : "\/articles"/);
  assert.match(runtime, /document\.querySelectorAll\("\.nav_menu a"\)/);
  assert.match(runtime, /\.setAttribute\("aria-current", "page"\)/);
});
