import { gsap } from 'gsap';
import { isMotionPaused, subscribeMotionPause } from './motion-pause.js';
import { PORTRAIT_STUDY_MODES, PORTRAIT_STUDY_BLENDS, portraitStudyTarget, orbitPlacement, portraitStudyCanPlay, createPortraitTimeline } from './portrait-study-model.js';
import { NEW_PORTRAIT_STUDIES, STUDY_STILL, sliceInsets } from './portrait-study-variants.js';
import { OVERPRINT_MODES, overprintLayout } from './portrait-overprint.js';
import './portrait-study.css';

// A reversible art-direction study on the two existing portrait surfaces only.
// The source assets, media transforms, and page-transition controllers are untouched.
const PORTRAIT_STUDY_ENABLED = true;
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const forcedReduced = import.meta.env.DEV && new URLSearchParams(location.search).get('motion') === 'reduce';
const make = (tag, className, text) => {
  const node = document.createElement(tag); node.className = className;
  if (text) node.textContent = text;
  return node;
};
let cleanup = null;
let pendingFrame = 0;

function mountPortraitStudy() {
  if (!PORTRAIT_STUDY_ENABLED || cleanup) return;
  const selector = portraitStudyTarget(location.pathname);
  const source = selector && document.querySelector(selector);
  if (!source) return;
  const history = source.matches('.biography-portrait-placeholder');
  const stage = history ? make('div', 'portrait-study-stage portrait-study-stage--history') : source;
  if (history) { source.before(stage); stage.append(source); }
  else stage.classList.add('portrait-study-stage');
  stage.dataset.portraitBlend = 'overlay';

  const layer = make('div', 'portrait-study-layer');
  layer.setAttribute('aria-hidden', 'true');
  const monument = make('div', 'portrait-study-monument');
  const bigLetter = make('span', 'portrait-study-glyph', 'A'); monument.append(bigLetter);
  const chorus = make('div', 'portrait-study-chorus');
  let chorusLetters = [];
  let chorusColumns;
  const orbit = make('div', 'portrait-study-orbit');
  const orbitLetters = Array.from({ length: 12 }, (_, index) => {
    const glyph = make('span', 'portrait-study-glyph', 'A');
    const point = orbitPlacement(index);
    glyph.style.left = `${point.left}%`; glyph.style.top = `${point.top}%`;
    gsap.set(glyph, { xPercent: -50, yPercent: -50, rotation: point.rotation });
    orbit.append(glyph); return glyph;
  });
  const studies = {};
  NEW_PORTRAIT_STUDIES.forEach(study => {
    const group = make('div', `portrait-study-variant portrait-study-variant--${study.layout}`);
    group.dataset.study = study.id;
    group.style.setProperty('--study-columns', study.columns);
    group.style.setProperty('--study-rows', study.rows);
    const glyphs = Array.from({ length: study.columns * study.rows }, (_, index) => {
      const mask = make('div', 'portrait-study-mask');
      const glyph = make('div', 'portrait-study-copy');
      glyph.append(make('span', 'portrait-study-glyph', 'A'));
      if (study.layout === 'slices') mask.style.clipPath = `inset(${sliceInsets(index, study.columns, study.rows).map(value => `${value}%`).join(' ')})`;
      mask.append(glyph); group.append(mask); return glyph;
    });
    studies[study.id] = { group, glyphs };
    layer.append(group);
  });
  layer.append(monument, chorus, orbit); stage.append(layer);

  const tools = make('div', 'portrait-study-tools');
  tools.setAttribute('role', 'group'); tools.setAttribute('aria-label', 'Portrait animation study');
  const modeLabel = make('label', ''); modeLabel.append(make('span', 'portrait-study-caption', 'A STUDIES'));
  const modeSelect = make('select', ''); modeSelect.setAttribute('aria-label', 'Portrait motif');
  const labels = { auto: 'Overprints · all', monument: '01 Monument', chorus: '02 Chorus',
    ...Object.fromEntries(NEW_PORTRAIT_STUDIES.map(study => [study.id, study.label])), orbit: 'Orbit · earlier test', original: 'Original photo' };
  const addOption = (parent, value) => { const option = make('option', '', labels[value]); option.value = value; parent.append(option); };
  addOption(modeSelect, 'auto');
  const selected = make('optgroup', ''); selected.label = 'Selected · hard-cut overprints';
  OVERPRINT_MODES.forEach(value => addOption(selected, value)); modeSelect.append(selected);
  addOption(modeSelect, 'original');
  const earlier = make('optgroup', ''); earlier.label = 'Earlier tests · not in the sequence';
  PORTRAIT_STUDY_MODES.filter(value => !OVERPRINT_MODES.includes(value) && !['auto', 'original'].includes(value))
    .forEach(value => addOption(earlier, value)); modeSelect.append(earlier);
  modeLabel.append(modeSelect);
  const blendSelect = make('select', ''); blendSelect.setAttribute('aria-label', 'Portrait blend');
  PORTRAIT_STUDY_BLENDS.forEach(value => { const option = make('option', '', value[0].toUpperCase() + value.slice(1)); option.value = value; blendSelect.append(option); });
  const pause = make('button', '', 'Pause'); pause.type = 'button';
  const replay = make('button', '', 'Replay'); replay.type = 'button'; replay.setAttribute('aria-label', 'Replay portrait study');
  const readout = make('output', 'portrait-study-readout'); readout.setAttribute('aria-live', 'off');
  const scrub = make('input', 'portrait-study-scrub'); scrub.type = 'range'; scrub.min = '0'; scrub.max = '100'; scrub.step = '.1';
  scrub.setAttribute('aria-label', 'Study position');
  const transport = make('div', 'portrait-study-transport'); transport.append(readout, scrub);
  tools.append(modeLabel, blendSelect, pause, replay, transport); stage.append(tools);

  let mode = 'auto';
  let take = Math.floor(Math.random() * 4294967296);
  let userPaused = false;
  let visible = true;
  let pageHidden = false;
  let timeline;
  const configureGrids = () => {
    OVERPRINT_MODES.filter(id => id !== 'monument').forEach(id => {
      const group = id === 'chorus' ? chorus : studies[id].group;
      const { columns, rows, tiles } = overprintLayout(id, take);
      group.classList.add('portrait-study-overprint-grid');
      group.style.setProperty('--study-columns', columns);
      group.style.setProperty('--study-rows', rows);
      group.dataset.studyGrid = `${columns}×${rows}${id === 'lattice' ? ' mixed' : ''}`;
      const masks = [], glyphs = [];
      for (const tile of tiles) {
        const mask = make('div', 'portrait-study-mask');
        mask.style.gridColumn = `${tile.column + 1} / span ${tile.width}`;
        mask.style.gridRow = `${tile.row + 1} / span ${tile.height}`;
        mask.style.setProperty('--study-span-x', tile.width);
        mask.style.setProperty('--study-span-y', tile.height);
        const glyph = make('div', 'portrait-study-copy');
        glyph.append(make('span', 'portrait-study-glyph', 'A'));
        mask.append(glyph); masks.push(mask); glyphs.push(glyph);
      }
      group.replaceChildren(...masks);
      if (id === 'chorus') { chorusLetters = glyphs; chorusColumns = columns; }
      else studies[id] = { group, glyphs, columns, rows, tiles };
    });
  };
  const reduced = () => reducedQuery.matches || forcedReduced;
  const sync = () => {
    const staticMode = reduced();
    layer.hidden = mode === 'original';
    if (staticMode && mode !== 'original') timeline?.time(STUDY_STILL, true);
    const play = portraitStudyCanPlay({ reduced: staticMode, userPaused,
      globalPaused: isMotionPaused(), visible, hidden: pageHidden || document.hidden, original: mode === 'original' });
    timeline?.paused(!play);
    stage.dataset.portraitPlayback = play ? 'playing' : 'paused';
    pause.disabled = staticMode || mode === 'original';
    pause.textContent = staticMode ? 'Still' : userPaused ? 'Play' : 'Pause';
    pause.setAttribute('aria-label', userPaused ? 'Play portrait animation' : 'Pause portrait animation');
    pause.setAttribute('aria-pressed', String(userPaused));
    replay.disabled = staticMode || mode === 'original';
    scrub.disabled = staticMode || mode === 'original' || mode === 'auto';
  };
  const updateReadout = () => {
    const current = mode === 'auto' ? timeline.currentLabel() : mode;
    const study = NEW_PORTRAIT_STUDIES.find(item => item.id === current);
    const grid = current === 'chorus' ? chorus.dataset.studyGrid : studies[current]?.group.dataset.studyGrid;
    const title = `${labels[current] || 'Overprints'}${grid ? ` · ${grid}` : ''}`;
    if (readout.textContent !== title) { readout.textContent = title; readout.title = study?.hint || ''; }
    if (mode !== 'auto') scrub.value = String(timeline.progress() * 100);
  };
  const rebuild = () => {
    timeline?.kill();
    configureGrids();
    timeline = createPortraitTimeline(gsap, { monument, bigLetter, chorus, chorusLetters, chorusColumns, orbit, orbitLetters, studies }, mode === 'original' ? 'monument' : mode, take);
    timeline.eventCallback('onUpdate', updateReadout);
    if (userPaused) timeline.time(STUDY_STILL, true);
    stage.dataset.portraitMotif = mode;
    sync();
    updateReadout();
  };
  modeSelect.addEventListener('change', () => { mode = modeSelect.value; rebuild(); });
  blendSelect.addEventListener('change', () => { stage.dataset.portraitBlend = blendSelect.value; });
  pause.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  replay.title = 'Replay with a new grid and overprint take';
  replay.addEventListener('click', () => { userPaused = false; take = (take + 1) >>> 0; rebuild(); });
  scrub.addEventListener('input', () => { userPaused = true; timeline.progress(Number(scrub.value) / 100); sync(); });
  const onHide = () => { pageHidden = true; sync(); };
  const onShow = () => { pageHidden = false; sync(); };
  window.addEventListener('pagehide', onHide);
  window.addEventListener('pageshow', onShow);
  reducedQuery.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  const unsubscribe = subscribeMotionPause(sync);
  const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .01 });
  intersection.observe(stage);
  const resize = new ResizeObserver(() => {
    const box = stage.getBoundingClientRect();
    stage.style.setProperty('--portrait-monument-size', `${Math.min(box.width * 1.65, box.height * 1.22)}px`);
  });
  resize.observe(stage);
  rebuild();
  cleanup = () => {
    timeline.kill(); unsubscribe(); intersection.disconnect(); resize.disconnect();
    window.removeEventListener('pagehide', onHide); window.removeEventListener('pageshow', onShow);
    document.removeEventListener('visibilitychange', sync); reducedQuery.removeEventListener('change', sync);
    layer.remove(); tools.remove();
    if (history) { stage.before(source); stage.remove(); }
    else { stage.classList.remove('portrait-study-stage'); stage.style.removeProperty('--portrait-monument-size');
      delete stage.dataset.portraitBlend; delete stage.dataset.portraitPlayback; delete stage.dataset.portraitMotif; }
    cleanup = null;
  };
}

const scheduleMount = () => { cancelAnimationFrame(pendingFrame); pendingFrame = requestAnimationFrame(mountPortraitStudy); };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleMount, { once: true });
else scheduleMount();
window.addEventListener('portfolio:routechange', scheduleMount);
if (import.meta.hot) import.meta.hot.dispose(() => {
  cancelAnimationFrame(pendingFrame); cleanup?.();
  document.removeEventListener('DOMContentLoaded', scheduleMount);
  window.removeEventListener('portfolio:routechange', scheduleMount);
});
