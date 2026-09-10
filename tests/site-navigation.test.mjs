import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {NAVIGATION_ROUTES, navigationSection, detailReturn} from '../src/site-navigation/model.js';
test('three canonical destinations',()=>assert.deepEqual(NAVIGATION_ROUTES.map(r=>r.path),['/','/articles','/history']));
test('detail parents resolve correctly',()=>{
  assert.deepEqual(detailReturn('/case-studies/avantos/'),{path:'/',label:'Projects'});
  assert.deepEqual(detailReturn('/articles/company-of-one/'),{path:'/articles',label:'Articles'});
  assert.equal(navigationSection('/articles/company-of-one/'),'/articles');
  assert.equal(navigationSection('/case-studies/avantos/'),'/');
  for(const path of ['/','/articles/','/history']) assert.equal(detailReturn(path),null);
});
const js=await readFile(new URL('../src/site-navigation/index.js',import.meta.url),'utf8');
const css=await readFile(new URL('../src/site-navigation/styles.css',import.meta.url),'utf8');
test('persistent desktop links and compact detail state',()=>{
  assert.ok(js.includes('nav.hidden = Boolean(detail) && compact.matches'));
  assert.ok(js.includes("back.dataset.siteDetailBack = ''"));
  assert.ok(js.includes('link.href = route.path'));
  assert.ok(js.includes('compact.addEventListener'));
});
test('accepted dimensions and detail context preserved',()=>{
  for(const value of ['- 60px','height: 44px','height: calc(68px','width: 14px','.detail-route .edition-context']) assert.ok(css.includes(value),value);
});
test('no comparison UI or alternative concepts remain in active module',()=>{
  for(const value of ['sessionStorage','nav-lab','CONCEPTS','command','overview']) assert.ok(!js.includes(value),value);
});
