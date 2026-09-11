import "./rotating-globe-icon.css";

const SVG_NS = "http://www.w3.org/2000/svg";
const CENTER_X = 64;
const TOP_Y = 10;
const MID_Y = 36;
const BOTTOM_Y = 62;
const MERIDIAN_RADIUS = 58;
const MERIDIAN_COUNT = 12;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

let instanceCount = 0;

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function meridianPath(offset) {
  const shoulder = offset * .72;
  return [
    `M ${CENTER_X} ${TOP_Y}`,
    `C ${CENTER_X + shoulder} ${TOP_Y} ${CENTER_X + offset} 25 ${CENTER_X + offset} ${MID_Y}`,
    `C ${CENTER_X + offset} 47 ${CENTER_X + shoulder} ${BOTTOM_Y} ${CENTER_X} ${BOTTOM_Y}`,
  ].join(" ");
}

export function createRotatingGlobeIcon({ duration = 6860, fadeMeridians = true, visibilityTarget = null } = {}) {
  instanceCount += 1;
  const clipId = `rotating-globe-clip-${instanceCount}`;
  const svg = createSvgElement("svg", {
    class: "rotating-globe-icon",
    viewBox: "0 0 128 72",
    fill: "none",
    "aria-hidden": "true",
    focusable: "false",
  });

  const defs = createSvgElement("defs");
  const clipPath = createSvgElement("clipPath", { id: clipId });
  clipPath.append(createSvgElement("ellipse", { cx: "64", cy: "36", rx: "59", ry: "26" }));
  defs.append(clipPath);

  const grid = createSvgElement("g", {
    class: "rotating-globe-icon__grid",
    "clip-path": `url(#${clipId})`,
  });

  const meridianCount = fadeMeridians ? MERIDIAN_COUNT : MERIDIAN_COUNT / 2;
  const meridians = Array.from({ length: meridianCount }, () => {
    const path = createSvgElement("path", { class: "rotating-globe-icon__meridian" });
    grid.append(path);
    return path;
  });

  grid.append(
    createSvgElement("path", {
      class: "rotating-globe-icon__latitude",
      d: "M 10 22 C 34 29 94 29 118 22",
    }),
    createSvgElement("path", {
      class: "rotating-globe-icon__latitude",
      d: "M 4 36 H 124",
    }),
    createSvgElement("path", {
      class: "rotating-globe-icon__latitude",
      d: "M 10 50 C 34 43 94 43 118 50",
    }),
  );

  const outline = createSvgElement("ellipse", {
    class: "rotating-globe-icon__outline",
    cx: "64",
    cy: "36",
    rx: "59",
    ry: "26",
  });

  svg.append(defs, grid, outline);

  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  let animationFrame = 0;
  let startTime = 0;
  let isVisible = true;
  let disposed = false;

  const render = (phase) => {
    meridians.forEach((path, index) => {
      // Constant-opacity mode wraps six front-facing arcs edge to edge.
      // Hidden rear arcs are not drawn, so there is no fade or doubled grid.
      const angle = (index / MERIDIAN_COUNT) * Math.PI * 2 + phase;
      const longitude = fadeMeridians
        ? angle
        : ((angle % Math.PI + Math.PI) % Math.PI) - Math.PI / 2;
      const depth = Math.cos(longitude);
      const offset = MERIDIAN_RADIUS * Math.sin(longitude);
      path.setAttribute("d", meridianPath(offset));
      path.style.opacity = fadeMeridians
        ? (depth > 0 ? String(.18 + .82 * Math.pow(depth, .62)) : "0")
        : "1";
    });
  };

  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    window.cancelAnimationFrame(animationFrame);
    reducedMotion.removeEventListener?.("change", onMotionPreferenceChange);
    document.removeEventListener("visibilitychange", syncPlayback);
    observer?.disconnect();
  };

  svg.destroy = cleanup;

  const tick = (time) => {
    if (!svg.isConnected) {
      cleanup();
      return;
    }
    if (!startTime) startTime = time;
    const phase = -((time - startTime) / duration) * Math.PI * 2;
    render(phase);
    animationFrame = window.requestAnimationFrame(tick);
  };

  const syncPlayback = () => {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    if (reducedMotion.matches || document.hidden || !isVisible || disposed) {
      render(0);
      return;
    }
    startTime = 0;
    animationFrame = window.requestAnimationFrame(tick);
  };

  function onMotionPreferenceChange() {
    syncPlayback();
  }

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver(([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
        syncPlayback();
      })
    : null;

  render(0);
  observer?.observe(visibilityTarget ?? svg);
  reducedMotion.addEventListener?.("change", onMotionPreferenceChange);
  document.addEventListener("visibilitychange", syncPlayback);
  window.requestAnimationFrame(syncPlayback);

  return svg;
}
