import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  glassBandFractionForHeight,
  GLASS,
  GLASS_BANDS_ENABLED,
} from "../src/effects/glass-band.js";

test("top and bottom glass bands are disabled site-wide", async () => {
  const siteEntry = await readFile(
    new URL("../src/site-motion.js", import.meta.url),
    "utf8",
  );

  assert.equal(GLASS_BANDS_ENABLED, false);
  assert.doesNotMatch(siteEntry, /effects\/glass-surface\.js/);
  assert.equal(GLASS.band, 0.08);
  assert.equal(GLASS.curve, 1);
  assert.equal(GLASS.strength, 1.5);
  assert.equal(GLASS.chromatic, 0.03);
  assert.equal("warp" in GLASS, false);
});

test("glass bands subtract 24 CSS pixels from the original 8% height", () => {
  for (const viewportHeight of [720, 900, 1080]) {
    const renderedHeight = glassBandFractionForHeight(viewportHeight) * viewportHeight;
    const expectedHeight = viewportHeight * GLASS.band - GLASS.bandReductionPx;
    assert.ok(Math.abs(renderedHeight - expectedHeight) < 1e-9);
  }
});

test("glass bands clamp safely when the viewport is shorter than the reduction", () => {
  assert.equal(glassBandFractionForHeight(200), 0);
});

test("the surface applies the reduced fraction to both shader edges", async () => {
  const surface = await readFile(
    new URL("../src/effects/glass-surface.js", import.meta.url),
    "utf8",
  );

  assert.match(surface, /glassBandFractionForHeight\(nextHeight\)/);
  assert.match(surface, /if \(!GLASS_BANDS_ENABLED\)/);
  assert.match(surface, /uniforms\.uBandTop\.value = bandFraction/);
  assert.match(surface, /uniforms\.uBandBottom\.value = bandFraction/);
  assert.ok(
    surface.indexOf("uniforms.uBandBottom.value = bandFraction")
      < surface.indexOf("if (nextWidth === width"),
    "band uniforms must refresh before the unchanged-size early return",
  );
});

