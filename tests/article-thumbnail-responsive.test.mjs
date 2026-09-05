import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Articles thumbnails grow responsively without changing their 3:2 geometry", async () => {
  const html = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");

  assert.match(html, /\.articles-entry\s*\{[^}]*grid-template-columns:\s*256px minmax\(0, 1fr\);/s);
  assert.match(html, /\.articles-entry\s*\{[^}]*align-items:\s*center;/s);
  assert.match(html, /\.articles-entry__thumbnail\s*\{[^}]*width:\s*100%;[^}]*aspect-ratio:\s*3 \/ 2;/s);
  assert.match(html, /@media screen and \(max-width:\s*768px\)[\s\S]*?\.articles-entry\s*\{[^}]*grid-template-columns:\s*201px minmax\(0, 1fr\);/s);
  assert.match(html, /@media screen and \(max-width:\s*480px\)[\s\S]*?\.articles-entry\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);[^}]*row-gap:\s*24px;[^}]*align-items:\s*start;/s);
});

test("Articles use the Projects-like title, metadata, excerpt hierarchy", async () => {
  const html = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");
  const entries = html.split('<article class="articles-entry">').slice(1);

  assert.equal(entries.length, 10);
  for (const entry of entries) {
    const title = entry.indexOf('class="articles-entry__title heading-style-h2 new"');
    const meta = entry.indexOf('class="articles-entry__meta display-inlineflex categories works-meta-spacing"');
    const excerpt = entry.indexOf('class="articles-entry__excerpt works-project-description"');
    assert.ok(title >= 0 && title < meta && meta < excerpt);
  }

  assert.equal(html.match(/articles-entry__title heading-style-h2 new/g)?.length, 10);
  assert.equal(html.match(/articles-entry__meta display-inlineflex categories works-meta-spacing/g)?.length, 10);
  assert.equal(html.match(/articles-entry__excerpt works-project-description/g)?.length, 10);
  assert.match(html, /\.articles-entry__title\.heading-style-h2\.new\s*\{[^}]*margin:\s*0;[^}]*font-family:\s*var\(--fonts--family-display\);[^}]*font-size:\s*22px;[^}]*line-height:\s*20px;[^}]*text-transform:\s*none;[^}]*font-weight:\s*400;/s);
  assert.match(html, /\.articles-entry__meta\s*\{[^}]*color:\s*#9c9c9c;[^}]*opacity:\s*1;[^}]*margin-top:\s*12px;[^}]*margin-bottom:\s*var\(--space--desktop-medium\);[^}]*gap:\s*24px;[^}]*font-family:\s*var\(--fonts--family-mono\);[^}]*font-size:\s*12px;[^}]*line-height:\s*13px;[^}]*text-transform:\s*uppercase;[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;/s);
  assert.match(html, /\.articles-entry__excerpt\s*\{[^}]*color:\s*var\(--swatches--light-1\);[^}]*opacity:\s*1;[^}]*margin-top:\s*0;[^}]*font-family:\s*"Geist",\s*sans-serif;[^}]*font-size:\s*13px;[^}]*line-height:\s*24px;[^}]*text-transform:\s*uppercase;/s);
});

test("Articles rows keep route-specific editorial spacing", async () => {
  const html = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");

  assert.match(html, /\.articles-entry-list > li\s*\{[^}]*padding-top:\s*32px;[^}]*padding-bottom:\s*32px;/s);
  assert.doesNotMatch(html, /\.articles-entry-list > li:first-child\s*\{[^}]*padding-top:\s*0;/s);
  assert.match(html, /\.articles-entry\s*\{[^}]*grid-column-gap:\s*24px;/s);
  assert.match(html, /html\[data-articles-motion="running"\] \.articles-motion-set > li\s*\{[^}]*padding-top:\s*32px;[^}]*padding-bottom:\s*32px;[^}]*border-top:/s);
  assert.match(html, /@media screen and \(max-width:\s*768px\)[\s\S]*?\.articles-entry-list > li\s*\{[^}]*padding-top:\s*24px;[^}]*padding-bottom:\s*24px;/s);
  assert.match(html, /@media screen and \(min-width:\s*992px\)[\s\S]*?\.articles-entry__meta\.works-meta-spacing\s*\{[^}]*margin-bottom:\s*12px;/s);
  assert.match(html, /@media screen and \(max-width:\s*768px\)[\s\S]*?\.articles-entry__meta\s*\{[^}]*margin-bottom:\s*var\(--space--tablet-medium\);/s);
  assert.match(html, /@media screen and \(max-width:\s*480px\)[\s\S]*?\.articles-entry__meta\s*\{[^}]*margin-bottom:\s*var\(--space--smartphone-medium\);/s);
});
