import { applyDomGlassSettings, mountDomGlassLens } from "./dom-glass-lens.js";
import { GLASS_LAB_CONTROLS_ENABLED } from "./glass-lab-config.js";
import "./dom-glass-lens.css";
import "./dom-glass-lab.css";

function init() {
  const lens = document.querySelector("[data-dom-glass-lens]");
  if (!lens) return;
  mountDomGlassLens(lens);

  if (GLASS_LAB_CONTROLS_ENABLED) {
    import("./dom-glass-lab-leva.js").then(({ mountGlassLabControls }) => {
      mountGlassLabControls((values) => applyDomGlassSettings(lens, values));
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
