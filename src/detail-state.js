import { gsap } from "gsap";
import "./detail-state.css";
import { createBoundaryMotion } from "./detail-boundary-motion.js";
import {
  ARTICLE_DETAILS,
  CASE_STUDIES,
  collectionForKind,
  detailFromPath,
} from "./detail-content.js";
import {
  projectCardDescription,
  projectCardTags,
} from "./project-content.js";

const MOTION_ROUTE_EVENT = "portfolio:routechange";
const DETAIL_STATE_KEY = "portfolioDetail";
const COLLECTION_STATE_KEY = "portfolioCollection";
const DETAIL_TOP_INSET = 16;
const DESKTOP_QUERY = "(min-width: 992px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

let activeDetail = null;
let activeTransition = null;
const FORCE_REDUCED_MOTION = import.meta.env.DEV
  && new URLSearchParams(window.location.search).get("motion") === "reduce";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sectionParagraphs(section) {
  return Array.isArray(section.paragraphs) ? section.paragraphs : [section.body];
}

function shouldReduceMotion(query = matchMedia(REDUCED_MOTION_QUERY)) {
  return query.matches || FORCE_REDUCED_MOTION;
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function normalizedPath() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function isCollectionPath(pathname = normalizedPath()) {
  return pathname === "/projects" || pathname === "/articles";
}

function collectionNodes() {
  return [
    document.querySelector(".works-motion-field"),
    document.querySelector(".works-scroll-space"),
    document.querySelector(".articles-index"),
  ].filter(Boolean);
}

function closeNavigationMenu() {
  const toggle = document.querySelector(".nav_toggle");
  const menu = document.querySelector(".nav_menu");
  toggle?.classList.remove("active");
  toggle?.setAttribute("aria-expanded", "false");
  menu?.classList.remove("show");
}

function setDetailChrome(entry) {
  document.documentElement.classList.add("detail-route");
  document.documentElement.dataset.detailKind = entry.kind;
  document.documentElement.dataset.detailActiveSlug = entry.slug;
  closeNavigationMenu();

  const toggle = document.querySelector(".nav_toggle");
  toggle?.setAttribute("aria-label", "Close detail");
  toggle?.setAttribute("title", "Close detail");

  const activeCollection = entry.kind === "project" ? "/projects" : "/articles";
  const markActiveNavigation = () => {
    const navigationLinks = [...document.querySelectorAll(".nav_menu a")];
    navigationLinks.forEach((link) => {
      link.classList.toggle("w--current", link.getAttribute("href") === activeCollection);
      link.removeAttribute("aria-current");
    });
    navigationLinks.find((link) => link.getAttribute("href") === activeCollection)
      ?.setAttribute("aria-current", "page");
  };
  markActiveNavigation();
  requestAnimationFrame(markActiveNavigation);

  const heading = document.querySelector(".title .heading");
  if (heading) heading.textContent = entry.kind === "project" ? "Selected work" : "Writing samples";
  document.title = `Andrew Zellinger • ${entry.title}`;
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", entry.path);
}

function restoreCollectionChrome() {
  document.documentElement.classList.remove("detail-route");
  delete document.documentElement.dataset.detailKind;
  delete document.documentElement.dataset.detailActiveSlug;
  delete document.documentElement.dataset.detailMode;

  const toggle = document.querySelector(".nav_toggle");
  toggle?.setAttribute("aria-label", "Toggle navigation");
  toggle?.removeAttribute("title");

  if (!activeDetail) return;
  const heading = document.querySelector(".title .heading");
  if (heading) heading.textContent = activeDetail.collectionHeading;
  document.title = activeDetail.collectionTitle;
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", activeDetail.collectionCanonical);
}

function detailState(entry, overrides = {}) {
  const current = history.state?.[DETAIL_STATE_KEY] ?? {};
  return {
    kind: entry.kind,
    slug: entry.slug,
    sourceRoute: entry.collectionPath,
    sourceScrollY: 0,
    originSlug: entry.slug,
    returnable: false,
    ...current,
    ...overrides,
  };
}

function replaceDetailHistory(entry, overrides = {}) {
  history.replaceState(
    {
      ...history.state,
      [DETAIL_STATE_KEY]: detailState(entry, overrides),
    },
    "",
    entry.path,
  );
}

function mediaMarkup(entry) {
  const label = entry.media?.label ?? `Tasman Glacier landscape stand-in for ${entry.title}`;
  const source = entry.media?.src
    ? ` style="--portfolio-media-image: url('${escapeHtml(entry.media.src)}')"`
    : "";
  return `<div class="media-background-holder landscape detail-unit__media detail-unit__media--placeholder" role="img" aria-label="${escapeHtml(label)}"${source}>
    <span class="detail-unit__media-shade" aria-hidden="true"></span>
  </div>`;
}

function unitMarkup(entry, index, entries, hidden) {
  const isProject = entry.kind === "project";
  const meta = isProject
    ? projectCardTags(entry)
    : [
      entry.meta[0] ?? "",
      entry.meta[1] ?? "",
      entry.meta.slice(2).join(" · "),
    ].filter(Boolean);
  const id = hidden ? "" : ` id="detail-${entry.kind}-${entry.slug}"`;
  const lede = isProject ? projectCardDescription(entry) : entry.summary;
  const titleClass = `detail-unit__title detail-unit__title--${entry.kind}`;
  const metaClass = `detail-unit__meta detail-unit__meta--${entry.kind}`;
  const ledeClass = `detail-unit__lede detail-unit__lede--${entry.kind}`;
  const body = isProject
    ? `<div class="detail-unit__sections detail-unit__sections--project">
      ${entry.sections.map((section) => `<section class="detail-unit__section detail-unit__section--project detail-unit__section--project-${section.label.toLowerCase()}">
      <div class="detail-unit__section-label">${escapeHtml(section.label)}</div>
      <div class="detail-unit__section-body detail-unit__section-body--project">
        ${sectionParagraphs(section).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </div>
    </section>`).join("")}
    </div>`
    : `<div class="detail-unit__article-body">
      ${entry.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
    </div>`;

  return `<article class="detail-unit" data-detail-index="${index}" data-detail-slug="${entry.slug}"${id}>
    ${mediaMarkup(entry)}
    <div class="detail-unit__copy detail-unit__copy--${entry.kind}" data-detail-motion-copy>
      <h2 class="${titleClass}" data-detail-motion-title tabindex="-1">${escapeHtml(entry.title)}</h2>
      <div class="${metaClass}" data-detail-motion-meta>${meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      <p class="${ledeClass}" data-detail-motion-lede>${escapeHtml(lede)}</p>
      ${body}
    </div>
  </article>`;
}

function setMarkup(entries, name, hidden) {
  const kind = entries[0]?.kind ?? "article";
  const accessibility = hidden ? ' aria-hidden="true" inert' : "";
  return `<div class="detail-set detail-set--${name} detail-set--${kind}" data-detail-set="${name}"${accessibility}>
    ${entries.map((entry, index) => unitMarkup(entry, index, entries, hidden)).join("")}
  </div>`;
}

function viewMarkup(entries, circular) {
  const kind = entries[0]?.kind ?? "article";
  const sets = circular
    ? `${setMarkup(entries, "before", true)}${setMarkup(entries, "source", false)}${setMarkup(entries, "after", true)}`
    : setMarkup(entries, "source", false);
  const label = kind === "project" ? "Project detail" : "Article detail";
  return `<main class="detail-view detail-view--${kind}" aria-label="${label}">
    <div class="detail-rail">
      <div class="detail-sets">${sets}</div>
    </div>
  </main>`;
}

function documentTop(element) {
  return element.getBoundingClientRect().top + window.scrollY;
}

function setScroll(top) {
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
}

function killTransition() {
  activeTransition?.timeline?.kill();
  activeTransition?.target?.style.removeProperty("visibility");
  activeTransition?.overlay?.remove();
  activeTransition = null;
}

function runEntranceTransition(sourceVisual, sourceRect, targetUnit, reduceMotion) {
  const target = targetUnit.querySelector(".detail-unit__media");
  const copy = targetUnit.querySelector(".detail-unit__copy");
  if (!sourceVisual || !sourceRect || !target || !copy || reduceMotion || !matchMedia(DESKTOP_QUERY).matches) {
    target?.style.removeProperty("visibility");
    return;
  }

  killTransition();
  const targetRect = target.getBoundingClientRect();
  const overlay = sourceVisual.cloneNode(true);
  overlay.classList.add("detail-transition-media");
  overlay.removeAttribute("role");
  overlay.removeAttribute("aria-label");
  overlay.setAttribute("aria-hidden", "true");
  Object.assign(overlay.style, {
    left: `${targetRect.left}px`,
    top: `${targetRect.top}px`,
    width: `${targetRect.width}px`,
    height: `${targetRect.height}px`,
  });
  document.body.append(overlay);
  target.style.visibility = "hidden";
  gsap.set(overlay, {
    x: sourceRect.left - targetRect.left,
    y: sourceRect.top - targetRect.top,
    scaleX: sourceRect.width / targetRect.width,
    scaleY: sourceRect.height / targetRect.height,
    transformOrigin: "0 0",
  });
  gsap.set(copy, { autoAlpha: 0, y: 24 });

  const finish = () => {
    target.style.removeProperty("visibility");
    overlay.remove();
    if (activeTransition?.overlay === overlay) activeTransition = null;
  };
  const timeline = gsap.timeline({ onComplete: finish });
  timeline
    .to(overlay, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      duration: .72,
      ease: "power3.inOut",
    })
    .set(target, { visibility: "visible" })
    .to(copy, {
      autoAlpha: 1,
      y: 0,
      duration: .42,
      ease: "power2.out",
      clearProps: "transform,opacity,visibility",
    }, "-=.18");

  activeTransition = { timeline, overlay, target };
}

function updateActiveEntry(entries, units) {
  const marker = window.scrollY + DETAIL_TOP_INSET + 2;
  let activeUnit = units[0];
  for (const unit of units) {
    if (documentTop(unit) <= marker) activeUnit = unit;
  }
  const entry = entries[Number(activeUnit?.dataset.detailIndex) || 0];
  if (!entry || normalizedPath() === entry.path.replace(/\/$/, "")) return;
  replaceDetailHistory(entry);
  document.documentElement.dataset.detailActiveSlug = entry.slug;
  document.title = `Andrew Zellinger • ${entry.title}`;
}

function setupDetailScroll(view, entries, circular, reduceMotion) {
  const sourceSet = view.querySelector('[data-detail-set="source"]');
  const afterSet = view.querySelector('[data-detail-set="after"]');
  const units = [...view.querySelectorAll(".detail-unit")];
  let sourceTop = 0;
  let cycleDistance = 0;
  let wrapping = false;
  let scrollFrame = 0;
  const boundaryMotion = createBoundaryMotion({ view, circular, reduceMotion });

  const measure = () => {
    sourceTop = documentTop(sourceSet);
    cycleDistance = circular && afterSet ? documentTop(afterSet) - sourceTop : 0;
    boundaryMotion.measure();
  };

  const handleScrollFrame = () => {
    scrollFrame = 0;
    let currentY = window.scrollY;
    if (circular && cycleDistance && !wrapping) {
      const lowerBoundary = sourceTop - DETAIL_TOP_INSET;
      const upperBoundary = lowerBoundary + cycleDistance;
      if (currentY < lowerBoundary) {
        wrapping = true;
        boundaryMotion.clear();
        currentY += cycleDistance;
        setScroll(currentY);
        requestAnimationFrame(() => {
          wrapping = false;
          boundaryMotion.render();
        });
      } else if (currentY >= upperBoundary) {
        wrapping = true;
        boundaryMotion.clear();
        currentY -= cycleDistance;
        setScroll(currentY);
        requestAnimationFrame(() => {
          wrapping = false;
          boundaryMotion.render();
        });
      }
    }
    boundaryMotion.render();
    updateActiveEntry(entries, units);
  };

  const onScroll = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(handleScrollFrame);
  };

  measure();
  boundaryMotion.render();
  window.addEventListener("scroll", onScroll, { passive: true });
  return {
    measure,
    boundaryMotion,
    destroy() {
      boundaryMotion.destroy();
      window.removeEventListener("scroll", onScroll);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
    },
  };
}

