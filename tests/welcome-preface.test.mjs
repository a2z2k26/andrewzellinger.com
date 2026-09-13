import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [html, source, styles, siteFonts, motionSource, globeSource, globeStyles] = await Promise.all([
  readFile(new URL("index.html", root), "utf8"),
  readFile(new URL("src/welcome-preface.js", root), "utf8"),
  readFile(new URL("src/welcome-preface.css", root), "utf8"),
  readFile(new URL("src/site-fonts.css", root), "utf8"),
  readFile(new URL("src/site-motion.js", root), "utf8"),
  readFile(new URL("src/rotating-globe-icon.js", root), "utf8"),
  readFile(new URL("src/rotating-globe-icon.css", root), "utf8"),
]);

test("Projects loads the introduction before the collection motion runtime", () => {
  const prefaceIndex = html.indexOf('/src/welcome-preface.js');
  const motionIndex = html.indexOf('/src/site-motion.js');
  assert.ok(prefaceIndex > -1);
  assert.ok(motionIndex > prefaceIndex);
  assert.match(html, /href="\/src\/welcome-preface\.css"/);
});

test("the retained introduction is launch-gated on, Projects-only, and once per browser session", () => {
  assert.match(source, /const WELCOME_PREFACE_ENABLED = true;/);
  assert.match(source, /function shouldOpen\(\) \{\s*if \(!WELCOME_PREFACE_ENABLED\) return false;/);
  assert.match(source, /new Set\(\["", "\/projects"\]\)/);
  assert.match(source, /window\.sessionStorage\.getItem\(SESSION_KEY\)/);
  assert.match(source, /window\.sessionStorage\.setItem\(SESSION_KEY, "true"\)/);
});

test("the approved copy and accessible dialog contract are present", () => {
  assert.match(source, /title\.textContent = "ZELLINGER"/);
  assert.match(source, /description\.textContent = "Years of building with AI has reshaped my design practice\. This site documents what came before, here’s what’s next:"/);
  assert.doesNotMatch(source, /Lorem ipsum/);
  assert.match(source, /role", "dialog"/);
  assert.match(source, /aria-modal", "true"/);
  assert.match(source, /aria-labelledby/);
  assert.match(source, /aria-describedby/);
  assert.match(source, /Close portfolio introduction/);
  assert.match(source, /createRotatingGlobeIcon/);
  assert.match(source, /visitLabel\.textContent = "visit"/);
  assert.match(source, /visitLink\.href = "https:\/\/comingsoon\.com"/);
  assert.match(source, /visitLink\.textContent = "comingsoon\.com"/);
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
  assert.match(globeStyles, /stroke: currentColor/);
  assert.match(globeStyles, /stroke-width: 2\.8/);
  assert.match(globeStyles, /stroke-width: 3\.4/);
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
  assert.match(styles, /background: rgb\(0 0 0 \/ 88%\)/);
  assert.match(styles, /width: min\(464px, calc\(100vw - 48px\)\)/);
  assert.match(styles, /height: 536px/);
  assert.doesNotMatch(styles, /aspect-ratio: 5 \/ 6/);
  assert.match(styles, /\.welcome-preface__panel\s*\{[^}]*justify-content: center/);
  assert.match(styles, /padding: 16px 32px/);
  assert.match(styles, /border-radius: 40px/);
  assert.match(styles, /background: linear-gradient\(180deg, #151515 0%, #121212 100%\)/);
  assert.match(styles, /box-shadow: inset 0 0 0 1px #242424/);
  assert.doesNotMatch(styles, /translate3d\(0, -4px, 0\)/);
  assert.match(styles, /font-family: "Geist Modal"/);
  assert.match(siteFonts, /font-family: "Geist Modal";[\s\S]*?Geist-Bold\.woff2[\s\S]*?font-weight: 700/);
  assert.match(styles, /font-size: 32px/);
  assert.match(styles, /font-weight: 700/);
  assert.match(styles, /line-height: 32px/);
  assert.match(styles, /letter-spacing: \.04em/);
  assert.match(styles, /margin-top: 18px/);
  assert.match(styles, /\.welcome-preface__description\s*\{[^}]*margin-top: 36px/);
  assert.match(styles, /\.welcome-preface__description\s*\{[^}]*text-align: center;[^}]*text-indent: 0/);
  assert.match(styles, /font-size: 16px/);
  assert.match(styles, /\.welcome-preface__description\s*\{[^}]*line-height: 28px/);
  assert.match(styles, /\.welcome-preface__description\s*\{[\s\S]*?color: #8a8a8a/);
  assert.match(styles, /\.welcome-preface__visit\s*\{[\s\S]*?gap: 8px;[\s\S]*?margin-top: 28px;[\s\S]*?color: #8a8a8a[\s\S]*?text-transform: none/);
  assert.match(styles, /\.welcome-preface__visit\s*\{[^}]*text-indent: 0/);
  const phoneStyles = styles.slice(styles.indexOf('@media screen and (max-width: 599px)'));
  assert.match(phoneStyles, /\.welcome-preface\s*\{\s*background: rgb\(0 0 0 \/ 65%\);/);
  assert.doesNotMatch(phoneStyles, /(?:box-shadow|(?:^|[;\s])color|outline-color):/);
  assert.match(phoneStyles, /\.welcome-preface__panel\s*\{[^}]*border-radius: 32px;/);
  assert.match(phoneStyles, /\.welcome-preface__description\s*\{[^}]*margin-top: 24px;[^}]*font-weight: 700;[^}]*line-height: 20px/);
  assert.match(phoneStyles, /\.welcome-preface__visit\s*\{[^}]*margin-top: 20px;[^}]*font-weight: 700/);
  assert.match(styles, /\.welcome-preface__close\s*\{[^}]*width: 48px;[^}]*height: 48px/);
  assert.match(styles, /@media screen and \(min-width: 992px\)\s*\{\s*\.welcome-preface__panel\s*\{[^}]*width: min\(400px, calc\(100vw - 48px\)\);[^}]*height: 464px;[^}]*padding-inline: 12px;/);
  assert.match(styles, /@media screen and \(min-width: 992px\)[\s\S]*?\.welcome-preface__description\s*\{[^}]*font-size: 14px;[^}]*line-height: 24px;/);
  assert.match(styles, /@media screen and \(min-width: 992px\)[\s\S]*?\.welcome-preface__visit\s*\{[^}]*font-size: 14px;[^}]*line-height: 24px;/);
  assert.match(styles, /@media screen and \(min-width: 992px\)[\s\S]*?\.welcome-preface__close\s*\{[^}]*width: 52px;[^}]*height: 52px;[^}]*margin-top: 34px/);
  assert.match(phoneStyles, /\.welcome-preface__close\s*\{[^}]*flex: 0 0 42px;[^}]*width: 42px;[^}]*height: 42px/);
  assert.match(phoneStyles, /\.welcome-preface__close::before\s*\{[^}]*inset: -3px/);
  assert.match(styles, /\.welcome-preface__close\s*\{[^}]*margin-top: 28px/);
  assert.match(phoneStyles, /\.welcome-preface__panel\s*\{[^}]*width: min\(296px, calc\(100vw - 80px\)\);[^}]*padding: 56px 0;/);
  assert.match(phoneStyles, /\.rotating-globe-icon\s*\{[^}]*width: 70px;[^}]*height: 39px/);
  assert.match(phoneStyles, /\.welcome-preface__close\s*\{[^}]*margin-top: 28px;[^}]*margin-bottom: 0/);
  assert.match(styles, /border: 0/);
  assert.match(styles, /\.welcome-preface__close\s*\{[\s\S]*?background: rgb\(255 255 255 \/ 8%\)/);
  assert.match(styles, /\.welcome-preface__close\s*\{[\s\S]*?color: #8a8a8a/);
  assert.match(styles, /\.welcome-preface__close svg\s*\{[^}]*width: 14px;[^}]*height: 14px/);
  assert.match(phoneStyles, /\.welcome-preface__close svg\s*\{[^}]*width: 12px;[^}]*height: 12px/);
  assert.match(styles, /\.welcome-preface__close path\s*\{[^}]*stroke-width: 2;/);
  assert.match(styles, /\.welcome-preface__close:hover\s*\{[\s\S]*?background: rgb\(255 255 255 \/ 8%\);[\s\S]*?color: #fff/);
  assert.match(styles, /translate3d\(0, 8px, 0\)/);
  assert.match(styles, /text-transform: none/);
  assert.match(styles, /var\(--motion-duration-response, 240ms\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});
