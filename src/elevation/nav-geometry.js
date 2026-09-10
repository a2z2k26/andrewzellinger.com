// Size the actual DOM geometry, not its ancestor: liquid-gooey measures in
// viewport coordinates, so ancestor scale transforms misalign its SVG proxy.
export function navigationGeometry(width, height) {
  // Every route is bottom-docked. Keep sizing independent of placement, and
  // Retain the approved panel envelope around three 44px targets with 12px
  // row gaps, plus the separate 16px panel-to-circle air gap.
  const compact = width < 992 || height < 676;
  const bottomInset = 48;
  const buttonSize = compact ? 64 : 92;
  const panelHeight = Math.max(188, Math.min(256, height - bottomInset - buttonSize - 32));
  return { scale: .8, docked: true, bottomInset, buttonSize, panelWidth: 224, panelHeight,
    padding: (panelHeight - 188) / 2,
    travel: panelHeight / 2 + buttonSize / 2 + 16 };
}

export function fitMorphFrames(frames, geometry) {
  return frames.map((frame) => Object.fromEntries(Object.entries(frame).map(([key, value]) => {
    const scale = key === 'transform' ? geometry.travel / 238
      : key === 'height' ? geometry.panelHeight / 320 : geometry.scale;
    return [key, typeof value === 'string' && key !== 'easing' && value !== '999px'
      ? value.replace(/(-?\d+(?:\.\d+)?)px/g, (_, n) => `${Number(n) * scale}px`) : value];
  })));
}

// WAAPI play() at time zero with a negative rate auto-rewinds to the end.
// An endpoint is already settled, not a request to replay the whole shape.
export function playToward(animation, open, duration, reduced) {
  const target = open ? duration : 0;
  const time = Number(animation.currentTime) || 0;
  if (reduced || (open ? time >= duration : time <= 0)) {
    animation.pause();
    animation.currentTime = target;
    return;
  }
  animation.playbackRate = open ? 1 : -1;
  animation.play();
}

export function scaleMorphFrames(frames, scale) {
  return frames.map((frame) => Object.fromEntries(Object.entries(frame).map(([key, value]) => [key,
    typeof value === "string" && key !== "easing" && value !== "999px"
      ? value.replace(/(-?\d+(?:\.\d+)?)px/g, (_, number) => `${Number(number) * scale}px`) : value,
  ])));
}
