import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gsap } from 'gsap';
import { PORTRAIT_AUTO_MODES, PORTRAIT_STUDY_MODES, portraitStudyTarget, orbitPlacement, portraitStudyCanPlay, createPortraitTimeline } from '../src/elevation/portrait-study-model.js';
import { NEW_PORTRAIT_STUDIES, STUDY_SLOT, STUDY_STILL, SIGNAL_BEATS, sliceInsets } from '../src/elevation/portrait-study-variants.js';
import { OVERPRINT_MODES, overprintFrames, overprintGrid, overprintLayout } from '../src/elevation/portrait-overprint.js';

test('portrait study is limited to Home and History, including trailing slashes', () => {
  assert.equal(portraitStudyTarget('/'), '.index-static-field');
  assert.equal(portraitStudyTarget('/history/'), '.biography-portrait-placeholder');
  for (const path of ['/projects', '/articles', '/case-studies/audible-sleep/', '/articles/example/']) assert.equal(portraitStudyTarget(path), null);
});

test('spiral placements are deterministic and bounded inside the photograph', () => {
  const points = Array.from({ length: 12 }, (_, i) => orbitPlacement(i));
  assert.equal(new Set(points.map(p => `${p.left}/${p.top}`)).size, 12);
  for (const point of points) {
    assert.ok(point.left >= 9 && point.left <= 91);
    assert.ok(point.top >= 9 && point.top <= 91);
  }
});

test('reduced motion, user pause, navigation, offscreen and background tabs stop playback', () => {
  const state = { reduced: false, userPaused: false, globalPaused: false, visible: true, hidden: false, original: false };
  assert.equal(portraitStudyCanPlay(state), true);
  for (const flag of ['reduced', 'userPaused', 'globalPaused', 'hidden', 'original']) assert.equal(portraitStudyCanPlay({ ...state, [flag]: true }), false);
  assert.equal(portraitStudyCanPlay({ ...state, visible: false }), false);
});

const shape = () => ({ autoAlpha: 0, xPercent: 0, yPercent: 0, scale: 1, scaleX: 1, scaleY: 1, rotation: 0 });
function nodes(seed) {
  const chorusGrid = seed === undefined ? { columns: 4, rows: 4 } : overprintGrid('chorus', seed);
  return { monument: shape(), chorus: shape(), orbit: shape(), bigLetter: shape(),
    chorusColumns: chorusGrid.columns,
    chorusLetters: Array.from({ length: chorusGrid.columns * chorusGrid.rows }, shape), orbitLetters: Array.from({ length: 12 }, shape),
    studies: Object.fromEntries(NEW_PORTRAIT_STUDIES.map(study => {
      const grid = seed === undefined || !OVERPRINT_MODES.includes(study.id) ? study : overprintLayout(study.id, seed);
      return [study.id, { group: shape(), columns: grid.columns, rows: grid.rows,
        tiles: grid.tiles, glyphs: Array.from({ length: grid.tiles?.length ?? grid.columns * grid.rows }, shape) }];
    })) };
}

test('grid takes prioritize large cells and reserve one study for a denser field', () => {
  for (let seed = 0; seed < 30; seed++) {
    const sizes = OVERPRINT_MODES.map(id => overprintGrid(id, seed));
    assert.ok(sizes.filter(g => g.columns * g.rows <= 6).length >= 5);
    assert.equal(sizes.filter(g => g.columns * g.rows >= 25).length, 1);
    for (const id of OVERPRINT_MODES.filter(id => id !== 'monument')) {
      assert.deepEqual(overprintGrid(id, seed), overprintGrid(id, seed));
      assert.notDeepEqual(overprintGrid(id, seed), overprintGrid(id, seed + 1));
    }
  }
});

test('all grid dimensions produce bounded hard-cut patterns and stable scrub geometry', () => {
  for (let seed = 0; seed < 6; seed++) for (const id of OVERPRINT_MODES) {
    const { columns, rows, tiles } = overprintLayout(id, seed);
    for (const frame of overprintFrames(id, tiles.length, seed, columns, tiles)) {
      assert.ok(frame.on.every(i => Number.isInteger(i) && i >= 0 && i < tiles.length), `${id} ${columns}x${rows}`);
      assert.equal(new Set(frame.on).size, frame.on.length);
    }
    const n = nodes(seed), tl = createPortraitTimeline(gsap, n, id, seed);
    const glyphs = id === 'monument' ? [n.bigLetter] : id === 'chorus' ? n.chorusLetters : n.studies[id].glyphs;
    const snapshot = () => glyphs.map(({ autoAlpha, xPercent, yPercent, scale }) => ({ autoAlpha, xPercent, yPercent, scale }));
    tl.time(1.3); const early = snapshot();
    tl.time(5); tl.time(1.3); assert.deepEqual(snapshot(), early);
    for (let t = 0; t < STUDY_SLOT; t += .11) {
      tl.time(t);
      for (const glyph of glyphs) {
        assert.ok([0, 1].includes(glyph.autoAlpha));
        assert.equal(glyph.xPercent, 0); assert.equal(glyph.yPercent, 0); assert.equal(glyph.scale, 1);
      }
    }
    tl.kill();
  }
});

