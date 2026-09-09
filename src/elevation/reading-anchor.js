// Layout coordinates deliberately exclude transform-driven reveal/boundary motion.
export function layoutTop(element) {
  let top = 0;
  for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
  return top;
}

export function captureReadingAnchor(blocks, inset) {
  const measurable = blocks.filter((block) => Number.isFinite(block.top) && block.height > 0);
  const block = measurable.find((candidate) => candidate.top + candidate.height > inset)
    ?? measurable.at(-1);
  if (!block) return null;
  const progress = Math.min(1, Math.max(0, (inset - block.top) / block.height));
  return {
    slug: block.slug,
    blockIndex: block.blockIndex,
    progress,
    viewportOffset: block.top + progress * block.height - inset,
  };
}

export function restoreReadingAnchor(anchor, blocks, inset) {
  if (!anchor) return null;
  const block = blocks.find((candidate) => (
    candidate.slug === anchor.slug && candidate.blockIndex === anchor.blockIndex && candidate.height > 0
  ));
  if (!block) return null;
  return Math.max(0, block.top + anchor.progress * block.height - inset - anchor.viewportOffset);
}

export function readingAnchorForNavigation(anchor, slug, navigationType) {
  if (navigationType !== "back_forward" && navigationType !== "reload") return null;
  if (!anchor || anchor.slug !== slug
    || !Number.isInteger(anchor.blockIndex) || anchor.blockIndex < 0
    || !Number.isFinite(anchor.progress) || anchor.progress < 0 || anchor.progress > 1
    || !Number.isFinite(anchor.viewportOffset)) return null;
  return anchor;
}
