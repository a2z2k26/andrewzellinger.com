import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {NAVIGATION_ROUTES, navigationSection, detailReturn, centeredMastheadLeft} from '../src/site-navigation/model.js';
test('three canonical destinations',()=>assert.deepEqual(NAVIGATION_ROUTES.map(r=>r.path),['/','/articles','/history']));
test('detail parents resolve correctly',()=>{
  assert.deepEqual(detailReturn('/case-studies/avantos/'),{path:'/',label:'Projects'});
  assert.deepEqual(detailReturn('/articles/company-of-one/'),{path:'/articles',label:'Articles'});
  assert.equal(navigationSection('/articles/company-of-one/'),'/articles');
  assert.equal(navigationSection('/case-studies/avantos/'),'/');
  for(const path of ['/','/articles/','/history']) assert.equal(detailReturn(path),null);
});
test('desktop menu centers between the logo and right content column',()=>{
  assert.equal(centeredMastheadLeft(104,728,205),313.5);
  assert.equal(centeredMastheadLeft(104,728,205,-136),177.5);
});
const js=await readFile(new URL('../src/site-navigation/index.js',import.meta.url),'utf8');
const css=await readFile(new URL('../src/site-navigation/styles.css',import.meta.url),'utf8');
test('persistent desktop links and compact detail state',()=>{
  assert.ok(js.includes('nav.hidden = Boolean(detail) && compact.matches'));
  assert.ok(js.includes("back.dataset.siteDetailBack = ''"));
  assert.ok(js.includes('link.href = route.path'));
  assert.ok(js.includes('compact.addEventListener'));
  assert.ok(js.includes('phone.addEventListener'));
  assert.ok(js.includes("getPropertyValue('--structure--grid-row-gap')"));
  assert.ok(js.includes('centeredMastheadLeft(rect.right, rightColumnLeft, menuWidth, -136)'));
  assert.ok(js.includes('sizes.observe(nav)'));
  assert.ok(!js.includes('rect.right + 156'));
});
test('phone navigation collapses into an accessible tap and swipe drawer',()=>{
  assert.ok(js.includes("menuToggle.setAttribute('aria-controls', nav.id)"));
  assert.ok(js.includes("menuToggle.setAttribute('aria-expanded', 'false')"));
  assert.ok(js.includes('travel <= -24'));
  assert.ok(js.includes('travel >= 24'));
  assert.ok(js.includes("event.key === 'Escape'"));
  assert.match(css,/\.site-navigation__menu-toggle \{[\s\S]*?width: 100%;[\s\S]*?height: calc\(54px \+ env\(safe-area-inset-bottom,0px\)\);[\s\S]*?background: #000;[\s\S]*?touch-action: none;/);
  assert.match(css,/\.site-navigation--mobile-open \.site-navigation__menu-toggle \{\s*height: 54px;[\s\S]*?transform: translateY\(calc\(-1 \* var\(--mobile-menu-content-height, 162px\)\)\);/);
  assert.ok(js.includes('host.append(menuToggle, nav, back)'));
  assert.ok(js.includes("host.style.setProperty('--mobile-menu-content-height', nav.offsetHeight + 'px')"));
  assert.match(css,/\.site-navigation__menu-toggle \{[^}]*border-radius: 0;/);
  assert.match(css,/@media \(max-width: 599px\) \{\s*\.masthead-links \{[^}]*background: #000;[^}]*border-radius: 0;/);
  assert.doesNotMatch(js,/site-navigation__menu-label/);
  assert.match(css,/\.site-navigation__menu-icon::before,[\s\S]*?\.site-navigation__menu-icon::after \{[\s\S]*?width: 28px;[\s\S]*?height: 1\.5px;/);
  assert.match(css,/\.site-navigation--mobile-open \.masthead-links \{[\s\S]*?opacity: 1;[\s\S]*?pointer-events: auto;/);
  assert.match(css,/\.masthead-link \{ width: 100%; height: 54px; min-height: 54px; flex: 0 0 54px;[\s\S]*?font-size: 14px;/);
  assert.match(css,/\.masthead-link:last-child \{ height: 62px; min-height: 62px; flex-basis: 62px; padding-bottom: 8px; \}/);
  assert.match(css,/@media \(max-width: 599px\) \{\s*\.masthead-links \{[^}]*padding: 0 0 env\(safe-area-inset-bottom,0px\);[^}]*border: 0;/);
  assert.match(css,/\.masthead-link \{ border-top: 1px solid rgba\(255,255,255,\.1\); \}/);
});
test('accepted dimensions and detail context preserved',()=>{
  for(const value of ['- 52px','height: 44px','height: calc(68px','width: 14px']) assert.ok(css.includes(value),value);
  assert.ok(!css.includes('.edition-context'));
});
test('phone case studies use a text-only Close row matching the mobile menu',()=>{
  const phone=css.slice(css.indexOf('@media (max-width: 599px) {'));
  assert.match(phone,/html\[data-detail-kind="project"\] \.site-navigation__back,[\s\S]*?height: calc\(62px \+ env\(safe-area-inset-bottom,0px\)\);[\s\S]*?padding: 0 16px calc\(8px \+ env\(safe-area-inset-bottom,0px\)\);[\s\S]*?border-top: 1px solid rgba\(255,255,255,\.1\);/);
  assert.match(phone,/html\[data-detail-kind="project"\] \.site-navigation__close-icon \{ display: none; \}/);
  assert.match(phone,/html\[data-detail-kind="project"\] \.site-navigation__close-label \{ font-size: 14px; \}/);
});
test('desktop Back control uses the refined neutral treatment',()=>{
  assert.match(css,/\.site-navigation__back \{[^}]*color: #aaa;[^}]*background: transparent;/);
  assert.match(css,/\.site-navigation__back:hover \{ color: #fff; \}/);
  assert.match(css,/\.site-navigation__desktop-label \{ font-size: 16px;/);
  assert.match(css,/\.site-navigation__back-arrow \{ width: 16px; height: 16px;[^}]*background: currentColor;/);
});
test('selected navigation uses white text without a dot',()=>{
  assert.match(css, /\.masthead-link:hover, \.masthead-link\[aria-current\] \{ color: #fff; \}/);
  assert.doesNotMatch(css, /\.masthead-link\[aria-current\]::(?:before|after)/);
});
test('navigation keyboard focus uses the shared neutral highlight',()=>{
  assert.match(css, /\.site-navigation a:focus-visible \{ outline: 2px solid var\(--edition-focus\); outline-offset: 5px; \}/);
  assert.doesNotMatch(css, /focus-visible[^}]*var\(--swatches--accent-1\)/);
});
test('no comparison UI or alternative concepts remain in active module',()=>{
  for(const value of ['sessionStorage','nav-lab','CONCEPTS','command','overview']) assert.ok(!js.includes(value),value);
});
