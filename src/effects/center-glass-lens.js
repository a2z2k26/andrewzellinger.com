import { applyDomGlassSettings, mountDomGlassLens } from "./dom-glass-lens.js";
import { GLASS_LAB_CONTROLS_ENABLED } from "./glass-lab-config.js";
import "./dom-glass-lens.css";

let destroyLens = null;
let destroyControls = null;

const SHARED_ICON_SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const SHARED_ICON_PATH = "M18 0C19.0843 0.000258911 19.9629 0.87955 19.9629 1.96387V16.0361H34.0361C35.1204 16.0364 36 16.9157 36 18C35.9997 19.0841 35.1203 19.9627 34.0361 19.9629H19.9629V34.0361C19.9627 35.1203 19.0841 35.9997 18 36C16.9156 36 16.0363 35.1205 16.0361 34.0361V19.9629H1.96289C0.878757 19.9627 0.000258891 19.0841 0 18C0 16.9157 0.878597 16.0363 1.96289 16.0361H16.0361V1.96387C16.0361 0.87939 16.9155 0 18 0Z";

function ensureSharedNavIcon(toggle) {
  const icon = toggle.querySelector(".nav_icon");
  if (!icon) return;

  if (icon.querySelector(".nav_icon-plus")) return;

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
  path.setAttribute("fill", "white");
  svg.appendChild(path);
  icon.appendChild(svg);
}

function initCenterGlassLens() {
  destroyLens?.();
  destroyControls?.();
  destroyControls = null;

  const toggle = document.querySelector(".nav_toggle");
  const menu = document.querySelector(".nav_menu");
  const shell = toggle?.closest(".nav_wrapper");
  if (!toggle || !menu || !shell) return;

  ensureSharedNavIcon(toggle);
  shell.classList.add("glass-nav-shell");
  const menuContainer = menu.querySelector("[data-nav-menu-list]");
  if (menuContainer) {
    const currentPath = window.location.pathname;
    menuContainer.querySelectorAll(":scope > a").forEach((anchor) => {
      const href = anchor.getAttribute("href");
      anchor.classList.add("nav_link", "glass-nav-link");
      const isCurrent = currentPath === href
        || (href === "/projects" && currentPath.startsWith("/case-studies/"))
        || (href === "/articles" && currentPath.startsWith("/articles/"));
      if (isCurrent) {
        anchor.classList.add("w--current");
        anchor.setAttribute("aria-current", "page");
      }
    });
    menuContainer.classList.add("glass-nav-menu-list");
  }

  const syncMenuState = () => {
    const isOpen = menu.classList.contains("show") && !document.documentElement.classList.contains("detail-route");
    shell.classList.toggle("glass-nav-shell--open", isOpen);
    menu.setAttribute("aria-hidden", String(!isOpen));
    menu.querySelectorAll("a").forEach((anchor) => {
      anchor.tabIndex = isOpen ? 0 : -1;
    });
  };
  const menuObserver = new MutationObserver(syncMenuState);
  menuObserver.observe(menu, { attributes: true, attributeFilter: ["class"] });
  syncMenuState();

  const stopGlass = mountDomGlassLens(shell);
  destroyLens = () => {
    menuObserver.disconnect();
    stopGlass();
    shell.classList.remove("glass-nav-shell", "glass-nav-shell--open");
  };

  if (import.meta.env.DEV && GLASS_LAB_CONTROLS_ENABLED) {
    import("./dom-glass-lab-leva.js").then(({ mountGlassLabControls }) => {
      destroyControls = mountGlassLabControls((values) => applyDomGlassSettings(shell, values));
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(initCenterGlassLens), { once: true });
} else {
  requestAnimationFrame(initCenterGlassLens);
}

window.addEventListener("pagehide", () => {
  destroyControls?.();
  destroyLens?.();
}, { once: true });
