import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Leva, useControls } from "leva";
import { DOM_GLASS_DEFAULTS } from "./dom-glass-lens.js";

export function mountGlassLabControls(onChange) {
  const host = document.createElement("div");
  host.dataset.glassLabControls = "true";
  document.body.append(host);

  function Controls() {
    const values = useControls("DOM liquid glass", {
      refraction: { value: DOM_GLASS_DEFAULTS.refraction, min: 0, max: 72, step: 1 },
      chromatic: { value: DOM_GLASS_DEFAULTS.chromatic, min: 0, max: 24, step: 0.5 },
      falloff: { value: DOM_GLASS_DEFAULTS.falloff, min: 0.4, max: 2.4, step: 0.05 },
      warp: { value: DOM_GLASS_DEFAULTS.warp, min: 0, max: 0.6, step: 0.01 },
      frost: { value: DOM_GLASS_DEFAULTS.frost, min: 0, max: 0.5, step: 0.01 },
      blur: { value: DOM_GLASS_DEFAULTS.blur, min: 0, max: 12, step: 0.1 },
      rim: { value: DOM_GLASS_DEFAULTS.rim, min: 0, max: 1.5, step: 0.01 },
      shadow: { value: DOM_GLASS_DEFAULTS.shadow, min: 0, max: 1, step: 0.01 },
      shadowBlur: { value: DOM_GLASS_DEFAULTS.shadowBlur, min: 0, max: 48, step: 1 },
    });
    useEffect(() => onChange(values), [values]);
    return React.createElement(Leva, {
      collapsed: false,
      oneLineLabels: true,
      titleBar: { title: "Liquid glass lab" },
    });
  }

  const root = createRoot(host);
  root.render(React.createElement(Controls));
  return () => {
    root.unmount();
    host.remove();
  };
}
