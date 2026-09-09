// One pause authority for the collection loop, chrome, and route transitions.
// Only the user's choice persists. Focus/visibility/navigation belong to this page.
const STORAGE_KEY = "portfolio:collection-motion-paused";
const reasons = new Set();
const subscribers = new Set();

function storedUserPreference() {
  try {
    return typeof window !== "undefined" && window.sessionStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

if (storedUserPreference()) reasons.add("user");

export function isMotionPaused() {
  return reasons.size > 0;
}

export function isUserMotionPaused() {
  return reasons.has("user");
}

// Explicit Pause stops autoplay, not the ability to browse with direct input.
// Transient reasons freeze all movement so focus and route snapshots stay stable.
export function isMotionInputPaused() {
  return [...reasons].some((reason) => reason !== "user");
}

export function setMotionPause(reason, paused) {
  if (typeof reason !== "string" || !reason) return;
  const next = Boolean(paused);
  if (reasons.has(reason) === next) return;
  if (next) reasons.add(reason);
  else reasons.delete(reason);
  for (const subscriber of subscribers) {
    subscriber(isMotionPaused(), {
      userPaused: isUserMotionPaused(),
      inputPaused: isMotionInputPaused(),
    });
  }
}

export function setUserMotionPaused(paused) {
  const next = Boolean(paused);
  try {
    if (typeof window !== "undefined") window.sessionStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    // Storage can be blocked; the page-local control must still work.
  }
  setMotionPause("user", next);
}

export function subscribeMotionPause(callback) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

if (typeof document !== "undefined") {
  const syncVisibility = () => setMotionPause("document-hidden", document.hidden);
  const syncRestore = (event) => {
    if (!event.persisted) return;
    setMotionPause("user", storedUserPreference());
    syncVisibility();
  };
  syncVisibility();
  document.addEventListener("visibilitychange", syncVisibility);
  if (typeof window !== "undefined") window.addEventListener?.("pageshow", syncRestore);
  if (import.meta.hot) import.meta.hot.dispose(() => {
    document.removeEventListener("visibilitychange", syncVisibility);
    if (typeof window !== "undefined") window.removeEventListener?.("pageshow", syncRestore);
  });
}
