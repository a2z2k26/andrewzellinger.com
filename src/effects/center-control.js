import { navigationGeometry, scaleMorphFrames } from "../elevation/nav-geometry.js";

let destroyCenterControl = null;

const SHARED_ICON_SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const SHARED_ICON_PATH = "M18 0C19.0843 0.000258911 19.9629 0.87955 19.9629 1.96387V16.0361H34.0361C35.1204 16.0364 36 16.9157 36 18C35.9997 19.0841 35.1203 19.9627 34.0361 19.9629H19.9629V34.0361C19.9627 35.1203 19.0841 35.9997 18 36C16.9156 36 16.0363 35.1205 16.0361 34.0361V19.9629H1.96289C0.878757 19.9627 0.000258891 19.0841 0 18C0 16.9157 0.878597 16.0363 1.96289 16.0361H16.0361V1.96387C16.0361 0.87939 16.9155 0 18 0Z";
const MENU_MORPH_DURATION_MS = 900;
const MENU_MORPH_EASING = "cubic-bezier(.45,0,.55,1)";
const ICON_ROTATION_PROGRESS = 0.27;
const MENU_MORPH_KEYFRAMES = [
  { offset: 0, width: "36px", height: "36px", borderRadius: "999px", transform: "translate(-50%, -50%)", easing: MENU_MORPH_EASING },
  { offset: 0.2, width: "36.5px", height: "36.5px", borderRadius: "999px", transform: "translate(-50%, calc(-50% - 50px))", easing: MENU_MORPH_EASING },
  { offset: 0.4, width: "96px", height: "112px", borderRadius: "999px", transform: "translate(-50%, calc(-50% - 88px))", easing: MENU_MORPH_EASING },
  { offset: 0.6, width: "176px", height: "200px", borderRadius: "999px", transform: "translate(-50%, calc(-50% - 132px))", easing: MENU_MORPH_EASING },
  { offset: 0.8, width: "232px", height: "252px", borderRadius: "64px", transform: "translate(-50%, calc(-50% - 198px))", easing: MENU_MORPH_EASING },
  { offset: 1, width: "280px", height: "320px", borderRadius: "56px", transform: "translate(-50%, calc(-50% - 238px))" },
];
const MENU_LIST_KEYFRAMES = [
  { offset: 0, marginTop: "40px", easing: MENU_MORPH_EASING },
  { offset: 0.8, marginTop: "40px", easing: MENU_MORPH_EASING },
  { offset: 1, marginTop: "0px" },
];

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
  const label = document.createElement("span");
  label.className = "edition-nav-label";
  label.setAttribute("aria-hidden", "true");
  shell.append(label);
  menu.id ||= "primary-navigation";
  toggle.setAttribute("aria-controls", menu.id);
  let geometry = navigationGeometry(innerWidth, innerHeight);
  const updateGeometry = () => {
    geometry = navigationGeometry(innerWidth, innerHeight);
    shell.style.setProperty("--center-nav-closed-size", `${geometry.buttonSize}px`);
    shell.style.setProperty("--center-nav-menu-width", `${geometry.panelWidth}px`);
    shell.style.setProperty("--center-nav-menu-height", `${geometry.panelHeight}px`);
    shell.style.setProperty("--edition-menu-travel", `${geometry.travel}px`);
    panelAnimation?.effect.setKeyframes(scaleMorphFrames(MENU_MORPH_KEYFRAMES, geometry.scale));
    menuListAnimation?.effect.setKeyframes(scaleMorphFrames(MENU_LIST_KEYFRAMES, geometry.scale));
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
        || (href === "/projects" && currentPath.startsWith("/case-studies/"))
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
    const linkStage = progress >= .98 ? 4 : progress >= .78 ? 2 : 0;
    setLinkStage(linkStage);

    const icon = toggle.querySelector(".nav_icon-plus");
    if (icon) {
      const iconProgress = isDetailRoute() ? 1 : Math.min(1, progress / ICON_ROTATION_PROGRESS);
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
      animation.playbackRate = isOpen ? 1 : -1;
      animation.play();
    });
    monitorProgress();
  };

  const createTimeline = (attempt = 0) => {
    const panel = gooeySurface?.getPanel();
    if (!panel || !menuList) {
      if (attempt < 12) window.requestAnimationFrame(() => createTimeline(attempt + 1));
      return;
    }

    panelAnimation = panel.animate(scaleMorphFrames(MENU_MORPH_KEYFRAMES, geometry.scale), {
      duration: MENU_MORPH_DURATION_MS,
      fill: "both",
      easing: "linear",
    });
    menuListAnimation = menuList.animate(scaleMorphFrames(MENU_LIST_KEYFRAMES, geometry.scale), {
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
    label.textContent = isDetailRoute() ? "Back" : isOpen ? "Close" : "Menu";
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
    label.remove();
    gooeySurface?.destroy();
    toggle.querySelector(".nav_icon-plus")?.style.removeProperty("transform");
    delete shell.dataset.navLinkStage;
    shell.classList.remove("center-nav-shell", "center-nav-shell--open", "center-nav-shell--closing", "center-nav-shell--labels-ready", "center-nav-shell--gooey-ready");
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(initCenterControl), { once: true });
} else {
  requestAnimationFrame(initCenterControl);
}

// A bfcache return must restore the control after pagehide unmounts its renderer.
window.addEventListener("pagehide", () => destroyCenterControl?.());
window.addEventListener("pageshow", (event) => { if (event.persisted) initCenterControl(); });
