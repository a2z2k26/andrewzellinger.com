import test from 'node:test';
import assert from 'node:assert/strict';
import { navigationGeometry, scaleMorphFrames, fitMorphFrames, playToward } from '../src/elevation/nav-geometry.js';

test('desktop circle is 92px while compact and short-screen controls remain 64px', () => {
  for (const [width, height] of [[1440,1000], [1280,720], [992,676]]) {
    const geometry = navigationGeometry(width, height);
    assert.equal(geometry.buttonSize, 92);
    assert.equal(geometry.docked, true);
    assert.equal(geometry.bottomInset, 48);
    assert.ok(height - geometry.bottomInset - geometry.buttonSize / 2 - geometry.travel - geometry.panelHeight / 2 >= 16);
  }
  for (const [width, height] of [[390,844], [768,1024], [1440,672], [1440,675]]) {
    assert.equal(navigationGeometry(width, height).buttonSize, 64);
    assert.equal(navigationGeometry(width, height).docked, true);
  }
});

test('menu geometry stays above its bottom-centered control without leaving the viewport', () => {
  for (const [width, height] of [[1440,1000],[1280,720],[1024,600],[768,1024],[390,844],[320,568],[844,390]]) {
    const geometry = navigationGeometry(width,height);
    const originY = height - geometry.bottomInset - geometry.buttonSize / 2;
    assert.equal(height - originY - geometry.buttonSize / 2, 48);
    assert.ok(originY - geometry.travel - geometry.panelHeight/2 >= 16);
    assert.ok(geometry.panelWidth < width - 32);
    assert.ok(geometry.buttonSize >= 44);
    assert.ok(geometry.travel - geometry.panelHeight/2 - geometry.buttonSize/2 >= 16);
  }
});

test('short screens fit all three full-size link targets with the wider gaps', () => {
  for (const width of [320, 390, 844, 992, 1280, 1920]) {
    for (const height of [320, 390, 400, 600, 720, 1000]) {
      const g = navigationGeometry(width, height);
      const origin = height - g.bottomInset - g.buttonSize / 2;
      assert.ok(g.panelHeight >= 3 * 44 + 2 * 12 + 2 * g.padding, `${width}×${height} content fit`);
      // At the smallest landscape height, preserve all three targets and the
      // requested bottom gap, allowing a smaller (but unclipped) top margin.
      assert.ok(origin - g.travel - g.panelHeight / 2 >= (height < 332 ? 0 : 16), `${width}×${height} top`);
      assert.ok(g.travel - g.panelHeight / 2 - g.buttonSize / 2 >= 16);
      const [frame] = fitMorphFrames([{width:'280px',height:'320px',transform:'translate(-50%, calc(-50% - 238px))'}],g);
      assert.equal(parseFloat(frame.width),g.panelWidth);
      assert.equal(parseFloat(frame.height),g.panelHeight);
      assert.ok(frame.transform.includes(`${g.travel}px`));
    }
  }
});

test('closed endpoint never plays in reverse on first mount; mid-flight reverses in place', () => {
  const animation = {currentTime:0, played:0, paused:0, play(){this.played++}, pause(){this.paused++}};
  playToward(animation, false, 900, false);
  assert.equal(animation.played,0);
  assert.equal(animation.currentTime,0);
  playToward(animation,true,900,false);
  assert.equal(animation.played,1);
  animation.currentTime=450;
  playToward(animation,false,900,false);
  assert.equal(animation.currentTime,450);
  assert.equal(animation.playbackRate,-1);
  playToward(animation,true,900,true);
  assert.equal(animation.currentTime,900);
  assert.equal(animation.played,2);
  playToward(animation,true,900,false);
  assert.equal(animation.played,2);
});

test('scaling uses real geometry without changing offsets, easing, or circular radii', () => {
  const frames = [{offset:.4,width:'96px',height:'112px',borderRadius:'999px',transform:'translate(-50%, calc(-50% - 88px))',easing:'linear'}];
  const result = scaleMorphFrames(frames,.8);
  assert.deepEqual(result,[{offset:.4,width:'76.80000000000001px',height:'89.60000000000001px',borderRadius:'999px',transform:'translate(-50%, calc(-50% - 70.4px))',easing:'linear'}]);
  assert.equal(frames[0].width,'96px');
});
