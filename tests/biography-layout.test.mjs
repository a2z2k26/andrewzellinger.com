import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Biography permanently omits the Archive-derived reference register", async () => {
  const [html, styles, glass, generator] = await Promise.all([
    readFile(new URL("../info/index.html", import.meta.url), "utf8"),
    readFile(new URL("../src/biography.css", import.meta.url), "utf8"),
    readFile(new URL("../src/effects/glass-surface.js", import.meta.url), "utf8"),
    readFile(new URL("../scripts/mirror-source.mjs", import.meta.url), "utf8"),
  ]);

  for (const source of [html, styles, glass, generator]) {
    assert.doesNotMatch(source, /biography-record|Selected record|renderBiographyArchiveList|biographyArchiveRows/);
  }
  assert.doesNotMatch(html, /Aequitas Lex|Zhero Hotel Ischgl/);
  await assert.rejects(
    access(new URL("../scripts/biography-record-data.mjs", import.meta.url)),
    { code: "ENOENT" },
  );
});

test("Biography renders one semantic editorial source in the approved order", async () => {
  const [html, runtime] = await Promise.all([
    readFile(new URL("../info/index.html", import.meta.url), "utf8"),
    readFile(new URL("../src/biography.js", import.meta.url), "utf8"),
  ]);

  assert.equal(html.match(/data-biography-content-anchor/g)?.length, 1);
  assert.equal(html.match(/data-biography-contact-anchor/g)?.length, 1);
  assert.match(html, /class="biography-layout" aria-label="Professional biography"/);
  assert.match(html, /class="media-background-holder landscape biography-portrait-placeholder"/);

  const lead = runtime.indexOf('"biography-introduction__lead"');
  const practiceLabel = runtime.indexOf('"biography-introduction__practice-label"');
  const practiceBody = runtime.indexOf('"biography-introduction__practice-body"');
  const introduction = runtime.indexOf("editorial.append(introduction)");
  const experience = runtime.indexOf("editorial.append(experience)");
  const capabilities = runtime.indexOf("editorial.append(capabilities)");
  const availability = runtime.indexOf("editorial.append(availability)");
  assert.ok(lead < practiceLabel && practiceLabel < practiceBody && practiceBody < introduction);
  assert.ok(introduction < experience && experience < capabilities && capabilities < availability);
  assert.doesNotMatch(runtime, /supportingLead|editorial\.append\(practice\)/);
  assert.match(runtime, /BIOGRAPHY\.experience\.entries\.forEach/);
  assert.match(runtime, /entry\.organization[\s\S]*entry\.role[\s\S]*entry\.dates/);
});

