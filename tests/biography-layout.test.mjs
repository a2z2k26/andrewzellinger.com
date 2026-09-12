import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("History reuses the animated globe as a portrait-only decorative overlay", async () => {
  const runtime = await readFile(new URL("../src/biography.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/biography.css", import.meta.url), "utf8");
  assert.match(runtime, /import \{ createRotatingGlobeIcon \} from "\.\/rotating-globe-icon.js"/);
  assert.match(runtime, /new WeakSet\(\)/);
  assert.match(runtime, /new MutationObserver\(mount\)/);
  assert.match(runtime, /const globe = createRotatingGlobeIcon\(\{\s*fadeMeridians: false,/);
  assert.match(runtime, /fadeMeridians: false,\s*duration: 8575,/);
  assert.match(runtime, /visibilityTarget: portrait\.closest\("\.biography-section"\)/);
  assert.match(styles, /translate\(-50%, -50%\) scaleY\(1\.25\)/);
  assert.match(styles, /\.biography-portrait-globe :is\([^}]+stroke-width: 2;/);
  assert.match(styles, /\.biography-portrait-placeholder\s*\{[^}]*isolation: isolate;/);
  assert.match(styles, /\.biography-portrait-placeholder \.biography-portrait-globe\s*\{[^}]*width: 95%;[^}]*color: #fff;[^}]*mix-blend-mode: overlay;[^}]*opacity: \.08;[^}]*pointer-events: none;/);
  assert.match(styles, /\.biography-portrait-globe \.rotating-globe-icon__outline\s*\{\s*stroke-width: 2;/);
});

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
  assert.match(styles, /\.biography-portrait-placeholder\s*\{[^}]*--portfolio-media-image:\s*url\("\/images\/history\/az-headshot-extended-v1\.png"\);[^}]*width:\s*100%;[^}]*background-size:\s*120% auto !important;/s);
  await access(new URL("../public/images/history/az-headshot-extended-v1.png", import.meta.url));

  const lead = runtime.indexOf('"biography-introduction__lead"');
  const practiceLabel = runtime.indexOf('"biography-introduction__practice-label"');
  const practiceBody = runtime.indexOf('"biography-introduction__practice-body"');
  const introduction = runtime.indexOf("editorial.append(introduction)");
  const perspective = runtime.indexOf("editorial.append(perspective)");
  const experience = runtime.indexOf("editorial.append(experience)");
  const clients = runtime.indexOf("editorial.append(clients)");
  const tools = runtime.indexOf("editorial.append(stack)");
  const availability = runtime.indexOf("editorial.append(availability)");
  assert.equal(practiceLabel, -1);
  assert.ok(lead < practiceBody && practiceBody < introduction);
  assert.equal(perspective, -1);
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
  assert.match(styles, /@media \(min-width:\s*992px\)[\s\S]*html\[data-design-edition="elevated"\] \.page\.info \.title \.container-xlarge\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*calc\(100% - 8px\);[^}]*padding-right:\s*48px;/s);
  assert.match(styles, /@media \(min-width:\s*992px\)[\s\S]*\.biography-layout__spacer\s*\{[^}]*padding-right:\s*48px;/s);
  assert.match(styles, /\.biography-editorial\s*\{[^}]*display:\s*grid;[^}]*gap:\s*var\(--biography-section-gap\);/s);
  assert.match(styles, /--biography-section-gap:\s*64px;/);
  assert.match(styles, /--biography-label-gap:\s*24px;/);
  assert.match(styles, /--biography-content-width:\s*90%;/);
  assert.match(styles, /@media \(min-width:\s*992px\)[\s\S]*?\.biography-portrait-placeholder\s*\{[^}]*width:\s*var\(--biography-content-width\);/s);
  assert.match(styles, /@media \(min-width:\s*992px\)[\s\S]*?\.biography-introduction,\s*\.biography-block,\s*\.biography-experience-section,\s*\.biography-contact\s*\{[^}]*width:\s*var\(--biography-content-width\);/s);
  assert.match(styles, /\.biography-block\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);[^}]*gap:\s*var\(--biography-label-gap\);/s);
  assert.match(styles, /\.biography-editorial,\s*\.biography-editorial \*,\s*\.biography-contact,\s*\.biography-contact \*\s*\{[^}]*text-indent:\s*0;[^}]*text-align:\s*left;/s);
  assert.match(styles, /\.biography-editorial :is\(p, h2, h3, dl, dt, dd, ol\)\s*\{[^}]*margin:\s*0;[^}]*padding-inline:\s*0;/s);
  const contentStyles = styles.replace(/\.biography-portrait-placeholder \.biography-portrait-globe\s*\{[^}]*\}/, "");
  assert.doesNotMatch(contentStyles, /calc\([^;]*- 80px|width:\s*80%/);
  assert.doesNotMatch(elevation, /\.biography-block\s*\{/);
  assert.match(styles, /@media screen and \(max-width:\s*599px\)[\s\S]*--biography-section-gap:\s*40px;/);
  assert.match(styles, /@media screen and \(max-width:\s*599px\)[\s\S]*--biography-label-gap:\s*16px;/);
  assert.match(styles, /@media screen and \(max-width:\s*599px\)[\s\S]*?\.biography-introduction__lead\s*\{[^}]*text-wrap:\s*pretty;/s);
  assert.match(styles, /@media screen and \(max-width:\s*599px\)[\s\S]*?\.biography-experience__row\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) 112px minmax\(0, 1fr\);/s);
  assert.match(styles, /@media screen and \(max-width:\s*599px\)[\s\S]*?\.biography-experience\s*\{[^}]*row-gap:\s*8px;/s);
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
  assert.match(styles, /\.biography-introduction__lead\s*\{[^}]*font-size:\s*28px;[^}]*font-weight:\s*500;[^}]*line-height:\s*var\(--biography-lead-leading\);/s);
  assert.match(styles, /--biography-body-size:\s*16px;/);
  assert.match(styles, /--biography-lead-leading:\s*1\.3;/);
  assert.match(styles, /--biography-body-leading:\s*1\.7;/);
  assert.match(styles, /\.biography-prose,[\s\S]*?\.biography-clients__list\s*\{[^}]*line-height:\s*var\(--biography-body-leading\);/s);
  assert.match(styles, /\.biography-prose,\s*\.biography-introduction__practice-body\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*66ch;/s);
  assert.match(styles, /\.biography-contact__label\s*\{[^}]*font-size:\s*var\(--typography--mono-size\);[^}]*line-height:\s*1\.5;/s);
  const accents = [...styles.matchAll(/([^{}]+)\{[^{}]*color:\s*var\(--swatches--accent-1\);[^{}]*\}/g)].map(match => match[1].trim());
  assert.deepEqual(accents, []);
  assert.match(styles, /\.biography-contact \.biography-contact__link:hover\s*\{[^}]*color:\s*#fff;[^}]*text-decoration:\s*none;/s);
  assert.match(styles, /\.biography-contact__link\s*\{[^}]*overflow-wrap:\s*anywhere;/s);
});

