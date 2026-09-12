import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("shared DOM liquid-glass lens follows the refractive tutorial model", async () => {
  const html = await readFile(new URL("../dev/liquid-glass-lab.html", import.meta.url), "utf8");
  const runtime = await readFile(new URL("../src/effects/dom-glass-lens.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/effects/dom-glass-lens.css", import.meta.url), "utf8");
  const siteEntry = await readFile(new URL("../src/site-motion.js", import.meta.url), "utf8");
  const band = await readFile(new URL("../src/effects/glass-band.js", import.meta.url), "utf8");

  assert.match(html, /data-dom-glass-lens/);
  assert.match(runtime, /feDisplacementMap/);
  assert.match(runtime, /1 - radius \* radius/);
  assert.match(runtime, /settings\.warp/);
  assert.match(runtime, /waveX/);
  assert.match(runtime, /waveY/);
  assert.match(runtime, /settings\.refraction \+ settings\.chromatic/);
  assert.match(runtime, /settings\.refraction - settings\.chromatic/);
  assert.match(styles, /backdrop-filter:\s*url\("#dom-liquid-glass"\)/);
  assert.match(styles, /box-shadow:/);
  assert.match(styles, /0 0 7px rgba\(255,255,255,calc\(\.18 \* var\(--lens-rim\)\)\) inset/);
  assert.match(styles, /filter:\s*blur\(\.35px\)/);
  assert.match(siteEntry, /center-control\.js/);
  assert.doesNotMatch(siteEntry, /center-glass-lens\.js|dom-glass-lens\.js/);
  assert.doesNotMatch(siteEntry, /dom-glass-lab|liquid-chrome/);
  assert.doesNotMatch(band, /uLens|plusMaterial|plusControls/);
});

