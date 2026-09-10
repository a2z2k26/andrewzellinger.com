import { HOME_PORTRAIT_MARKS, portraitArtworkFor, portraitArtworkSize } from './portrait-artwork-model.js';
import './portrait-artwork.css';

// The motion laboratory and fixed portrait artwork remain preserved for later
// use, but no live route currently opts into an overlay.
export const PORTRAIT_ARTWORK_ENABLED = true;
let cleanup = null;
let pendingFrame = 0;

export function mountPortraitArtwork() {
  if (!PORTRAIT_ARTWORK_ENABLED) return;
  if (cleanup) return;
  const artwork = portraitArtworkFor(location.pathname);
  const source = artwork && document.querySelector(artwork.selector);
  if (!source) return;
  const history = artwork.kind === 'history';
  const stage = history ? document.createElement('div') : source;
  if (history) {
    // Keep the existing wrapper hook used by compact route snapshots.
    stage.className = 'portrait-study-stage--history portrait-artwork-stage';
    source.before(stage); stage.append(source);
  } else stage.classList.add('portrait-artwork-stage');
  stage.dataset.portraitArtwork = artwork.kind;
  const layer = document.createElement('div');
  layer.className = `portrait-artwork-layer portrait-artwork-layer--${artwork.kind}`;
  layer.setAttribute('aria-hidden', 'true');
  const marks = history ? [{ x: .5, y: .5, scale: 1 }] : HOME_PORTRAIT_MARKS;
  for (const mark of marks) {
    const glyph = document.createElement('span');
    glyph.className = 'portrait-artwork-glyph'; glyph.textContent = 'A';
    if (history) {
      const period = document.createElement('span');
      period.className = 'portrait-artwork-period';
      glyph.append(period);
    }
    glyph.style.left = `${mark.x * 100}%`; glyph.style.top = `${mark.y * 100}%`;
    glyph.style.setProperty('--portrait-mark-scale', mark.scale);
    layer.append(glyph);
  }
  stage.append(layer);
  const size = () => {
    const box = stage.getBoundingClientRect();
    stage.style.setProperty('--portrait-artwork-size', `${portraitArtworkSize(artwork.kind, box.width, box.height)}px`);
  };
  const resize = new ResizeObserver(size);
  resize.observe(stage); size();
  cleanup = () => {
    resize.disconnect(); layer.remove();
    if (history) { stage.before(source); stage.remove(); }
    else { stage.classList.remove('portrait-artwork-stage'); stage.style.removeProperty('--portrait-artwork-size'); delete stage.dataset.portraitArtwork; }
    cleanup = null;
  };
}

const scheduleMount = () => { cancelAnimationFrame(pendingFrame); pendingFrame = requestAnimationFrame(mountPortraitArtwork); };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleMount, { once: true });
else scheduleMount();
window.addEventListener('portfolio:routechange', scheduleMount);
if (import.meta.hot) import.meta.hot.dispose(() => {
  cancelAnimationFrame(pendingFrame); cleanup?.();
  document.removeEventListener('DOMContentLoaded', scheduleMount);
  window.removeEventListener('portfolio:routechange', scheduleMount);
});
