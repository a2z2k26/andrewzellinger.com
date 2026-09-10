import { gsap } from "gsap";
import './site-navigation/index.js';
import { ARTICLE_DETAILS } from "./article-content.js";
import { PROJECTS } from "./project-content.js";
import { mountPortraitArtwork } from "./elevation/portrait-artwork.js";
import {
  isMotionPaused,
  isMotionInputPaused,
  isUserMotionPaused,
  setMotionPause,
  subscribeMotionPause,
} from "./elevation/motion-pause.js";
import "./site-fonts.css";
import "./effects/center-control.css";
import "./effects/center-control.js";
import "./elevation/index.js";

const INDEX_PATH = "";
const WORKS_PATH = "/projects";
const WORKS_CARD_SELECTOR = ".works-motion-card";
const ARTICLES_PATH = "/articles";
const HISTORY_PATH = "/history";
const ARTICLE_CARD_SELECTOR = ".articles-entry-list > li";
const MOBILE_NATIVE_PATHS = new Set([WORKS_PATH, INDEX_PATH, "/articles", "/history"]);
const NATIVE_SCROLL_PATHS = new Set([INDEX_PATH]);
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const LOOP_SPEED_PX_PER_SECOND = 60;
const LOOP_MIN_IMPULSE_MULTIPLIER = 8;
const LOOP_MAX_IMPULSE_MULTIPLIER = 24;
const LOOP_INPUT_SETTLE_SECONDS = 0.1;
const LOOP_DECELERATION_SECONDS = 2;
const FORCE_REDUCED_MOTION = import.meta.env.DEV
  && new URLSearchParams(window.location.search).get("motion") === "reduce";

let destroyActiveRuntime = null;
let activeCollectionLoop = null;
let pendingRailSweepArrival = false;
const loopSnapshots = new Map();

function currentPath() {
  // The root URL uses the Projects collection's established motion path.
  return window.location.pathname.replace(/\/$/, "") || WORKS_PATH;
}

function isDetailPath(pathname = currentPath()) {
  return pathname.startsWith("/case-studies/")
    || (pathname.startsWith("/articles/") && pathname !== "/articles");
}

function clampScroll(value) {
  const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return gsap.utils.clamp(0, maximum, value);
}

