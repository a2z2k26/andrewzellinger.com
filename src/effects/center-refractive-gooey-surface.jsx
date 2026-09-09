// Rejected clear-glass trial, preserved for recovery but not imported by the live control.
import React, { useId, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Liquid } from "liquid-gooey";
import { CENTER_GLASS_SETTINGS, centerGlassDisplacementMap, syncCenterGlassMaterial } from './center-glass-material.js';

function GooeySurface() {
  const group = useRef(null);
  const [silhouetteId, setSilhouetteId] = useState(null);
  const [map, setMap] = useState(null);
  const maskId = `center-glass-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const refractionId = `${maskId}-refraction`;
  const rimId = `${maskId}-rim`;
  const settings = CENTER_GLASS_SETTINGS;
  useLayoutEffect(() => {
    // Reuse the live, already-filtered liquid silhouette. One backdrop layer
    // avoids double tint/blur where the emerging bud overlaps the circle.
    setSilhouetteId(group.current?.querySelector('[data-gooey-svg] > g[id]')?.id || null);
    setMap(centerGlassDisplacementMap());
  }, []);
  useLayoutEffect(() => {
    if (map) syncCenterGlassMaterial(group.current.parentElement);
  }, [map]);
  return (
    <>
    <svg className="center-glass-mask-defs" width="0" height="0" aria-hidden="true">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="840" height="860" style={{ maskType: "alpha" }}>
          {silhouetteId && <use href={`#${silhouetteId}`} transform="translate(240 240)" />}
        </mask>
        <filter id={refractionId} filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse"
          x="0" y="0" width="840" height="860" colorInterpolationFilters="sRGB">
          <feFlood floodColor="rgb(128,128,128)" result="neutral" />
          <feImage data-center-glass-map="panel" href={map || undefined} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="panel-map" />
          <feImage data-center-glass-map="base" href={map || undefined} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="base-map" />
          <feMerge result="map"><feMergeNode in="neutral" /><feMergeNode in="panel-map" /><feMergeNode in="base-map" /></feMerge>
          <feDisplacementMap in="SourceGraphic" in2="map" scale={settings.refraction + settings.chromatic} xChannelSelector="R" yChannelSelector="G" result="red-shift" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale={settings.refraction} xChannelSelector="R" yChannelSelector="G" result="green-shift" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale={settings.refraction - settings.chromatic} xChannelSelector="R" yChannelSelector="G" result="blue-shift" />
          <feColorMatrix in="red-shift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red-channel" />
          <feColorMatrix in="green-shift" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green-channel" />
          <feColorMatrix in="blue-shift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue-channel" />
          <feBlend in="red-channel" in2="green-channel" mode="screen" result="red-green" />
          <feBlend in="red-green" in2="blue-channel" mode="screen" />
        </filter>
        <filter id={rimId} x="-100%" y="-100%" width="300%" height="300%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation={settings.shadowBlur / 2} result="shadow-blur" />
          <feOffset in="shadow-blur" dy="9" result="shadow-offset" />
          <feComposite in="shadow-offset" in2="SourceAlpha" operator="out" result="shadow-edge" />
          <feFlood floodColor="#000" floodOpacity={settings.shadow * .88} result="shadow-color" />
          <feComposite in="shadow-color" in2="shadow-edge" operator="in" result="shadow" />
          <feMorphology in="SourceAlpha" operator="erode" radius="2.5" result="inner" />
          <feOffset in="inner" dx="1" dy="2" result="inner-offset" />
          <feComposite in="SourceAlpha" in2="inner-offset" operator="out" result="rim-edge" />
          <feGaussianBlur in="rim-edge" stdDeviation=".8" result="rim-soft" />
          <feFlood floodColor="#fff" floodOpacity={settings.rim * .62} result="rim-color" />
          <feComposite in="rim-color" in2="rim-soft" operator="in" result="rim" />
          <feMerge><feMergeNode in="shadow" /><feMergeNode in="rim" /></feMerge>
        </filter>
      </defs>
    </svg>
    <div className="center-nav-glass-surface" hidden={!silhouetteId}
      style={{ maskImage: `url(#${maskId})`, WebkitMaskImage: `url(#${maskId})`,
        '--center-nav-glass-fill': `rgba(190, 200, 205, ${settings.frost})`,
        '--center-nav-refraction': `url("#${refractionId}")`, '--center-nav-material-blur': `${settings.blur}px` }} />
    <svg className="center-nav-glass-highlights" width="840" height="860" aria-hidden="true">
      {silhouetteId && <use href={`#${silhouetteId}`} transform="translate(240 240)" filter={`url(#${rimId})`} />}
    </svg>
    <Liquid
      ref={group}
      className={`center-gooey-group${silhouetteId ? " center-gooey-group--glass-mask" : ""}`}
      blur={6}
      contrast={18}
      fill="#fff"
      filterPadding={240}
    >
      <Liquid.Item
        className="center-gooey-base-item"
        radius={50}
      >
        <div className="center-gooey-base-surface" />
      </Liquid.Item>
      <Liquid.Item observe>
        <div className="center-gooey-menu-panel-surface" />
      </Liquid.Item>
    </Liquid>
    </>
  );
}

export function mountCenterGooeySurface(shell) {
  const host = document.createElement("div");
  host.className = "center-gooey-host";
  host.setAttribute("aria-hidden", "true");
  shell.prepend(host);

  const root = createRoot(host);
  root.render(<GooeySurface />);

  return {
    getPanel() {
      return host.querySelector(".center-gooey-menu-panel-surface");
    },
    syncMaterial() { syncCenterGlassMaterial(host); },
    destroy() {
      root.unmount();
      host.remove();
    },
  };
}
