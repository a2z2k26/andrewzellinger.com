import test from 'node:test';
import assert from 'node:assert/strict';
import { navigationGeometry, scaleMorphFrames } from '../src/elevation/nav-geometry.js';

test('menu geometry stays above its centered control without leaving the viewport', () => {
  for (const [width, height] of [[1440,1000],[1280,720],[1024,600],[768,1024],[390,844],[320,568],[844,390]]) {
    const geometry = navigationGeometry(width,height);
    const originY = width < 992 ? height - 48 : height / 2;
    assert.ok(originY - geometry.travel - geometry.panelHeight/2 >= 16);
    assert.ok(geometry.panelWidth < width - 32);
    assert.ok(geometry.buttonSize >= 44);
    assert.ok(geometry.travel - geometry.panelHeight/2 - geometry.buttonSize/2 >= 16);
  }
});

test('scaling uses real geometry without changing offsets, easing, or circular radii', () => {
  const frames = [{offset:.4,width:'96px',height:'112px',borderRadius:'999px',transform:'translate(-50%, calc(-50% - 88px))',easing:'linear'}];
  const result = scaleMorphFrames(frames,.8);
  assert.deepEqual(result,[{offset:.4,width:'76.80000000000001px',height:'89.60000000000001px',borderRadius:'999px',transform:'translate(-50%, calc(-50% - 70.4px))',easing:'linear'}]);
  assert.equal(frames[0].width,'96px');
});
