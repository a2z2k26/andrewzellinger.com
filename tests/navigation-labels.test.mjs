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
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
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

  assert.match(home, /<h1 class="heading"><span class="home-title-desktop">Product designer<\/span><span class="home-title-mobile">Designer<\/span><\/h1>/);
  assert.match(home, /if \(pagePath !== "\/projects"\) return;/);
  assert.match(home, /heading\.textContent = "Selected work"/);
  assert.match(home, /<title>Andrew Zellinger • Designer<\/title>/);
  assert.match(home, /<link rel="canonical" href="\/">/);
  assert.match(articles, /<h1 class="heading">Writing samples<\/h1>/);
  assert.match(articles, /<link rel="canonical" href="\/articles">/);
  assert.match(biography, /<h1 class="heading">A brief history<\/h1>/);
  assert.match(biography, /<title>Andrew Zellinger • History<\/title>/);
  assert.match(biography, /<link rel="canonical" href="\/history">/);
});

test("collection templates keep their active destinations on canonical routes", async () => {
  const home = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const articles = await readFile(new URL("../articles/index.html", import.meta.url), "utf8");
  const biography = await readFile(new URL("../info/index.html", import.meta.url), "utf8");

  assert.match(home, /<a href="\/" aria-current="page" class="nav_link w--current">Home<\/a>/);
  assert.match(home, /projectsLink\?\.setAttribute\("aria-current", "page"\)/);
  assert.match(articles, /<a href="\/articles" aria-current="page" class="nav_link w--current">Articles<\/a>/);
  assert.match(biography, /<a href="\/history" aria-current="page" class="nav_link w--current">History<\/a>/);
});

test("the mirror generator preserves canonical routes and route-specific page names", async () => {
  const generator = await readFile(new URL("../scripts/mirror-source.mjs", import.meta.url), "utf8");

  assert.ok(generator.includes('href="/projects"'));
  assert.ok(generator.includes('href="/" class="nav_link">Home</a>'));
  assert.ok(generator.includes('href="/history"'));
  assert.doesNotMatch(generator, />Index<\/a>/);
  assert.match(generator, /heading\.textContent = "Selected work"/);
  assert.match(generator, /<span class=\"home-title-desktop\">Product designer<\/span><span class=\"home-title-mobile\">Designer<\/span>/);
  assert.match(generator, /<h1 class="heading">A brief history<\/h1>/);
});

test("the shared identity uses the approved page-title size and logo treatment", async () => {
  const styles = await readFile(new URL("../public/css/caverzasio.css", import.meta.url), "utf8");
  const fontStyles = await readFile(new URL("../src/site-fonts.css", import.meta.url), "utf8");
  const packageManifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

  assert.match(styles, /--typography-desktop--h1-size:\s*62px;/);
  assert.match(styles, /--typography-desktop--h1-line:\s*62px;/);
  assert.match(styles, /\.heading\s*\{[^}]*text-transform:\s*none;/s);
  assert.equal(packageManifest.dependencies.geist, "^1.7.2");
  assert.match(fontStyles, /@font-face\s*\{[^}]*font-family:\s*"Geist";[^}]*node_modules\/geist\/dist\/fonts\/geist-sans\/Geist-Medium\.woff2[^}]*font-weight:\s*500;/s);
  assert.match(styles, /\.nav_brand\s*\{[^}]*font-family:\s*"Geist", sans-serif;[^}]*font-weight:\s*500;[^}]*font-synthesis:\s*none;/s);
  assert.match(styles, /\.home-title-mobile\s*\{\s*display:\s*none;/s);
  assert.match(styles, /@media screen and \(max-width:\s*991px\)[\s\S]*?\.home-title-desktop\s*\{\s*display:\s*none;/s);
  assert.match(styles, /@media screen and \(max-width:\s*991px\)[\s\S]*?\.home-title-mobile\s*\{\s*display:\s*inline;/s);

  for (const templatePath of templatePaths) {
    const html = await readFile(new URL(templatePath, import.meta.url), "utf8");
    assert.match(html, /<a href="\/" class="nav_brand w-inline-block">\s*<div>A\. ZELLINGER<\/div>\s*<\/a>/s);
    assert.doesNotMatch(html, />ANDREW ZELLINGER</);
    assert.doesNotMatch(html, /nav_brand-(?:desktop|mobile)/);
  }
});
