import { MODE_FRAMES, paintFrame, resolvePreset } from "thinking-orbs/engine";

const PRESET_SIZE = 64;
const FRAME_SIZE = 68;
const WIDTH = 112;
const HORIZONTAL_SPREAD = 1.72;
const HIGHLIGHT_SPEED_SCALE = 0.6;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const STATIC_FRAME_TIME = 0.6;

// Use the package's pure canvas engine so the DOM-first introduction keeps
// its existing lifecycle instead of mounting a separate React root.
export function createThinkingOrbIcon() {
  const canvas = document.createElement("canvas");
  canvas.className = "welcome-preface__orb";
  canvas.setAttribute("aria-hidden", "true");
  const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(WIDTH * pixelRatio);
  canvas.height = Math.round(FRAME_SIZE * pixelRatio);

  const context = canvas.getContext("2d");
  if (!context) return canvas;

  const { mode, speed, opts } = resolvePreset("searching", PRESET_SIZE);
  // The searching frame's scanMul controls the bright meridian relative to
  // the globe's own rotation. Slow that highlight without slowing the globe.
  const frameOpts = { ...opts, scanMul: opts.scanMul * HIGHLIGHT_SPEED_SCALE };
  const makeFrame = MODE_FRAMES[mode];
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  let frameId = 0;
  let running = false;
  let inView = true;
  let destroyed = false;

  const paint = (time) => {
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, WIDTH, FRAME_SIZE);
    const frame = makeFrame(FRAME_SIZE, time, frameOpts);
    // Widen the globe's projected positions, not its painted dots. The
    // searching preset and each circular dot keep their package geometry.
    for (const dot of frame.dots) {
      dot.x = WIDTH / 2 + (dot.x - FRAME_SIZE / 2) * HORIZONTAL_SPREAD;
    }
    for (const line of frame.lines) {
      line.x1 = WIDTH / 2 + (line.x1 - FRAME_SIZE / 2) * HORIZONTAL_SPREAD;
      line.x2 = WIDTH / 2 + (line.x2 - FRAME_SIZE / 2) * HORIZONTAL_SPREAD;
    }
    paintFrame(context, frame, true);
  };

  const stop = () => {
    running = false;
    window.cancelAnimationFrame(frameId);
  };

  const tick = () => {
    paint(window.performance.now() / 1000 * speed);
    if (running) frameId = window.requestAnimationFrame(tick);
  };

  const start = () => {
    if (destroyed || running || reducedMotion.matches || !inView || document.hidden) return;
    running = true;
    frameId = window.requestAnimationFrame(tick);
  };

  const onVisibilityChange = () => {
    if (document.hidden) stop();
    else start();
  };

  const onMotionChange = () => {
    if (reducedMotion.matches) {
      stop();
      paint(STATIC_FRAME_TIME);
    } else {
      paint(window.performance.now() / 1000 * speed);
      start();
    }
  };

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    })
    : null;

  paint(reducedMotion.matches ? STATIC_FRAME_TIME : window.performance.now() / 1000 * speed);
  observer?.observe(canvas);
  if (!observer) start();
  document.addEventListener("visibilitychange", onVisibilityChange);
  reducedMotion.addEventListener("change", onMotionChange);

  canvas.destroy = () => {
    destroyed = true;
    stop();
    observer?.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.removeEventListener("change", onMotionChange);
  };
  return canvas;
}
