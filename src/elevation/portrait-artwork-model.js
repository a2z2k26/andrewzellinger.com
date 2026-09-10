// Fixed Home composition from Andrew's Sep 9 00:31:22 Signal screenshot.
// Preserve the ten selected positions; vary only a handful of glyph sizes.
// Coordinates are relative to the photo, not the viewport or the page grid.
export const HOME_PORTRAIT_MARKS = [
  { x: .316, y: .13, scale: .78 },
  { x: .500, y: .13, scale: 1 },
  { x: .132, y: .294, scale: 1.45 },
  { x: .500, y: .294, scale: .78 },
  { x: .868, y: .294, scale: 1 },
  { x: .316, y: .458, scale: 1 },
  { x: .316, y: .622, scale: 1 },
  { x: .132, y: .786, scale: .78 },
  { x: .316, y: .786, scale: 1.35 },
  { x: .868, y: .786, scale: 2.15 },
];

export function portraitArtworkFor(pathname) {
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/history') return { kind: 'history', selector: '.biography-portrait-placeholder' };
  return null;
}

export function portraitArtworkSize(kind, width, height) {
  return kind === 'history' ? Math.min(width * 1.65, height * 1.22)
    : Math.min(width * .184, height * .16);
}
