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
  const [html, runtime, styles] = await Promise.all([
    readFile(new URL("../info/index.html", import.meta.url), "utf8"),
    readFile(new URL("../src/biography.js", import.meta.url), "utf8"),
    readFile(new URL("../src/biography.css", import.meta.url), "utf8"),
  ]);

  assert.equal(html.match(/data-biography-content-anchor/g)?.length, 1);
  assert.equal(html.match(/data-biography-contact-anchor/g)?.length, 1);
  assert.match(html, /class="biography-layout" aria-label="Professional biography"/);
  assert.match(html, /class="media-background-holder landscape biography-portrait-placeholder" role="img" aria-label="Andrew Zellinger in profile"/);
  assert.match(styles, /\.biography-portrait-placeholder\s*\{[^}]*--portfolio-media-image:\s*url\("\/images\/history\/az-headshot-extended-v1\.png"\);/s);
  await access(new URL("../public/images/history/az-headshot-extended-v1.png", import.meta.url));

  const lead = runtime.indexOf('"biography-introduction__lead"');
  const practiceLabel = runtime.indexOf('"biography-introduction__practice-label"');
  const practiceBody = runtime.indexOf('"biography-introduction__practice-body"');
  const introduction = runtime.indexOf("editorial.append(introduction)");
  const experience = runtime.indexOf("editorial.append(experience)");
  const clients = runtime.indexOf("editorial.append(clients)");
  const tools = runtime.indexOf("editorial.append(stack)");
  const availability = runtime.indexOf("editorial.append(availability)");
  assert.equal(practiceLabel, -1);
  assert.ok(lead < practiceBody && practiceBody < introduction);
  assert.ok(introduction < experience && experience < clients && clients < availability);
  assert.equal(tools, -1);
  assert.doesNotMatch(runtime, /supportingLead|editorial\.append\(practice\)/);
  assert.match(runtime, /BIOGRAPHY\.experience\.entries\.forEach/);
  assert.match(runtime, /entry\.organization[\s\S]*entry\.role[\s\S]*entry\.dates/);
  assert.match(runtime, /const clients = labeledSection\("Select Clients", "clients"\);/);
  assert.doesNotMatch(runtime, /BIOGRAPHY\.capabilities\.groups\.forEach|biography-capability|capabilityGrid/);
  assert.doesNotMatch(runtime, /BIOGRAPHY\.stack|biography-tools|biography-block--stack/);
});