test("white center control retains its reversible panel sequence with responsive geometry", async () => {
  const styles = await readFile(new URL("../src/effects/center-control.css", import.meta.url), "utf8");
  const runtime = await readFile(new URL("../src/effects/center-control.js", import.meta.url), "utf8");
  const surface = await readFile(new URL("../src/effects/center-gooey-surface.jsx", import.meta.url), "utf8");
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.match(styles, /\.center-nav-shell\s*\{[^}]*--center-nav-closed-size:\s*100px;[^}]*--center-nav-menu-width:\s*280px;[^}]*--center-nav-menu-height:\s*320px;[^}]*width:\s*360px;[^}]*height:\s*380px/s);
  assert.match(styles, /\.center-nav-shell\s*\{[^}]*align-self:\s*center/s);
  assert.match(styles, /\.center-nav-shell\s*\{[^}]*margin-inline:\s*auto/s);
  assert.match(styles, /\.center-nav-shell\s*\{[^}]*pointer-events:\s*none;[^}]*background:\s*transparent !important;[^}]*backdrop-filter:\s*none;/s);
  assert.match(styles, /\.center-nav-shell \.nav_toggle,[\s\S]*?background:\s*#fff !important;[^}]*transform:\s*translate\(-50%, -50%\) !important;/s);
  assert.match(styles, /\.center-nav-shell\.center-nav-shell--gooey-ready \.nav_toggle,[\s\S]*?background:\s*transparent !important;/s);
  assert.match(styles, /\.center-gooey-host\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*pointer-events:\s*none;/s);
  assert.match(surface, /import \{ Liquid \} from "liquid-gooey"/);
  assert.match(surface, /blur=\{6\}/);
  assert.match(surface, /contrast=\{18\}/);
  assert.match(surface, /fill="#fff"/);
  assert.doesNotMatch(surface, /center-glass-material|center-refractive-gooey/);
  assert.match(surface, /className="center-nav-frosted-surface"/);
  assert.match(surface, /<Liquid\.Item\s+observe>/);
  assert.doesNotMatch(surface, /morph=\{/);
  assert.match(surface, /className="center-gooey-menu-panel-surface"/);
  assert.doesNotMatch(surface, /MENU_SLOTS|center-gooey-menu-item/);
  assert.match(packageJson, /"liquid-gooey":\s*"\^0\.2\.1"/);
  assert.match(styles, /\.center-gooey-menu-panel-surface\s*\{[^}]*width:\s*36px;[^}]*height:\s*36px;[^}]*border-radius:\s*999px;[^}]*transform:\s*translate\(-50%, -50%\);/s);
  assert.doesNotMatch(styles, /\.center-gooey-menu-panel-surface--step-/);
  assert.doesNotMatch(styles, /\.center-gooey-menu-panel-surface\s*\{[^}]*transition:/s);
  assert.match(styles, /\.center-nav-shell \.nav_menu,[\s\S]*?inset:\s*0;[^}]*transform:\s*none !important;[^}]*pointer-events:\s*none;/s);
  assert.match(styles, /\.center-nav-shell \.center-nav-menu-list\s*\{[^}]*width:\s*var\(--center-nav-menu-width\);[^}]*height:\s*var\(--center-nav-menu-height\);[^}]*padding:\s*64px 40px;[^}]*flex-direction:\s*column;[^}]*gap:\s*20px;[^}]*transform:\s*translate\(-50%, calc\(-50% - 238px\)\) !important;/s);
  assert.doesNotMatch(styles, /data-nav-morph-step/);
  assert.match(styles, /\.center-nav-shell \.center-nav-link\s*\{[^}]*width:\s*100%;[^}]*height:\s*24px;[^}]*color:\s*#000;[^}]*font-family:\s*"Geist Menu", "Geist", sans-serif;[^}]*font-size:\s*16px;[^}]*font-weight:\s*600;[^}]*font-synthesis:\s*none;[^}]*line-height:\s*20px;[^}]*text-align:\s*center;[^}]*text-transform:\s*uppercase;/s);
  const fonts = await readFile(new URL('../src/site-fonts.css', import.meta.url), 'utf8');
  assert.match(fonts, /@font-face\s*\{[^}]*font-family:\s*"Geist Menu";[^}]*Geist-SemiBold\.woff2[^}]*font-weight:\s*600;/s);
  assert.match(styles, /\.center-nav-shell\[data-nav-link-stage="1"\][\s\S]*?\.center-nav-shell\[data-nav-link-stage="4"\][^}]*\{[^}]*visibility:\s*visible;[^}]*pointer-events:\s*auto;/s);
  assert.doesNotMatch(styles, /\.center-nav-shell \.center-nav-link\s*\{[^}]*transition:[^}]*opacity/s);
  assert.match(runtime, /center-nav-menu-list/);
  assert.match(runtime, /mountCenterGooeySurface/);
  assert.match(runtime, /import\("\.\/center-gooey-surface\.jsx"\)/);
  assert.match(runtime, /panel\.animate\(menuMorphFrames\(geometry\)/);
  assert.match(runtime, /menuList\.animate\(menuListFrames\(geometry\.scale\)/);
  assert.match(runtime, /playToward\(animation, isOpen, MENU_MORPH_DURATION_MS, reducedMotion\)/);
  assert.match(runtime, /const progress = currentTime \/ MENU_MORPH_DURATION_MS/);
  assert.doesNotMatch(runtime, /runMorphSequence|morphTimers|MORPH_STEP_MS|MORPH_SETTLE_MS|CLOSE_LABEL_RELEASE_MS/);
  assert.match(runtime, /center-nav-shell--labels-ready/);
  const morph = await readFile(new URL('../src/elevation/menu-morph.js', import.meta.url), 'utf8');
  assert.match(morph, /const MENU_MORPH_DURATION_MS = 900/);
  assert.match(runtime, /shell\.dataset\.navLinkStage = String\(nextStage\)/);
  assert.match(runtime, /progress >= \.98 \? 4 : progress >= \.78 \? 2 : 0/);
  assert.match(runtime, /center-nav-shell--closing/);
  assert.match(runtime, /menuObserver\.observe/);
  assert.doesNotMatch(runtime, /mountDomGlassLens|dom-glass-lens|plusMaterial|backdrop-filter/);
  assert.match(styles, /@media screen and \(max-width:\s*991px\)[\s\S]*?\.center-nav-shell\s*\{[^}]*--center-nav-closed-size:\s*96px;/s);
});

