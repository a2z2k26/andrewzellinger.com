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
  const indexHtml = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");
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

  const [
    companyOfOne,
    aFreeSurfLesson,
    showingMyTeeth,
    intentionDeficitDisorder,
    twoDollarBill,
    youAlwaysLetYourselfWin,
    ...temporaryArticles
  ] = ARTICLE_DETAILS;
  assert.equal(companyOfOne.slug, "company-of-one");
  assert.equal(companyOfOne.title, "Company of One");
  assert.deepEqual(companyOfOne.meta, ["Andrew Zellinger", "Jun 2nd 2026"]);
  assert.match(companyOfOne.summary, /^I spent years building agent systems the wrong way/);
  assert.equal(companyOfOne.body.filter((block) => block.type === "heading").length, 8);
  assert.equal(companyOfOne.body.filter((block) => block.type === "paragraph").length, 16);
  assert.equal(companyOfOne.body[0].text, "At its worst, my agents waited in line");
  assert.match(companyOfOne.body.at(-1).text, /the only success metric that ever mattered\.$/);

  assert.equal(aFreeSurfLesson.slug, "a-free-surf-lesson");
  assert.equal(aFreeSurfLesson.title, "A Free Surf Lesson");
  assert.deepEqual(aFreeSurfLesson.meta, ["Andrew Zellinger", "Jan 9th 2026"]);
  assert.match(aFreeSurfLesson.summary, /^Good taste alone won't save you from the crashing wave\./);
  assert.equal(aFreeSurfLesson.body.filter((block) => block.type === "heading").length, 8);
  assert.equal(aFreeSurfLesson.body.filter((block) => block.type === "paragraph").length, 16);
  assert.equal(aFreeSurfLesson.body[0].text, "It's a comforting story. It's also incomplete");
  assert.match(aFreeSurfLesson.body.at(-1).text, /^Develop your judgement, but build the machinery/);

  assert.equal(showingMyTeeth.slug, "showing-my-teeth");
  assert.equal(showingMyTeeth.title, "Showing My Teeth");
  assert.deepEqual(showingMyTeeth.meta, ["Andrew Zellinger", "Mar 28th 2026"]);
  assert.match(showingMyTeeth.summary, /^Two years after COVID hit New York/);
  assert.equal(showingMyTeeth.body.filter((block) => block.type === "heading").length, 6);
  assert.equal(showingMyTeeth.body.filter((block) => block.type === "paragraph").length, 24);
  assert.equal(showingMyTeeth.body[0].text, "I got fired on the day I left Denver");
  assert.match(showingMyTeeth.body.at(-1).text, /^IF THE IMAGE DOESN'T WORK/);

  assert.equal(intentionDeficitDisorder.slug, "intention-deficit-disorder");
  assert.equal(intentionDeficitDisorder.title, "Intention Deficit Disorder");
  assert.deepEqual(intentionDeficitDisorder.meta, ["Andrew Zellinger", "May 16th 2026"]);
  assert.match(intentionDeficitDisorder.summary, /^Intention debt is the new UX debt/);
  assert.equal(intentionDeficitDisorder.body.filter((block) => block.type === "heading").length, 11);
  assert.equal(intentionDeficitDisorder.body.filter((block) => block.type === "paragraph").length, 47);
  assert.equal(intentionDeficitDisorder.body[0].text, "I call it intention deficit");
  assert.equal(intentionDeficitDisorder.body.at(-1).text, "That starts with treating intent as something worth designing");

  assert.equal(twoDollarBill.slug, "two-dollar-bill");
  assert.equal(twoDollarBill.title, "Two-Dollar Bill");
  assert.deepEqual(twoDollarBill.meta, ["Andrew Zellinger", "May 16th 2026"]);
  assert.match(twoDollarBill.summary, /^Here's what week two taught me/);
  assert.equal(twoDollarBill.body.filter((block) => block.type === "heading").length, 6);
  assert.equal(twoDollarBill.body.filter((block) => block.type === "paragraph").length, 26);
  assert.match(twoDollarBill.body[0].text, /^Because here's what two dollars represents/);
  assert.match(twoDollarBill.body.at(-1).text, /^Nobody puts /);

  assert.equal(youAlwaysLetYourselfWin.slug, "you-always-let-yourself-win");
  assert.equal(youAlwaysLetYourselfWin.title, "You Always Let Yourself Win");
  assert.deepEqual(youAlwaysLetYourselfWin.meta, ["Andrew Zellinger", "May 16th 2026"]);
  assert.match(youAlwaysLetYourselfWin.summary, /^Designers need evals, not just prompts/);
  assert.equal(youAlwaysLetYourselfWin.body.filter((block) => block.type === "heading").length, 10);
  assert.equal(youAlwaysLetYourselfWin.body.filter((block) => block.type === "paragraph").length, 54);
  assert.match(youAlwaysLetYourselfWin.body[0].text, /^Every AI product team hits the same moment/);
  assert.match(youAlwaysLetYourselfWin.body.at(-1).text, /^AI makes production faster/);

  assert.equal(temporaryArticles.length, 4);
  temporaryArticles.forEach((article) => assert.deepEqual(article.body, legacyBody));

  for (const article of ARTICLE_DETAILS.slice(0, 6)) {
    assert.match(indexHtml, new RegExp(`data-detail-slug="${article.slug}"`));
    assert.match(indexHtml, new RegExp(`aria-label="Read article: ${article.title}"`));
  }
  assert.doesNotMatch(indexHtml, /prototypes-as-instruments-for-thinking|where-judgment-enters-the-loop/);

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
