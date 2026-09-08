import { gsap } from "gsap";

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

export function runVerticalExpansion({
  target,
  direction = "enter",
  reduceMotion = false,
  onComplete = () => {},
}) {
  let tween = null;
  let finished = false;
  let resolveFinished;
  const completion = new Promise((resolve) => { resolveFinished = resolve; });

  const finish = (notify = true) => {
    if (finished) return;
    finished = true;
    if (target) gsap.set(target, { clearProps: "transform,opacity,visibility,clipPath,willChange" });
    resolveFinished();
    if (notify) onComplete();
  };

  const cancel = () => {
    tween?.kill();
    finish(false);
  };

  if (!target || reduceMotion) {
    requestAnimationFrame(() => finish(true));
    return { tween: null, finished: completion, cancel };
  }

  if (direction === "enter") {
    gsap.set(target, {
      autoAlpha: 0,
      y: 24,
      clipPath: "inset(0 0 100% 0)",
      willChange: "transform,opacity,clip-path",
    });
    tween = gsap.to(target, {
      autoAlpha: 1,
      y: 0,
      clipPath: "inset(0 0 0% 0)",
      duration: .72,
      ease: "power3.out",
      onComplete: () => finish(true),
    });
  } else {
    tween = gsap.to(target, {
      autoAlpha: 0,
      y: -12,
      clipPath: "inset(0 0 100% 0)",
      duration: .52,
      ease: "power3.inOut",
      willChange: "transform,opacity,clip-path",
      onComplete: () => finish(true),
    });
  }

  return { tween, finished: completion, cancel };
}

export function runRouteTransition({
  direction = "enter",
  mediaVisual,
  mediaFrom,
  mediaTo,
  nativeTarget = null,
  nativeCopy = null,
  copyFrom = null,
  copyTo = null,
  expansionTarget = null,
  revealTarget = null,
  reduceMotion = false,
  onComplete = () => {},
}) {
  let overlay = null;
  let timeline = null;
  let finished = false;

  const finish = (notify = true) => {
    if (finished) return;
    finished = true;
    nativeTarget?.style.removeProperty("visibility");
    if (nativeCopy) gsap.set(nativeCopy, { clearProps: "transform,opacity,visibility,willChange" });
    if (expansionTarget) {
      gsap.set(expansionTarget, {
        clearProps: "transform,opacity,visibility,clipPath,willChange",
      });
    }
    if (revealTarget) gsap.set(revealTarget, { clearProps: "opacity,visibility,willChange" });
    overlay?.remove();
    if (notify) onComplete();
  };

  const cancel = () => {
    timeline?.kill();
    finish(false);
  };

  const canAnimateMedia = Boolean(
    mediaVisual
    && mediaFrom
    && mediaTo
    && nativeTarget
    && [mediaFrom.width, mediaFrom.height, mediaTo.width, mediaTo.height]
      .every((value) => value > 0),
  );

  if (reduceMotion) {
    requestAnimationFrame(() => finish(true));
    return { timeline: null, cancel };
  }

  if (canAnimateMedia) {
    overlay = holdRouteVisual(mediaVisual, "detail-transition-media", mediaTo);
    nativeTarget.style.visibility = "hidden";
    gsap.set(overlay, {
      x: mediaFrom.left - mediaTo.left,
      y: mediaFrom.top - mediaTo.top,
      scaleX: mediaFrom.width / mediaTo.width,
      scaleY: mediaFrom.height / mediaTo.height,
      transformOrigin: "0 0",
      willChange: "transform",
    });
  }

  const animateExpandedCard = direction === "enter" && canAnimateMedia;
  if (animateExpandedCard && nativeCopy) {
    const copyY = copyFrom && copyTo ? copyFrom.top - copyTo.top : 24;
    gsap.set(nativeCopy, {
      autoAlpha: copyFrom ? 1 : 0,
      y: copyY,
      willChange: "transform,opacity",
    });
  }
  if (animateExpandedCard && expansionTarget) {
    gsap.set(expansionTarget, {
      autoAlpha: 0,
      y: 32,
      clipPath: "inset(0 0 100% 0)",
      willChange: "transform,opacity,clip-path",
    });
  }
  if (revealTarget) {
    gsap.set(revealTarget, {
      autoAlpha: 0,
      willChange: "opacity",
    });
  }

  if (!overlay && !revealTarget && !animateExpandedCard) {
    requestAnimationFrame(() => finish(true));
    return { timeline: null, cancel };
  }

  timeline = gsap.timeline({ onComplete: () => finish(true) });
  timeline.addLabel("travel", 0);
  if (overlay) {
    timeline.to(overlay, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 1.2,
      ease: "power3.inOut",
    }, "travel");
  }
  if (animateExpandedCard && nativeCopy) {
    timeline.to(nativeCopy, {
      autoAlpha: 1,
      y: 0,
      duration: 1.16,
      ease: "power3.inOut",
    }, "travel+=.04");
  }
  if (animateExpandedCard && expansionTarget) {
    timeline.addLabel("expand", .84);
    timeline.to(expansionTarget, {
      autoAlpha: 1,
      y: 0,
      clipPath: "inset(0 0 0% 0)",
      duration: .76,
      ease: "power3.out",
    }, "expand");
  }
  if (revealTarget) {
    timeline.to(revealTarget, {
      autoAlpha: 1,
      duration: .72,
      ease: "power2.out",
    }, "travel+=.18");
  }

  return { timeline, cancel };
}
