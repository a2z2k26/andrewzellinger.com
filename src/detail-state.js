import { gsap } from "gsap";
import "./detail-state.css";
import { createBoundaryMotion } from "./detail-boundary-motion.js";
import { createDetailSectionMotion } from "./detail-section-motion.js";
import {
  holdRouteVisual,
  runArticleExitTransition,
  runRouteTransition,
  runVerticalExpansion,
} from "./detail-route-transition.js";
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
let pendingDetailRender = null;
let routeOperation = 0;
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

function collectionChromeFor(entry) {
  const project = entry.kind === "project";
  return {
    collectionHeading: project ? "Projects" : "Articles",
    collectionTitle: `Andrew Zellinger • ${project ? "Projects" : "Articles"}`,
    collectionCanonical: entry.collectionPath,
  };
}

function closeNavigationMenu() {
  const toggle = document.querySelector(".nav_toggle");
  const menu = document.querySelector(".nav_menu");
  toggle?.classList.remove("active");
  toggle?.setAttribute("aria-expanded", "false");
  menu?.classList.remove("show");
}

function setShareMetadata(title, description, path) {
  for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]', 'meta[property="twitter:title"]']) {
    document.querySelector(selector)?.setAttribute("content", title);
  }
  for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]', 'meta[property="twitter:description"]']) {
    document.querySelector(selector)?.setAttribute("content", description);
  }
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", path);
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
  if (heading) heading.textContent = entry.kind === "project" ? "Projects" : "Articles";
  document.title = `Andrew Zellinger • ${entry.title}`;
  setShareMetadata(document.title, entry.summary, entry.path);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", entry.path);
}

function restoreCollectionChrome(detail = activeDetail) {
  document.documentElement.classList.remove("detail-route");
  delete document.documentElement.dataset.detailKind;
  delete document.documentElement.dataset.detailActiveSlug;
  delete document.documentElement.dataset.detailMode;

  const toggle = document.querySelector(".nav_toggle");
  toggle?.setAttribute("aria-label", "Toggle navigation");
  toggle?.removeAttribute("title");

  if (!detail) return;
  const heading = document.querySelector(".title .heading");
  if (heading) heading.textContent = detail.collectionHeading;
  document.title = detail.collectionTitle;
  setShareMetadata(document.title, detail.collectionCanonical === "/articles"
    ? "Articles by Andrew Zellinger on product design, AI experience quality, and building systems: decisions, constraints, and lessons from hands-on work."
    : "Selected commercial product design by Andrew Zellinger, spanning complex workflows, design systems, and AI products.", detail.collectionCanonical);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", detail.collectionCanonical);
}

function discardPendingDetailRender({ restoreCollection = false } = {}) {
  const pending = pendingDetailRender;
  if (!pending) return;
  pendingDetailRender = null;
  pending.sectionMotion?.destroy();
  pending.sourceVisual?.remove();
  pending.sourceCopyVisual?.remove();
  pending.view?.remove();
  if (!restoreCollection) return;
  if (activeDetail) destroyDetailView(activeDetail);
  activeDetail = null;
  pending.collectionNodes.forEach((node) => { node.hidden = false; });
  restoreCollectionChrome(pending);
  window.dispatchEvent(new Event(MOTION_ROUTE_EVENT));
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
  const projectClass = entry.kind === "project" ? " project-media-placeholder" : "";
  const source = entry.media?.src
    ? ` style="--portfolio-media-image: url('${escapeHtml(entry.media.src)}')"`
    : "";
  const accessibleMedia = entry.media?.decorative ? 'aria-hidden="true"' : `role="img" aria-label="${escapeHtml(label)}"`;
  return `<div class="media-background-holder landscape${projectClass} detail-unit__media detail-unit__media--placeholder" ${accessibleMedia}${source}>
    <span class="detail-unit__media-shade" aria-hidden="true"></span>
  </div>`;
}

