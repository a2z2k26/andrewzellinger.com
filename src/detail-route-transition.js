import { gsap } from "gsap";

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function prepareOverlay(element, className, rect) {
  if (!element || !rect) return null;
  const overlay = element;
  [overlay, ...overlay.querySelectorAll(".glass-proxy-media-ready, .glass-proxy-text-ready")]
    .forEach((node) => {
      node.classList.remove("glass-proxy-media-ready", "glass-proxy-text-ready");
    });
  overlay.classList.add(className);
  overlay.removeAttribute("role");
  overlay.removeAttribute("aria-label");
  overlay.setAttribute("aria-hidden", "true");
  overlay.querySelector(".detail-unit__media-shade")?.remove();
  overlay.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
  overlay.style.removeProperty("transform");
  overlay.style.removeProperty("opacity");
  overlay.style.removeProperty("visibility");
  overlay.style.removeProperty("clip-path");
  Object.assign(overlay.style, {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  });
  return overlay;
}

export function holdRouteVisual(element, className, rect) {
  const overlay = prepareOverlay(element, className, rect);
  if (overlay) document.body.append(overlay);
  return overlay;
}

function clearTargets(targets) {
  gsap.set(targets, { clearProps: "transform,opacity,visibility,willChange" });
}

export function runRouteTransition({
  direction,
  mediaVisual,
  mediaFrom,
  mediaTo,
  copyVisual = null,
  copyRect = null,
  nativeTarget = null,
  detailHeader = {},
  destinationCopy = null,
  reduceMotion = false,
  onComplete = () => {},
}) {
  const detailTitles = asArray(detailHeader.titles);
  const detailMeta = asArray(detailHeader.meta);
  const detailLede = asArray(detailHeader.lede);
  const detailTargets = [...detailTitles, ...detailMeta, ...detailLede];
  const compact = matchMedia("(max-width: 991px)").matches;
  const distanceFactor = compact ? .5 : 1;
  let overlay = null;
  let copyOverlay = null;
  let timeline = null;
  let finished = false;

  const finish = (notify = true) => {
    if (finished) return;
    finished = true;
    nativeTarget?.style.removeProperty("visibility");
    clearTargets(detailTargets);
    clearTargets(destinationCopy);
    overlay?.remove();
    copyOverlay?.remove();
    if (notify) onComplete();
  };

  function cancel() {
    timeline?.kill();
    finish(false);
  }

  if (
    reduceMotion
    || !mediaVisual
    || !mediaFrom
    || !mediaTo
    || !nativeTarget
    || ![mediaFrom.width, mediaFrom.height, mediaTo.width, mediaTo.height].every((value) => value > 0)
  ) {
    requestAnimationFrame(() => finish(true));
    return { timeline: null, cancel };
  }

  overlay = holdRouteVisual(mediaVisual, "detail-transition-media", mediaTo);
  copyOverlay = holdRouteVisual(copyVisual, "detail-transition-copy", copyRect);
  nativeTarget.style.visibility = "hidden";

  gsap.set(overlay, {
    x: mediaFrom.left - mediaTo.left,
    y: mediaFrom.top - mediaTo.top,
    scaleX: mediaFrom.width / mediaTo.width,
    scaleY: mediaFrom.height / mediaTo.height,
    transformOrigin: "0 0",
  });

  if (copyOverlay) gsap.set(copyOverlay, { autoAlpha: 1, y: 0 });

  if (direction === "enter") {
    gsap.set(detailTitles, { autoAlpha: 0, y: 24 * distanceFactor });
    gsap.set(detailMeta, { autoAlpha: 0, y: 18 * distanceFactor });
    gsap.set(detailLede, { autoAlpha: 0, y: 14 * distanceFactor });
  } else {
    gsap.set(destinationCopy, { autoAlpha: 0, y: 12 * distanceFactor });
  }

  timeline = gsap.timeline({ onComplete: () => finish(true) });
  if (copyOverlay) {
    timeline.to(copyOverlay, {
      autoAlpha: 0,
      y: (direction === "enter" ? 12 : -12) * distanceFactor,
      duration: .24,
      ease: "power2.in",
    }, 0);
  }
  timeline.to(overlay, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    duration: .7,
    ease: "power3.inOut",
  }, direction === "return" ? .06 : 0);

  if (direction === "enter") {
    timeline
      .to(detailTitles, { autoAlpha: 1, y: 0, duration: .3, ease: "power2.out" }, .46)
      .to(detailMeta, { autoAlpha: 1, y: 0, duration: .3, ease: "power2.out" }, .505)
      .to(detailLede, { autoAlpha: 1, y: 0, duration: .3, ease: "power2.out" }, .55);
  } else {
    timeline.to(destinationCopy, {
      autoAlpha: 1,
      y: 0,
      duration: .3,
      ease: "power2.out",
    }, .48);
  }

  return { timeline, cancel };
}
