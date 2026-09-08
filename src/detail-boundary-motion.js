import { gsap } from "gsap";
import { boundaryProgress, motionFrame } from "./detail-motion-values.js";

function unitParts(unit) {
  return {
    unit,
    media: unit.querySelector(".detail-unit__media"),
    shade: unit.querySelector(".detail-unit__media-shade"),
    header: [
      ...unit.querySelectorAll("[data-detail-motion-title]"),
      unit.querySelector("[data-detail-motion-meta]"),
      unit.querySelector("[data-detail-motion-lede]"),
    ].filter(Boolean),
    titles: [...unit.querySelectorAll("[data-detail-motion-title]")],
    meta: unit.querySelector("[data-detail-motion-meta]"),
    lede: unit.querySelector("[data-detail-motion-lede]"),
  };
}

function resetParts(parts) {
  if (!parts) return;
  gsap.set(parts.media, { clearProps: "transform,clipPath,willChange" });
  gsap.set(parts.shade, { clearProps: "opacity" });
  gsap.set(parts.header, { clearProps: "transform,opacity,willChange" });
}

function resetPair(pair) {
  if (!pair) return;
  resetParts(pair.outgoing);
  resetParts(pair.incoming);
}

export function createBoundaryMotion({ view, circular, reduceMotion, initialUnit = null }) {
  const enabled = Boolean(view?.classList.contains("detail-view--project")) && !reduceMotion;
  const compact = !circular;
  let pairs = [];
  let activePair = null;
  let activeProgress = 0;

  const measure = () => {
    if (!enabled) return;
    const units = [...view.querySelectorAll(".detail-unit")].map(unitParts);
    pairs = units.slice(1)
      .map((incoming, index) => ({
        outgoing: units[index],
        incoming,
      }))
      .filter(({ incoming }) => incoming.unit !== initialUnit);
  };

  const clear = () => {
    resetPair(activePair);
    activePair = null;
    activeProgress = 0;
    delete document.documentElement.dataset.detailBoundaryMotion;
  };

  const render = () => {
    if (!enabled || !pairs.length) return;
    const candidates = pairs.map((pair) => {
      const nextRect = pair.incoming.media?.getBoundingClientRect();
      if (!nextRect) return null;
      const progress = boundaryProgress(nextRect.top, window.innerHeight);
      if (progress <= 0 || progress >= 1) return null;
      return { pair, progress, distance: Math.abs(progress - .5), nextRect };
    }).filter(Boolean).sort((a, b) => a.distance - b.distance);

    const candidate = candidates[0];
    if (!candidate) {
      clear();
      return;
    }

    if (activePair !== candidate.pair) {
      resetPair(activePair);
      activePair = candidate.pair;
    }

    const { pair, progress, nextRect } = candidate;
    const frame = motionFrame(progress, compact);
    activeProgress = progress;
    document.documentElement.dataset.detailBoundaryMotion = "active";

    gsap.set(pair.outgoing.media, {
      y: frame.outgoingMediaY,
      scale: frame.outgoingMediaScale,
      transformOrigin: "50% 50%",
    });
    gsap.set(pair.outgoing.shade, { opacity: frame.outgoingShade });
    gsap.set(pair.outgoing.header, {
      y: frame.outgoingCopyY,
      opacity: frame.outgoingCopyOpacity,
    });
    gsap.set(pair.incoming.media, {
      y: frame.incomingMediaY,
      scale: frame.incomingMediaScale,
      clipPath: `inset(${(1 - frame.incomingReveal) * 100}% 0 0 0)`,
      transformOrigin: "50% 50%",
    });
    gsap.set(pair.incoming.titles, {
      y: frame.incomingTitleY,
      opacity: frame.incomingTitleOpacity,
    });
    gsap.set(pair.incoming.meta, {
      y: frame.incomingMetaY,
      opacity: frame.incomingMetaOpacity,
    });
    gsap.set(pair.incoming.lede, {
      y: frame.incomingLedeY,
      opacity: frame.incomingLedeOpacity,
    });
  };

  const isTransitioning = () => activeProgress > 0 && activeProgress < 1;

  const destroy = () => {
    clear();
    pairs.forEach(resetPair);
    pairs = [];
  };

  measure();
  return { render, measure, isTransitioning, clear, destroy };
}
