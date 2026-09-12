import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

test("phone page gutters share a 16px token independently of the modal and tablet", async () => {
  const elevated = await readFile(new URL("src/elevation/styles.css", root), "utf8");
  const phoneStart = elevated.indexOf('@media (max-width: 599px) {');
  const phone = elevated.slice(phoneStart);
  assert.match(phone, /--mobile-page-gutter: 16px;/);
  assert.match(phone, /\.container-xlarge,[\s\S]*?\.title \.container-xlarge,[\s\S]*?\.nav > \.container-xlarge:first-child \{\s*padding-inline: var\(--mobile-page-gutter\);/);
  assert.match(phone, /\.nav_h \{ padding-right: var\(--mobile-page-gutter\); \}/);
  assert.match(phone, /\.index-static-field,[\s\S]*?\.works-motion-field,[\s\S]*?\.articles-index,[\s\S]*?\.detail-rail \{\s*margin-inline: var\(--mobile-page-gutter\);/);
  assert.match(elevated.slice(0, phoneStart), /\.container-xlarge \{ padding-inline: 24px; \}/);
  assert.doesNotMatch(phone, /welcome-preface/);
});

test("phone typography uses one shared hierarchy without changing larger breakpoints", async () => {
  const elevated = await readFile(new URL("src/elevation/styles.css", root), "utf8");
  const biography = await readFile(new URL("src/biography.css", root), "utf8");
  const welcome = await readFile(new URL("src/welcome-preface.css", root), "utf8");
  const phone = elevated.slice(elevated.indexOf('@media (max-width: 599px) {'));
  const historyPhone = biography.slice(biography.indexOf('@media screen and (max-width: 599px) {'));
  const welcomePhone = welcome.slice(welcome.indexOf('@media screen and (max-width: 599px) {'));

  assert.match(phone, /\.title \.heading \{ font-size: 32px; \}/);
  assert.match(phone, /\.works-motion-route \{ --works-card-gap: 32px; \}/);
  assert.match(phone, /--mobile-page-top-inset: 132px;/);
  assert.match(phone, /\.title \{ padding-top: var\(--mobile-page-top-inset\); padding-bottom: 32px; \}/);
  assert.match(phone, /\.articles-entry__title\.heading-style-h2\.new,[\s\S]*?\.detail-unit__project-lockup \.heading-style-h2\.new \{\s*font-size: 14px;\s*line-height: 1\.15;/);
  assert.match(phone, /\.detail-unit__title--article \{\s*font-family: "Geist", sans-serif;\s*font-size: 18px;\s*font-weight: 500;\s*line-height: 1\.3;\s*letter-spacing: -\.035em;/);
  assert.match(phone, /\.articles-entry__excerpt,[\s\S]*?\.detail-unit__lede \{\s*font-size: 12px;/);
  assert.match(phone, /\.articles-entry__title\.heading-style-h2\.new \{[^}]*margin-bottom: 6px;[^}]*text-wrap: pretty;/s);
  assert.match(phone, /\.articles-entry__excerpt \{[^}]*line-height: 1\.5;[^}]*text-wrap: pretty;/s);
  assert.match(phone, /\.detail-unit__section-body--project p,[\s\S]*?\.detail-unit__article-body blockquote \{\s*font-size: 14px;/);

  assert.match(historyPhone, /--biography-body-size: 12px;/);
  assert.match(historyPhone, /\.biography-introduction__lead \{\s*font-size: 18px;/);
  assert.match(historyPhone, /\.biography-experience__organization \{[\s\S]*?font-size: clamp\(10px, 3\.08vw, 12px\);/);
  assert.match(historyPhone, /\.biography-experience__role \{[\s\S]*?font-size: clamp\(9px, 2\.56vw, 10px\);/);
  assert.match(historyPhone, /\.biography-contact__link \{\s*font-size: 12px;/);

  assert.match(welcomePhone, /\.welcome-preface__description \{[\s\S]*?font-size: 12px;/);
  assert.match(welcomePhone, /\.welcome-preface__visit \{[\s\S]*?font-size: 12px;/);
});