test("History registers stack flush left on phones and clear the fixed menu", async () => {
  const styles = await readFile(new URL("../src/biography.css", import.meta.url), "utf8");
  const runtime = await readFile(new URL("../src/biography.js", import.meta.url), "utf8");
  assert.match(styles, /\.biography-experience__row\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.35fr\) minmax\(0, 1fr\) 112px;[^}]*align-items:\s*baseline;[^}]*padding-block:\s*0;/s);
  assert.match(styles, /\.biography-experience__organization\s*\{[^}]*text-transform:\s*none;/s);
  assert.match(styles, /\.biography-experience-section__heading\s*\{[^}]*padding-bottom:\s*var\(--biography-label-gap\);/s);
  assert.match(styles, /\.biography-experience\s*\{[^}]*display:\s*grid;[^}]*row-gap:\s*16px;/s);
  assert.match(styles, /\.biography-experience\s*\{[^}]*padding:\s*0;[^}]*list-style:\s*none;/s);
  assert.match(styles, /@media \(min-width:\s*992px\)[\s\S]*\.biography-experience\s*\{[^}]*width:\s*100%;[^}]*row-gap:\s*6px;/);
  assert.match(styles, /@media \(min-width:\s*992px\)[\s\S]*\.biography-experience__row\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.15fr\) minmax\(0, \.9fr\) auto;[^}]*column-gap:\s*16px;/);
  assert.match(styles, /@media screen and \(max-width:\s*599px\)[\s\S]*\.biography-experience__role\s*\{[^}]*grid-column:\s*2;[^}]*text-align:\s*left;[^}]*white-space:\s*nowrap;/s);
  assert.match(styles, /@media screen and \(max-width:\s*599px\)[\s\S]*\.biography-experience__dates\s*\{[^}]*grid-column:\s*3;[^}]*justify-self:\s*end;[^}]*text-align:\s*right;/s);
  assert.match(runtime, /element\("div", "biography-contact__label", "Connect"\)/);
  assert.doesNotMatch(runtime, /element\("div", "biography-contact__label", "Email"\)/);
  assert.doesNotMatch(runtime, /mailto:/);
  assert.match(styles, /@media screen and \(max-width:\s*599px\)[\s\S]*\.biography-contact\s*\{[^}]*flex-direction:\s*column;[^}]*align-items:\s*flex-start;[^}]*gap:\s*0;/s);
  assert.match(styles, /@media screen and \(max-width:\s*599px\)[\s\S]*\.biography-contact__socials\s*\{[^}]*flex-direction:\s*column;[^}]*align-items:\s*flex-start;[^}]*gap:\s*0;[^}]*margin-top:\s*var\(--biography-label-gap\);/s);
  assert.match(styles, /@media screen and \(max-width:\s*991px\)[\s\S]*\.biography-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);/);
  assert.match(styles, /padding-bottom:\s*calc\(80px \+ env\(safe-area-inset-bottom, 0px\)\);/);
});
