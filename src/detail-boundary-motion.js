import { gsap } from "gsap";
import {
  articleCopyFrame,
  boundaryProgress,
  motionFrame,
} from "./detail-motion-values.js";

const BOUNDARY_PENDING_CLASS = "detail-unit__media--boundary-pending";

function unitParts(unit) {
  const media = unit.querySelector(".detail-unit__media");
  return {
    unit,
    media,
    anchor: media ?? unit.querySelector("[data-article-detail-header]"),
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
  if (parts.media) gsap.set(parts.media, { clearProps: "transform,clipPath,willChange" });
  if (parts.shade) gsap.set(parts.shade, { clearProps: "opacity" });
  gsap.set(parts.header, { clearProps: "transform,opacity,willChange" });
}

function resetPair(pair) {
  if (!pair) return;
  resetParts(pair.outgoing);
  resetParts(pair.incoming);
}

export function createBoundaryMotion({ view, circular, reduceMotion, initialUnit = null }) {
  const enabled = Boolean(
    view?.classList.contains("detail-view--project")
    || view?.classList.contains("detail-view--article"),
  ) && !reduceMotion;
  const animateOutgoing = view?.classList.contains("detail-view--project");
  const revealArticleCopyEarly = view?.classList.contains("detail-view--article");
  const compact = !circular;
  let pairs = [];
  let activePair = null;
  let activeProgress = 0;

  const syncPendingMedia = (incoming, nextRect) => {
    const media = incoming?.media;
    if (!media || !nextRect) return;
    if (nextRect.top >= window.innerHeight) {
      media.classList.add(BOUNDARY_PENDING_CLASS);
    } else if (nextRect.top <= window.innerHeight * .1) {
      media.classList.remove(BOUNDARY_PENDING_CLASS);
    }
  };

  const measure = () => {
    if (!enabled) return;
    const units = [...view.querySelectorAll(".detail-unit")].map(unitParts);
    pairs = units.slice(1)
      .map((incoming, index) => ({
        outgoing: units[index],
        incoming,
      }))
      .filter(({ incoming }) => incoming.unit !== initialUnit);
    pairs.forEach(({ incoming }) => {
      syncPendingMedia(incoming, incoming.media?.getBoundingClientRect());
    });
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
      const nextRect = pair.incoming.anchor?.getBoundingClientRect();
      if (!nextRect) return null;
      syncPendingMedia(pair.incoming, nextRect);
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
    const copyFrame = revealArticleCopyEarly
      ? articleCopyFrame(progress, compact)
      : frame;
    activeProgress = progress;
    document.documentElement.dataset.detailBoundaryMotion = "active";

    if (animateOutgoing) {
      gsap.set(pair.outgoing.media, {
        y: frame.outgoingMediaY,
        scale: frame.outgoingMediaScale,
        transformOrigin: "50% 50%",
      });
      gsap.set(pair.outgoing.shade, { opacity: frame.outgoingShade });
    }
    if (pair.incoming.media) {
      gsap.set(pair.incoming.media, {
        y: frame.incomingMediaY,
        scale: frame.incomingMediaScale,
        clipPath: `inset(${(1 - frame.incomingReveal) * 100}% 0 0 0)`,
        transformOrigin: "50% 50%",
      });
    }
    gsap.set(pair.incoming.titles, {
      y: copyFrame.incomingTitleY,
      opacity: copyFrame.incomingTitleOpacity,
    });
    gsap.set(pair.incoming.meta, {
      y: copyFrame.incomingMetaY,
      opacity: copyFrame.incomingMetaOpacity,
    });
    gsap.set(pair.incoming.lede, {
      y: copyFrame.incomingLedeY,
      opacity: copyFrame.incomingLedeOpacity,
    });
  };

  const isTransitioning = () => activeProgress > 0 && activeProgress < 1;

  const destroy = () => {
    clear();
    pairs.forEach(resetPair);
    view.querySelectorAll(`.${BOUNDARY_PENDING_CLASS}`)
      .forEach((media) => media.classList.remove(BOUNDARY_PENDING_CLASS));
    pairs = [];
  };

  measure();
  return { render, measure, isTransitioning, clear, destroy };
}