test("glass bands preserve AZRAEL's vertical-only circular refraction", async () => {
  const band = await readFile(
    new URL("../src/effects/glass-band.js", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(band, /uniform float uWarp;/);
  assert.doesNotMatch(band, /displacement\.x \+=/);
  assert.doesNotMatch(band, /uWarp: \{/);
  assert.match(band, /displacement\.y -= edge \* uBandTop \* uStrength;/);
  assert.match(band, /displacement\.y \+= edge \* uBandBottom \* uStrength;/);
});

test("glass bands rasterize retained non-project media surfaces into the shader", async () => {
  const surface = await readFile(
    new URL("../src/effects/glass-surface.js", import.meta.url),
    "utf8",
  );

  assert.match(surface, /const MEDIA_SELECTOR/);
  assert.match(surface, /"\.index-media-placeholder"/);
  assert.match(surface, /"\.articles-entry__thumbnail"/);
  assert.match(surface, /"\.biography-portrait-placeholder"/);
  assert.match(surface, /new THREE\.TextureLoader\(\)\.load/);
  assert.match(surface, /entry\.kind === "media"/);
  assert.match(surface, /"glass-proxy-media-ready"/);
  assert.match(surface, /const TEXT_SELECTOR/);
});

test("transition-sensitive project surfaces remain native DOM paint", async () => {
  const surface = await readFile(
    new URL("../src/effects/glass-surface.js", import.meta.url),
    "utf8",
  );
  const textSelector = surface.slice(
    surface.indexOf("const TEXT_SELECTOR"),
    surface.indexOf("const MEDIA_SELECTOR"),
  );
  const mediaSelector = surface.slice(
    surface.indexOf("const MEDIA_SELECTOR"),
    surface.indexOf("const SURFACE_SELECTOR"),
  );

  assert.doesNotMatch(textSelector, /\.works-motion-card/);
  assert.doesNotMatch(textSelector, /\.detail-unit__title/);
  assert.doesNotMatch(textSelector, /\.detail-unit__meta/);
  assert.doesNotMatch(textSelector, /\.detail-unit__lede/);
  assert.doesNotMatch(mediaSelector, /\.project-media-placeholder/);
  assert.doesNotMatch(mediaSelector, /\.detail-unit__media/);
});

test("glass media proxy crops images with cover geometry instead of stretching", async () => {
  const surface = await readFile(
    new URL("../src/effects/glass-surface.js", import.meta.url),
    "utf8",
  );

  assert.match(surface, /function coverUvFor\(texture, rectangle\)/);
  assert.match(surface, /const imageAspect = imageWidth \/ imageHeight;/);
  assert.match(surface, /const rectangleAspect = rectangle\.width \/ rectangle\.height;/);
  assert.match(surface, /scaleX = rectangleAspect \/ imageAspect;/);
  assert.match(surface, /scaleY = imageAspect \/ rectangleAspect;/);
  assert.match(surface, /uUvScale\.value\.set\(uv\.scaleX, uv\.scaleY\)/);
  assert.match(surface, /uUvOffset\.value\.set\(uv\.offsetX, uv\.offsetY\)/);
  assert.match(surface, /vec2 coverUv = vUv \* uUvScale \+ uUvOffset;/);
});

test("the shader owns one canvas and suppresses duplicate native media paint", async () => {
  const surface = await readFile(
    new URL("../src/effects/glass-surface.js", import.meta.url),
    "utf8",
  );
  const styles = await readFile(
    new URL("../src/effects/glass-surface.css", import.meta.url),
    "utf8",
  );

  assert.match(surface, /const RUNTIME_KEY = "__caverGlassSurfaceRuntime";/);
  assert.match(surface, /previousRuntime\?\.destroy\?\.\(\);/);
  assert.match(surface, /querySelectorAll\("\.glass-band-canvas"\)/);
  assert.match(styles, /html\[data-glass-bands="active"\] \.glass-proxy-media-ready\s*\{[^}]*background-image:\s*none !important;/s);
});

test("the glass proxy respects hidden route-transition targets", async () => {
  const surface = await readFile(
    new URL("../src/effects/glass-surface.js", import.meta.url),
    "utf8",
  );

  assert.match(surface, /style\.visibility === "hidden" \|\| style\.display === "none"/);
  assert.match(surface, /parentStyle\.visibility === "hidden" \|\| parentStyle\.display === "none"/);
});

test("rebuilt loop clones never inherit a glass-ready hidden-paint state", async () => {
  const motion = await readFile(new URL("../src/site-motion.js", import.meta.url), "utf8");

  assert.match(motion, /querySelectorAll\("\.glass-proxy-media-ready, \.glass-proxy-text-ready"\)/);
  assert.match(motion, /classList\.remove\("glass-proxy-media-ready", "glass-proxy-text-ready"\)/);
});

test("the persistent logo and clock remain native above both effects", async () => {
  const surface = await readFile(
    new URL("../src/effects/glass-surface.js", import.meta.url),
    "utf8",
  );
  const surfaceStyles = await readFile(
    new URL("../src/effects/glass-surface.css", import.meta.url),
    "utf8",
  );
  const globalStyles = await readFile(
    new URL("../public/css/caverzasio.css", import.meta.url),
    "utf8",
  );

  const textSelector = surface.slice(
    surface.indexOf("const TEXT_SELECTOR"),
    surface.indexOf("const MEDIA_SELECTOR"),
  );
  assert.doesNotMatch(textSelector, /\.nav_brand/);
  assert.doesNotMatch(textSelector, /#h/);
  assert.match(surface, /"\.title \.heading"/);
  assert.match(surfaceStyles, /\.glass-band-canvas\s*\{[^}]*z-index:\s*80;/s);
  assert.match(globalStyles, /\.nav\s*\{[^}]*z-index:\s*97;/s);
});
