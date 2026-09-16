import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [html, source, styles, siteFonts, motionSource, orbSource] = await Promise.all([
  readFile(new URL("index.html", root), "utf8"),
  readFile(new URL("src/welcome-preface.js", root), "utf8"),
  readFile(new URL("src/welcome-preface.css", root), "utf8"),
  readFile(new URL("src/site-fonts.css", root), "utf8"),
  readFile(new URL("src/site-motion.js", root), "utf8"),
  readFile(new URL("src/thinking-orb-icon.js", root), "utf8"),
]);

test("Projects loads the introduction before the collection motion runtime", () => {
  const prefaceIndex = html.indexOf('/src/welcome-preface.js');
  const motionIndex = html.indexOf('/src/site-motion.js');
  assert.ok(prefaceIndex > -1);
  assert.ok(motionIndex > prefaceIndex);
  assert.match(html, /href="\/src\/welcome-preface\.css"/);
});

test("the retained introduction is launch-gated on, Projects-only, and shown on every arrival", () => {
  assert.match(source, /const WELCOME_PREFACE_ENABLED = true;/);
  assert.match(source, /function shouldOpen\(\) \{\s*if \(!WELCOME_PREFACE_ENABLED\) return false;/);
  assert.match(source, /new Set\(\["", "\/projects"\]\)/);
  assert.match(source, /return HOME_PATHS\.has\(currentPath\(\)\);/);
  assert.doesNotMatch(source, /sessionStorage|SESSION_KEY|readDismissal|rememberDismissal/);
});

test("the introduction waits for the incoming browser top layer before mounting", () => {
  assert.match(source, /function waitForIncomingTopLayer\(\)/);
  assert.match(source, /"onpagereveal" in window/);
  assert.match(source, /event\.viewTransition\.finished\.catch\(\(\) => \{\}\)\.then\(resolve\)/);
  assert.match(source, /incomingTopLayerReady\.then\(mountPreface\)/);
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
  assert.match(source, /createThinkingOrbIcon/);
  assert.match(source, /visitLabel\.textContent = "visit"/);
  assert.match(source, /visitLink\.href = "https:\/\/andrewzellinger\.framer\.website\/"/);
  assert.match(source, /visitLink\.textContent = "temporary\.com"/);
  assert.match(source, /M2 2 30 30M30 2 2 30/);
  assert.match(source, /panel\.append\(orb, title, description, visit, closeButton\)/);
});

test("the modal uses a restrained wider searching preset without a React root", () => {
  assert.match(orbSource, /from "thinking-orbs\/engine"/);
  assert.match(orbSource, /const PRESET_SIZE = 64/);
  assert.match(orbSource, /const FRAME_SIZE = 68/);
  assert.match(orbSource, /const WIDTH = 112/);
  assert.match(orbSource, /const HORIZONTAL_SPREAD = 1\.72/);
  assert.match(orbSource, /resolvePreset\("searching", PRESET_SIZE\)/);
  assert.match(orbSource, /MODE_FRAMES\[mode\]/);
  assert.match(orbSource, /dot\.x = WIDTH \/ 2 \+ \(dot\.x - FRAME_SIZE \/ 2\) \* HORIZONTAL_SPREAD/);
  assert.match(orbSource, /paintFrame\(context, frame, true\)/);
  assert.match(orbSource, /aria-hidden", "true"/);
  assert.match(orbSource, /prefers-reduced-motion: reduce/);
  assert.match(orbSource, /paint\(STATIC_FRAME_TIME\)/);
  assert.match(orbSource, /IntersectionObserver/);
  assert.match(orbSource, /visibilitychange/);
  assert.match(orbSource, /canvas\.destroy = \(\) =>/);
  assert.match(source, /orb\.destroy\?\.\(\)/);
  assert.doesNotMatch(orbSource, /from ["']react|createRoot\(/i);
  assert.match(styles, /\.welcome-preface__orb\s*\{[^}]*width: 112px;[^}]*height: 68px/);
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
  assert.match(styles, /width: min\(448px, calc\(100vw - 48px\)\)/);
  assert.match(styles, /height: 520px/);
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
  assert.match(styles, /\.welcome-preface__description\s*\{[^}]*margin-top: 32px/);
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
  assert.match(phoneStyles, /\.welcome-preface__description\s*\{[^}]*margin-top: 20px;[^}]*font-weight: 700;[^}]*line-height: 20px/);
  assert.match(phoneStyles, /\.welcome-preface__visit\s*\{[^}]*margin-top: 20px;[^}]*font-weight: 700/);
  assert.match(styles, /\.welcome-preface__close\s*\{[^}]*width: 48px;[^}]*height: 48px/);
  assert.match(styles, /@media screen and \(min-width: 992px\)\s*\{\s*\.welcome-preface__panel\s*\{[^}]*width: min\(376px, calc\(100vw - 48px\)\);[^}]*height: 448px;[^}]*padding: 18px 12px 14px;/);
  assert.match(styles, /@media screen and \(min-width: 992px\)[\s\S]*?\.welcome-preface__description\s*\{[^}]*font-size: 14px;[^}]*line-height: 24px;/);
  assert.match(styles, /@media screen and \(min-width: 992px\)[\s\S]*?\.welcome-preface__visit\s*\{[^}]*font-size: 14px;[^}]*line-height: 24px;/);
  assert.match(styles, /@media screen and \(min-width: 992px\)[\s\S]*?\.welcome-preface__close\s*\{[^}]*width: 48px;[^}]*height: 48px;[^}]*margin-top: 34px/);
  assert.match(styles, /@media screen and \(min-width: 992px\)[\s\S]*?\.welcome-preface__close svg\s*\{[^}]*width: 12px;[^}]*height: 12px/);
  assert.match(phoneStyles, /\.welcome-preface__close\s*\{[^}]*flex: 0 0 38px;[^}]*width: 38px;[^}]*height: 38px/);
  assert.match(phoneStyles, /\.welcome-preface__close::before\s*\{[^}]*inset: -5px/);
  assert.match(styles, /\.welcome-preface__close\s*\{[^}]*margin-top: 28px/);
  assert.match(phoneStyles, /\.welcome-preface__panel\s*\{[^}]*width: min\(292px, calc\(100vw - 84px\)\);[^}]*padding: 48px 0 50\.2px;/);
  assert.match(phoneStyles, /\.welcome-preface__orb\s*\{[^}]*width: 95\.2px;[^}]*height: 57\.8px;/);
  assert.match(phoneStyles, /\.welcome-preface__close\s*\{[^}]*margin-top: 28px;[^}]*margin-bottom: 0/);
  assert.match(styles, /border: 0/);
  assert.match(styles, /\.welcome-preface__close\s*\{[\s\S]*?background: rgb\(255 255 255 \/ 4%\)/);
  assert.match(styles, /\.welcome-preface__close\s*\{[\s\S]*?color: #8a8a8a/);
  assert.match(styles, /\.welcome-preface__close svg\s*\{[^}]*width: 14px;[^}]*height: 14px/);
  assert.match(phoneStyles, /\.welcome-preface__close svg\s*\{[^}]*width: 10px;[^}]*height: 10px/);
  assert.match(styles, /\.welcome-preface__close path\s*\{[^}]*stroke-width: 2;/);
  assert.match(styles, /\.welcome-preface__close:hover\s*\{[\s\S]*?background: rgb\(255 255 255 \/ 4%\);[\s\S]*?color: #fff/);
  assert.match(styles, /translate3d\(0, 8px, 0\)/);
  assert.match(styles, /text-transform: none/);
  assert.match(styles, /var\(--motion-duration-response, 240ms\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});
