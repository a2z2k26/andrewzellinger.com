import { PROJECTS } from "../project-content.js";
import { ARTICLE_DETAILS } from "../article-content.js";
import { hasCounterflow, isCounterflowPair, isCounterflowArrival, prepareCounterflow, commitCounterflow } from './counterflow.js';
import { readingContextLayout } from './reading-context-layout.js';
import { pageContext, activeSectionIndex, documentProgress, collectionProgress } from './page-context.js';
import { ensureTitleCharacters, animateTitleCharacters } from './title-motion.js';
import "./styles.css";
import './portrait-artwork.js';

const root = document.documentElement;
root.dataset.designEdition = "elevated";
const reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");
const forceReducedMotion = import.meta.env.DEV && new URLSearchParams(location.search).get("motion") === "reduce";
const shouldReduceMotion = () => reduceQuery.matches || forceReducedMotion;
root.dataset.editionMotion = shouldReduceMotion() ? "reduced" : "full";
const routes = [
  { path: "/", label: "Home" },
  { path: "/projects", label: "Projects" },
  { path: "/articles", label: "Articles" },
  { path: "/history", label: "History" },
];
const normalized = (path) => path.replace(/\/$/, "") || "/";
const sectionFor = (path) => path.startsWith("/case-studies/") ? "/projects"
  : path.startsWith("/articles/") ? "/articles" : normalized(path);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function initialize() {
  if (document.querySelector(".edition-context")) return;
  const title = document.querySelector(".title .container-xlarge");
  if (!title) return;
  ensureTitleCharacters();

  const context = el("div", "edition-context");
  const contextCount = el("span", "edition-context__count");
  const contextTitle = el("span", "edition-context__title");
  const contextHint = el("span", "edition-context__hint");
  context.append(contextCount, contextTitle, contextHint);
  let contextMounted = false;

  const reading = el("div", "edition-reading");
  reading.setAttribute("aria-hidden", "true");
  reading.append(el("div", "edition-reading__fill"));
  document.body.append(reading);
  let activeUnit = null;
  let currentContext = "";
  let lastSection = "";
  let entering = [];
  let navigating = false;
  let cancelPendingDeparture = () => {};
  window.addEventListener('portfolio:routechange',()=>cancelPendingDeparture());
  window.addEventListener('pagehide',()=>cancelPendingDeparture());
  let progressFrame = 0;
  let candidateObserver = null;
  let readingLineObserver = null;
  let historySections = [];
  const candidates = new Set();

  const positionReadingContext = () => {
    if (innerWidth < 992 || !contextMounted) return;
    const heading = document.querySelector('.title .heading');
    const clock = document.querySelector('#h');
    if (!heading || !clock) return;
    const layout = readingContextLayout(
      heading.getBoundingClientRect().bottom,
      clock.getBoundingClientRect().top,
      context.getBoundingClientRect().height,
      !reading.hidden,
    );
    root.style.setProperty('--edition-context-top', `${layout.top}px`);
    root.style.setProperty('--edition-reading-top', `${layout.ruleTop}px`);
  };
  let contextLayoutFrame = 0;
  const scheduleContextLayout = () => {
    cancelAnimationFrame(contextLayoutFrame);
    contextLayoutFrame = requestAnimationFrame(positionReadingContext);
  };
  if (typeof ResizeObserver === 'function') {
    const contextSizeObserver = new ResizeObserver(scheduleContextLayout);
    [context, document.querySelector('.title .heading'), document.querySelector('#h')]
      .filter(Boolean).forEach(node => contextSizeObserver.observe(node));
  }
  document.fonts?.ready.then(scheduleContextLayout);
  window.addEventListener('portfolio:rail-sweep-arrival', scheduleContextLayout);

  const currentRail = () => root.classList.contains("detail-route")
    ? document.querySelector(".detail-view")
    : document.querySelector(".index-static-field, .works-motion-field, .articles-index__list, .biography-layout__content");

  const animateEntrance = () => {
    entering.forEach((animation) => animation.cancel());
    entering = [];
    if (shouldReduceMotion() || (hasCounterflow() && isCounterflowArrival())) return;
    const rail = currentRail();
    const timing = { duration: 650, easing: "cubic-bezier(.16,1,.3,1)", fill: "none" };
    entering.push(animateTitleCharacters('enter'));
    // Clip the outer rail only; the existing detail/loop motion owns its children.
    if (rail && !root.classList.contains("detail-route")) {
      entering.push(rail.animate([
        { clipPath: "inset(7% 0 0 0)", opacity: 0 },
        { clipPath: "inset(0 0 0 0)", opacity: 1 },
      ], { ...timing, duration: 800 }));
    }
    // Re-measure after the title's temporary entrance translation settles.
    Promise.all(entering.map(animation => animation.finished.catch(() => {}))).then(scheduleContextLayout);
  };

  const updateChrome = () => {
    ensureTitleCharacters();
    const section = sectionFor(location.pathname);
    root.dataset.editionSection = section === "/" ? "home" : section.slice(1);
    if (lastSection !== section) {
      currentContext = "";
      lastSection = section;
    }
  };

  const updateContext = () => {
    const section = sectionFor(location.pathname);
    if (!contextMounted) {
      document.body.append(context);
      contextMounted = true;
    }
    let best = null;
    let distance = Infinity;
    const targetY = innerHeight * .38;
    for (const item of candidates) {
      if (!item.isConnected) continue;
      const rect = item.getBoundingClientRect();
      const nextDistance = targetY < rect.top ? rect.top - targetY
        : targetY > rect.bottom ? targetY - rect.bottom : 0;
      if (nextDistance < distance) { distance = nextDistance; best = item; }
    }
    activeUnit = best?.classList.contains("detail-unit") ? best : null;
    const collection = section === "/projects" ? PROJECTS : ARTICLE_DETAILS;
    const heading = best?.querySelector(".detail-unit__title, .heading-style-h2, h2");
    let name = heading?.textContent?.trim() || "";
    let index = collection.findIndex((item) => item.title === name);
    let total = collection.length;
    const detail = root.classList.contains("detail-route");
    const historyProgress = section === '/history'
      ? documentProgress(window.scrollY, root.scrollHeight, innerHeight) : 0;
    const atEnd = historyProgress >= .9999;
    if (section === '/history') {
      index = activeSectionIndex(historySections.map(node => node.getBoundingClientRect().top), targetY, atEnd);
      const activeSection = historySections[index];
      name = activeSection?.querySelector('h2, h3')?.textContent?.trim()
        || activeSection?.getAttribute('aria-label') || 'Design practice';
      total = historySections.length;
    }
    const content = pageContext({ section, detail, name, index, total, atEnd });
    reading.hidden = !content.progress;
    const contextKey = JSON.stringify(content);
    if (contextKey !== currentContext) {
      currentContext = contextKey;
      contextCount.textContent = content.count;
      contextTitle.textContent = content.title;
      contextHint.textContent = content.hint;
      scheduleContextLayout();
      if (!shouldReduceMotion()) contextTitle.animate([{ opacity: .2, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 260, easing: "ease-out" });
    }
    const rect = activeUnit?.getBoundingClientRect();
    const itemRect = best?.getBoundingClientRect();
    const progress = section === '/history'
      ? historyProgress
      : !detail && itemRect ? collectionProgress(index, total, itemRect.top, itemRect.height, targetY)
        : rect ? Math.max(0, Math.min(1, (innerHeight * .25 - rect.top) / Math.max(1, rect.height - innerHeight * .5))) : 0;
    root.style.setProperty("--edition-reading", String(progress));
  };

  const observeContent = () => {
    candidateObserver?.disconnect();
    readingLineObserver?.disconnect();
    candidates.clear();
    historySections = sectionFor(location.pathname) === '/history'
      ? [...document.querySelectorAll('.biography-introduction, .biography-block, .biography-experience-section, .biography-clients, .biography-contact')]
      : [];
    const selector = root.classList.contains("detail-route") ? ".detail-unit"
      : sectionFor(location.pathname) === "/projects" ? ".works-motion-card" : ".articles-entry-list > li";
    candidateObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? candidates.add(entry.target) : candidates.delete(entry.target));
      updateContext();
    }, { rootMargin: "100px 0px", threshold: [0, .25, .5, .75, 1] });
    // Ambient collection motion changes transforms without window scroll events.
    // The narrow reading-line observer refreshes the label at the actual handoff.
    readingLineObserver = new IntersectionObserver(updateContext, {
      rootMargin: `-${innerHeight * .38}px 0px -${innerHeight * .62 - 1}px 0px`, threshold: 0,
    });
    document.querySelectorAll(selector).forEach((node) => {
      candidateObserver.observe(node);
      readingLineObserver.observe(node);
    });
    updateContext();
  };

  let scheduled = 0;
  const synchronize = () => {
    cancelAnimationFrame(scheduled);
    scheduled = requestAnimationFrame(() => { updateChrome(); observeContent(); scheduleContextLayout(); });
  };
  const modeObserver = new MutationObserver(synchronize);
  modeObserver.observe(root, { attributes: true, attributeFilter: ["class", "data-detail-active-slug", "data-works-motion", "data-articles-motion"] });
  window.addEventListener("popstate", synchronize);
  window.addEventListener("resize", synchronize);
  const onScroll = () => {
    if (progressFrame) return;
    progressFrame = requestAnimationFrame(() => { progressFrame = 0; updateContext(); });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener('portfolio:loop-progress', () => {
    if (innerWidth >= 992 && !root.classList.contains('detail-route')) onScroll();
  });

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

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      revealObserver.unobserve(target);
      if (!shouldReduceMotion()) target.animate([
        { opacity: 0, transform: "translateY(16px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 650, easing: "cubic-bezier(.16,1,.3,1)" });
    });
  }, { threshold: .08 });
  document.querySelectorAll(".biography-block, .biography-introduction, .biography-experience-section, .biography-contact").forEach((node) => revealObserver.observe(node));
  updateChrome();
  observeContent();
  requestAnimationFrame(animateEntrance);
  reduceQuery.addEventListener("change", () => {
    root.dataset.editionMotion = shouldReduceMotion() ? "reduced" : "full";
    if (shouldReduceMotion()) entering.forEach((animation) => animation.cancel());
  });
  window.addEventListener("pageshow", (event) => { if (event.persisted) { navigating = false; synchronize(); } });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
else initialize();
