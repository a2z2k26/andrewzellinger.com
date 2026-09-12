import { hasCounterflow, isCounterflowPair, isCounterflowArrival, prepareCounterflow, commitCounterflow } from './counterflow.js';
import { ensureTitleCharacters, animateTitleCharacters } from './title-motion.js';
import {
  prepareStructuralText,
  resetStructuralText,
  revealStructuralText,
} from "./text-motion-system.js";
import "./styles.css";
import { isPhone, animatePhoneArrival } from "../motion/phone.js";
import './portrait-artwork.js';

const root = document.documentElement;
root.dataset.designEdition = "elevated";
const reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");
const forceReducedMotion = import.meta.env.DEV && new URLSearchParams(location.search).get("motion") === "reduce";
const shouldReduceMotion = () => reduceQuery.matches || forceReducedMotion;
root.dataset.editionMotion = shouldReduceMotion() ? "reduced" : "full";
const routes = [
  { path: "/", label: "Projects" },
  { path: "/articles", label: "Articles" },
  { path: "/history", label: "History" },
];
const normalized = (path) => path.replace(/\/$/, "") || "/";
const sectionFor = (path) => path.startsWith("/case-studies/") ? "/projects"
  : path.startsWith("/articles/") ? "/articles"
  : normalized(path) === "/" ? "/projects" : normalized(path);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function historyTextParts(section) {
  if (section.matches(".biography-block")) {
    return {
      label: section.querySelector(".biography-block__label"),
      body: section.querySelector(".biography-prose, .biography-clients__list"),
    };
  }
  if (section.matches(".biography-experience-section")) {
    return {
      label: section.querySelector(".biography-experience-section__heading"),
      body: section.querySelector(".biography-experience"),
    };
  }
  return { label: null, body: section };
}