function projectSectionsMarkup(entry) {
  return `<div class="detail-unit__sections detail-unit__sections--project" data-detail-expansion-body>
    ${entry.sections.map((section) => `<section class="detail-unit__section detail-unit__section--project detail-unit__section--project-${section.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">
      <h3 class="detail-unit__section-label">${escapeHtml(section.label)}</h3>
      <div class="detail-unit__section-body detail-unit__section-body--project">
        ${sectionParagraphs(section).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        ${section.items?.length ? `<ul class="detail-unit__decisions">${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
      </div>
    </section>`).join("")}
  </div>`;
}

function projectLockupMarkup(entry) {
  const meta = projectCardTags(entry);
  const lede = projectCardDescription(entry);
  return `<div class="detail-unit__project-lockup">
    <div class="works-media-spacing">${mediaMarkup(entry)}</div>
    <div class="detail-unit__copy detail-unit__copy--project" data-project-card-copy data-detail-motion-copy>
      <div class="grid _3-col">
        <h2 class="heading-style-h2 new detail-unit__title detail-unit__title--project" data-detail-motion-title tabindex="-1">${escapeHtml(entry.title)}</h2>
        <div class="detail-unit__project-details">
          <div class="works-meta-spacing">
            <div class="display-inlineflex categories detail-unit__meta detail-unit__meta--project" data-detail-motion-meta>${meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
          </div>
          <div class="works-description-spacing">
            <p class="works-project-description detail-unit__lede detail-unit__lede--project" data-detail-motion-lede>${escapeHtml(lede)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function articleBodyBlockMarkup(block) {
  if (typeof block === "string") return `<p>${escapeHtml(block)}</p>`;
  if (block?.type === "quote") return `<blockquote class="detail-unit__quote"><p>${escapeHtml(block.text)}</p></blockquote>`;
  if (block?.type === "list") {
    const tag = block.ordered ? "ol" : "ul";
    return `<${tag}>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
  }
  return `<p>${escapeHtml(block?.text ?? "")}</p>`;
}

function articleBodyMarkup(entry) {
  const groups = [];
  let current = { heading: null, blocks: [] };

  entry.body.forEach((block) => {
    if (block?.type !== "heading") {
      current.blocks.push(block);
      return;
    }

    if (current.heading || current.blocks.length) groups.push(current);
    current = { heading: block.text, blocks: [] };
  });
  if (current.heading || current.blocks.length) groups.push(current);

  return `<div class="detail-unit__article-body">
    ${groups.map((group) => {
      const content = group.blocks.map(articleBodyBlockMarkup).join("");
      if (!group.heading) {
        return `<div class="detail-unit__article-opening">${content}</div>`;
      }
      return `<section class="detail-unit__article-section">
        <h3>${escapeHtml(group.heading)}</h3>
        ${content ? `<div class="detail-unit__article-section-body">${content}</div>` : ""}
      </section>`;
    }).join("")}
    ${entry.relatedProject ? `<p class="detail-unit__related">Related work: <a href="${escapeHtml(entry.relatedProject.path)}">${escapeHtml(entry.relatedProject.title)}</a></p>` : ""}
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
  if (isProject) {
    return `<article class="detail-unit" data-detail-index="${index}" data-detail-slug="${entry.slug}"${id}>
      ${projectLockupMarkup(entry)}
      ${projectSectionsMarkup(entry)}
    </article>`;
  }

  const body = articleBodyMarkup(entry);

  return `<article class="detail-unit" data-detail-index="${index}" data-detail-slug="${entry.slug}"${id}>
    ${mediaMarkup(entry)}
    <div class="detail-unit__copy detail-unit__copy--${entry.kind}" data-detail-motion-copy>
      <div class="detail-unit__article-header" data-article-detail-header>
        <h2 class="${titleClass}" data-detail-motion-title tabindex="-1">${escapeHtml(entry.title)}</h2>
        <div class="${metaClass}" data-detail-motion-meta>${meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        <p class="${ledeClass}" data-detail-motion-lede>${escapeHtml(lede)}</p>
      </div>
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

function elementRect(element) {
  const rect = element?.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) return null;
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

function closestDetailUnit(view, slug, targetTop = DETAIL_TOP_INSET) {
  return [...view.querySelectorAll(`.detail-unit[data-detail-slug="${slug}"]`)]
    .map((unit) => ({
      unit,
      rect: elementRect(unit.querySelector(".detail-unit__media")),
    }))
    .filter(({ rect }) => rect)
    .sort((a, b) => Math.abs(a.rect.top - targetTop) - Math.abs(b.rect.top - targetTop))[0]?.unit
    ?? null;
}

function killTransition() {
  if (activeTransition?.cancel) {
    activeTransition.cancel();
    activeTransition = null;
    return;
  }
  activeTransition?.timeline?.kill();
  activeTransition?.target?.style.removeProperty("visibility");
  activeTransition?.overlay?.remove();
  activeTransition = null;
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
  setShareMetadata(document.title, entry.summary, entry.path);
}

function setupDetailScroll(view, entries, circular, reduceMotion, {
  initialUnit = null,
} = {}) {
  const sourceSet = view.querySelector('[data-detail-set="source"]');
  const afterSet = view.querySelector('[data-detail-set="after"]');
  const units = [...view.querySelectorAll(".detail-unit")];
  let sourceTop = 0;
  let cycleDistance = 0;
  let wrapping = false;
  let scrollFrame = 0;
  const boundaryMotion = createBoundaryMotion({ view, circular, reduceMotion, initialUnit });
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

function destroyDetailView(detail = activeDetail) {
  if (!detail) return;
  detail.sectionMotion?.destroy();
  detail.scrollRuntime?.destroy();
  detail.resizeCall?.kill();
  window.removeEventListener("resize", detail.onResize);
  detail.reduceMotionQuery.removeEventListener("change", detail.onMotionPreferenceChange);
  killTransition();
  detail.view.remove();
  if (activeDetail === detail) activeDetail = null;
}

async function renderDetail(entry, {
  sourceVisual = null,
  sourceCopyVisual = null,
  sourceRect = null,
  sourceCopyRect = null,
} = {}) {
  const operation = ++routeOperation;
  discardPendingDetailRender();
  const previousDetail = activeDetail;
  if (previousDetail) destroyDetailView(previousDetail);

  const fallbackChrome = collectionChromeFor(entry);
  const collectionHeading = previousDetail?.collectionHeading ?? fallbackChrome.collectionHeading;
  const collectionTitle = previousDetail?.collectionTitle ?? fallbackChrome.collectionTitle;
  const collectionCanonical = previousDetail?.collectionCanonical
    ?? fallbackChrome.collectionCanonical;
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
  const sourceSet = view.querySelector('[data-detail-set="source"]');
  const selectedIndex = entries.findIndex((candidate) => candidate.slug === entry.slug);
  const selectedUnit = sourceSet.querySelector(`.detail-unit[data-detail-index="${selectedIndex}"]`);
  const animateFromCard = circular
    && Boolean(sourceVisual)
    && Number.isFinite(sourceRect?.top);
  if (entry.kind === "article" && animateFromCard) {
    selectedUnit.querySelector(".detail-unit__media").style.visibility = "hidden";
    gsap.set(selectedUnit.querySelector("[data-article-detail-header]"), { autoAlpha: 0 });
  }
  const sectionMotion = createDetailSectionMotion({
    view,
    enabled: circular,
  });
  const pending = {
    operation,
    view,
    sectionMotion,
    collectionHeading,
    collectionTitle,
    collectionCanonical,
    collectionNodes: nodes,
    sourceVisual: sourceVisual?.isConnected ? sourceVisual : null,
    sourceCopyVisual: sourceCopyVisual?.isConnected ? sourceCopyVisual : null,
  };
  pendingDetailRender = pending;
  document.documentElement.dataset.detailMode = circular ? "circular" : "static";
  await nextFrame();
  if (pendingDetailRender !== pending || operation !== routeOperation) return;

  const expandedTop = DETAIL_TOP_INSET;
  setScroll(documentTop(selectedUnit) - expandedTop);
  await nextFrame();
  if (pendingDetailRender !== pending || operation !== routeOperation) return;

  const scrollRuntime = setupDetailScroll(
    view,
    entries,
    circular,
    reduceMotion,
    animateFromCard ? {
      initialUnit: selectedUnit,
    } : {},
  );
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
    sectionMotion,
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
    sourceRect,
  };
  pendingDetailRender = null;

  const focusTarget = selectedUnit.querySelector(".detail-unit__title");
  if (entry.kind === "project") {
    const targetMedia = selectedUnit.querySelector(".detail-unit__media");
    const targetCopy = selectedUnit.querySelector("[data-project-card-copy]");
    let transition = null;
    transition = runRouteTransition({
      direction: "enter",
      mediaVisual: sourceVisual,
      mediaFrom: sourceRect,
      mediaTo: elementRect(targetMedia),
      nativeTarget: targetMedia,
      nativeCopy: targetCopy,
      copyFrom: sourceCopyRect,
      copyTo: elementRect(targetCopy),
      expansionTarget: selectedUnit.querySelector("[data-detail-expansion-body]"),
      reduceMotion,
      onComplete: () => {
        if (activeTransition === transition) activeTransition = null;
        sectionMotion.start();
        if (focusTarget?.isConnected) focusTarget.focus({ preventScroll: true });
      },
    });
    activeTransition = transition;
    return;
  }

  const targetMedia = selectedUnit.querySelector(".detail-unit__media");
  const targetHeader = selectedUnit.querySelector("[data-article-detail-header]");
  let transition = null;
  transition = runRouteTransition({
    direction: "enter",
    mediaVisual: sourceVisual,
    mediaFrom: sourceRect,
    mediaTo: elementRect(targetMedia),
    nativeTarget: targetMedia,
    nativeCopy: targetHeader,
    sourceCopyVisual,
    copyFrom: sourceCopyRect,
    copyTo: elementRect(targetHeader),
    copyMode: "crossfade",
    reduceMotion,
    onComplete: () => {
      if (activeTransition === transition) activeTransition = null;
      sectionMotion.start();
      if (focusTarget?.isConnected) focusTarget.focus({ preventScroll: true });
    },
  });
  activeTransition = transition;
}

async function restoreCollection(state) {
  const operation = ++routeOperation;
  if (!activeDetail) return;
  const previous = activeDetail;
  killTransition();
  previous.scrollRuntime?.boundaryMotion?.clear();

  const saved = state?.[COLLECTION_STATE_KEY];
  const scrollY = saved?.scrollY ?? previous.sourceScrollY ?? 0;
  const activeSlug = document.documentElement.dataset.detailActiveSlug;
  const returnSlug = activeSlug;
  const activeUnit = closestDetailUnit(previous.view, activeSlug);
  const canReverse = previous.view.classList.contains("detail-view--project")
    && !previous.reduceMotion
    && Boolean(returnSlug)
    && Boolean(activeUnit);
  const isArticle = previous.view.classList.contains("detail-view--article");

  if (canReverse) {
    const collapse = runVerticalExpansion({
      target: activeUnit.querySelector("[data-detail-expansion-body]"),
      direction: "return",
      reduceMotion: previous.reduceMotion,
    });
    activeTransition = collapse;
    await collapse.finished;
    if (operation !== routeOperation) return;
    if (activeTransition === collapse) activeTransition = null;
  }

  if (isArticle) {
    const exit = runArticleExitTransition({
      target: previous.view,
      reduceMotion: previous.reduceMotion,
    });
    activeTransition = exit;
    await exit.finished;
    if (operation !== routeOperation) return;
    if (activeTransition === exit) activeTransition = null;
  }

  const detailMedia = canReverse ? activeUnit.querySelector(".detail-unit__media") : null;
  const returnMediaRect = elementRect(detailMedia);
  const mediaIsVisible = returnMediaRect
    && returnMediaRect.top + returnMediaRect.height > 0
    && returnMediaRect.top < window.innerHeight;
  const returnAnchorTop = mediaIsVisible ? returnMediaRect.top : DETAIL_TOP_INSET;
  const returnMediaVisual = mediaIsVisible
    ? holdRouteVisual(detailMedia.cloneNode(true), "detail-transition-media", returnMediaRect)
    : null;
  const collectionField = previous.collectionNodes.find((node) => (
    node.matches?.(".works-motion-field, .articles-index")
  ));
  if (!collectionField) {
    returnMediaVisual?.remove();
    previous.view.style.visibility = "hidden";
    destroyDetailView(previous);
    restoreCollectionChrome(previous);
    window.location.replace(previous.collectionCanonical);
    return;
  }
  if ((canReverse || isArticle) && collectionField) gsap.set(collectionField, { autoAlpha: 0 });

  previous.view.style.visibility = "hidden";
  destroyDetailView(previous);
  previous.collectionNodes.forEach((node) => { node.hidden = false; });
  restoreCollectionChrome(previous);
  window.dispatchEvent(new CustomEvent(MOTION_ROUTE_EVENT, {
    detail: {
      anchorSlug: returnSlug,
      anchorTop: returnAnchorTop,
      holdSeconds: 1.35,
    },
  }));

  await nextFrame();
  setScroll(scrollY);
  await nextFrame();
  if (operation !== routeOperation) {
    returnMediaVisual?.remove();
    if (collectionField) gsap.set(collectionField, { clearProps: "opacity,visibility" });
    return;
  }

  const candidateLinks = [...document.querySelectorAll(
    `[data-portfolio-detail-link][data-detail-slug="${returnSlug}"]`,
  )];
  const focusTarget = candidateLinks.find((link) => !link.closest("[aria-hidden='true']"));
  const targetTop = returnAnchorTop;
  const candidates = candidateLinks.map((link) => {
    const media = link.querySelector(".media-background-holder");
    return { link, media, rect: elementRect(media) };
  }).filter(({ rect }) => rect).sort((a, b) => (
    Math.abs(a.rect.top - targetTop) - Math.abs(b.rect.top - targetTop)
  ));
  const target = candidates[0];

  if (!target) {
    returnMediaVisual?.remove();
    if (collectionField) gsap.set(collectionField, { clearProps: "opacity,visibility" });
    focusTarget?.focus({ preventScroll: true });
    return;
  }

  let transition = null;
  transition = runRouteTransition({
    direction: "return",
    mediaVisual: returnMediaVisual,
    mediaFrom: returnMediaRect,
    mediaTo: target.rect,
    nativeTarget: target.media,
    revealTarget: collectionField,
    revealDuration: isArticle ? .42 : .72,
    revealOffset: isArticle ? .04 : .18,
    reduceMotion: previous.reduceMotion,
    onComplete: () => {
      if (activeTransition === transition) activeTransition = null;
      focusTarget?.focus({ preventScroll: true });
    },
  });
  activeTransition = transition;
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
  const sourceCopy = link.querySelector("[data-project-card-copy], .articles-entry__body");
  const sourceCopyRect = elementRect(sourceCopy);
  const sourceVisual = sourceMedia?.cloneNode(true) ?? null;
  const canAnimateArticle = entry.kind === "article"
    && sourceRect
    && matchMedia(DESKTOP_QUERY).matches
    && !shouldReduceMotion();
  const transitionVisual = entry.kind === "article"
    && sourceVisual
    && canAnimateArticle
    ? holdRouteVisual(sourceVisual, "detail-transition-media", sourceRect)
    : sourceVisual;
  const sourceCopyVisual = canAnimateArticle && sourceCopy && sourceCopyRect
    ? holdRouteVisual(sourceCopy.cloneNode(true), "article-transition-copy", sourceCopyRect)
    : null;
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
  renderDetail(entry, {
    sourceVisual: transitionVisual,
    sourceCopyVisual,
    sourceRect,
    sourceCopyRect,
  });
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
  if (toggle && (activeDetail || pendingDetailRender)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    closeDetail();
    return;
  }

  let link = event.target.closest("[data-portfolio-detail-link]");
  if (!link && !activeDetail && !pendingDetailRender && Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
    const clone = [...document.querySelectorAll("[data-loop-detail-slug]")].find((element) => {
      const rect = element.getBoundingClientRect();
      return event.clientX >= rect.left
        && event.clientX <= rect.right
        && event.clientY >= rect.top
        && event.clientY <= rect.bottom;
    });
    link = clone?.querySelector("[data-portfolio-detail-link]") ?? null;
  }
  if (!link || activeDetail || pendingDetailRender || isModifiedActivation(event)) return;
  event.preventDefault();
  openDetail(link);
}

function onDocumentKeyDown(event) {
  if (activeDetail || pendingDetailRender || event.key !== "Enter") return;
  const link = event.target.closest?.("[data-portfolio-detail-link]");
  if (!link) return;
  event.preventDefault();
  openDetail(link);
}

function restoreOrphanedCollection(state) {
  const path = normalizedPath();
  const nodes = collectionNodes();
  const hasStaleDetailState = document.documentElement.classList.contains("detail-route")
    || nodes.some((node) => node.hidden)
    || Boolean(document.querySelector(".detail-view"));
  if (!hasStaleDetailState) return;

  const expectedRoot = path === "/articles"
    ? document.querySelector(".articles-index")
    : document.querySelector(".works-motion-field");
  if (!expectedRoot || document.querySelector(".detail-view")) {
    window.location.replace(path);
    return;
  }

  const operation = ++routeOperation;
  killTransition();
  nodes.forEach((node) => { node.hidden = false; });
  gsap.set(nodes, { clearProps: "opacity,visibility" });

  const project = path === "/projects";
  restoreCollectionChrome(collectionChromeFor({
    kind: project ? "project" : "article",
    collectionPath: path,
  }));
  window.dispatchEvent(new Event(MOTION_ROUTE_EVENT));

  const scrollY = state?.[COLLECTION_STATE_KEY]?.scrollY ?? 0;
  requestAnimationFrame(() => {
    if (operation === routeOperation) setScroll(scrollY);
  });
}

function onPopState(event) {
  const entry = detailFromPath(window.location.pathname);
  if (entry) {
    renderDetail(entry);
    return;
  }
  if (!isCollectionPath()) return;
  if (pendingDetailRender) {
    routeOperation += 1;
    discardPendingDetailRender({ restoreCollection: true });
    return;
  }
  if (activeDetail) {
    restoreCollection(event.state);
    return;
  }
  restoreOrphanedCollection(event.state);
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