function currentEntry(entries) {
  return detailFromPath(window.location.pathname) ?? entries[0];
}

function destroyDetailView() {
  if (!activeDetail) return;
  activeDetail.scrollRuntime?.destroy();
  activeDetail.resizeCall?.kill();
  window.removeEventListener("resize", activeDetail.onResize);
  activeDetail.reduceMotionQuery.removeEventListener("change", activeDetail.onMotionPreferenceChange);
  killTransition();
  activeDetail.view.remove();
}

async function renderDetail(entry, { sourceVisual = null, sourceRect = null } = {}) {
  if (activeDetail) destroyDetailView();

  const collectionHeading = activeDetail?.collectionHeading
    ?? document.querySelector(".title .heading")?.textContent
    ?? (entry.kind === "project" ? "Selected work" : "Writing samples");
  const collectionTitle = activeDetail?.collectionTitle ?? document.title;
  const collectionCanonical = activeDetail?.collectionCanonical
    ?? document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ?? entry.collectionPath;
  const reduceMotionQuery = matchMedia(REDUCED_MOTION_QUERY);
  const reduceMotion = shouldReduceMotion(reduceMotionQuery);
  const circular = matchMedia(DESKTOP_QUERY).matches && !reduceMotion;
  const entries = collectionForKind(entry.kind);
  const nodes = collectionNodes();
  nodes.forEach((node) => { node.hidden = true; });

  window.dispatchEvent(new Event(MOTION_ROUTE_EVENT));
  setDetailChrome(entry);

  const host = document.querySelector(".wrapper");
  host.insertAdjacentHTML("beforeend", viewMarkup(entries, circular));
  const view = host.querySelector(".detail-view:last-child");
  document.documentElement.dataset.detailMode = circular ? "circular" : "static";
  await nextFrame();

  const sourceSet = view.querySelector('[data-detail-set="source"]');
  const selectedIndex = entries.findIndex((candidate) => candidate.slug === entry.slug);
  const selectedUnit = sourceSet.querySelector(`.detail-unit[data-detail-index="${selectedIndex}"]`);
  setScroll(documentTop(selectedUnit) - DETAIL_TOP_INSET);
  await nextFrame();

  const scrollRuntime = setupDetailScroll(view, entries, circular, reduceMotion);
  let resizeCall = null;
  const rerenderForEnvironment = () => {
    const nextCircular = matchMedia(DESKTOP_QUERY).matches && !shouldReduceMotion();
    if (nextCircular === activeDetail?.circular) {
      activeDetail?.scrollRuntime?.measure();
      return;
    }
    const visibleEntry = currentEntry(entries);
    renderDetail(visibleEntry);
  };
  const onResize = () => {
    resizeCall?.kill();
    resizeCall = gsap.delayedCall(.2, rerenderForEnvironment);
    if (activeDetail) activeDetail.resizeCall = resizeCall;
  };
  const onMotionPreferenceChange = () => rerenderForEnvironment();
  window.addEventListener("resize", onResize, { passive: true });
  reduceMotionQuery.addEventListener("change", onMotionPreferenceChange);

  activeDetail = {
    view,
    entries,
    circular,
    reduceMotion,
    scrollRuntime,
    resizeCall,
    onResize,
    reduceMotionQuery,
    onMotionPreferenceChange,
    collectionHeading,
    collectionTitle,
    collectionCanonical,
    collectionNodes: nodes,
    sourceScrollY: history.state?.[DETAIL_STATE_KEY]?.sourceScrollY ?? 0,
    originSlug: history.state?.[DETAIL_STATE_KEY]?.originSlug ?? entry.slug,
  };

  runEntranceTransition(sourceVisual, sourceRect, selectedUnit, reduceMotion);
  selectedUnit.querySelector(".detail-unit__title")?.focus({ preventScroll: true });
}

