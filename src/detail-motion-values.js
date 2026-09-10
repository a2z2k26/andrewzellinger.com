export function clamp01(value) {
  return Math.min(1, Math.max(0, Number(value) || 0));
}

export function rangeProgress(value, start, end) {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

export function boundaryProgress(nextMediaTop, viewportHeight) {
  const height = Math.max(1, viewportHeight);
  const start = height;
  const end = height * .1;
  return clamp01((start - nextMediaTop) / (start - end));
}

const mix = (from, to, progress) => from + ((to - from) * progress);

export function motionFrame(progress, compact = false) {
  const value = clamp01(progress);
  const outgoingMedia = rangeProgress(value, .15, .7);
  const incomingMedia = rangeProgress(value, 0, .65);
  const title = rangeProgress(value, .65, .9);
  const meta = rangeProgress(value, .7, .95);
  const lede = rangeProgress(value, .75, 1);
  const distanceFactor = compact ? .5 : 1;

  return {
    outgoingMediaScale: mix(1, .96, outgoingMedia),
    outgoingMediaY: mix(0, -20 * distanceFactor, outgoingMedia),
    outgoingShade: mix(0, .22, outgoingMedia),
    incomingMediaScale: mix(1.04, 1, incomingMedia),
    incomingMediaY: mix(40 * distanceFactor, 0, incomingMedia),
    incomingReveal: incomingMedia,
    incomingTitleY: mix(24 * distanceFactor, 0, title),
    incomingTitleOpacity: title,
    incomingMetaY: mix(18 * distanceFactor, 0, meta),
    incomingMetaOpacity: meta,
    incomingLedeY: mix(14 * distanceFactor, 0, lede),
    incomingLedeOpacity: lede,
  };
}

export function articleCopyFrame(progress, compact = false) {
  const value = clamp01(progress);
  const title = rangeProgress(value, 0, .18);
  const meta = rangeProgress(value, .03, .23);
  const lede = rangeProgress(value, .06, .27);
  const distanceFactor = compact ? .5 : 1;

  return {
    incomingTitleY: mix(16 * distanceFactor, 0, title),
    incomingTitleOpacity: title,
    incomingMetaY: mix(12 * distanceFactor, 0, meta),
    incomingMetaOpacity: meta,
    incomingLedeY: mix(8 * distanceFactor, 0, lede),
    incomingLedeOpacity: lede,
  };
}
