import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("desktop canvas uses a 24px outer frame while mobile remains 16px", async () => {
  const styles = await readFile(
    new URL("../public/css/site-base.css", import.meta.url),
    "utf8",
  );

  assert.match(styles, /--structure--padding-desktop:\s*24px;/);
  assert.match(styles, /--structure--padding-tablet:\s*16px;/);
  assert.match(styles, /--structure--padding-smartphone:\s*16px;/);
  assert.match(styles, /\.container-xlarge\s*\{[^}]*padding-left:\s*var\(--structure--padding-desktop\);[^}]*padding-right:\s*var\(--structure--padding-desktop\);/s);
  assert.match(styles, /\.nav\s*\{[^}]*padding-top:\s*var\(--structure--padding-desktop\);[^}]*padding-bottom:\s*var\(--structure--padding-desktop\);/s);
  assert.match(styles, /\.title\s*\{[^}]*padding-top:\s*var\(--structure--padding-desktop\);[^}]*padding-bottom:\s*var\(--structure--padding-desktop\);/s);
});

test("the landing page mounts Projects without a Home portrait and retains the card gap", async () => {
  const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const details = await readFile(new URL("../src/detail-state.css", import.meta.url), "utf8");

  assert.doesNotMatch(index, /const staticField = makeElement\("div", "index-static-field"\);/);
  assert.doesNotMatch(index, /makeElement\("div", "media-background-holder index-media-placeholder"\)/);
  assert.match(index, /if \(pagePath === "" \|\| pagePath === "\/projects"\) \{\s*document\.documentElement\.classList\.add\("works-motion-route"\)/);
  assert.match(index, /PROJECTS\.forEach\(\(project\) => motionField\.append\(createProjectCard\(project\)\)\)/);
  assert.doesNotMatch(index, /index-motion-(?:field|track|set)|index-scroll-space/);
  assert.match(index, /html\.works-motion-route\s*\{[^}]*--works-card-gap:\s*40px;/s);
  assert.match(index, /html\.works-motion-route \.works-motion-track,[\s\S]*?row-gap:\s*var\(--works-card-gap\);/);
  assert.match(details, /\.detail-sets\s*\{[^}]*gap:\s*var\(--structure--gutter-width\);/s);
});

test("the desktop Projects carousel passes behind the canvas's vertical inset", async () => {
  const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const mirror = await readFile(new URL("../scripts/archive/mirror-source.mjs", import.meta.url), "utf8");

  for (const [label, source] of [["shipped page", index], ["source mirror", mirror]]) {
    assert.match(
      source,
      /html\.works-motion-route \.works-motion-field\s*\{[^}]*position:\s*fixed;[^}]*top:\s*0;[^}]*right:\s*var\(--structure--padding-desktop\);[^}]*bottom:\s*0;[^}]*left:\s*calc\(50% \+ \(var\(--structure--grid-row-gap\) \/ 2\)\);[^}]*overflow:\s*hidden;/s,
      `${label} must clip the moving carousel at the viewport edges while retaining the horizontal rail`,
    );
  }
});

test("the desktop Articles and History carousels pass behind the canvas's vertical inset", async () => {
  const articles = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");
  const biography = await readFile(new URL("../src/biography.css", import.meta.url), "utf8");

  assert.match(
    articles,
    /html\[data-articles-motion="running"\] \.articles-index__list\s*\{[^}]*position:\s*fixed;[^}]*top:\s*0;[^}]*right:\s*var\(--structure--padding-desktop\);[^}]*bottom:\s*0;[^}]*left:\s*calc\(50% \+ \(var\(--structure--grid-row-gap\) \/ 2\)\);[^}]*overflow:\s*hidden;/s,
  );
  assert.match(
    biography,
    /html\[data-history-motion="running"\] \.biography-sweep-viewport\s*\{[^}]*position:\s*fixed;[^}]*top:\s*0;[^}]*right:\s*var\(--structure--padding-desktop\);[^}]*bottom:\s*0;[^}]*left:\s*calc\(50% \+ \(var\(--structure--grid-row-gap\) \/ 2\)\);[^}]*overflow:\s*hidden;/s,
  );
});