function restoreCollection(state) {
  if (!activeDetail) return;
  const previous = activeDetail;
  destroyDetailView();
  activeDetail = previous;
  previous.collectionNodes.forEach((node) => { node.hidden = false; });
  restoreCollectionChrome();
  activeDetail = null;
  window.dispatchEvent(new Event(MOTION_ROUTE_EVENT));

  const saved = state?.[COLLECTION_STATE_KEY];
  const scrollY = saved?.scrollY ?? previous.sourceScrollY ?? 0;
  const originSlug = saved?.originSlug ?? previous.originSlug;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setScroll(scrollY);
    [...document.querySelectorAll(`[data-detail-slug="${originSlug}"]`)]
      .find((element) => !element.closest("[aria-hidden='true']"))
      ?.focus({ preventScroll: true });
  }));
}

function openDetail(link) {
  const entries = collectionForKind(link.dataset.detailKind);
  const entry = entries.find((candidate) => candidate.slug === link.dataset.detailSlug);
  if (!entry) return;

  const sourceMedia = link.querySelector(".media-background-holder, .articles-entry__thumbnail");
  const rect = sourceMedia?.getBoundingClientRect();
  const sourceRect = rect
    ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    : null;
  const sourceVisual = sourceMedia?.cloneNode(true) ?? null;
  const sourceRoute = normalizedPath();
  const sourceScrollY = window.scrollY;
  const collectionState = {
    route: sourceRoute,
    scrollY: sourceScrollY,
    originSlug: entry.slug,
  };

  history.replaceState(
    { ...history.state, [COLLECTION_STATE_KEY]: collectionState },
    "",
    window.location.href,
  );
  history.pushState(
    {
      ...history.state,
      [DETAIL_STATE_KEY]: detailState(entry, {
        sourceRoute,
        sourceScrollY,
        originSlug: entry.slug,
        returnable: true,
      }),
    },
    "",
    entry.path,
  );
  renderDetail(entry, { sourceVisual, sourceRect });
}

