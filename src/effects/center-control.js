import { navigationGeometry, playToward } from "../elevation/nav-geometry.js";
import { MENU_MORPH_DURATION_MS, menuMorphFrames, menuListFrames, menuIconProgress, menuFillOpacity } from "../elevation/menu-morph.js";

let destroyCenterControl = null;

const SHARED_ICON_SVG_NAMESPACE = "http://www.w3.org/2000/svg";
// Five-unit arms give the plus/X a little more weight within the same 36px bounds.
const SHARED_ICON_PATH = "M18 0a2.5 2.5 0 0 1 2.5 2.5v13h13a2.5 2.5 0 0 1 0 5h-13v13a2.5 2.5 0 0 1 -5 0v-13h-13a2.5 2.5 0 0 1 0 -5h13v-13A2.5 2.5 0 0 1 18 0Z";

function ensureSharedNavIcon(toggle) {
  const icon = toggle.querySelector(".nav_icon");
  if (!icon || icon.querySelector(".nav_icon-plus")) return;

  const svg = document.createElementNS(SHARED_ICON_SVG_NAMESPACE, "svg");
  svg.classList.add("nav_icon-plus");
  svg.setAttribute("xmlns", SHARED_ICON_SVG_NAMESPACE);
  svg.setAttribute("width", "36");
  svg.setAttribute("height", "36");
  svg.setAttribute("viewBox", "0 0 36 36");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const path = document.createElementNS(SHARED_ICON_SVG_NAMESPACE, "path");
  path.setAttribute("d", SHARED_ICON_PATH);
  path.setAttribute("fill", "black");
  svg.appendChild(path);
  icon.appendChild(svg);
}

