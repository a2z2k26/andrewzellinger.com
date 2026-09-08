import { PROJECTS } from "../project-content.js";
import { ARTICLE_DETAILS } from "../article-content.js";
import "./styles.css";

const root = document.documentElement;
root.dataset.designEdition = "elevated";
const reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");
const forceReducedMotion = import.meta.env.DEV && new URLSearchParams(location.search).get("motion") === "reduce";
const shouldReduceMotion = () => reduceQuery.matches || forceReducedMotion;
root.dataset.editionMotion = shouldReduceMotion() ? "reduced" : "full";
const routes = [
  { path: "/", label: "Home", eyebrow: "Product · Strategy · Systems" },
  { path: "/projects", label: "Projects", eyebrow: `${PROJECTS.length} selected projects` },
  { path: "/articles", label: "Articles", eyebrow: "Notes on design & making" },
  { path: "/history", label: "History", eyebrow: "Practice & perspective" },
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
  if (document.querySelector(".edition-directory")) return;
  const title = document.querySelector(".title .container-xlarge");
  if (!title) return;
  const eyebrow = el("p", "edition-eyebrow");
  title.prepend(eyebrow);

  const directory = el("nav", "edition-directory");
  directory.setAttribute("aria-label", "Explore the portfolio");
  routes.forEach((route) => {
    const link = el("a", "edition-directory__link", route.label);
    link.href = route.path;
    directory.append(link);
  });
  document.body.append(directory);

  const context = el("div", "edition-context");
  const contextCount = el("span", "edition-context__count");
  const contextTitle = el("span", "edition-context__title");
  const contextHint = el("span", "edition-context__hint");
  context.append(contextCount, contextTitle, contextHint);
  document.body.append(context);

  const reading = el("div", "edition-reading");
  reading.setAttribute("aria-hidden", "true");
  reading.append(el("div", "edition-reading__fill"));
  document.body.append(reading);
  let activeUnit = null;
  let currentContext = "";
  let lastSection = "";
  let entering = [];
  let navigating = false;
  let progressFrame = 0;
  let candidateObserver = null;
  const candidates = new Set();

  const currentRail = () => root.classList.contains("detail-route")
    ? document.querySelector(".detail-view")
    : document.querySelector(".index-static-field, .works-motion-field, .articles-index__list, .biography-layout__content");

  const animateEntrance = () => {
    entering.forEach((animation) => animation.cancel());
    entering = [];
    if (shouldReduceMotion()) return;
    const rail = currentRail();
    const timing = { duration: 650, easing: "cubic-bezier(.16,1,.3,1)", fill: "none" };
    entering.push(title.animate([
      { opacity: 0, transform: "translateY(18px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], timing));
    // Clip the outer rail only; the existing detail/loop motion owns its children.
    if (rail && !root.classList.contains("detail-route")) {
      entering.push(rail.animate([
        { clipPath: "inset(7% 0 0 0)", opacity: 0 },
        { clipPath: "inset(0 0 0 0)", opacity: 1 },
      ], { ...timing, duration: 800 }));
    }
  };

  const updateChrome = () => {
    const section = sectionFor(location.pathname);
    const route = routes.find((item) => item.path === section) ?? routes[0];
    root.dataset.editionSection = section === "/" ? "home" : section.slice(1);
    eyebrow.textContent = route.eyebrow;
    directory.querySelectorAll("a").forEach((link) => {
      if (normalized(link.getAttribute("href")) === section) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    if (lastSection !== section) {
      currentContext = "";
      lastSection = section;
    }
  };

  const updateContext = () => {
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
    const section = sectionFor(location.pathname);
    const collection = section === "/projects" ? PROJECTS : ARTICLE_DETAILS;
    const heading = best?.querySelector(".detail-unit__title, .heading-style-h2, h2");
    const name = heading?.textContent?.trim() || "";
    const index = collection.findIndex((item) => item.title === name);
    const detail = root.classList.contains("detail-route");
    const count = index < 0 ? "" : `${String(index + 1).padStart(2, "0")} / ${String(collection.length).padStart(2, "0")}`;
    const hint = section === "/" ? "Explore the work" : section === "/history" ? "A practice in motion"
      : detail ? "Scroll to continue" : "Scroll to explore";
    const contextKey = `${section}:${name}:${detail}`;
    if (contextKey !== currentContext) {
      currentContext = contextKey;
      contextCount.textContent = count;
      contextTitle.textContent = name || (section === "/" ? "Ideas into interfaces." : "Design, through doing.");
      contextHint.textContent = hint;
      if (!shouldReduceMotion()) contextTitle.animate([{ opacity: .2, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 260, easing: "ease-out" });
    }
    const rect = activeUnit?.getBoundingClientRect();
    const progress = rect ? Math.max(0, Math.min(1, (innerHeight * .25 - rect.top) / Math.max(1, rect.height - innerHeight * .5))) : 0;
    root.style.setProperty("--edition-reading", String(progress));
    reading.hidden = !detail;
  };

  const observeContent = () => {
    candidateObserver?.disconnect();
    candidates.clear();
    const selector = root.classList.contains("detail-route") ? ".detail-unit"
      : sectionFor(location.pathname) === "/projects" ? ".works-motion-card" : ".articles-entry-list > li";
    candidateObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? candidates.add(entry.target) : candidates.delete(entry.target));
      updateContext();
    }, { rootMargin: "100px 0px", threshold: [0, .25, .5, .75, 1] });
    document.querySelectorAll(selector).forEach((node) => candidateObserver.observe(node));
    updateContext();
  };

  let scheduled = 0;
  const synchronize = () => {
    cancelAnimationFrame(scheduled);
    scheduled = requestAnimationFrame(() => { updateChrome(); observeContent(); });
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

  // Top-level routes retain real document navigation and the existing detail history.
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") || link.target || link.matches("[data-portfolio-detail-link]")) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.hash || !routes.some((route) => route.path === normalized(url.pathname))) return;
    if (normalized(location.pathname) === normalized(url.pathname)) return;
    if (shouldReduceMotion()) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    const rail = currentRail();
    const timing = { duration: 240, fill: "forwards", easing: "cubic-bezier(.4,0,1,1)" };
    const animations = [title.animate([{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-12px)" }], timing)];
    if (rail) animations.push(rail.animate([{ opacity: 1, clipPath: "inset(0 0 0 0)" }, { opacity: 0, clipPath: "inset(0 0 8% 0)" }], timing));
    let departed = false;
    const depart = () => { if (!departed) { departed = true; location.assign(url.href); } };
    Promise.all(animations.map((animation) => animation.finished.catch(() => {}))).then(depart);
    setTimeout(depart, 400);
    const reset = () => { animations.forEach((animation) => animation.cancel()); navigating = false; departed = true; };
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

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(initialize), { once: true });
else requestAnimationFrame(initialize);
