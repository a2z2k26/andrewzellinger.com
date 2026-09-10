import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Articles render as a text-only Projects-style collection", async () => {
  const html = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");
  const runtime = await readFile(new URL("../src/articles-index.js", import.meta.url), "utf8");
  const entries = html.split('<article class="articles-entry" data-article-card-copy>').slice(1);

  assert.equal(entries.length, 11);
  assert.equal(html.match(/data-article-card-copy/g)?.length, 11);
  assert.doesNotMatch(html, /articles-entry__thumbnail|articles-entry__cta|Read more/);
  assert.doesNotMatch(runtime, /articles-entry__thumbnail|articles-entry__cta|entry\.media\.src|Read more/);

  for (const entry of entries) {
    const title = entry.indexOf('class="articles-entry__title heading-style-h2 new"');
    const meta = entry.indexOf('class="articles-entry__meta display-inlineflex categories works-meta-spacing"');
    const excerpt = entry.indexOf('class="articles-entry__excerpt works-project-description"');
    assert.ok(title >= 0 && title < meta && meta < excerpt);
  }

  assert.match(html, /\.articles-entry\s*\{[^}]*display:\s*block;/s);
  assert.match(html, /\.articles-entry__body\s*\{[^}]*width:\s*min\(100%, 60ch\);[^}]*font-family:\s*"Geist",\s*sans-serif;[^}]*font-size:\s*15px;[^}]*grid-template-columns:\s*minmax\(0, 1fr\);[^}]*align-items:\s*start;/s);
  assert.match(html, /\.articles-entry__title\.heading-style-h2\.new\s*\{[^}]*grid-column:\s*1;[^}]*grid-row:\s*auto;[^}]*max-width:\s*none;[^}]*margin:\s*0 0 16px;[^}]*font-size:\s*16px;[^}]*line-height:\s*1\.08;[^}]*text-transform:\s*none;/s);
  assert.match(html, /\.articles-entry__meta\s*\{[^}]*grid-column:\s*1;[^}]*margin:\s*0 0 8px;[^}]*font-family:\s*var\(--fonts--family-mono\);[^}]*font-size:\s*12px;/s);
  assert.match(html, /\.articles-entry__excerpt\s*\{[^}]*grid-column:\s*1;[^}]*font-size:\s*13px;[^}]*line-height:\s*22px;[^}]*overflow:\s*hidden;[^}]*text-overflow:\s*ellipsis;[^}]*-webkit-line-clamp:\s*2;[^}]*line-clamp:\s*2;/s);
  assert.match(html, /@media screen and \(min-width:\s*992px\)[\s\S]*?\.articles-entry__title\.heading-style-h2\.new\s*\{\s*font-size:\s*18px;/s);
  assert.match(html, /@media screen and \(min-width:\s*992px\)[\s\S]*?\.articles-entry__excerpt\s*\{\s*block-size:\s*2lh;/s);
});

test("Articles keep the refined collection rhythm at every breakpoint", async () => {
  const html = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");
  const elevated = await readFile(new URL("../src/elevation/styles.css", import.meta.url), "utf8");

  assert.doesNotMatch(html, /articles-index__header|All \(10\)/i);
  assert.match(html, /\.articles-entry-list > li\s*\{[^}]*padding-top:\s*0;[^}]*padding-bottom:\s*0;[^}]*border-bottom:\s*0;/s);
  assert.match(html, /\.articles-entry-link\s*\{[^}]*width:\s*100%;[^}]*padding-bottom:\s*60px;[^}]*display:\s*block;/s);
  assert.match(elevated, /\.articles-entry-list > li\s*\{\s*padding-block:\s*0;\s*border:\s*0;/s);
  assert.match(elevated, /\.articles-entry-link\s*\{\s*padding-bottom:\s*60px;/s);
  assert.match(elevated, /@media \(max-width: 991px\)[\s\S]*?\.articles-entry-link\s*\{\s*padding-bottom:\s*32px;/s);
  assert.match(html, /@media screen and \(max-width:\s*768px\)[\s\S]*?\.articles-entry__body\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);/s);
  assert.match(html, /@media screen and \(max-width:\s*768px\)[\s\S]*?\.articles-entry__title\.heading-style-h2\.new\s*\{[^}]*grid-row:\s*auto;[^}]*margin-bottom:\s*16px;/s);
  assert.match(html, /@media screen and \(max-width:\s*768px\)[\s\S]*?\.articles-entry__meta\s*\{[^}]*margin:\s*0 0 8px;/s);
  assert.match(html, /@media screen and \(max-width:\s*480px\)[\s\S]*?\.articles-entry-link\s*\{[^}]*padding-bottom:\s*32px;/s);
});

test("Articles motion derives its card-count guard from the shared article records", async () => {
  const motion = await readFile(new URL("../src/site-motion.js", import.meta.url), "utf8");

  assert.match(motion, /import \{ ARTICLE_DETAILS \} from "\.\/article-content\.js";/);
  assert.match(motion, /dataset:\s*"articlesMotion",[\s\S]*?expectedCount:\s*ARTICLE_DETAILS\.length,/);
  assert.doesNotMatch(motion, /dataset:\s*"articlesMotion",[\s\S]*?expectedCount:\s*10,/);
});