test('mixed Lattice reserves non-overlapping areas for simultaneous large and small letters', () => {
  for (let seed = 0; seed < 30; seed++) {
    const { columns, rows, tiles } = overprintLayout('lattice', seed);
    const occupied = new Set();
    for (const tile of tiles) {
      for (let y = tile.row; y < tile.row + tile.height; y++) for (let x = tile.column; x < tile.column + tile.width; x++) {
        assert.ok(x < columns && y < rows);
        const cell = y * columns + x;
        assert.ok(!occupied.has(cell)); occupied.add(cell);
      }
    }
    assert.equal(occupied.size, columns * rows);
    assert.ok(tiles.some(tile => tile.width === 2 && tile.height === 2));
    assert.ok(tiles.some(tile => tile.width === 1 && tile.height === 1));
    const frames = overprintFrames('lattice', tiles.length, seed, columns, tiles);
    assert.ok(frames.some(frame => frame.on.some(i => tiles[i].width === 2) && frame.on.some(i => tiles[i].width === 1)));
  }
});

test('GSAP sequences distinct vignettes with blank seams and no initial letter flash', () => {
  const n = nodes();
  const tl = createPortraitTimeline(gsap, n);
  assert.equal(n.bigLetter.yPercent, 0);
  assert.ok(n.chorusLetters.every(item => item.yPercent === 0 && item.autoAlpha === 0));
  assert.ok(n.orbitLetters.every(item => item.autoAlpha === 0));
  tl.time(tl.labels.monument + 2);
  assert.equal(n.monument.autoAlpha, 1);
  assert.equal(n.bigLetter.yPercent, 0);
  tl.time(tl.labels.monument + 5.95);
  assert.equal(n.monument.autoAlpha, 0);
  tl.time(tl.labels.chorus + 2.2);
  assert.equal(n.chorus.autoAlpha, 1);
  assert.ok(n.chorusLetters.every(item => item.yPercent === 0));
  tl.time(tl.labels.chorus + 5.95);
  assert.equal(n.chorus.autoAlpha, 0);
  assert.equal(n.orbit.autoAlpha, 0);
  tl.kill();
  assert.equal(tl.parent, null);
});

test('selected overprints are the only automatic studies; earlier tests remain available', () => {
  assert.equal(NEW_PORTRAIT_STUDIES.length, 10);
  assert.equal(new Set(PORTRAIT_STUDY_MODES).size, 15);
  assert.deepEqual(PORTRAIT_AUTO_MODES, ['signal', 'chorus', 'columns', 'lattice', 'stack', 'relay', 'monument']);
  for (const id of ['orbit', 'multiplicity', 'registers', 'mosaic', 'quadrants', 'rows']) assert.ok(!PORTRAIT_AUTO_MODES.includes(id));
  assert.ok(PORTRAIT_STUDY_MODES.includes('orbit'));
});

test('all seven selected treatments remain stationary and strictly binary across every frame', () => {
  for (const id of OVERPRINT_MODES) {
    const n = nodes(), tl = createPortraitTimeline(gsap, n, id, 415);
    const glyphs = id === 'monument' ? [n.bigLetter] : id === 'chorus' ? n.chorusLetters : n.studies[id].glyphs;
    for (let at = 0; at < STUDY_SLOT; at += .037) {
      tl.time(at);
      for (const glyph of glyphs) {
        assert.ok(glyph.autoAlpha === 0 || glyph.autoAlpha === 1, `${id}: opacity is a cut`);
        assert.equal(glyph.xPercent, 0, id); assert.equal(glyph.yPercent, 0, id);
        assert.equal(glyph.rotation, 0, id); assert.equal(glyph.scale, 1, id);
        assert.equal(glyph.scaleX, 1, id); assert.equal(glyph.scaleY, 1, id);
      }
    }
    tl.kill();
  }
});

test('overprint takes are seeded, irregular, bounded and separated by quiet holds', () => {
  for (const id of OVERPRINT_MODES) {
    const count = id === 'monument' ? 1 : id === 'stack' ? 3 : 16;
    const frames = overprintFrames(id, count, 9);
    assert.deepEqual(frames, overprintFrames(id, count, 9));
    assert.notDeepEqual(frames, overprintFrames(id, count, 10));
    frames.forEach((frame, index) => {
      assert.ok(frame.on.every(cell => cell >= 0 && cell < count));
      assert.equal(new Set(frame.on).size, frame.on.length);
      if (index) assert.ok(frame.at - frames[index - 1].at >= .55, id);
    });
    assert.deepEqual(frames.at(-1).on, []);
  }
});

