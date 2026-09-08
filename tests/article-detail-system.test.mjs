import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { ARTICLE_DETAILS } from "../src/article-content.js";

test("article records share reviewed metadata, authored bodies and stable routes", async () => {
  const indexHtml = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");
  const indexRuntime = await readFile(new URL("../src/articles-index.js", import.meta.url), "utf8");
  const source = await readFile(new URL("../src/article-content.js", import.meta.url), "utf8");
  const { ARTICLE_DETAILS: previousArticles } = await import("../docs/editorial/article-source-before-2026-09-08-pass.js");
  assert.equal(ARTICLE_DETAILS.length, 11);
  assert.deepEqual(new Set(ARTICLE_DETAILS.map(a => a.slug)), new Set(previousArticles.map(a => a.slug)));
  assert.deepEqual(ARTICLE_DETAILS.slice(0,3).map(a => a.slug), ["the-constraint-was-the-brief", "intention-deficit-disorder", "company-of-one"]);
  const text = a => a.body.flatMap(b => b.type === "list" ? b.items : [b.text]).join(" ");
  const words = a => text(a).trim().split(/\s+/).length;
  for (const article of ARTICLE_DETAILS) {
    assert.equal(article.kind, "article");
    assert.equal(article.collectionPath, "/articles");
    assert.equal(article.path, `/articles/${article.slug}/`);
    assert.deepEqual(article.meta, ["Andrew Zellinger", "Reviewed Sep 8th 2026", `${Math.max(1, Math.ceil(words(article) / 200))} MIN`]);
    assert.ok(article.summary.length >= 100 && article.summary.length <= 190);
    assert.match(article.summary, /\.$/);
    assert.ok(article.body.every(b => b.type === "list" ? b.items.length && b.items.every(Boolean) : b.text?.trim()));
    assert.equal(article.media.decorative, true);
    assert.ok(indexHtml.includes(`data-detail-slug="${article.slug}"`));
    assert.ok(indexHtml.includes(`aria-label="Read article: ${article.title}"`));
    for (const meta of article.meta) assert.ok(indexHtml.includes(meta));
  }
  const bySlug = slug => ARTICLE_DETAILS.find(a => a.slug === slug);
  const originals = slug => previousArticles.find(a => a.slug === slug);
  assert.equal(text(bySlug("showing-my-teeth")), text(originals("showing-my-teeth")), "personal essay wording is retained pending publication decision");
  for (const slug of ["company-of-one", "a-free-surf-lesson", "intention-deficit-disorder", "two-dollar-bill"]) {
    assert.ok(words(bySlug(slug)) < words(originals(slug)), slug + " should be tightened");
  }
  assert.match(bySlug("cut-defer-or-build").body[0].text, /^Every 0-1 engagement/);
  assert.match(bySlug("design-principles-that-actually-shape-the-product").body[0].text, /^Most design principles die/);
  assert.match(bySlug("what-makes-a-real-mvp").body[0].text, /^I've spent most of my career/);
  assert.doesNotMatch(text(bySlug("company-of-one")), /eight gates|gates make that impossible|no business building/);
  assert.match(text(bySlug("two-dollar-bill")), /does not establish a fifty-fold reduction in total operating cost/);
  assert.match(text(bySlug("what-makes-a-real-mvp")), /not a measured abandonment time/);
  assert.match(text(bySlug("you-always-let-yourself-win")), /hypothetical calibration exercise/);
  assert.doesNotMatch(source, /consolidateParagraphRun/);
  assert.doesNotMatch(JSON.stringify(ARTICLE_DETAILS), /Jason Ramirez/);
  assert.match(indexRuntime, /entry\.meta\.map/);
  assert.match(indexRuntime, /entry\.summary/);
  assert.match(indexRuntime, /Read more/);
});

test("Article Detail renders semantic paragraphs without fixed section labels", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(runtime, /function articleBodyMarkup\(entry\)/);
  assert.match(runtime, /entry\.body\.forEach\(\(block\) =>/);
  assert.match(runtime, /group\.blocks\.map\(articleBodyBlockMarkup\)/);
  assert.match(runtime, /block\?\.type !== "heading"/);
  assert.match(runtime, /detail-unit__article-opening/);
  assert.match(runtime, /detail-unit__article-section/);
  assert.match(runtime, /<h3>\$\{escapeHtml\(group\.heading\)\}<\/h3>/);
  assert.match(runtime, /block\?\.type === "list"/);
  assert.match(runtime, /const tag = block\.ordered \? "ol" : "ul"/);
  assert.match(runtime, /<li>\$\{escapeHtml\(item\)\}<\/li>/);
  assert.match(runtime, /class="detail-unit__article-body"/);
  assert.doesNotMatch(runtime, />Opening<|>Argument<|>Notes</);
  assert.match(styles, /\.detail-unit__article-body\s*\{[^}]*width:\s*100%;[^}]*margin-left:\s*0;[^}]*padding-top:\s*var\(--detail-project-description-section-gap\);/s);
  assert.match(styles, /\.detail-unit__article-body p \+ p\s*\{[^}]*margin-top:\s*24px;/s);
  assert.match(styles, /\.detail-unit__article-body p\s*\{[^}]*text-indent:\s*0;/s);
  assert.match(styles, /\.detail-unit__article-body li \+ li\s*\{[^}]*margin-top:\s*8px;/s);
  assert.match(styles, /\.detail-unit__article-body > :first-child\s*\{[^}]*padding-top:\s*var\(--detail-project-section-copy-edge-gap\);[^}]*border-top:\s*1px solid rgba\(255, 255, 255, \.16\);/s);
  assert.match(styles, /\.detail-unit__article-section\s*\{[^}]*margin-top:\s*40px;/s);
  assert.match(styles, /\.detail-unit__article-section:first-child\s*\{[^}]*margin-top:\s*0;/s);
  assert.doesNotMatch(styles, /\.detail-unit__article-section\s*\{[^}]*border-top:/s);
  assert.match(styles, /\.detail-unit__article-section h3\s*\{[^}]*margin:\s*0;[^}]*color:\s*#9c9c9c;[^}]*font-family:\s*var\(--fonts--family-mono\);[^}]*font-size:\s*12px;[^}]*line-height:\s*13px;[^}]*text-transform:\s*uppercase;/s);
  assert.match(styles, /\.detail-unit__article-section-body\s*\{[^}]*margin-top:\s*24px;/s);
  assert.doesNotMatch(styles, /\.detail-unit__article-section h3\s*\{[^}]*font-family:\s*var\(--fonts--family-display\)/s);
});

test("details keep their current collection navigation and visible headings active", async () => {
  const runtime = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");

  assert.match(runtime, /entry\.kind === "project" \? "Projects" : "Articles"/);
  assert.match(runtime, /const activeCollection = entry\.kind === "project" \? "\/projects" : "\/articles"/);
  assert.match(runtime, /document\.querySelectorAll\("\.nav_menu a"\)/);
  assert.match(runtime, /\.setAttribute\("aria-current", "page"\)/);
});