function createSmoothScrolling(onInput = () => {}) {
  const proxy = { y: window.scrollY };
  let desiredY = window.scrollY;
  let scrollTween = null;
  let isWritingScroll = false;
  let previousTouch = null;
  let inputWasPaused = isMotionInputPaused();

  const stopTween = () => {
    scrollTween?.kill();
    scrollTween = null;
    isWritingScroll = false;
    proxy.y = window.scrollY;
    desiredY = window.scrollY;
  };

  const syncInputPause = () => {
    const inputIsPaused = isMotionInputPaused();
    if (inputIsPaused || inputWasPaused) {
      stopTween();
      previousTouch = null;
    }
    inputWasPaused = inputIsPaused;
  };
  const unsubscribePause = subscribeMotionPause(syncInputPause);

  const smoothTo = (nextY) => {
    if (isMotionInputPaused()) return;
    desiredY = clampScroll(nextY);
    scrollTween?.kill();
    proxy.y = window.scrollY;
    isWritingScroll = true;
    scrollTween = gsap.to(proxy, {
      y: desiredY,
      duration: 0.65,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => window.scrollTo(0, proxy.y),
      onComplete: () => {
        scrollTween = null;
        isWritingScroll = false;
        desiredY = window.scrollY;
      },
    });
  };

  const onWheel = (event) => {
    if (event.ctrlKey || event.defaultPrevented || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? window.innerHeight
        : 1;
    const delta = event.deltaY * unit;
    if (!delta) return;
    if (isMotionInputPaused()) {
      event.preventDefault();
      return;
    }
    onInput({
      direction: delta > 0 ? 1 : -1,
      magnitude: Math.abs(delta),
      source: "wheel",
      x: event.clientX,
      y: event.clientY,
    });
    event.preventDefault();
    if (!scrollTween) desiredY = window.scrollY;
    smoothTo(desiredY + delta);
  };

  const onKeyDown = (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && (
      target.isContentEditable
      || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName)
      || (target.tagName === "A" && event.key === " ")
    )) return;

    if (!scrollTween) desiredY = window.scrollY;
    const pageDistance = window.innerHeight * 0.875;
    const destinations = {
      ArrowDown: { y: desiredY + 48, direction: 1 },
      ArrowUp: { y: desiredY - 48, direction: -1 },
      PageDown: { y: desiredY + pageDistance, direction: 1 },
      PageUp: { y: desiredY - pageDistance, direction: -1 },
      Home: { y: 0, direction: -1 },
      End: { y: document.documentElement.scrollHeight, direction: 1 },
      " ": {
        y: desiredY + (event.shiftKey ? -pageDistance : pageDistance),
        direction: event.shiftKey ? -1 : 1,
      },
    };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    if (isMotionInputPaused()) return;
    onInput({
      direction: destinations[event.key].direction,
      magnitude: Math.abs(destinations[event.key].y - desiredY),
      source: "keyboard",
    });
    smoothTo(destinations[event.key].y);
  };

  const onTouchStart = (event) => {
    stopTween();
    if (isMotionInputPaused()) {
      previousTouch = null;
      return;
    }
    const touch = event.touches[0];
    previousTouch = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const onTouchMove = (event) => {
    if (event.touches.length > 1) return;
    if (isMotionInputPaused()) {
      if (event.cancelable) event.preventDefault();
      previousTouch = null;
      return;
    }
    const touch = event.touches[0];
    if (!touch || !previousTouch) return;
    const delta = previousTouch.y - touch.clientY;
    previousTouch = { x: touch.clientX, y: touch.clientY };
    if (Math.abs(delta) < 0.5) return;
    onInput({
      direction: delta > 0 ? 1 : -1,
      magnitude: Math.abs(delta) * 4,
      source: "touch",
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const onTouchEnd = () => {
    previousTouch = null;
  };

  const onScroll = () => {
    if (isWritingScroll || scrollTween) return;
    desiredY = window.scrollY;
    proxy.y = desiredY;
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  // Installed only for enhanced desktop scrolling; native mobile routes never
  // mount this listener. Keep single-touch input still while snapshots are held.
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("touchcancel", onTouchEnd, { passive: true });

  return () => {
    unsubscribePause();
    stopTween();
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchcancel", onTouchEnd);
  };
}

function createContentLoop(logicalItems, {
  fieldSelector,
  itemSelector,
  namespace,
  sourceContainerSelector,
  initialSnapshot,
  initialAnchor,
  refreshClonesOnResize = false,
  forwardCloneLinks = false,
  onMeasure = () => {},
}) {
  const field = document.querySelector(fieldSelector);
  const sourceContainer = sourceContainerSelector
    ? field?.querySelector(sourceContainerSelector)
    : null;
  const expectedParent = sourceContainer ?? field;
  if (!field || logicalItems.some((item) => item.parentElement !== expectedParent)) {
    return { setDirection() {}, handleInput() {}, destroy() {} };
  }

  const track = document.createElement("div");
  const sourceSet = sourceContainer ?? document.createElement("div");
  const cloneSetBefore = document.createElement(sourceSet.tagName.toLowerCase());
  const cloneSetAfter = document.createElement(sourceSet.tagName.toLowerCase());
  const preservedSourceClasses = [...sourceSet.classList];
  track.className = `${namespace}-motion-track`;
  sourceSet.classList.add(`${namespace}-motion-set`, `${namespace}-motion-set-source`);

  logicalItems.forEach((item) => sourceSet.append(item));

  const prepareCloneSet = (cloneSet, position) => {
    cloneSet.className = [
      ...preservedSourceClasses,
      `${namespace}-motion-set`,
      `${namespace}-motion-set-clone`,
      `${namespace}-motion-set-clone-${position}`,
    ].join(" ");
    cloneSet.setAttribute("aria-hidden", "true");
    cloneSet.setAttribute("inert", "");
    cloneSet.inert = true;
    cloneSet.replaceChildren(...logicalItems.map((item) => item.cloneNode(true)));
    cloneSet.querySelectorAll(itemSelector).forEach((item, index) => {
      [
        item,
        ...item.querySelectorAll(".glass-proxy-media-ready, .glass-proxy-text-ready"),
      ].forEach((element) => {
        element.classList.remove("glass-proxy-media-ready", "glass-proxy-text-ready");
      });
      item.dataset.loopClone = `${position}-${index + 1}`;
      const detailLink = item.querySelector("[data-portfolio-detail-link]");
      if (detailLink) {
        item.dataset.loopDetailSlug = detailLink.dataset.detailSlug;
        item.dataset.loopDetailKind = detailLink.dataset.detailKind;
      }
      item.removeAttribute("role");
      item.removeAttribute("aria-label");
      [item, ...item.querySelectorAll("[id]")].forEach((element) => element.removeAttribute("id"));
      item.querySelectorAll("img").forEach((image) => {
        image.loading = "eager";
      });
    });
  };

  prepareCloneSet(cloneSetBefore, "before");
  prepareCloneSet(cloneSetAfter, "after");
  track.append(cloneSetBefore, sourceSet, cloneSetAfter);
  field.append(track);

  let loopTween = null;
  let resizeCall = null;
  let settleCall = null;
  let decayTween = null;
  let startCall = null;
  let direction = initialSnapshot?.direction > 0 ? 1 : -1;
  let distance = 0;
  let pendingPhase = Number.isFinite(initialSnapshot?.phase) ? initialSnapshot.phase : null;
  let pendingAnchor = initialAnchor?.anchorSlug ? initialAnchor : null;
  const speedState = { multiplier: 1 };
  const focusReason = `${namespace}:focus`;
  let destroyed = false;

  const currentPhase = () => {
    if (!distance) return 0;
    const y = Number(gsap.getProperty(track, "y")) || 0;
    return (((y % distance) + distance) % distance) / distance;
  };

  const applySpeed = () => {
    loopTween?.timeScale(speedState.multiplier);
    track.dataset.loopPaused = String(isMotionPaused());
    track.dataset.loopSpeedMultiplier = speedState.multiplier.toFixed(3);
    track.dataset.loopSpeed = (isMotionPaused() ? 0 : LOOP_SPEED_PX_PER_SECOND * speedState.multiplier).toFixed(1);
  };

  const applyPause = () => {
    if (destroyed) return;
    if (isMotionPaused()) {
      settleCall?.kill();
      settleCall = null;
      decayTween?.kill();
      decayTween = null;
      speedState.multiplier = 1;
    }
    // Pause the current tween, rather than reconstructing its phase or endpoint.
    loopTween?.paused(isMotionPaused());
    startCall?.paused(isMotionPaused());
    applySpeed();
  };

  const beginSpeedDecay = () => {
    decayTween?.kill();
    decayTween = gsap.to(speedState, {
      multiplier: 1,
      duration: LOOP_DECELERATION_SECONDS,
      ease: "power3.out",
      overwrite: true,
      onUpdate: applySpeed,
      onComplete: () => {
        decayTween = null;
        applySpeed();
      },
    });
  };

  const startSegment = () => {
    loopTween?.kill();
    if (!distance) return;

    const currentY = Number(gsap.getProperty(track, "y")) || 0;
    const targetY = direction > 0 ? 0 : -2 * distance;
    const remaining = Math.abs(targetY - currentY);
    if (remaining < 0.5) gsap.set(track, { y: -distance });

    const startY = Number(gsap.getProperty(track, "y")) || 0;
    loopTween = gsap.to(track, {
      y: direction > 0 ? 0 : -2 * distance,
      duration: Math.abs((direction > 0 ? 0 : -2 * distance) - startY) / LOOP_SPEED_PX_PER_SECOND,
      ease: "none",
      paused: isMotionPaused(),
      onUpdate: () => window.dispatchEvent(new CustomEvent('portfolio:loop-progress')),
      onComplete: () => {
        gsap.set(track, { y: -distance });
        startSegment();
      },
    });
    track.dataset.loopDirection = direction > 0 ? "down" : "up";
    document.documentElement.dataset.loopDirection = track.dataset.loopDirection;
    applySpeed();
  };

  const buildLoop = () => {
    loopTween?.kill();
    startCall?.kill();
    startCall = null;
    if (distance) pendingPhase = currentPhase();
    gsap.set(track, { y: 0 });
    const setGap = Number.parseFloat(getComputedStyle(track).rowGap) || 0;
    distance = sourceSet.getBoundingClientRect().height + setGap;
    if (!distance) return;
    onMeasure(distance);

    const duration = distance / LOOP_SPEED_PX_PER_SECOND;
    track.dataset.loopDistance = String(distance);
    track.dataset.loopDuration = String(duration);
    const anchor = pendingAnchor;
    let initialY = pendingPhase === null ? -distance : (pendingPhase * distance) - distance;
    if (anchor) {
      const anchorItem = logicalItems.find((item) => (
        item.querySelector("[data-portfolio-detail-link]")?.dataset.detailSlug === anchor.anchorSlug
      ));
      const anchorMedia = anchorItem?.querySelector(".media-background-holder, [data-article-card-copy]");
      if (anchorMedia) {
        const trackTop = track.getBoundingClientRect().top;
        const mediaOffset = anchorMedia.getBoundingClientRect().top - trackTop;
        const fieldTop = field.getBoundingClientRect().top;
        initialY = (Number(anchor.anchorTop) || fieldTop) - fieldTop - mediaOffset;
        while (initialY > 0) initialY -= distance;
        while (initialY <= -2 * distance) initialY += distance;
        track.dataset.loopAnchorSlug = anchor.anchorSlug;
      }
    }
    pendingPhase = null;
    pendingAnchor = null;
    gsap.set(track, { y: initialY });
    if (anchor?.holdSeconds > 0) {
      startCall = gsap.delayedCall(anchor.holdSeconds, () => {
        startCall = null;
        startSegment();
      });
      startCall.paused(isMotionPaused());
    } else {
      startSegment();
    }
  };

  const resumeAfterDetail = () => {
    if (destroyed) return;
    // The native card is visible again. End its protective hold immediately,
    // retaining the restored phase/direction and every independent pause.
    if (startCall) {
      startCall.kill();
      startCall = null;
      startSegment();
    } else {
      applyPause();
    }
  };

  const resetForArrival = () => {
    if (destroyed) return;
    // The incoming rail travels upward; autoplay must continue that direction,
    // even when a cached snapshot last moved downward. Keep its visible phase.
    settleCall?.kill();
    settleCall = null;
    decayTween?.kill();
    decayTween = null;
    startCall?.kill();
    startCall = null;
    direction = -1;
    speedState.multiplier = 1;
    startSegment();
  };

  const setDirection = (nextDirection) => {
    if (isMotionInputPaused()) return;
    const normalizedDirection = nextDirection > 0 ? 1 : -1;
    if (normalizedDirection === direction) return;
    direction = normalizedDirection;
    startSegment();
  };

  const handleInput = ({ direction: nextDirection, magnitude = 0, source, x, y }) => {
    if (isMotionInputPaused()) return;
    setDirection(nextDirection);

    const fieldBounds = field.getBoundingClientRect();
    const isKeyboardInput = source === "keyboard";
    const isWithinField = Number.isFinite(x) && Number.isFinite(y)
      && x >= fieldBounds.left && x <= fieldBounds.right
      && y >= fieldBounds.top && y <= fieldBounds.bottom;
    if (!isKeyboardInput && !isWithinField) return;

    if (isUserMotionPaused()) {
      if (!distance) return;
      // Direct input remains useful while paused, but introduces no inertia or
      // ambient restart. Normalize into the two-set runway at the same phase.
      const currentY = Number(gsap.getProperty(track, "y")) || 0;
      const delta = direction * Math.abs(magnitude);
      const nextY = ((((currentY + delta) % distance) + distance) % distance) - distance;
      gsap.set(track, { y: nextY });
      window.dispatchEvent(new CustomEvent('portfolio:loop-progress'));
      startSegment();
      return;
    }

    const impulseMultiplier = gsap.utils.clamp(
      LOOP_MIN_IMPULSE_MULTIPLIER,
      LOOP_MAX_IMPULSE_MULTIPLIER,
      6 + Math.abs(magnitude) / 15,
    );
    decayTween?.kill();
    decayTween = null;
    settleCall?.kill();
    speedState.multiplier = Math.max(speedState.multiplier, impulseMultiplier);
    applySpeed();
    settleCall = gsap.delayedCall(LOOP_INPUT_SETTLE_SECONDS, beginSpeedDecay);
  };

  const onResize = () => {
    resizeCall?.kill();
    resizeCall = gsap.delayedCall(0.18, () => {
      if (destroyed) return;
      // History contains a responsive portrait illustration. Refresh its inert
      // copies only after the source has settled at its new dimensions.
      if (refreshClonesOnResize) {
        prepareCloneSet(cloneSetBefore, "before");
        prepareCloneSet(cloneSetAfter, "after");
      }
      buildLoop();
    });
  };

  // Inert copies never add keyboard stops. Their visible contact links still
  // delegate pointer clicks to the matching, accessible source link.
  const onCloneLinkClick = (event) => {
    if (!forwardCloneLinks || event.defaultPrevented || event.button !== 0) return;
    if (event.target.closest?.('a[href]')) return;
    const sourceLinks = [...sourceSet.querySelectorAll('a[href]')];
    for (const clone of [cloneSetBefore, cloneSetAfter]) {
      const links = [...clone.querySelectorAll('a[href]')];
      const index = links.findIndex(link => {
        const rect = link.getBoundingClientRect();
        return event.clientX >= rect.left && event.clientX <= rect.right
          && event.clientY >= rect.top && event.clientY <= rect.bottom;
      });
      if (index < 0 || !sourceLinks[index]) continue;
      event.preventDefault();
      sourceLinks[index].dispatchEvent(new MouseEvent('click', {
        bubbles: true, cancelable: true, view: window,
        ctrlKey: event.ctrlKey, metaKey: event.metaKey,
        altKey: event.altKey, shiftKey: event.shiftKey,
      }));
      break;
    }
  };
  field.addEventListener('click', onCloneLinkClick);

  const onReadingViewportScroll = () => {
    if (!forwardCloneLinks || destroyed || !distance || !field.scrollTop) return;
    // Keyboard focus can scroll an overflow-hidden viewport to its canonical
    // contact link. Absorb that offset into the loop so focus stays visible,
    // without leaving a second scroll offset that would break the next wrap.
    const y = (Number(gsap.getProperty(track, 'y')) || 0) - field.scrollTop;
    field.scrollTop = 0;
    gsap.set(track, { y });
    startSegment();
    window.dispatchEvent(new CustomEvent('portfolio:loop-progress'));
  };
  field.addEventListener('scroll', onReadingViewportScroll, { passive: true });

  const onFocusIn = () => syncFocusPause();
  let focusFrame = 0;
  const syncFocusPause = () => {
    if (destroyed) return;
    const focused = document.activeElement;
    // Return focus remains on the source card for accessibility, but pointer
    // focus must not stop autoplay. Keyboard focus keeps its stable target.
    setMotionPause(focusReason, field.contains(focused) && focused.matches(':focus-visible'));
  };
  const scheduleFocusPause = () => {
    cancelAnimationFrame(focusFrame);
    // Wait for the browser's default focus/modality update before sampling it.
    focusFrame = requestAnimationFrame(syncFocusPause);
  };
  const onFocusOut = scheduleFocusPause;
  syncFocusPause();
  const unsubscribePause = subscribeMotionPause(applyPause);
  field.addEventListener("focusin", onFocusIn);
  field.addEventListener("focusout", onFocusOut);
  window.addEventListener('keydown', scheduleFocusPause);
  window.addEventListener('pointerdown', scheduleFocusPause);

  buildLoop();
  applyPause();
  const sizeObserver = refreshClonesOnResize ? new ResizeObserver(onResize) : null;
  sizeObserver?.observe(sourceSet);
  if (refreshClonesOnResize) document.fonts?.ready.then(() => { if (!destroyed) onResize(); });
  window.addEventListener("resize", onResize, { passive: true });

  return {
    setDirection,
    handleInput,
    resumeAfterDetail,
    resetForArrival,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      sizeObserver?.disconnect();
      field.removeEventListener('click', onCloneLinkClick);
      field.removeEventListener('scroll', onReadingViewportScroll);
      unsubscribePause();
      field.removeEventListener("focusin", onFocusIn);
      field.removeEventListener("focusout", onFocusOut);
      window.removeEventListener('keydown', scheduleFocusPause);
      window.removeEventListener('pointerdown', scheduleFocusPause);
      cancelAnimationFrame(focusFrame);
      setMotionPause(focusReason, false);
      window.removeEventListener("resize", onResize);
      resizeCall?.kill();
      settleCall?.kill();
      decayTween?.kill();
      startCall?.kill();
      if (distance) {
        loopSnapshots.set(namespace, {
          phase: currentPhase(),
          direction,
        });
      }
      loopTween?.kill();
      gsap.set(track, { clearProps: "transform" });
      if (sourceContainer) {
        sourceSet.classList.remove(`${namespace}-motion-set`, `${namespace}-motion-set-source`);
        field.insertBefore(sourceSet, track);
      } else {
        logicalItems.forEach((item) => field.insertBefore(item, track));
      }
      track.remove();
      delete document.documentElement.dataset.loopDirection;
    },
  };
}

function createScrollDirectionObserver(onDirection) {
  let previousY = window.scrollY;

  const onScroll = () => {
    const nextY = window.scrollY;
    const delta = nextY - previousY;
    previousY = nextY;
    if (Math.abs(delta) < 0.5) return;
    onDirection(delta > 0 ? 1 : -1);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

export function initSiteMotion({ reduceMotion, initialAnchor } = {}) {
  destroyActiveRuntime?.();
  destroyActiveRuntime = null;

  const isWorks = currentPath() === WORKS_PATH;
  const isArticles = currentPath() === ARTICLES_PATH;
  const isHistory = currentPath() === HISTORY_PATH;
  // Mount the original overprint before duplicating the biography for looping.
  if (isHistory) mountPortraitArtwork();
  const routeLoop = isWorks
      ? {
        dataset: "worksMotion",
        expectedCount: PROJECTS.length,
        fieldSelector: ".works-motion-field",
        itemSelector: WORKS_CARD_SELECTOR,
        namespace: "works",
      }
      : isArticles
        ? {
          dataset: "articlesMotion",
          expectedCount: ARTICLE_DETAILS.length,
          fieldSelector: ".articles-index__list",
          sourceContainerSelector: ".articles-entry-list",
          itemSelector: ARTICLE_CARD_SELECTOR,
          namespace: "articles",
        }
        : isHistory
          ? {
            dataset: "historyMotion",
            expectedCount: 1,
            fieldSelector: ".biography-sweep-viewport",
            itemSelector: ".biography-sweep-content",
            namespace: "history",
            refreshClonesOnResize: true,
            forwardCloneLinks: true,
            onMeasure: distance => document.documentElement.style.setProperty('--history-loop-height', `${distance}px`),
          }
          : null;
  const logicalItems = routeLoop
    ? gsap.utils.toArray(routeLoop.itemSelector).filter((item) => !item.closest("[aria-hidden='true']"))
    : [];
  const media = gsap.matchMedia();

  media.add(
    {
      reduceMotion: REDUCED_MOTION_QUERY,
      allowMotion: "(prefers-reduced-motion: no-preference)",
      desktopMotion: "(min-width: 992px) and (prefers-reduced-motion: no-preference)",
    },
    (context) => {
      const shouldReduce = reduceMotion ?? (context.conditions.reduceMotion || FORCE_REDUCED_MOTION);
      const useNativeMobileRoute = MOBILE_NATIVE_PATHS.has(currentPath())
        && !context.conditions.desktopMotion
        && !shouldReduce;
      const useNativeScrolling = shouldReduce
        || isDetailPath()
        || NATIVE_SCROLL_PATHS.has(currentPath())
        || useNativeMobileRoute;
      document.documentElement.dataset.smoothScroll = useNativeScrolling ? "native" : "gsap";

      if (routeLoop) {
        document.documentElement.dataset[routeLoop.dataset] = shouldReduce
          ? "reduced"
          : useNativeMobileRoute
            ? "mobile-static"
            : "running";
      }
      if (useNativeScrolling) return;

      const contentLoop = routeLoop && logicalItems.length === routeLoop.expectedCount
        ? createContentLoop(logicalItems, {
          ...routeLoop,
          initialSnapshot: loopSnapshots.get(routeLoop.namespace),
          initialAnchor,
        })
        : { setDirection() {}, handleInput() {}, destroy() {} };
      if (routeLoop) {
        activeCollectionLoop = contentLoop;
        applyPendingRailSweepArrival();
      }
      const stopSmoothScrolling = createSmoothScrolling(contentLoop.handleInput);
      const stopDirectionObserver = routeLoop
        ? createScrollDirectionObserver(contentLoop.setDirection)
        : () => {};
      return () => {
        if (activeCollectionLoop === contentLoop) activeCollectionLoop = null;
        stopDirectionObserver();
        contentLoop.destroy();
        stopSmoothScrolling();
        if (isHistory) document.documentElement.style.removeProperty('--history-loop-height');
      };
    },
  );

  let destroyed = false;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    media.revert();
    delete document.documentElement.dataset.smoothScroll;
    delete document.documentElement.dataset.indexMotion;
    delete document.documentElement.dataset.worksMotion;
    delete document.documentElement.dataset.articlesMotion;
    delete document.documentElement.dataset.historyMotion;
    window.removeEventListener("pagehide", destroy);
    if (destroyActiveRuntime === destroy) destroyActiveRuntime = null;
  };

  window.addEventListener("pagehide", destroy, { once: true });
  destroyActiveRuntime = destroy;
  return destroy;
}

function applyPendingRailSweepArrival() {
  const hasArrival = pendingRailSweepArrival || document.documentElement.dataset.railSweep === "up";
  if (!hasArrival || !activeCollectionLoop?.resetForArrival) return;
  activeCollectionLoop.resetForArrival();
  pendingRailSweepArrival = false;
}

function onRailSweepArrival() {
  if (![WORKS_PATH, ARTICLES_PATH, HISTORY_PATH].includes(currentPath())) return;
  // pagereveal can arrive before startup, after startup, or around bfcache
  // restoration. Consume only after a live collection loop can accept it.
  pendingRailSweepArrival = true;
  applyPendingRailSweepArrival();
}

function startWhenReady() {
  // Static module scripts run while readyState is "interactive". In a build,
  // Rollup evaluates this shared import before the entry module creates cards.
  // Wait for the complete deferred module graph, not just the HTML parser.
  if (document.readyState !== "complete") {
    document.addEventListener("DOMContentLoaded", () => initSiteMotion(), { once: true });
  } else {
    initSiteMotion();
  }
}

startWhenReady();
window.addEventListener("portfolio:rail-sweep-arrival", onRailSweepArrival);
window.addEventListener('portfolio:collection-return-ready', () => {
  if (currentPath() !== WORKS_PATH && currentPath() !== ARTICLES_PATH) return;
  activeCollectionLoop?.resumeAfterDetail?.();
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted && !destroyActiveRuntime) initSiteMotion();
});
window.addEventListener("portfolio:routechange", (event) => {
  initSiteMotion({ initialAnchor: event.detail });
});
