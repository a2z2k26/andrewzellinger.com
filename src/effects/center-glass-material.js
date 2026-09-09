import { createDisplacementMap, DOM_GLASS_DEFAULTS } from './dom-glass-lens.js';

// Reuse the preserved glass recipe without mounting its former controller,
// global filter IDs, layout, or development panel.
export const CENTER_GLASS_SETTINGS = DOM_GLASS_DEFAULTS;
let displacementMap;
export function centerGlassDisplacementMap() {
  return displacementMap ||= createDisplacementMap(
    CENTER_GLASS_SETTINGS.falloff, CENTER_GLASS_SETTINGS.warp,
  );
}

export function relativeGlassRect(frame, surface) {
  return { x: frame.left - surface.left, y: frame.top - surface.top,
    width: frame.width, height: frame.height };
}

export function syncCenterGlassMaterial(host) {
  const surface = host.querySelector('.center-nav-glass-surface');
  const base = host.querySelector('.center-gooey-base-item');
  const panel = host.querySelector('.center-gooey-menu-panel-surface');
  const baseMap = host.querySelector('[data-center-glass-map="base"]');
  const panelMap = host.querySelector('[data-center-glass-map="panel"]');
  if (!surface || !base || !panel || !baseMap || !panelMap) return;
  // Batch all layout reads before writing filter geometry. The existing
  // morph's progress loop calls this; no second animation/idle RAF is added.
  const surfaceRect = surface.getBoundingClientRect();
  const positions = [base, panel].map(node => relativeGlassRect(node.getBoundingClientRect(), surfaceRect));
  [baseMap, panelMap].forEach((map, index) => {
    for (const [key, value] of Object.entries(positions[index])) {
      const next = String(value);
      if (map.getAttribute(key) !== next) map.setAttribute(key, next);
    }
  });
}