test("frosted navigation drives one masked fill from menu progress without fading its foreground", async () => {
  const styles = await readFile(new URL('../src/effects/center-control.css', import.meta.url), 'utf8');
  const surface = await readFile(new URL('../src/effects/center-gooey-surface.jsx', import.meta.url), 'utf8');
  const runtime = await readFile(new URL('../src/effects/center-control.js', import.meta.url), 'utf8');
  assert.match(styles, /--center-nav-frosted-opacity:\s*1;/);
  assert.match(styles, /--center-nav-frosted-fill:\s*rgba\(255, 255, 255, var\(--center-nav-frosted-opacity\)\)/);
  assert.match(runtime, /setProperty\("--center-nav-frosted-opacity", String\(menuFillOpacity\(progress\)\)\)/);
  assert.match(styles, /--center-nav-frosted-blur:\s*32px/);
  assert.match(styles, /\.center-nav-frosted-surface\s*\{[^}]*background:\s*var\(--center-nav-frosted-fill\);[^}]*backdrop-filter:\s*blur\(var\(--center-nav-frosted-blur\)\);[^}]*-webkit-backdrop-filter:/s);
  assert.equal(surface.match(/className="center-nav-frosted-surface"/g)?.length, 1);
  assert.match(surface, /maskUnits="userSpaceOnUse" x="0" y="0" width="840" height="860"/);
  assert.match(surface, /<use href=\{`#\$\{silhouetteId\}`\} transform="translate\(240 240\)"/);
  assert.match(surface, /maskImage: `url\(#\$\{maskId\}\)`/);
  assert.match(surface, /center-gooey-group--glass-mask/);
  assert.doesNotMatch(surface, /feDisplacementMap|feImage|center-glass-material/);
  assert.doesNotMatch(styles, /\.center-nav-shell\s*\{[^}]*\sopacity:/s);
});

test("preserved glass trial uses one live liquid mask with nonzero bounds and full-opacity foreground", async () => {
  const [styles, surface] = await Promise.all(['center-control.css', 'center-refractive-gooey-surface.jsx']
    .map(file => readFile(new URL(`../src/effects/${file}`, import.meta.url), 'utf8')));
  assert.match(styles, /--center-nav-glass-fill:\s*rgba\(190, 200, 205, 0\)/);
  assert.match(styles, /--center-nav-glass-blur:\s*1px/);
  assert.match(surface, /--center-nav-glass-fill': `rgba\(190, 200, 205, \$\{settings.frost\}\)`/);
  assert.match(styles, /\.center-nav-glass-surface\s*\{[^}]*inset:\s*-240px;[^}]*backdrop-filter:\s*blur\(var\(--center-nav-glass-blur\)\);[^}]*-webkit-backdrop-filter:/s);
  // Percent bounds resolved to zero in the zero-sized SVG definitions host.
  assert.match(surface, /maskUnits="userSpaceOnUse" x="0" y="0" width="840" height="860"/);
  assert.match(surface, /<use href=\{`#\$\{silhouetteId\}`\} transform="translate\(240 240\)"/);
  assert.match(surface, /maskImage: `url\(#\$\{maskId\}\)`/);
  assert.match(styles, /\.center-gooey-group--glass-mask > \[data-gooey-svg\] \{ opacity: 0; \}/);
  assert.doesNotMatch(styles, /\.center-nav-shell\s*\{[^}]*opacity:\s*0\.3/s);
});