test("History uses one flush-left editorial column with shared spacing", async () => {
  const [styles, elevation, motion, runtime] = await Promise.all([
    readFile(new URL("../src/biography.css", import.meta.url), "utf8"),
    readFile(new URL("../src/elevation/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../src/site-motion.js", import.meta.url), "utf8"),
    readFile(new URL("../src/biography.js", import.meta.url), "utf8"),
  ]);
  assert.match(styles, /\.biography-layout\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);[^}]*column-gap:\s*var\(--structure--grid-row-gap\);/s);
  assert.match(styles, /\.biography-editorial\s*\{[^}]*display:\s*grid;[^}]*gap:\s*var\(--biography-section-gap\);/s);
  assert.match(styles, /--biography-section-gap:\s*64px;/);
  assert.match(styles, /--biography-label-gap:\s*24px;/);
  assert.match(styles, /\.biography-block\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);[^}]*gap:\s*var\(--biography-label-gap\);/s);
  assert.match(styles, /\.biography-editorial,\s*\.biography-editorial \*,\s*\.biography-contact,\s*\.biography-contact \*\s*\{[^}]*text-indent:\s*0;[^}]*text-align:\s*left;/s);
  assert.match(styles, /\.biography-editorial :is\(p, h2, h3, dl, dt, dd, ol\)\s*\{[^}]*margin:\s*0;[^}]*padding-inline:\s*0;/s);
  assert.doesNotMatch(styles, /calc\([^;]*- 80px|width:\s*80%/);
  assert.doesNotMatch(elevation, /\.biography-block\s*\{/);
  assert.match(styles, /@media screen and \(max-width:\s*599px\)[\s\S]*--biography-section-gap:\s*48px;/);
  assert.match(styles, /\.biography-introduction\s*\{[^}]*padding-top:\s*48px;/s);
  assert.match(styles, /\.biography-prose > p \+ p\s*\{[^}]*margin-top:\s*16px;/s);
  assert.doesNotMatch(styles, /biography-clients[^}]*calc\(var\(--biography-section-gap\)/s);
  assert.doesNotMatch(styles, /--biography-rule/);
  for (const [, value] of styles.matchAll(/border-(?:top|bottom):([^;]+);/g)) assert.equal(value.trim(), "none");
  assert.match(runtime, /clients\.append\(element\("p", "biography-clients__list"[\s\S]*editorial\.append\(clients\);/s);
  assert.match(runtime, /BIOGRAPHY\.capabilities\.clients\.join\(", "\)/);
  assert.match(styles, /\.biography-editorial \.biography-clients__list\s*\{[^}]*text-transform:\s*none;/s);
  assert.match(motion, /new Set\(\[WORKS_PATH, INDEX_PATH, "\/articles", "\/history"\]\)/);
});

test("History has readable type and white contact links", async () => {
  const styles = await readFile(new URL("../src/biography.css", import.meta.url), "utf8");
  assert.match(styles, /\.biography-introduction__lead\s*\{[^}]*font-size:\s*28px;[^}]*font-weight:\s*500;[^}]*line-height:\s*1\.25;/s);
  assert.match(styles, /--biography-body-size:\s*16px;/);
  assert.match(styles, /--biography-body-leading:\s*1\.625;/);
  assert.match(styles, /\.biography-prose,\s*\.biography-introduction__practice-body\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*66ch;/s);
  assert.match(styles, /\.biography-contact__label\s*\{[^}]*font-size:\s*12px;[^}]*line-height:\s*1\.5;/s);
  const accents = [...styles.matchAll(/([^{}]+)\{[^{}]*color:\s*var\(--swatches--accent-1\);[^{}]*\}/g)].map(match => match[1].trim());
  assert.deepEqual(accents, []);
  assert.match(styles, /\.biography-contact \.biography-contact__link:hover\s*\{[^}]*color:\s*#fff;[^}]*text-decoration:\s*none;/s);
  assert.match(styles, /\.biography-contact__link\s*\{[^}]*overflow-wrap:\s*anywhere;/s);
});

test("History registers stack flush left on phones and clear the fixed menu", async () => {
  const styles = await readFile(new URL("../src/biography.css", import.meta.url), "utf8");
  assert.match(styles, /\.biography-experience__row\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.35fr\) minmax\(0, 1fr\) 112px;[^}]*align-items:\s*baseline;[^}]*padding-block:\s*0;/s);
  assert.match(styles, /\.biography-experience__organization\s*\{[^}]*text-transform:\s*none;/s);
  assert.match(styles, /\.biography-experience-section__heading\s*\{[^}]*padding-bottom:\s*var\(--biography-label-gap\);/s);
  assert.match(styles, /\.biography-experience\s*\{[^}]*display:\s*grid;[^}]*row-gap:\s*16px;/s);
  assert.match(styles, /\.biography-experience\s*\{[^}]*padding:\s*0;[^}]*list-style:\s*none;/s);
  assert.match(styles, /@media \(min-width:\s*992px\)[\s\S]*\.biography-experience\s*\{[^}]*width:\s*90%;[^}]*row-gap:\s*10px;/);
  assert.match(styles, /@media \(min-width:\s*992px\)[\s\S]*\.biography-experience__row\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.15fr\) minmax\(0, \.9fr\) auto;[^}]*column-gap:\s*16px;/);
  assert.match(styles, /@media screen and \(max-width:\s*599px\)[\s\S]*\.biography-experience__row\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) auto;[^}]*row-gap:\s*8px;/);
  assert.match(styles, /@media screen and \(max-width:\s*599px\)[\s\S]*\.biography-contact\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);/);
  assert.match(styles, /@media screen and \(max-width:\s*991px\)[\s\S]*\.biography-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);/);
  assert.match(styles, /padding-bottom:\s*calc\(80px \+ env\(safe-area-inset-bottom, 0px\)\);/);
});