test("Biography uses the shared editorial type and tightened responsive grid", async () => {
  const [styles, motion, runtime] = await Promise.all([
    readFile(new URL("../src/biography.css", import.meta.url), "utf8"),
    readFile(new URL("../src/site-motion.js", import.meta.url), "utf8"),
    readFile(new URL("../src/biography.js", import.meta.url), "utf8"),
  ]);

  assert.match(styles, /\.biography-layout\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);[^}]*column-gap:\s*var\(--structure--grid-row-gap\);/s);
  assert.match(styles, /\.page\.info \.wrapper\s*\{[^}]*padding-top:\s*var\(--structure--padding-desktop\);[^}]*padding-bottom:\s*var\(--structure--padding-desktop\);/s);
  assert.match(styles, /\.biography-introduction\s*\{[^}]*padding-top:\s*44px;[^}]*padding-bottom:\s*52px;/s);
  assert.doesNotMatch(styles.match(/\.biography-introduction\s*\{[^}]*\}/s)?.[0] ?? "", /border-bottom/);
  assert.match(styles, /\.biography-introduction__lead\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none;[^}]*font-family:\s*var\(--fonts--family-display\);[^}]*font-size:\s*32px;[^}]*line-height:\s*40px;[^}]*text-indent:\s*0;/s);
  assert.match(styles, /@media screen and \(max-width:\s*991px\)[\s\S]*?\.biography-introduction__lead\s*\{[^}]*line-height:\s*32px;/s);
  assert.match(styles, /\.biography-introduction__practice-label\s*\{[^}]*margin-top:\s*52px[^}]*color:\s*#9c9c9c;[^}]*font-family:\s*var\(--fonts--family-mono\);[^}]*font-size:\s*12px;[^}]*line-height:\s*13px;[^}]*text-align:\s*left;[^}]*text-transform:\s*uppercase;/s);
  assert.match(styles, /\.biography-introduction__practice-body\s*\{[^}]*width:\s*80%;[^}]*margin-top:\s*24px[^}]*font-family:\s*"Geist", sans-serif;[^}]*font-size:\s*13px;[^}]*line-height:\s*22px;[^}]*letter-spacing:\s*0;[^}]*text-transform:\s*uppercase;/s);
  assert.match(styles, /@media screen and \(max-width:\s*991px\)[\s\S]*?\.biography-introduction__practice-body\s*\{[^}]*width:\s*100%;/s);
  assert.match(styles, /\.biography-block\s*\{[^}]*grid-template-columns:\s*minmax\(0, calc\([^}]*- 80px\)\) minmax\(0, 1fr\);[^}]*padding-top:\s*52px;[^}]*padding-bottom:\s*52px;/s);
  assert.match(styles, /\.biography-block--capabilities\s*\{[^}]*padding-top:\s*64px;[^}]*padding-bottom:\s*64px;/s);
  assert.match(styles, /\.biography-block--availability\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);[^}]*row-gap:\s*24px;/s);
  assert.match(styles, /\.biography-block--availability \.biography-prose\s*\{[^}]*max-width:\s*none;[^}]*color:\s*var\(--swatches--light-1\);[^}]*font-family:\s*"Geist", sans-serif;[^}]*font-size:\s*13px;[^}]*font-weight:\s*400;[^}]*line-height:\s*22px;[^}]*letter-spacing:\s*0;[^}]*text-indent:\s*0;[^}]*text-transform:\s*uppercase;/s);
  assert.match(styles, /\.biography-block__label,[\s\S]*font-size:\s*12px;[\s\S]*line-height:\s*13px;/s);
  assert.match(styles, /\.biography-prose\s*\{[^}]*font-family:\s*"Geist", sans-serif;[^}]*font-size:\s*13px;[^}]*line-height:\s*24px;[^}]*letter-spacing:\s*-0\.01em;/s);
  assert.match(styles, /\.biography-experience-section\s*\{[^}]*margin-top:\s*40px;[^}]*padding-bottom:\s*52px;/s);
  assert.doesNotMatch(styles.match(/\.biography-experience-section\s*\{[^}]*\}/s)?.[0] ?? "", /border-bottom/);
  assert.match(styles, /@media screen and \(max-width:\s*991px\)[\s\S]*?\.biography-experience-section\s*\{[^}]*margin-top:\s*64px;/s);
  assert.match(styles, /\.biography-experience-section__heading\s*\{[^}]*margin:\s*0;[^}]*padding-bottom:\s*32px;[^}]*color:\s*#9c9c9c;[^}]*font-family:\s*var\(--fonts--family-mono\);[^}]*font-size:\s*12px;[^}]*line-height:\s*13px;[^}]*text-transform:\s*uppercase;/s);
  assert.match(styles, /\.biography-experience__row\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.35fr\) minmax\(0, 1fr\) max-content;[^}]*column-gap:\s*24px;[^}]*padding-top:\s*16px;[^}]*padding-bottom:\s*16px;/s);
  assert.match(styles, /@media screen and \(max-width:\s*991px\)[\s\S]*?\.biography-experience__row\s*\{[^}]*padding-top:\s*24px;[^}]*padding-bottom:\s*24px;/s);
  assert.match(styles, /\.biography-experience__organization\s*\{[^}]*color:\s*var\(--swatches--light-1\);[^}]*font-family:\s*"Geist", sans-serif;[^}]*font-size:\s*13px;[^}]*line-height:\s*22px;[^}]*letter-spacing:\s*0;[^}]*text-transform:\s*uppercase;/s);
  assert.match(styles, /\.biography-capability__items\s*\{[^}]*color:\s*var\(--swatches--light-1\);[^}]*font-family:\s*"Geist", sans-serif;[^}]*font-size:\s*13px;[^}]*line-height:\s*22px;[^}]*letter-spacing:\s*0;[^}]*text-transform:\s*uppercase;/s);
  assert.match(styles, /\.biography-clients\s*\{[^}]*grid-column:\s*1 \/ -1;[^}]*margin-top:\s*52px;[^}]*padding-top:\s*24px;[^}]*border-top:/s);
  assert.match(styles, /\.biography-clients__list\s*\{[^}]*color:\s*var\(--swatches--light-1\);[^}]*font-family:\s*"Geist", sans-serif;[^}]*font-size:\s*13px;[^}]*font-weight:\s*400;[^}]*line-height:\s*22px;[^}]*letter-spacing:\s*0;[^}]*text-indent:\s*0;[^}]*text-transform:\s*uppercase;/s);
  assert.match(styles, /\.biography-block__label,[\s\S]*?\.biography-clients__label,[\s\S]*?color:\s*#9c9c9c;[\s\S]*?font-family:\s*var\(--fonts--family-mono\);[\s\S]*?font-size:\s*12px;[\s\S]*?line-height:\s*13px;/s);
  assert.match(runtime, /capabilitiesContent\.append\(capabilityGrid\);\s*capabilities\.append\(capabilitiesContent, clients\);/s);
  assert.doesNotMatch(runtime, /capabilitiesContent\.append\(capabilityGrid, clients\)/);
  assert.match(styles, /@media screen and \(max-width:\s*767px\)[\s\S]*?\.biography-experience__row\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);[^}]*row-gap:\s*8px;/s);
  assert.match(styles, /@media screen and \(max-width:\s*991px\)[\s\S]*?\.page\.info \.wrapper\s*\{[^}]*padding-top:\s*var\(--structure--padding-tablet\);[^}]*padding-bottom:\s*var\(--structure--padding-tablet\);/s);
  assert.match(motion, /new Set\(\[WORKS_PATH, INDEX_PATH, "\/articles", "\/history"\]\)/);
});
