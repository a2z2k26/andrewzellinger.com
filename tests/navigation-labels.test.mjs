import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const templatePaths = [
  "../index.html",
  "../articles/index.html",
  "../info/index.html",
  "../detail-shell.html",
];

const canonicalNavigation = [
  { href: "/", label: "Projects" },
  { href: "/articles", label: "Articles" },
  { href: "/history", label: "History" },
];

function navigationEntries(html) {
  return [...html.matchAll(/<a\b([^>]*)>([^<]+)<\/a>/g)]
    .filter(([, attributes]) => /class="[^"]*\bnav_link\b[^"]*"/.test(attributes))
    .map(([, attributes, label]) => ({
      href: attributes.match(/href="([^"]+)"/)?.[1],
      label: label.trim(),
    }));
}

test("every authored template exposes the same canonical navigation map", async () => {
  for (const templatePath of templatePaths) {
    const html = await readFile(new URL(templatePath, import.meta.url), "utf8");
    assert.deepEqual(navigationEntries(html), canonicalNavigation, templatePath);
    assert.doesNotMatch(html, />Index<\/a>/i);
    assert.doesNotMatch(html, />About<\/a>/i);
    assert.doesNotMatch(html, /href="\/(?:index|info)"/i);
  }
});

test("canonical page headings and metadata use the final map", async () => {
  const home = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const articles = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");
  const biography = await readFile(new URL("../info/index.html", import.meta.url), "utf8");

  assert.match(home, /<h1 class="heading">Projects<\/h1>/);
  assert.doesNotMatch(home, /staticField\.append\(portrait\)/);
  assert.match(home, /heading\.textContent = "Projects"/);
  assert.match(home, /<title>Andrew Zellinger • Projects<\/title>/);
  assert.match(home, /<link rel="canonical" href="\/">/);
  assert.match(articles, /<h1 class="heading">Articles<\/h1>/);
  assert.match(articles, /<link rel="canonical" href="\/articles">/);
  assert.match(biography, /<h1 class="heading">History<\/h1>/);
  assert.match(biography, /<title>Andrew Zellinger • History<\/title>/);
  assert.match(biography, /<link rel="canonical" href="\/history">/);
});

test("collection templates keep their active destinations on canonical routes", async () => {
  const home = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const articles = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");
  const biography = await readFile(new URL("../info/index.html", import.meta.url), "utf8");

  assert.match(home, /<a href="\/" aria-current="page" class="nav_link w--current">Projects<\/a>/);
  assert.match(home, /projectsLink\?\.setAttribute\("aria-current", "page"\)/);
  assert.match(articles, /<a href="\/articles" aria-current="page" class="nav_link w--current">Articles<\/a>/);
  assert.match(biography, /<a href="\/history" aria-current="page" class="nav_link w--current">History<\/a>/);
});

test("the mirror generator preserves canonical routes and route-specific page names", async () => {
  const generator = await readFile(new URL("../scripts/mirror-source.mjs", import.meta.url), "utf8");

  assert.ok(generator.includes('href="/"'));
  assert.doesNotMatch(generator, />Home<\/a>/);
  assert.ok(generator.includes('href="/history"'));
  assert.doesNotMatch(generator, />Index<\/a>/);
  assert.match(generator, /heading\.textContent = "Projects"/);
  assert.match(generator, /<h1 class="heading">Projects<\/h1>/);
  assert.match(generator, /<h1 class="heading">History<\/h1>/);
  assert.ok(generator.includes('<div>A. ZELLINGER</div>'));
});

