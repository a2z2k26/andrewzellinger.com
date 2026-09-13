import { createRotatingGlobeIcon } from "./rotating-globe-icon.js";

// Launch gate: retain the complete introduction while keeping it off every viewport.
const WELCOME_PREFACE_ENABLED = true;
const SESSION_KEY = "portfolio:welcome-preface-dismissed-v1";
const HOME_PATHS = new Set(["", "/projects"]);
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);

function currentPath() {
  return window.location.pathname.replace(/\/$/, "");
}

function readDismissal() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function rememberDismissal() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "true");
  } catch {
    // A blocked storage API should not prevent the modal from closing.
  }
}

function shouldOpen() {
  if (!WELCOME_PREFACE_ENABLED) return false;
  if (!HOME_PATHS.has(currentPath())) return false;
  const forcePreview = import.meta.env.DEV
    && new URLSearchParams(window.location.search).get("welcome") === "1";
  return forcePreview || !readDismissal();
}

function makePreface() {
  const backdrop = document.createElement("div");
  backdrop.className = "welcome-preface";
  backdrop.dataset.state = "entering";

  const panel = document.createElement("section");
  panel.className = "welcome-preface__panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "welcome-preface-title");
  panel.setAttribute("aria-describedby", "welcome-preface-description");
  panel.tabIndex = -1;

  const globe = createRotatingGlobeIcon();

  const title = document.createElement("h2");
  title.id = "welcome-preface-title";
  title.className = "welcome-preface__title";
  title.textContent = "ZELLINGER";

  const description = document.createElement("p");
  description.id = "welcome-preface-description";
  description.className = "welcome-preface__description";
  description.textContent = "Years of building with AI has reshaped my design practice. This site documents what came before, here’s what’s next:";

  const visit = document.createElement("p");
  visit.className = "welcome-preface__visit";

  const visitLabel = document.createElement("span");
  visitLabel.textContent = "visit";

  const visitLink = document.createElement("a");
  visitLink.href = "https://comingsoon.com";
  visitLink.target = "_blank";
  visitLink.rel = "noopener noreferrer";
  visitLink.textContent = "comingsoon.com";
  visit.append(visitLabel, visitLink);

  const closeButton = document.createElement("button");
  closeButton.className = "welcome-preface__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close portfolio introduction");
  closeButton.innerHTML = `
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M2 2 30 30M30 2 2 30" />
    </svg>
  `;

  panel.append(globe, title, description, visit, closeButton);
  backdrop.append(panel);
  return { backdrop, panel, closeButton, globe };
}

function mountPreface() {
  if (!shouldOpen() || document.querySelector(".welcome-preface")) return;

  const page = document.querySelector(".page");
  const priorFocus = document.activeElement;
  const priorAriaHidden = page?.getAttribute("aria-hidden");
  const pageWasInert = page?.hasAttribute("inert") ?? false;
  const { backdrop, panel, closeButton, globe } = makePreface();
  let closing = false;
  let removalTimer = 0;

  const focusableSelector = [
    "button:not([disabled])",
    "a[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  const restorePage = () => {
    if (page) {
      page.inert = pageWasInert;
      if (!pageWasInert) page.removeAttribute("inert");
      if (priorAriaHidden === null) page.removeAttribute("aria-hidden");
      else page.setAttribute("aria-hidden", priorAriaHidden);
    }
    document.documentElement.removeAttribute("data-welcome-preface");
  };

  const finalizeClose = () => {
    window.clearTimeout(removalTimer);
    window.removeEventListener("pagehide", onPageHide);
    backdrop.removeEventListener("wheel", onBlockedScrollInput);
    backdrop.removeEventListener("touchmove", onBlockedScrollInput);
    globe.destroy?.();
    backdrop.remove();
    restorePage();
    if (priorFocus instanceof HTMLElement && priorFocus.isConnected && priorFocus !== document.body) {
      priorFocus.focus({ preventScroll: true });
    }
  };

  const close = () => {
    if (closing) return;
    closing = true;
    rememberDismissal();
    backdrop.dataset.state = "leaving";
    document.removeEventListener("keydown", onKeyDown);
    backdrop.removeEventListener("click", onBackdropClick);
    closeButton.removeEventListener("click", close);

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      finalizeClose();
      return;
    }

    const onTransitionEnd = (event) => {
      if (event.target !== backdrop || event.propertyName !== "opacity") return;
      backdrop.removeEventListener("transitionend", onTransitionEnd);
      finalizeClose();
    };
    backdrop.addEventListener("transitionend", onTransitionEnd);
    removalTimer = window.setTimeout(finalizeClose, 300);
  };

  function onBackdropClick(event) {
    if (event.target === backdrop) close();
  }

  function onBlockedScrollInput(event) {
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
  }

  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    const targetIsControl = event.target instanceof HTMLElement
      && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(event.target.tagName);
    if (SCROLL_KEYS.has(event.key) && !targetIsControl) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [...panel.querySelectorAll(focusableSelector)]
      .filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
    if (!focusable.length) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onPageHide() {
    rememberDismissal();
    document.removeEventListener("keydown", onKeyDown);
    backdrop.removeEventListener("wheel", onBlockedScrollInput);
    backdrop.removeEventListener("touchmove", onBlockedScrollInput);
    globe.destroy?.();
    backdrop.remove();
    restorePage();
  }

  if (page) {
    page.inert = true;
    page.setAttribute("aria-hidden", "true");
  }
  document.documentElement.setAttribute("data-welcome-preface", "open");
  document.body.append(backdrop);
  closeButton.addEventListener("click", close);
  backdrop.addEventListener("click", onBackdropClick);
  backdrop.addEventListener("wheel", onBlockedScrollInput, { passive: false });
  backdrop.addEventListener("touchmove", onBlockedScrollInput, { passive: false });
  document.addEventListener("keydown", onKeyDown);

  requestAnimationFrame(() => {
    backdrop.dataset.state = "open";
    panel.focus({ preventScroll: true });
  });

  window.addEventListener("pagehide", onPageHide, { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountPreface, { once: true });
} else {
  mountPreface();
}