test('slice masks tile exactly one shared glyph coordinate system', () => {
  for (const study of NEW_PORTRAIT_STUDIES.filter(item => item.layout === 'slices')) {
    let area = 0;
    for (let index = 0; index < study.rows * study.columns; index++) {
      const [top, right, bottom, left] = sliceInsets(index, study.columns, study.rows);
      assert.ok([top, right, bottom, left].every(value => value >= 0 && value < 100));
      area += (100 - top - bottom) * (100 - left - right);
    }
    assert.ok(Math.abs(area - 10000) < .001);
  }
});

test('every new study plays independently, settles, blanks, and replays cleanly', () => {
  for (const { id } of NEW_PORTRAIT_STUDIES) {
    const n = nodes(), tl = createPortraitTimeline(gsap, n, id);
    const { group, glyphs } = n.studies[id];
    assert.ok(glyphs.every(g => g.autoAlpha === 0 || Math.abs(g.xPercent) >= 100 || Math.abs(g.yPercent) >= 100), `${id} starts hidden`);
    tl.time(STUDY_STILL);
    assert.equal(group.autoAlpha, 1, id);
    assert.ok(glyphs.some(g => g.autoAlpha > 0), `${id} has visible glyphs`);
    Object.entries(n.studies).filter(([other]) => other !== id).forEach(([, other]) => assert.equal(other.group.autoAlpha, 0));
    tl.time(6.1);
    assert.equal(group.autoAlpha, 0, `${id} clears before seam`);
    assert.equal(tl.duration(), STUDY_SLOT);
    tl.totalTime(STUDY_SLOT + .7 + STUDY_STILL);
    assert.equal(group.autoAlpha, 1, `${id} replays`);
    tl.kill();
  }
});

test('sliced copies align exactly into one complete A at the still frame', () => {
  for (const { id } of NEW_PORTRAIT_STUDIES.filter(item => item.layout === 'slices')) {
    const n = nodes(), tl = createPortraitTimeline(gsap, n, id); tl.time(STUDY_STILL);
    for (const glyph of n.studies[id].glyphs) {
      assert.equal(glyph.xPercent, 0, id); assert.equal(glyph.yPercent, 0, id); assert.equal(glyph.scale, 1, id);
    }
    tl.kill();
  }
});

test('scrubbing backward reproduces the same assembly geometry as forward playback', () => {
  for (const { id } of NEW_PORTRAIT_STUDIES) {
    const n = nodes(), tl = createPortraitTimeline(gsap, n, id);
    const snapshot = () => n.studies[id].glyphs.map(({ autoAlpha, xPercent, yPercent, scale, scaleX, scaleY }) =>
      ({ autoAlpha, xPercent, yPercent, scale, scaleX, scaleY }));
    tl.time(.64); const early = snapshot();
    tl.time(4.9); tl.time(.64);
    assert.deepEqual(snapshot(), early, id);
    tl.kill();
  }
});

test('Signal uses spaced partial-grid cuts, not rapid whole-image flashing', () => {
  SIGNAL_BEATS.forEach((beat, i) => {
    assert.equal(beat.cells.length, 4);
    assert.ok(beat.hold >= .5);
    if (i) assert.ok(beat.at - SIGNAL_BEATS[i - 1].at > .7);
  });
});

test('manual motifs isolate their choreography', () => {
  for (const mode of ['monument', 'chorus', 'orbit']) {
    const n = nodes(); const tl = createPortraitTimeline(gsap, n, mode);
    tl.time(2);
    assert.equal(n[mode].autoAlpha, 1);
    for (const other of ['monument', 'chorus', 'orbit'].filter(name => name !== mode)) assert.equal(n[other].autoAlpha, 0);
    tl.kill();
  }
});

test('decorative overlays are isolated, clipped, aria-hidden, and cleaned up', async () => {
  const css = await readFile(new URL('../src/elevation/portrait-study.css', import.meta.url), 'utf8');
  const source = await readFile(new URL('../src/elevation/portrait-study.js', import.meta.url), 'utf8');
  assert.match(css, /isolation: isolate; overflow: clip !important/);
  assert.match(css, /pointer-events: none/);
  assert.match(css, /mix-blend-mode: overlay/);
  assert.match(css, /mix-blend-mode: difference/);
  assert.match(css, /Geist-SemiBold\.woff2/);
  assert.match(css, /\.portrait-study-glyph\s*\{[^}]*font-weight: 600/);
  assert.doesNotMatch(css, /font-weight: 500/);
  assert.match(source, /setAttribute\('aria-hidden', 'true'\)/);
  assert.match(source, /timeline.kill\(\); unsubscribe\(\); intersection.disconnect\(\); resize.disconnect\(\)/);
  assert.doesNotMatch(source, /backgroundImage\s*=|backgroundSize\s*=|\.src\s*=/);
});