function closeDetail() {
  const state = history.state?.[DETAIL_STATE_KEY];
  if (state?.returnable) {
    history.back();
    return;
  }
  const entry = detailFromPath(window.location.pathname);
  window.location.assign(entry?.collectionPath ?? "/");
}

function isModifiedActivation(event) {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function onDocumentClick(event) {
  const toggle = event.target.closest(".nav_toggle");
  if (toggle && activeDetail) {
    event.preventDefault();
    event.stopImmediatePropagation();
    closeDetail();
    return;
  }

  let link = event.target.closest("[data-portfolio-detail-link]");
  if (!link && !activeDetail && Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
    const clone = [...document.querySelectorAll("[data-loop-detail-slug]")].find((element) => {
      const rect = element.getBoundingClientRect();
      return event.clientX >= rect.left
        && event.clientX <= rect.right
        && event.clientY >= rect.top
        && event.clientY <= rect.bottom;
    });
    link = clone?.querySelector("[data-portfolio-detail-link]") ?? null;
  }
  if (!link || activeDetail || isModifiedActivation(event)) return;
  event.preventDefault();
  openDetail(link);
}

function onDocumentKeyDown(event) {
  if (activeDetail || event.key !== "Enter") return;
  const link = event.target.closest?.("[data-portfolio-detail-link]");
  if (!link) return;
  event.preventDefault();
  openDetail(link);
}

function onPopState(event) {
  const entry = detailFromPath(window.location.pathname);
  if (entry) {
    renderDetail(entry);
    return;
  }
  if (isCollectionPath() && activeDetail) restoreCollection(event.state);
}

function initializeDetailState() {
  history.scrollRestoration = "manual";
  document.addEventListener("click", onDocumentClick, true);
  document.addEventListener("keydown", onDocumentKeyDown, true);
  window.addEventListener("popstate", onPopState);
  window.addEventListener("pagehide", () => {
    destroyDetailView();
    document.removeEventListener("click", onDocumentClick, true);
    document.removeEventListener("keydown", onDocumentKeyDown, true);
    window.removeEventListener("popstate", onPopState);
  }, { once: true });

  const entry = detailFromPath(window.location.pathname);
  if (!entry) return;
  const currentState = history.state?.[DETAIL_STATE_KEY];
  replaceDetailHistory(entry, {
    sourceRoute: currentState?.sourceRoute ?? entry.collectionPath,
    sourceScrollY: currentState?.sourceScrollY ?? 0,
    originSlug: currentState?.originSlug ?? entry.slug,
    returnable: currentState?.returnable ?? false,
  });
  renderDetail(entry);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeDetailState, { once: true });
} else {
  initializeDetailState();
}

export { ARTICLE_DETAILS, CASE_STUDIES };
