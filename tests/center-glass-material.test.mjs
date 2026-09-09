import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CENTER_GLASS_SETTINGS, relativeGlassRect, syncCenterGlassMaterial } from '../src/effects/center-glass-material.js';
import { DOM_GLASS_DEFAULTS } from '../src/effects/dom-glass-lens.js';

test('new material reuses the preserved clear-glass preset, not the 30% tint trial', () => {
  assert.equal(CENTER_GLASS_SETTINGS, DOM_GLASS_DEFAULTS);
  assert.equal(CENTER_GLASS_SETTINGS.frost, 0);
  assert.equal(CENTER_GLASS_SETTINGS.blur, 1);
  assert.equal(CENTER_GLASS_SETTINGS.refraction, 40);
  assert.equal(CENTER_GLASS_SETTINGS.chromatic, 2);
});

test('refraction maps follow their own circle and panel inside the padded surface', () => {
  const surface = {left:300,top:478};
  assert.deepEqual(relativeGlassRect({left:676,top:864,width:88,height:88},surface),
    {x:376,y:386,width:88,height:88});
  assert.deepEqual(relativeGlassRect({left:608,top:592,width:224,height:256},surface),
    {x:308,y:114,width:224,height:256});
});

test('material batches reads, writes only changed coordinates, and tolerates mount gaps', () => {
  const events = [];
  const box = (name, rect) => ({getBoundingClientRect(){ events.push(`read:${name}`); return rect; }});
  const map = () => { const attrs = {}; return {
    getAttribute:key=>attrs[key], setAttribute(key,value){ events.push(`write:${key}`); attrs[key]=value; }, attrs,
  }; };
  const baseMap=map(), panelMap=map();
  const elements = {
    '.center-nav-glass-surface':box('surface',{left:300,top:478}),
    '.center-gooey-base-item':box('base',{left:676,top:864,width:88,height:88}),
    '.center-gooey-menu-panel-surface':box('panel',{left:608,top:592,width:224,height:256}),
    '[data-center-glass-map="base"]':baseMap, '[data-center-glass-map="panel"]':panelMap,
  };
  const host={querySelector:key=>elements[key]};
  syncCenterGlassMaterial(host);
  assert.deepEqual(events.slice(0,3),['read:surface','read:base','read:panel']);
  assert.deepEqual(panelMap.attrs,{x:'308',y:'114',width:'224',height:'256'});
  events.length=0;
  syncCenterGlassMaterial(host);
  assert.equal(events.length,3);
  syncCenterGlassMaterial({querySelector:()=>null});
});

test('adapter keeps filter IDs local, caches the original map, and adds no animation loop', async () => {
  const [material,surface,runtime] = await Promise.all(['center-glass-material.js','center-refractive-gooey-surface.jsx','center-control.js']
    .map(file=>readFile(new URL(`../src/effects/${file}`,import.meta.url),'utf8')));
  assert.match(material,/displacementMap \|\|= createDisplacementMap/);
  assert.doesNotMatch(material,/requestAnimationFrame|setInterval|mountDomGlassLens\(/);
  assert.match(surface,/refractionId = `\$\{maskId\}-refraction`/);
  assert.match(surface,/center-nav-glass-highlights" width="840" height="860"/);
  assert.match(surface,/settings\.rim \* \.62/);
  assert.match(surface,/settings\.shadow \* \.88/);
  assert.doesNotMatch(runtime,/syncMaterial\(|center-refractive-gooey/);
  assert.match(surface,/syncMaterial\(\) \{ syncCenterGlassMaterial\(host\); \}/);
});