test("elevated page titles use a fixed desktop size without changing compact typography", async () => {
  const styles = await readFile(new URL("../src/elevation/styles.css", import.meta.url), "utf8");
  assert.match(styles, /html\[data-design-edition="elevated"\] \.title \.heading\s*\{\s*font-size: 72px;\s*line-height: \.98;\s*font-weight: 500;/);
  assert.match(styles, /@media \(min-width: 992px\) \{[\s\S]*?html\[data-design-edition="elevated"\] \.title \.heading\s*\{\s*font-size: 124px;\s*font-weight: 500;/);
  assert.match(styles, /@media \(max-width: 991px\)[\s\S]*?\.title \.heading \{ font-size: clamp\(56px, 6\.9vw, 94px\); \}/);
});

test("desktop collection titles and History lead use 28px", async () => {
  const styles = await readFile(new URL("../src/elevation/styles.css", import.meta.url), "utf8");
  assert.match(styles, /@media \(min-width: 992px\) \{[\s\S]*?html\[data-design-edition="elevated"\] \.works-motion-card \.heading-style-h2\.new,\s*html\[data-design-edition="elevated"\] \.articles-entry__title\.heading-style-h2\.new,\s*html\[data-design-edition="elevated"\] \.biography-introduction__lead \{\s*font-size: 28px;\s*\}/);
  assert.match(styles, /\.detail-unit__title \{ font-size: clamp\(30px, 3vw, 44px\);/);
});

test("desktop page titles sit 32px above vertical center with left alignment and compact layout intact", async () => {
  const styles = await readFile(new URL("../src/elevation/styles.css", import.meta.url), "utf8");
  const desktop = styles.slice(styles.indexOf('@media (min-width: 992px) {'), styles.indexOf('@media (max-width: 991px) {'));
  assert.match(desktop, /\.title \{ bottom: 64px; \}/);
  assert.match(desktop, /\.title \.container-xlarge \{ max-width: calc\(50% - 60px\); margin: 0; \}/);
  assert.doesNotMatch(desktop, /bottom: 20vh|top: -3px/);
  assert.doesNotMatch(styles, /\.title \{ padding-bottom: 100px; \}/);
  assert.match(styles, /\.title \{ position: relative; padding: 104px 0 42px; inset: auto; \}/);
});

test("desktop project copy restores its original split and detail titles match collection sizes", async () => {
  const styles = await readFile(new URL("../src/elevation/styles.css", import.meta.url), "utf8");
  const desktop = styles.slice(styles.indexOf('@media (min-width: 992px) {'), styles.indexOf('@media (min-width: 992px) and'));
  assert.match(desktop, /\.detail-unit__project-lockup \.heading-style-h2\.new,\s*html\[data-design-edition="elevated"\] \.detail-unit__title--article \{\s*font-size: 28px;/);
  assert.match(desktop, /\.works-motion-card \.grid\._3-col \{\s*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);\s*column-gap: var\(--structure--grid-row-gap\);\s*align-items: start;/);
  assert.match(desktop, /\.works-motion-card \.grid\._3-col > :nth-child\(2\) \{\s*grid-area: 1 \/ 2 \/ 2 \/ 4;\s*min-width: 0;\s*max-width: none;/);
  // The shared compact defaults remain stacked; only the desktop override splits.
  assert.match(styles, /\.detail-unit__project-lockup \.grid\._3-col \{\s*grid-template-columns: 1fr;/);
});

test("mobile navigation floats over content without a bottom band", async () => {
  const styles = await readFile(new URL("../src/elevation/styles.css", import.meta.url), "utf8");
  assert.doesNotMatch(styles, /body::after/);
  assert.match(styles, /--edition-control-bottom-gap, 48px/);
  assert.match(styles, /env\(safe-area-inset-bottom, 0px\)/);
});

test("the shared identity uses the approved page-title size and logo treatment", async () => {
  const styles = await readFile(new URL("../public/css/site-base.css", import.meta.url), "utf8");
  const fontStyles = await readFile(new URL("../src/site-fonts.css", import.meta.url), "utf8");
  const packageManifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

  assert.match(styles, /--typography-desktop--h1-size:\s*80px;/);
  assert.match(styles, /--typography-desktop--h1-line:\s*80px;/);
  assert.match(styles, /--typography-desktop--h1-font:\s*"Geist",\s*sans-serif;/);
  assert.match(styles, /h1\s*\{[^}]*font-weight:\s*500;/s);
  assert.match(styles, /\.heading\s*\{[^}]*text-transform:\s*none;/s);
  assert.equal(packageManifest.dependencies.geist, "^1.7.2");
  assert.match(fontStyles, /@font-face\s*\{[^}]*font-family:\s*"Geist";[^}]*node_modules\/geist\/dist\/fonts\/geist-sans\/Geist-Medium\.woff2[^}]*font-weight:\s*500;/s);
  assert.match(fontStyles, /@font-face\s*\{[^}]*font-family:\s*"Geist Wordmark";[^}]*Geist-SemiBold\.woff2[^}]*font-weight:\s*600;/s);
  assert.match(styles, /\.nav_brand\s*\{[^}]*font-family:\s*"Geist Wordmark", "Geist", sans-serif;[^}]*font-size:\s*14px;[^}]*font-weight:\s*600;[^}]*font-synthesis:\s*none;/s);
  assert.match(styles, /\.nav_brand\s*\{[^}]*color:\s*#fff;/s);
  assert.doesNotMatch(styles, /\.nav_brand\s*\{[^}]*(?:background(?:-color)?|padding):/s);
  assert.doesNotMatch(styles, /\.nav_brand::(?:before|after)/);
  for (const routeStyles of ["../src/biography.css", "../src/detail-state.css"]) {
    const css = await readFile(new URL(routeStyles, import.meta.url), "utf8");
    assert.doesNotMatch(css, /\.nav_brand\s*\{[^}]*color:/s);
  }
  assert.doesNotMatch(styles, /\.nav_brand__initial/);
  assert.match(styles, /\.home-title-mobile\s*\{\s*display:\s*none;/s);
  assert.match(styles, /@media screen and \(max-width:\s*991px\)[\s\S]*?\.home-title-desktop\s*\{\s*display:\s*none;/s);
  assert.match(styles, /@media screen and \(max-width:\s*991px\)[\s\S]*?\.home-title-mobile\s*\{\s*display:\s*inline;/s);

  for (const templatePath of templatePaths) {
    const html = await readFile(new URL(templatePath, import.meta.url), "utf8");
    assert.match(html, /<a href="\/" class="nav_brand w-inline-block">\s*<div>A\. ZELLINGER<\/div>\s*<\/a>/s);
    assert.doesNotMatch(html, /nav_brand-(?:desktop|mobile)/);
  }
});
