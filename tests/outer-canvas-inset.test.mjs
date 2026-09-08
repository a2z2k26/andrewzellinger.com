import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("desktop canvas uses a 24px outer frame while mobile remains 16px", async () => {
  const styles = await readFile(
    new URL("../public/css/caverzasio.css", import.meta.url),
    "utf8",
  );

  assert.match(styles, /--structure--padding-desktop:\s*24px;/);
  assert.match(styles, /--structure--padding-tablet:\s*16px;/);
  assert.match(styles, /--structure--padding-smartphone:\s*16px;/);
  assert.match(styles, /\.container-xlarge\s*\{[^}]*padding-left:\s*var\(--structure--padding-desktop\);[^}]*padding-right:\s*var\(--structure--padding-desktop\);/s);
  assert.match(styles, /\.nav\s*\{[^}]*padding-top:\s*var\(--structure--padding-desktop\);[^}]*padding-bottom:\s*var\(--structure--padding-desktop\);/s);
  assert.match(styles, /\.title\s*\{[^}]*padding-top:\s*var\(--structure--padding-desktop\);[^}]*padding-bottom:\s*var\(--structure--padding-desktop\);/s);
});

test("Index uses one fixed portrait field while Projects keeps its own card gap", async () => {
  const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const details = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.match(index, /html\.index-route \.index-static-field\s*\{[^}]*position:\s*fixed;[^}]*top:\s*var\(--structure--padding-desktop\);[^}]*bottom:\s*var\(--structure--padding-desktop\);/s);
  assert.match(index, /\.index-media-placeholder\s*\{[^}]*--portfolio-media-image:\s*url\("\/images\/home\/az-hero-extended-v2\.png"\);/s);
  assert.match(index, /@media screen and \(min-width: 992px\)[\s\S]*?html\.index-route \.index-media-placeholder\s*\{[^}]*background-position:\s*center center !important;/s);
  assert.match(index, /@media screen and \(min-width: 992px\)[\s\S]*?html\.index-route \.index-media-placeholder\s*\{[^}]*background-size:\s*cover !important;[^}]*transform:\s*scale\(1\.1\);[^}]*transform-origin:\s*center center;/s);
  assert.match(index, /const staticField = makeElement\("div", "index-static-field"\);/);
  assert.equal(index.match(/makeElement\("div", "media-background-holder index-media-placeholder"\)/g)?.length, 1);
  assert.doesNotMatch(index, /index-motion-(?:field|track|set)|index-scroll-space/);
  assert.match(index, /html\.works-motion-route\s*\{[^}]*--works-card-gap:\s*32px;/s);
  assert.match(index, /html\.works-motion-route \.works-motion-track,[\s\S]*?row-gap:\s*var\(--works-card-gap\);/);
  assert.match(details, /\.detail-sets\s*\{[^}]*gap:\s*var\(--structure--gutter-width\);/s);
});