function initCenterControl() {
  destroyCenterControl?.();

  const toggle = document.querySelector(".nav_toggle");
  const menu = document.querySelector(".nav_menu");
  const shell = toggle?.closest(".nav_wrapper");
  if (!toggle || !menu || !shell) return;

  ensureSharedNavIcon(toggle);
  shell.classList.add("center-nav-shell");
  let connected = true;
  let gooeySurface = null;
  let menuIsOpen = false;
  let panelAnimation = null;
  let menuListAnimation = null;
  let progressFrame = 0;
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const forceReducedMotion = import.meta.env.DEV && new URLSearchParams(location.search).get("motion") === "reduce";
  let reducedMotion = reduceQuery.matches || forceReducedMotion;
  const isDetailRoute = () => document.documentElement.classList.contains("detail-route");
  menu.id ||= "primary-navigation";
  toggle.setAttribute("aria-controls", menu.id);
  let geometry = navigationGeometry(innerWidth, innerHeight);
  const updateGeometry = () => {
    geometry = navigationGeometry(innerWidth, innerHeight);
    shell.style.setProperty("--center-nav-closed-size", `${geometry.buttonSize}px`);
    shell.style.setProperty("--center-nav-menu-width", `${geometry.panelWidth}px`);
    shell.style.setProperty("--center-nav-menu-height", `${geometry.panelHeight}px`);
    shell.style.setProperty("--edition-control-bottom-gap", `${geometry.bottomInset}px`);
    shell.style.setProperty("--edition-menu-travel", `${geometry.travel}px`);
    shell.style.setProperty("--edition-menu-padding", `${geometry.padding}px`);
    shell.dataset.navPlacement = geometry.docked ? "docked" : "center";
    panelAnimation?.effect.setKeyframes(menuMorphFrames(geometry));
    menuListAnimation?.effect.setKeyframes(menuListFrames(geometry.scale));
  };
  updateGeometry();

  const setLinkStage = (stage) => {
    const nextStage = Math.max(0, Math.min(4, stage));
    shell.dataset.navLinkStage = String(nextStage);
    shell.classList.toggle("center-nav-shell--labels-ready", nextStage === 4);
  };

  const menuList = menu.querySelector("[data-nav-menu-list]");
  if (menuList) {
    const currentPath = window.location.pathname;
    menuList.querySelectorAll(":scope > a").forEach((anchor) => {
      const href = anchor.getAttribute("href");
      anchor.classList.add("nav_link", "center-nav-link");
      const isCurrent = currentPath === href
        || (href === "/" && currentPath.startsWith("/case-studies/"))
        || (href === "/articles" && currentPath.startsWith("/articles/"));
      if (isCurrent) {
        anchor.classList.add("w--current");
        anchor.setAttribute("aria-current", "page");
      }
    });
    menuList.classList.add("center-nav-menu-list");
  }

  const applyProgressState = () => {
    const currentTime = Math.max(0, Math.min(MENU_MORPH_DURATION_MS, Number(panelAnimation?.currentTime) || 0));
    const progress = currentTime / MENU_MORPH_DURATION_MS;
    shell.style.setProperty("--center-nav-frosted-opacity", String(menuFillOpacity(progress)));
    const linkStage = progress >= .98 ? 4 : progress >= .78 ? 2 : 0;
    setLinkStage(linkStage);

    const icon = toggle.querySelector(".nav_icon-plus");
    if (icon) {
      const iconProgress = isDetailRoute() ? 1 : menuIconProgress(progress);
      icon.style.transform = `rotate(${iconProgress * 45}deg)`;
    }

    if (!menuIsOpen && currentTime <= 0.5) {
      shell.classList.remove("center-nav-shell--closing");
    }
  };

  const monitorProgress = () => {
    window.cancelAnimationFrame(progressFrame);
    const tick = () => {
      applyProgressState();
      if (panelAnimation?.playState === "running") {
        progressFrame = window.requestAnimationFrame(tick);
      }
    };
    tick();
  };

  const playTimeline = (isOpen) => {
    if (!panelAnimation || !menuListAnimation) {
      setLinkStage(0);
      return;
    }

    const targetTime = isOpen ? MENU_MORPH_DURATION_MS : 0;
    if (reducedMotion) {
      panelAnimation.currentTime = targetTime;
      menuListAnimation.currentTime = targetTime;
      panelAnimation.pause();
      menuListAnimation.pause();
      applyProgressState();
      return;
    }

    [panelAnimation, menuListAnimation].forEach((animation) => {
      playToward(animation, isOpen, MENU_MORPH_DURATION_MS, reducedMotion);
    });
    monitorProgress();
  };

  const createTimeline = (attempt = 0) => {
    const panel = gooeySurface?.getPanel();
    if (!panel || !menuList) {
      if (attempt < 12) window.requestAnimationFrame(() => createTimeline(attempt + 1));
      return;
    }

    panelAnimation = panel.animate(menuMorphFrames(geometry), {
      duration: MENU_MORPH_DURATION_MS,
      fill: "both",
      easing: "linear",
    });
    menuListAnimation = menuList.animate(menuListFrames(geometry.scale), {
      duration: MENU_MORPH_DURATION_MS,
      fill: "both",
      easing: "linear",
    });
    panelAnimation.pause();
    menuListAnimation.pause();
    panelAnimation.currentTime = 0;
    menuListAnimation.currentTime = 0;
    panelAnimation.onfinish = () => {
      applyProgressState();
      if (!menuIsOpen) shell.classList.remove("center-nav-shell--closing");
    };
    shell.classList.add("center-nav-shell--gooey-ready");
    playTimeline(menuIsOpen);
  };

  import("./center-gooey-surface.jsx").then(({ mountCenterGooeySurface }) => {
    if (!connected || !shell.isConnected) return;
    gooeySurface = mountCenterGooeySurface(shell);
    window.requestAnimationFrame(() => createTimeline());
  });

  const syncMenuState = () => {
    const isOpen = menu.classList.contains("show") && !document.documentElement.classList.contains("detail-route");
    const wasOpen = menuIsOpen;
    menuIsOpen = isOpen;
    shell.classList.toggle("center-nav-shell--open", isOpen);
    if (isOpen) {
      shell.classList.remove("center-nav-shell--closing");
    } else if (wasOpen || (Number(panelAnimation?.currentTime) || 0) > 0) {
      shell.classList.add("center-nav-shell--closing");
    }
    playTimeline(isOpen);
    menu.setAttribute("aria-hidden", String(!isOpen));
    toggle.setAttribute("aria-expanded", String(isOpen));
    applyProgressState();
    menu.querySelectorAll("a").forEach((anchor) => {
      anchor.tabIndex = isOpen ? 0 : -1;
    });
  };
  const menuObserver = new MutationObserver(syncMenuState);
  menuObserver.observe(menu, { attributes: true, attributeFilter: ["class"] });
  const routeObserver = new MutationObserver(syncMenuState);
  routeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  const dismiss = () => {
    menu.classList.remove("show");
    toggle.classList.remove("active");
  };
  const onKeyDown = (event) => {
    if (!menuIsOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      dismiss();
      toggle.focus({ preventScroll: true });
    }
    // Keep Tab inside the open disclosure. Link order follows the visible stack.
    if (event.key === "Tab") {
      const links = [...menu.querySelectorAll("a")].filter((link) => getComputedStyle(link).visibility === "visible");
      const items = [toggle, ...links];
      const index = items.indexOf(document.activeElement);
      if (index === -1) return;
      event.preventDefault();
      items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length].focus({ preventScroll: true });
    }
  };
  const onOutsidePointer = (event) => {
    if (menuIsOpen && !toggle.contains(event.target) && !menuList?.contains(event.target)) dismiss();
  };
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("pointerdown", onOutsidePointer);
  window.addEventListener("resize", updateGeometry);
  const onMotionPreferenceChange = () => {
    reducedMotion = reduceQuery.matches || forceReducedMotion;
    playTimeline(menuIsOpen);
  };
  reduceQuery.addEventListener("change", onMotionPreferenceChange);
  syncMenuState();

  destroyCenterControl = () => {
    connected = false;
    window.cancelAnimationFrame(progressFrame);
    panelAnimation?.cancel();
    menuListAnimation?.cancel();
    menuObserver.disconnect();
    routeObserver.disconnect();
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("pointerdown", onOutsidePointer);
    window.removeEventListener("resize", updateGeometry);
    reduceQuery.removeEventListener("change", onMotionPreferenceChange);
    gooeySurface?.destroy();
    toggle.querySelector(".nav_icon-plus")?.style.removeProperty("transform");
    delete shell.dataset.navLinkStage;
    shell.classList.remove("center-nav-shell", "center-nav-shell--open", "center-nav-shell--closing", "center-nav-shell--labels-ready", "center-nav-shell--gooey-ready");
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCenterControl, { once: true });
} else {
  initCenterControl();
}

// A bfcache return must restore the control after pagehide unmounts its renderer.
window.addEventListener("pagehide", () => {
  // Store a closed disclosure in bfcache. Re-entering must not replay an old
  // open intent merely because the previous navigation began inside the menu.
  document.querySelector('.nav_menu')?.classList.remove('show');
  document.querySelector('.nav_toggle')?.classList.remove('active');
  destroyCenterControl?.();
});
window.addEventListener("pageshow", (event) => { if (event.persisted) initCenterControl(); });