function initialize() {
  if (root.dataset.elevationInitialized === "true") return;
  const title = document.querySelector(".title .container-xlarge");
  if (!title) return;
  root.dataset.elevationInitialized = "true";
  ensureTitleCharacters();

  let entering = [];
  let navigating = false;
  let cancelPendingDeparture = () => {};
  window.addEventListener('portfolio:routechange',()=>cancelPendingDeparture());
  window.addEventListener('pagehide',()=>cancelPendingDeparture());

  const currentRail = () => root.classList.contains("detail-route")
    ? document.querySelector(".detail-view")
    : document.querySelector(".index-static-field, .works-motion-field, .articles-index__list, .biography-layout__content");

  const animateEntrance = () => {
    entering.forEach((animation) => animation.cancel());
    entering = [];
    if (root.dataset.welcomePreface === "open" || shouldReduceMotion() || (hasCounterflow() && isCounterflowArrival())) return;
    const rail = currentRail();
    if (isPhone()) {
      if (performance.getEntriesByType('navigation')[0]?.type === 'back_forward') return;
      if (!root.classList.contains('detail-route')) {
        entering.push(animateTitleCharacters('enter'));
        entering.push(animatePhoneArrival([rail]));
      }
      return;
    }
    const timing = { duration: 650, easing: "cubic-bezier(.16,1,.3,1)", fill: "none" };
    entering.push(animateTitleCharacters('enter'));
    // Clip the outer rail only; the existing detail/loop motion owns its children.
    if (rail && !root.classList.contains("detail-route")) {
      entering.push(rail.animate([
        { clipPath: "inset(7% 0 0 0)", opacity: 0 },
        { clipPath: "inset(0 0 0 0)", opacity: 1 },
      ], { ...timing, duration: 800 }));
    }
  };

  const updateChrome = () => {
    ensureTitleCharacters();
    const section = sectionFor(location.pathname);
    root.dataset.editionSection = section === "/" ? "home" : section.slice(1);
  };

  let scheduled = 0;
  const synchronize = () => {
    cancelAnimationFrame(scheduled);
    scheduled = requestAnimationFrame(updateChrome);
  };
  const modeObserver = new MutationObserver(records => {
    synchronize();
    // The first title entrance belongs after the introduction has cleared.
    if (records.some(record => record.attributeName === 'data-welcome-preface' && record.oldValue === 'open')
      && !root.hasAttribute('data-welcome-preface')) requestAnimationFrame(animateEntrance);
  });
  modeObserver.observe(root, { attributes: true, attributeOldValue: true, attributeFilter: ["data-welcome-preface", "class", "data-detail-active-slug", "data-works-motion", "data-articles-motion", "data-history-motion"] });
  window.addEventListener("popstate", synchronize);

  // Top-level routes retain real document navigation and the existing detail history.
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") || link.target || link.matches("[data-portfolio-detail-link]")) return;
    // A native external/hash navigation is still a newer current-page intent.
    // Cancel the old transaction without intercepting the new link's behavior.
    cancelPendingDeparture();
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.hash || !routes.some((route) => route.path === normalized(url.pathname))) return;
    if (normalized(location.pathname) === normalized(url.pathname)) return;
    if (shouldReduceMotion()) return;
    if (hasCounterflow() && isCounterflowPair(url.href)) {
      event.preventDefault();
      entering.forEach(animation=>animation.cancel());
      let cancelled=false;
      const destination=routes.find(route=>route.path===normalized(url.pathname));
      const loading=el('span','edition-loading',`Preparing ${destination.label}`);
      loading.setAttribute('role','status');
      document.body.append(loading);
      root.dataset.transitionPhase='prepare';
      cancelPendingDeparture=()=>{cancelled=true;loading.remove();root.dataset.transitionPhase='idle';};
      prepareCounterflow(url.href).then(ready=>{
        if(cancelled) return;
        loading.remove();
        // Native navigation owns commit and Back/Forward. Decode timeout
        // falls back to ordinary navigation, never to an opaque waiting mask.
        commitCounterflow(url.href,ready);
      });
      return;
    }
    if (isPhone()) return;
    event.preventDefault();
    navigating = true;
    const rail = currentRail();
    const timing = { duration: 240, fill: "forwards", easing: "cubic-bezier(.4,0,1,1)" };
    entering.forEach(animation => animation.cancel());
    const animations = [animateTitleCharacters('exit')];
    if (rail) animations.push(rail.animate([{ opacity: 1, clipPath: "inset(0 0 0 0)" }, { opacity: 0, clipPath: "inset(0 0 8% 0)" }], timing));
    let departed = false;
    const depart = () => { if (!departed) { departed = true; location.assign(url.href); } };
    Promise.all(animations.map((animation) => animation.finished.catch(() => {}))).then(depart);
    const fallbackTimer = setTimeout(depart, 600);
    const reset = () => {
      departed = true;
      clearTimeout(fallbackTimer);
      animations.forEach((animation) => animation.cancel());
      navigating = false;
      window.removeEventListener('pageshow',reset);
    };
    cancelPendingDeparture=reset;
    window.addEventListener("pageshow", reset, { once: true });
  });

  let destroyHistoryTextMotion = () => {};
  let historyTextMode = null;
  const setupHistoryTextMotion = () => {
    const nextMode = sectionFor(location.pathname) === "/history" && innerWidth < 992 && !shouldReduceMotion()
      ? (isPhone() ? "phone" : "compact")
      : "static";
    if (nextMode === historyTextMode) return;
    destroyHistoryTextMotion();
    destroyHistoryTextMotion = () => {};
    historyTextMode = nextMode;
    if (nextMode === "static") return;

    const sections = [...document.querySelectorAll(
      ".biography-block, .biography-introduction, .biography-experience-section, .biography-contact",
    )];
    const timelines = new Map();
    const revealed = new Set();
    if (nextMode !== "phone") sections.forEach((section) => prepareStructuralText(historyTextParts(section)));
    const reveal = (section) => {
      if (revealed.has(section)) return;
      revealed.add(section);
      if (nextMode === "phone" && section.getBoundingClientRect().top < 0) return;
      if (nextMode === "phone") prepareStructuralText(historyTextParts(section));
      timelines.set(section, revealStructuralText(historyTextParts(section)));
    };
    let observer = null;
    if (typeof IntersectionObserver !== "function") {
      sections.forEach(reveal);
    } else {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          observer.unobserve(target);
          reveal(target);
        });
      }, { rootMargin: nextMode === "phone" ? "0px" : "0px 0px -12% 0px", threshold: nextMode === "phone" ? 0 : .08 });
      sections.forEach((section) => observer.observe(section));
    }
    destroyHistoryTextMotion = () => {
      observer?.disconnect();
      timelines.forEach((timeline) => timeline.kill());
      sections.forEach((section) => resetStructuralText(historyTextParts(section)));
    };
  };
  let historyResizeFrame = 0;
  const onHistoryResize = () => {
    cancelAnimationFrame(historyResizeFrame);
    historyResizeFrame = requestAnimationFrame(setupHistoryTextMotion);
  };
  if (sectionFor(location.pathname) === "/history") {
    setupHistoryTextMotion();
    window.addEventListener("resize", onHistoryResize, { passive: true });
  }
  updateChrome();
  requestAnimationFrame(animateEntrance);
  reduceQuery.addEventListener("change", () => {
    root.dataset.editionMotion = shouldReduceMotion() ? "reduced" : "full";
    if (shouldReduceMotion()) entering.forEach((animation) => animation.cancel());
    setupHistoryTextMotion();
  });
  window.addEventListener("pageshow", (event) => { if (event.persisted) { navigating = false; synchronize(); } });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
else initialize();
