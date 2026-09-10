import test from 'node:test';
import assert from 'node:assert/strict';
import { navigationGeometry } from '../src/elevation/nav-geometry.js';
import { MENU_MORPH_DURATION_MS, menuMorphFrames, menuListFrames, menuIconProgress, menuFillOpacity } from '../src/elevation/menu-morph.js';

const travel = frame => Number(frame.transform.match(/- ([\d.]+)px/)[1]);
const sizes = [[1440,900], [992,676], [1024,600], [768,1024], [390,844], [844,390]];

test('fill follows reversible menu progress from solid white to sixty-percent frost', () => {
  assert.equal(menuFillOpacity(0),1);
  assert.equal(menuFillOpacity(.5),.8);
  assert.equal(menuFillOpacity(1),.6);
  assert.equal(menuFillOpacity(-1),1);
  assert.equal(menuFillOpacity(2),.6);
  const opening=Array.from({length:101},(_,i)=>menuFillOpacity(i/100));
  assert.ok(opening.every((alpha,i)=>alpha>=.6&&alpha<=1&&(!i||alpha<=opening[i-1])));
  assert.deepEqual(opening.toReversed(),Array.from({length:101},(_,i)=>menuFillOpacity((100-i)/100)));
  assert.ok((1-menuFillOpacity(.0001))/.0001<.001);
  assert.ok((menuFillOpacity(.9999)-.6)/.0001<.001);
});

test('menu morph preserves its duration, endpoints and final circle separation', () => {
  assert.equal(MENU_MORPH_DURATION_MS, 900);
  for (const [width,height] of sizes) {
    const geometry = navigationGeometry(width,height), frames = menuMorphFrames(geometry);
    assert.equal(frames.length,181);
    assert.equal(frames[0].offset,0);
    assert.equal(frames.at(-1).offset,1);
    assert.equal(travel(frames[0]),0);
    assert.equal(travel(frames.at(-1)),geometry.travel);
    assert.equal(parseFloat(frames.at(-1).width),geometry.panelWidth);
    assert.equal(parseFloat(frames.at(-1).height),geometry.panelHeight);
    assert.ok(Math.abs(parseFloat(frames.at(-1).borderRadius)-44.8)<1e-9);
    assert.equal(geometry.travel - geometry.panelHeight / 2 - geometry.buttonSize / 2,16);
  }
});

test('sampled menu path carries motion through intermediate poses without stops or radius snaps', () => {
  for (const [width,height] of sizes) {
    const frames = menuMorphFrames(navigationGeometry(width,height));
    for (let i=1;i<frames.length;i++) {
      const current = frames[i], previous = frames[i-1];
      assert.equal(current.easing,'linear'); // Easing is already baked into the shared curve.
      assert.ok(parseFloat(current.width)>=parseFloat(previous.width));
      assert.ok(parseFloat(current.height)>=parseFloat(previous.height));
      assert.ok(travel(current)>=travel(previous));
      if(current.offset>.15 && current.offset<.9) {
        assert.ok((travel(current)-travel(previous))/5>.03,`No intermediate near-stop at ${current.offset}`);
      }
      const radius = parseFloat(current.borderRadius);
      assert.ok(radius>=0 && radius<=Math.min(parseFloat(current.width),parseFloat(current.height))/2);
      assert.ok(Math.abs(radius-parseFloat(previous.borderRadius))<1.25,'No clamped-radius collapse');
    }
  }
});

test('one deterministic sampled path supplies exact reverse geometry', () => {
  const geometry = navigationGeometry(1440,900);
  const opening = menuMorphFrames(geometry);
  const closing = menuMorphFrames(geometry).reverse();
  assert.deepEqual(closing,opening.toReversed());
  // No independent closing shape or easing: the controller reverses currentTime.
  assert.deepEqual(menuMorphFrames(geometry),opening);
});

test('icon and late text settle with eased endpoint velocities', () => {
  assert.equal(menuIconProgress(0),0);
  assert.equal(menuIconProgress(.27),1);
  assert.equal(menuIconProgress(1),1);
  assert.ok(menuIconProgress(.0001)/.0001<.01);
  assert.ok((1-menuIconProgress(.2699))/.0001<.01);
  const frames = menuListFrames(.8);
  assert.ok(frames.filter(frame=>frame.offset<=.8).every(frame=>parseFloat(frame.marginTop)===32));
  assert.equal(parseFloat(frames.at(-1).marginTop),0);
});
