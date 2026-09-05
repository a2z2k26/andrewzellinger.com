import { gsap } from "gsap";
import { PROJECTS } from "./project-content.js";
import "./site-fonts.css";
import "./effects/glass-surface.js";
import "./effects/center-control.css";
import "./effects/center-glass-lens.js";

const INDEX_PATH = "";
const PANEL_SELECTOR = ".index-media-placeholder";
const WORKS_PATH = "/projects";
const WORKS_CARD_SELECTOR = ".works-motion-card";
const ARTICLES_PATH = "/articles";
const ARTICLE_CARD_SELECTOR = ".articles-entry-list > li";
const MOBILE_NATIVE_PATHS = new Set([WORKS_PATH, INDEX_PATH, "/articles", "/history"]);
const NATIVE_SCROLL_PATHS = new Set();
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const LOOP_SPEED_PX_PER_SECOND = 60;
const LOOP_MIN_IMPULSE_MULTIPLIER = 8;
const LOOP_MAX_IMPULSE_MULTIPLIER = 24;
const LOOP_INPUT_SETTLE_SECONDS = 0.1;
const LOOP_DECELERATION_SECONDS = 2;
const FORCE_REDUCED_MOTION = import.meta.env.DEV
  && new URLSearchParams(window.location.search).get("motion") === "reduce";

let destroyActiveRuntime = null;

function currentPath() {
  return window.location.pathname.replace(/\/$/, "");
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

  const stopTween = () => {
    scrollTween?.kill();
    scrollTween = null;
    isWritingScroll = false;
    proxy.y = window.scrollY;
    desiredY = window.scrollY;
  };

  const smoothTo = (nextY) => {
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
    onInput({
      direction: destinations[event.key].direction,
      magnitude: Math.abs(destinations[event.key].y - desiredY),
      source: "keyboard",
    });
    smoothTo(destinations[event.key].y);
  };

  const onTouchStart = (event) => {
    stopTween();
    const touch = event.touches[0];
    previousTouch = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const onTouchMove = (event) => {
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
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("touchcancel", onTouchEnd, { passive: true });

  return () => {
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
  let direction = -1;
  let distance = 0;
  const speedState = { multiplier: 1 };

  const applySpeed = () => {
    loopTween?.timeScale(speedState.multiplier);
    track.dataset.loopSpeedMultiplier = speedState.multiplier.toFixed(3);
    track.dataset.loopSpeed = (LOOP_SPEED_PX_PER_SECOND * speedState.multiplier).toFixed(1);
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
    gsap.set(track, { y: 0 });
    const setGap = Number.parseFloat(getComputedStyle(track).rowGap) || 0;
    distance = sourceSet.getBoundingClientRect().height + setGap;
    if (!distance) return;

    const duration = distance / LOOP_SPEED_PX_PER_SECOND;
    track.dataset.loopDistance = String(distance);
    track.dataset.loopDuration = String(duration);
    gsap.set(track, { y: -distance });
    startSegment();
  };

  const setDirection = (nextDirection) => {
    const normalizedDirection = nextDirection > 0 ? 1 : -1;
    if (normalizedDirection === direction) return;
    direction = normalizedDirection;
    startSegment();
  };

  const handleInput = ({ direction: nextDirection, magnitude = 0, source, x, y }) => {
    setDirection(nextDirection);

    const fieldBounds = field.getBoundingClientRect();
    const isKeyboardInput = source === "keyboard";
    const isWithinField = Number.isFinite(x) && Number.isFinite(y)
      && x >= fieldBounds.left && x <= fieldBounds.right
      && y >= fieldBounds.top && y <= fieldBounds.bottom;
    if (!isKeyboardInput && !isWithinField) return;

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
    resizeCall = gsap.delayedCall(0.18, buildLoop);
  };

  buildLoop();
  window.addEventListener("resize", onResize, { passive: true });

  return {
    setDirection,
    handleInput,
    destroy() {
      window.removeEventListener("resize", onResize);
      resizeCall?.kill();
      settleCall?.kill();
      decayTween?.kill();
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

export function initSiteMotion({ reduceMotion } = {}) {
  destroyActiveRuntime?.();
  destroyActiveRuntime = null;

  const isIndex = currentPath() === INDEX_PATH;
  const isWorks = currentPath() === WORKS_PATH;
  const isArticles = currentPath() === ARTICLES_PATH;
  const routeLoop = isIndex
    ? {
      dataset: "indexMotion",
      expectedCount: 5,
      fieldSelector: ".index-motion-field",
      itemSelector: PANEL_SELECTOR,
      namespace: "index",
    }
    : isWorks
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
          expectedCount: 10,
          fieldSelector: ".articles-index__list",
          sourceContainerSelector: ".articles-entry-list",
          itemSelector: ARTICLE_CARD_SELECTOR,
          namespace: "articles",
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
        ? createContentLoop(logicalItems, routeLoop)
        : { setDirection() {}, handleInput() {}, destroy() {} };
      const stopSmoothScrolling = createSmoothScrolling(contentLoop.handleInput);
      const stopDirectionObserver = routeLoop
        ? createScrollDirectionObserver(contentLoop.setDirection)
        : () => {};
      return () => {
        stopDirectionObserver();
        contentLoop.destroy();
        stopSmoothScrolling();
      };
    },
  );

  const destroy = () => {
    media.revert();
    delete document.documentElement.dataset.smoothScroll;
    delete document.documentElement.dataset.indexMotion;
    delete document.documentElement.dataset.worksMotion;
    delete document.documentElement.dataset.articlesMotion;
    window.removeEventListener("pagehide", destroy);
  };

  window.addEventListener("pagehide", destroy, { once: true });
  destroyActiveRuntime = destroy;
  return destroy;
}

function startWhenReady() {
  if (document.readyState !== "complete") {
    document.addEventListener("DOMContentLoaded", () => initSiteMotion(), { once: true });
  } else {
    initSiteMotion();
  }
}

startWhenReady();
window.addEventListener("portfolio:routechange", () => initSiteMotion());