test("all center-control states use one black 36px SVG plus/X icon", async () => {
  const styles = await readFile(new URL("../src/effects/center-control.css", import.meta.url), "utf8");
  const runtime = await readFile(new URL("../src/effects/center-control.js", import.meta.url), "utf8");

  assert.match(runtime, /http:\/\/www\.w3\.org\/2000\/svg/);
  assert.match(runtime, /viewBox", "0 0 36 36"/);
  assert.match(runtime, /width", "36"/);
  assert.match(runtime, /height", "36"/);
  assert.ok(runtime.includes('M18 0a2.5 2.5 0 0 1 2.5 2.5v13h13a2.5 2.5 0 0 1 0 5h-13v13a2.5 2.5 0 0 1 -5 0v-13h-13a2.5 2.5 0 0 1 0 -5h13v-13A2.5 2.5 0 0 1 18 0Z'));
  assert.match(runtime, /path\.setAttribute\("fill", "black"\)/);
  assert.doesNotMatch(runtime, /nav_icon-h|nav_icon-v|legacyBar/);
  assert.match(styles, /\.center-nav-shell \.nav_icon-plus\s*\{[^}]*width:\s*36px;[^}]*height:\s*36px;[^}]*transform:\s*rotate\(0deg\);[^}]*transition:\s*none;/s);
  assert.match(styles, /html\.detail-route \.center-nav-shell \.nav_icon-plus\s*\{[^}]*transform:\s*rotate\(45deg\);/s);
  assert.doesNotMatch(styles, /nav_icon-h|nav_icon-v/);
});

test("frosted navigation uses black labels, icon and focus indicators", async () => {
  const styles = await readFile(new URL("../src/effects/center-control.css", import.meta.url), "utf8");
  const elevated = await readFile(new URL("../src/elevation/styles.css", import.meta.url), "utf8");
  assert.ok(styles.includes(".center-nav-shell .nav_icon-plus path {\n  fill: #000;"));
  assert.match(styles, /\.center-nav-shell \.center-nav-link:hover,\s*\.center-nav-shell \.center-nav-link\.w--current\s*\{\s*color:\s*#000;/);
  assert.ok(elevated.includes('.center-nav-link { color: #000; }'));
  assert.ok(elevated.includes('.center-nav-link.w--current {\n  color: #000;\n  text-decoration: none;'));
  assert.match(elevated, /\.center-nav-link\s*\{\s*font-size:\s*24px;\s*line-height:\s*1\.2;/);
  assert.match(elevated, /@media \(min-width: 992px\)\s*\{\s*html\[data-design-edition="elevated"\] \.center-nav-link\s*\{\s*font-size:\s*32px;\s*\}/);
  assert.ok(elevated.includes('.center-nav-link:focus-visible { outline-color: black;'));
  assert.match(elevated, /\.center-nav-menu-list\s*\{[^}]*gap:\s*12px;/s);
});

test("every breakpoint uses one stacked menu and contains no legacy circular-menu implementation", async () => {
  const sourceFiles = [
    "../index.html",
    "../articles/index.html",
    "../info/index.html",
    "../detail-shell.html",
    "../public/js/site-shell.js",
    "../public/css/site-base.css",
    "../src/biography.css",
    "../src/detail-state.css",
    "../src/effects/center-control.js",
    "../scripts/archive/mirror-source.mjs",
  ];
  const sources = await Promise.all(sourceFiles.map((file) => readFile(new URL(file, import.meta.url), "utf8")));

  sources.forEach((source) => {
    assert.doesNotMatch(source, /circletext|nav_menu-circle|ct-letter|Nav Circle|totalWidth|radius\s*=\s*90|nav_icon-h|nav_icon-v/);
  });

  for (const source of sources.slice(0, 4)) {
    assert.match(source, /data-nav-menu-list/);
  }

  const runtime = sources[8];
  assert.match(runtime, /menu\.querySelector\("\[data-nav-menu-list\]"\)/);
  assert.doesNotMatch(runtime, /querySelectorAll\("\.ct-letter"\)|replaceChildren/);
});

test("Leva tuning controls have one reversible global off switch", async () => {
  const config = await readFile(new URL("../src/effects/glass-lab-config.js", import.meta.url), "utf8");
  const siteLens = await readFile(new URL("../src/effects/center-glass-lens.js", import.meta.url), "utf8");
  const lab = await readFile(new URL("../src/effects/dom-glass-lab.js", import.meta.url), "utf8");

  assert.match(config, /GLASS_LAB_CONTROLS_ENABLED\s*=\s*false/);
  assert.match(siteLens, /import\.meta\.env\.DEV\s*&&\s*GLASS_LAB_CONTROLS_ENABLED/);
  assert.match(lab, /if\s*\(GLASS_LAB_CONTROLS_ENABLED\)/);
});
