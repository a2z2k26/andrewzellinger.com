import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Articles thumbnails grow responsively without changing their 3:2 geometry", async () => {
  const html = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");

  assert.match(html, /\.articles-entry\s*\{[^}]*grid-template-columns:\s*288px minmax\(0, 1fr\);/s);
  assert.match(html, /\.articles-entry\s*\{[^}]*align-items:\s*center;/s);
  assert.match(html, /\.articles-entry__thumbnail\s*\{[^}]*width:\s*100%;[^}]*aspect-ratio:\s*3 \/ 2;/s);
  assert.match(html, /@media screen and \(max-width:\s*768px\)[\s\S]*?\.articles-entry\s*\{[^}]*grid-template-columns:\s*224px minmax\(0, 1fr\);/s);
  assert.match(html, /@media screen and \(max-width:\s*480px\)[\s\S]*?\.articles-entry\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);[^}]*row-gap:\s*24px;[^}]*align-items:\s*start;/s);
});

test("Articles use the Projects-like title, metadata, excerpt hierarchy", async () => {
  const html = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");
  const entries = html.split('<article class="articles-entry">').slice(1);

  assert.equal(entries.length, 11);
  for (const entry of entries) {
    const title = entry.indexOf('class="articles-entry__title heading-style-h2 new"');
    const meta = entry.indexOf('class="articles-entry__meta display-inlineflex categories works-meta-spacing"');
    const excerpt = entry.indexOf('class="articles-entry__excerpt works-project-description"');
    assert.ok(title >= 0 && title < meta && meta < excerpt);
  }

  assert.equal(html.match(/articles-entry__title heading-style-h2 new/g)?.length, 11);
  assert.equal(html.match(/articles-entry__meta display-inlineflex categories works-meta-spacing/g)?.length, 11);
  assert.equal(html.match(/articles-entry__excerpt works-project-description/g)?.length, 11);
  assert.equal(html.match(/<span class="articles-entry__cta">Read more<\/span>/g)?.length, 11);
  assert.match(html, /\.articles-entry__title\.heading-style-h2\.new\s*\{[^}]*max-width:\s*80%;[^}]*margin:\s*0;[^}]*font-family:\s*"Geist",\s*sans-serif;[^}]*font-size:\s*24px;[^}]*line-height:\s*24px;[^}]*text-transform:\s*none;[^}]*font-weight:\s*500;/s);
  assert.match(html, /@media screen and \(max-width:\s*768px\)[\s\S]*?\.articles-entry__title\s*\{\s*max-width:\s*80%;\s*\}/s);
  assert.match(html, /\.articles-entry__meta\s*\{[^}]*color:\s*#9c9c9c;[^}]*opacity:\s*1;[^}]*margin-top:\s*16px;[^}]*margin-bottom:\s*var\(--space--desktop-medium\);[^}]*gap:\s*24px;[^}]*font-family:\s*var\(--fonts--family-mono\);[^}]*font-size:\s*12px;[^}]*line-height:\s*13px;[^}]*text-transform:\s*uppercase;[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;/s);
  assert.match(html, /\.articles-entry__excerpt\s*\{[^}]*color:\s*var\(--swatches--light-1\);[^}]*opacity:\s*1;[^}]*margin-top:\s*0;[^}]*font-family:\s*"Geist",\s*sans-serif;[^}]*font-size:\s*13px;[^}]*line-height:\s*24px;[^}]*text-transform:\s*uppercase;[^}]*overflow:\s*hidden;[^}]*display:\s*-webkit-box;[^}]*-webkit-box-orient:\s*vertical;[^}]*-webkit-line-clamp:\s*2;/s);
  assert.match(html, /\.articles-entry__cta\s*\{[^}]*margin-top:\s*24px;[^}]*font-family:\s*"Geist",\s*sans-serif;[^}]*font-size:\s*12px;[^}]*line-height:\s*13px;[^}]*text-transform:\s*uppercase;[^}]*text-decoration:\s*none;[^}]*display:\s*inline-block;/s);
});

test("Articles rows keep route-specific editorial spacing", async () => {
  const html = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");

  assert.doesNotMatch(html, /articles-index__header|All \(10\)/i);
  assert.match(html, /\.articles-entry-list > li\s*\{[^}]*padding-top:\s*48px;[^}]*padding-bottom:\s*48px;[^}]*border-bottom:\s*1px solid rgba\(255, 255, 255, \.16\);/s);
  assert.doesNotMatch(html, /\.articles-entry-list > li \+ li\s*\{[^}]*border-top:/s);
  assert.match(html, /\.articles-entry\s*\{[^}]*grid-column-gap:\s*32px;/s);
  assert.match(html, /@media screen and \(max-width:\s*768px\)[\s\S]*?\.articles-entry\s*\{[^}]*grid-column-gap:\s*32px;/s);
  assert.doesNotMatch(html, /html\[data-articles-motion="running"\] \.articles-motion-set > li:first-child\s*\{[^}]*border-top:\s*0;/s);
  assert.match(html, /@media screen and \(max-width:\s*768px\)[\s\S]*?\.articles-entry-list > li\s*\{[^}]*padding-top:\s*40px;[^}]*padding-bottom:\s*40px;/s);
  assert.match(html, /@media screen and \(max-width:\s*480px\)[\s\S]*?\.articles-entry-list > li\s*\{[^}]*padding-top:\s*32px;[^}]*padding-bottom:\s*32px;/s);
  assert.match(html, /@media screen and \(min-width:\s*992px\)[\s\S]*?\.articles-entry__meta\.works-meta-spacing\s*\{[^}]*margin-bottom:\s*12px;/s);
  assert.match(html, /@media screen and \(max-width:\s*768px\)[\s\S]*?\.articles-entry__meta\s*\{[^}]*margin-top:\s*24px;[^}]*margin-bottom:\s*var\(--space--tablet-medium\);/s);
  assert.match(html, /@media screen and \(max-width:\s*480px\)[\s\S]*?\.articles-entry__meta\s*\{[^}]*margin-top:\s*32px;[^}]*margin-bottom:\s*var\(--space--smartphone-medium\);/s);
});

test("Articles motion derives its card-count guard from the shared article records", async () => {
  const motion = await readFile(new URL("../src/site-motion.js", import.meta.url), "utf8");

  assert.match(motion, /import \{ ARTICLE_DETAILS \} from "\.\/article-content\.js";/);
  assert.match(motion, /dataset:\s*"articlesMotion",[\s\S]*?expectedCount:\s*ARTICLE_DETAILS\.length,/);
  assert.doesNotMatch(motion, /dataset:\s*"articlesMotion",[\s\S]*?expectedCount:\s*10,/);
});
