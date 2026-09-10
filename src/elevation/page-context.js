const clamp = value => Math.max(0, Math.min(1, value));
const position = (index, total) => index < 0 || !total ? ''
  : `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

// One typographic structure; only meaningful labels and indicators per state.
export function pageContext({ section, name = '', index = -1, total = 0 }) {
  return {
    count: position(index, total),
    title: name || (section === '/history' ? 'Design practice' : section === '/' || section === '/projects' ? 'Selected projects' : 'Selected articles'),
    progress: true,
  };
}

// Sections may nest (Selected clients lives inside Capabilities). Choose the
// latest section start crossing the reading line, not the containing parent.
export function activeSectionIndex(tops, readingLine, atEnd = false) {
  if (atEnd && tops.length) return tops.length - 1;
  let active = 0;
  tops.forEach((top, index) => { if (top <= readingLine) active = index; });
  return active;
}

export function documentProgress(scrollTop, scrollHeight, viewportHeight) {
  const distance = scrollHeight - viewportHeight;
  return distance > 0 ? clamp(scrollTop / distance) : 0;
}

// Keep History's section index and progress inside one canonical loop cycle,
// regardless of whether the visible copy is before or after the source.
export function historyLoopPosition(sourceTop, distance, readingLine) {
  if (!Number.isFinite(distance) || distance <= 0) return 0;
  return ((readingLine - sourceTop) % distance + distance) % distance;
}

// Equal portions per logical item, with continuous travel inside that portion.
// Inert loop copies keep the original ordinal; the bar wraps at the seam.
export function collectionProgress(index, total, top, height, readingLine) {
  if (index < 0 || !total || height <= 0) return 0;
  return clamp((index + clamp((readingLine - top) / height)) / total);
}
