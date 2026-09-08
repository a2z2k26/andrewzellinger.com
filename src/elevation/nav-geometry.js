// Size the actual DOM geometry, not its ancestor: liquid-gooey measures in
// viewport coordinates, so ancestor scale transforms misalign its SVG proxy.
export function navigationGeometry(width, height) {
  const mobile = width < 992;
  const availableHeight = mobile ? height - 80 : height / 2 - 24;
  const scale = Math.min(.8, Math.max(.4, availableHeight / 398));
  return { scale, buttonSize: mobile ? 64 : 100 * scale, panelWidth: 280 * scale,
    panelHeight: 320 * scale, travel: 238 * scale };
}

export function scaleMorphFrames(frames, scale) {
  return frames.map((frame) => Object.fromEntries(Object.entries(frame).map(([key, value]) => [key,
    typeof value === "string" && key !== "easing" && value !== "999px"
      ? value.replace(/(-?\d+(?:\.\d+)?)px/g, (_, number) => `${Number(number) * scale}px`) : value,
  ])));
}
