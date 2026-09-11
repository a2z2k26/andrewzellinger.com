import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [html, source, styles, siteFonts, motionSource, globeSource] = await Promise.all([
  readFile(new URL("index.html", root), "utf8"),
  readFile(new URL("src/welcome-preface.js", root), "utf8"),
  readFile(new URL("src/welcome-preface.css", root), "utf8"),
  readFile(new URL("src/site-fonts.css", root), "utf8"),
  readFile(new URL("src/site-motion.js", root), "utf8"),
  readFile(new URL("src/rotating-globe-icon.js", root), "utf8"),
]);

test("Projects loads the introduction before the collection motion runtime", () => {
  const prefaceIndex = html.indexOf('/src/welcome-preface.js');
  const motionIndex = html.indexOf('/src/site-motion.js');
  assert.ok(prefaceIndex > -1);
  assert.ok(motionIndex > prefaceIndex);
  assert.match(html, /href="\/src\/welcome-preface\.css"/);
});

test("the introduction is Projects-only and once per browser session", () => {
  assert.match(source, /new Set\(\["", "\/projects"\]\)/);
  assert.match(source, /window\.sessionStorage\.getItem\(SESSION_KEY\)/);
  assert.match(source, /window\.sessionStorage\.setItem\(SESSION_KEY, "true"\)/);
});

test("the approved copy and accessible dialog contract are present", () => {
  assert.match(source, /title\.textContent = "ZELLINGER"/);
  assert.match(source, /Lorem ipsum dolor amet, consectetur<br>adipiscing elit\. Aenean et sapien augue\.<br>ipsum dolor amet consectetur\./);
  assert.match(source, /role", "dialog"/);
  assert.match(source, /aria-modal", "true"/);
  assert.match(source, /aria-labelledby/);
  assert.match(source, /aria-describedby/);
  assert.match(source, /Close portfolio introduction/);
  assert.match(source, /createRotatingGlobeIcon/);
  assert.match(source, /visitLabel\.textContent = "visit"/);
  assert.match(source, /visitLink\.href = "https:\/\/www\.frgmnt\.ai"/);
  assert.match(source, /visitLink\.textContent = "www\.frgmnt\.ai"/);
  assert.match(source, /M2 2 30 30M30 2 2 30/);
  assert.match(source, /panel\.append\(globe, title, description, visit, closeButton\)/);
});

test("the modal globe remains vector, horizontally animated, and reduced-motion safe", () => {
  assert.match(globeSource, /createElementNS\(SVG_NS/);
  assert.match(globeSource, /viewBox: "0 0 128 72"/);
  assert.match(globeSource, /duration = 6860/);
  assert.match(globeSource, /MERIDIAN_RADIUS \* Math\.sin\(longitude\)/);
  assert.match(globeSource, /Math\.cos\(longitude\)/);
  assert.match(globeSource, /requestAnimationFrame\(tick\)/);
  assert.match(globeSource, /prefers-reduced-motion: reduce/);
  assert.match(globeSource, /IntersectionObserver/);
  assert.match(globeSource, /svg\.destroy = cleanup/);
  assert.match(source, /globe\.destroy\?\.\(\)/);
  assert.doesNotMatch(globeSource, /canvas|<img|\.png|\.jpg/);
  assert.match(styles, /\.rotating-globe-icon\s*\{[\s\S]*?width: 82\.8px;[\s\S]*?height: 46px;[\s\S]*?color: #8a8a8a/);
  assert.match(styles, /stroke: currentColor/);
  assert.match(styles, /stroke-width: 2\.8/);
  assert.match(styles, /stroke-width: 3\.4/);
});

test("dismissal and background behavior cover pointer, keyboard, focus, and uninterrupted carousel motion", () => {
  assert.match(source, /event\.target === backdrop/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /event\.key !== "Tab"/);
  assert.match(source, /SCROLL_KEYS\.has\(event\.key\)/);
  assert.match(source, /backdrop\.addEventListener\("wheel", onBlockedScrollInput, \{ passive: false \}\)/);
  assert.match(source, /backdrop\.addEventListener\("touchmove", onBlockedScrollInput, \{ passive: false \}\)/);
  assert.match(source, /backdrop\.removeEventListener\("wheel", onBlockedScrollInput\)/);
  assert.match(source, /event\.stopPropagation\(\)/);
  assert.match(source, /page\.inert = true/);
  assert.match(source, /priorFocus\.focus/);
  assert.doesNotMatch(source, /setMotionPause|motion-pause/);
  assert.match(motionSource, /filter\(\(item\) => !item\.closest\("\[data-loop-clone\]"\)\)/);
  assert.doesNotMatch(motionSource, /filter\(\(item\) => !item\.closest\("\[aria-hidden='true'\]"\)\)/);
  assert.match(source, /window\.addEventListener\("pagehide", onPageHide/);
});

test("the Figma modal composition and reduced-motion treatment remain explicit", () => {
  assert.match(styles, /background: rgb\(0 0 0 \/ 80%\)/);
  assert.match(styles, /width: min\(528px, calc\(100vw - 48px\)\)/);
  assert.match(styles, /height: 600px/);
  assert.doesNotMatch(styles, /aspect-ratio: 5 \/ 6/);
  assert.match(styles, /padding: 96px 64px 84px/);
  assert.match(styles, /border-radius: 16px/);
  assert.match(styles, /background: linear-gradient\(180deg, #151515 0%, #121212 100%\)/);
  assert.match(styles, /box-shadow: inset 0 0 0 1px #242424/);
  assert.match(styles, /\.rotating-globe-icon,[\s\S]*?\.welcome-preface__visit\s*\{[\s\S]*?transform: translate3d\(0, -4px, 0\)/);
  assert.match(styles, /font-family: "Geist Modal"/);
  assert.match(siteFonts, /font-family: "Geist Modal";[\s\S]*?Geist-Bold\.woff2[\s\S]*?font-weight: 700/);
  assert.match(styles, /font-size: 32px/);
  assert.match(styles, /font-weight: 700/);
  assert.match(styles, /line-height: 32px/);
  assert.match(styles, /letter-spacing: \.04em/);
  assert.match(styles, /margin-top: 18px/);
  assert.match(styles, /\.welcome-preface__description\s*\{[\s\S]*?margin-top: 44px/);
  assert.match(styles, /font-size: 16px/);
  assert.match(styles, /line-height: 32px/);
  assert.match(styles, /\.welcome-preface__description\s*\{[\s\S]*?color: #8a8a8a/);
  assert.match(styles, /\.welcome-preface__visit\s*\{[\s\S]*?gap: 6px;[\s\S]*?margin-top: 36px;[\s\S]*?color: #8a8a8a[\s\S]*?text-transform: none/);
  assert.match(styles, /width: 52px/);
  assert.match(styles, /height: 52px/);
  assert.match(styles, /border: 0/);
  assert.match(styles, /\.welcome-preface__close\s*\{[\s\S]*?background: rgb\(255 255 255 \/ 8%\)/);
  assert.match(styles, /\.welcome-preface__close\s*\{[\s\S]*?color: #8a8a8a/);
  assert.match(styles, /width: 16px/);
  assert.match(styles, /height: 16px/);
  assert.match(styles, /\.welcome-preface__close:hover\s*\{[\s\S]*?background: rgb\(255 255 255 \/ 8%\);[\s\S]*?color: #fff/);
  assert.match(styles, /translate3d\(0, 8px, 0\)/);
  assert.match(styles, /text-transform: none/);
  assert.match(styles, /var\(--motion-duration-response, 240ms\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});
