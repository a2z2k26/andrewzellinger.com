const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const XLINK_NAMESPACE = "http://www.w3.org/1999/xlink";
const FILTER_ID = "dom-liquid-glass";
const MAP_SIZE = 128;

export const DOM_GLASS_DEFAULTS = Object.freeze({
  refraction: 40,
  chromatic: 2,
  falloff: 2.4,
  warp: 0.6,
  frost: 0,
  blur: 1,
  rim: 0.27,
  shadow: 0.54,
  shadowBlur: 48,
});

function createDisplacementMap(falloffExponent, warpStrength) {
  const canvas = document.createElement("canvas");
  canvas.width = MAP_SIZE;
  canvas.height = MAP_SIZE;
  const context = canvas.getContext("2d");
  const image = context.createImageData(MAP_SIZE, MAP_SIZE);

  for (let y = 0; y < MAP_SIZE; y += 1) {
    for (let x = 0; x < MAP_SIZE; x += 1) {
      const nx = (x / (MAP_SIZE - 1)) * 2 - 1;
      const ny = (y / (MAP_SIZE - 1)) * 2 - 1;
      const radius = Math.hypot(nx, ny);
      const parabolic = radius < 1
        ? Math.pow(1 - radius * radius, falloffExponent)
        : 0;
      const waveX = Math.sin((ny * 1.65 + nx * 0.35) * Math.PI) * warpStrength;
      const waveY = Math.sin((nx * 1.45 - ny * 0.3) * Math.PI) * warpStrength;
      const displacementX = Math.max(-1, Math.min(1, (nx + waveX) * parabolic));
      const displacementY = Math.max(-1, Math.min(1, (ny + waveY) * parabolic));
      const offset = (y * MAP_SIZE + x) * 4;
      image.data[offset] = Math.round((0.5 + displacementX * 0.5) * 255);
      image.data[offset + 1] = Math.round((0.5 + displacementY * 0.5) * 255);
      image.data[offset + 2] = 128;
      image.data[offset + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

function createFilterHost() {
  const host = document.createElementNS(SVG_NAMESPACE, "svg");
  host.classList.add("dom-glass-filter-definitions");
  host.setAttribute("aria-hidden", "true");
  host.innerHTML = `
    <defs>
      <filter id="${FILTER_ID}" x="-75%" y="-75%" width="250%" height="250%" color-interpolation-filters="sRGB">
        <feImage id="glass-displacement-map" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
        <feDisplacementMap id="glass-red-displacement" in="SourceGraphic" in2="map" scale="52" xChannelSelector="R" yChannelSelector="G" result="red-shift" />
        <feDisplacementMap id="glass-green-displacement" in="SourceGraphic" in2="map" scale="42" xChannelSelector="R" yChannelSelector="G" result="green-shift" />
        <feDisplacementMap id="glass-blue-displacement" in="SourceGraphic" in2="map" scale="32" xChannelSelector="R" yChannelSelector="G" result="blue-shift" />
        <feColorMatrix in="red-shift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red-channel" />
        <feColorMatrix in="green-shift" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green-channel" />
        <feColorMatrix in="blue-shift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue-channel" />
        <feBlend in="red-channel" in2="green-channel" mode="screen" result="red-green" />
        <feBlend in="red-green" in2="blue-channel" mode="screen" />
      </filter>
    </defs>`;
  document.body.append(host);
  return host;
}

function ensureFilterHost() {
  const existingFilter = document.getElementById(FILTER_ID);
  if (existingFilter) return existingFilter.closest("svg");
  return createFilterHost();
}

function setHref(element, value) {
  element.setAttribute("href", value);
  element.setAttributeNS(XLINK_NAMESPACE, "href", value);
}

export function applyDomGlassSettings(lens, values = DOM_GLASS_DEFAULTS) {
  const settings = { ...DOM_GLASS_DEFAULTS, ...values };
  const map = document.querySelector("#glass-displacement-map");
  const red = document.querySelector("#glass-red-displacement");
  const green = document.querySelector("#glass-green-displacement");
  const blue = document.querySelector("#glass-blue-displacement");
  if (!map || !red || !green || !blue) return;

  setHref(map, createDisplacementMap(settings.falloff, settings.warp));
  red.setAttribute("scale", String(settings.refraction + settings.chromatic));
  green.setAttribute("scale", String(settings.refraction));
  blue.setAttribute("scale", String(Math.max(0, settings.refraction - settings.chromatic)));
  lens.style.setProperty("--lens-rim", String(settings.rim));
  lens.style.setProperty("--lens-frost", String(settings.frost));
  lens.style.setProperty("--lens-blur", `${settings.blur}px`);
  lens.style.setProperty("--lens-shadow", String(settings.shadow));
  lens.style.setProperty("--lens-shadow-blur", `${settings.shadowBlur}px`);
  document.documentElement.dataset.glassLensTuning = JSON.stringify(settings);
}

export function mountDomGlassLens(lens) {
  if (!lens) return () => {};
  const host = ensureFilterHost();
  lens.classList.add("dom-glass-lens-effect");
  lens.dataset.plusMaterial = "liquid-glass";
  applyDomGlassSettings(lens);
  document.documentElement.dataset.glassLens = "active";
  document.documentElement.dataset.backdropSvgFilter = String(
    CSS.supports("backdrop-filter", `url("#${FILTER_ID}")`),
  );

  return () => {
    lens.classList.remove("dom-glass-lens-effect");
    delete lens.dataset.plusMaterial;
    delete document.documentElement.dataset.glassLens;
    delete document.documentElement.dataset.glassLensTuning;
    delete document.documentElement.dataset.backdropSvgFilter;
    if (host?.classList.contains("dom-glass-filter-definitions")) host.remove();
  };
}
