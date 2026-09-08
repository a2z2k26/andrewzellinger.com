/**
 * DOM-first surface adapter for the AZRAEL glass-band shader.
 *
 * The document remains the layout, interaction and accessibility authority.
 * Participating text and media surfaces are copied into a transparent Three.js
 * layer; their DOM paint is hidden only after the corresponding texture is
 * ready, matching AZRAEL's surface-plane handoff.
 * WebGL failure or context loss immediately restores normal DOM rendering.
 */
import * as THREE from "three";
import {
  createGlassBand,
  glassBandFractionForHeight,
  GLASS,
  GLASS_BANDS_ENABLED,
} from "./glass-band.js";
import "./glass-surface.css";

const TEXT_SELECTOR = [
  ".title .heading",
  ".articles-entry__meta",
  ".articles-entry__title",
  ".articles-entry__excerpt",
  ".biography-introduction__lead",
  ".biography-introduction__practice-label",
  ".biography-introduction__practice-body",
  ".biography-block__label",
  ".biography-prose p",
  ".biography-experience-section__heading",
  ".biography-experience__row",
  ".biography-capability__label",
  ".biography-capability__items",
  ".biography-clients__label",
  ".biography-clients__list",
  ".biography-contact__label",
  ".biography-contact__link",
  ".detail-unit__section",
  ".detail-unit__article-body",
].join(",");

const MEDIA_SELECTOR = [
  ".index-media-placeholder",
  ".articles-entry__thumbnail",
  ".biography-portrait-placeholder",
].join(",");

const SURFACE_SELECTOR = `${TEXT_SELECTOR},${MEDIA_SELECTOR}`;

const SURFACE_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SURFACE_FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform vec2 uUvScale;
  uniform vec2 uUvOffset;
  varying vec2 vUv;
  void main() {
    vec2 coverUv = vUv * uUvScale + uUvOffset;
    vec4 sampled = texture2D(uMap, coverUv);
    gl_FragColor = vec4(sampled.rgb, sampled.a * uOpacity);
    #include <colorspace_fragment>
  }
`;

const MAX_TEXTURE_SIDE = 4096;
const BAKES_PER_FRAME = 6;
const CULL_MARGIN = 120;
const RUNTIME_KEY = "__caverGlassSurfaceRuntime";
let activeRuntime = null;

function clearGlassSurfaceState() {
  activeRuntime?.destroy();
  activeRuntime = null;
  document.querySelectorAll(".glass-band-canvas").forEach((element) => element.remove());
  document.querySelectorAll(".glass-proxy-text-ready")
    .forEach((element) => {
      element.classList.remove("glass-proxy-text-ready");
    });
  document.querySelectorAll(".glass-proxy-media-ready")
    .forEach((element) => {
      element.classList.remove("glass-proxy-media-ready");
    });
  document.documentElement.removeAttribute("data-glass-bands");
  delete document.documentElement.dataset.glassBands;
}

function backgroundImageUrl(value) {
  if (!value || value === "none") return "";
  const match = value.match(/^url\((['"]?)(.*?)\1\)$/);
  return match?.[2] ?? "";
}

function transformText(text, transform) {
  if (transform === "uppercase") return text.toUpperCase();
  if (transform === "lowercase") return text.toLowerCase();
  return text;
}

function fontString(style, scale) {
  return `${style.fontStyle} ${style.fontWeight} ${parseFloat(style.fontSize) * scale}px ${style.fontFamily}`;
}

function charRuns(rectangles) {
  const runs = [];
  let current = null;
  rectangles.forEach((rectangle, index) => {
    if (!rectangle) {
      current = null;
      return;
    }
    if (current && Math.abs(rectangle.y - current.y) <= 0.5 && index === current.end) {
      current.end = index + 1;
      return;
    }
    current = { start: index, end: index + 1, x: rectangle.x, y: rectangle.y };
    runs.push(current);
  });
  return runs;
}

const ascentCache = new Map();

function bakeText(element, pixelRatio) {
  const box = element.getBoundingClientRect();
  if (box.width < 1 || box.height < 1) return null;

  const ratio = Math.min(
    pixelRatio,
    MAX_TEXTURE_SIDE / Math.max(box.width, box.height),
  );
  const width = Math.max(2, Math.ceil(box.width * ratio));
  const height = Math.max(2, Math.ceil(box.height * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.textBaseline = "alphabetic";
  const layoutScale = element.offsetWidth > 0 ? box.width / element.offsetWidth : 1;
  const supportsLetterSpacing = typeof context.letterSpacing === "string";
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const range = document.createRange();

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.data;
    if (!text.trim()) continue;
    const parent = node.parentElement;
    if (!parent) continue;
    const style = getComputedStyle(parent);
    if (style.visibility !== "visible" || style.display === "none") continue;

    const font = fontString(style, layoutScale);
    const spacing = style.letterSpacing === "normal"
      ? 0
      : parseFloat(style.letterSpacing) * layoutScale;
    const rectangles = new Array(text.length);

    for (let index = 0; index < text.length; index += 1) {
      range.setStart(node, index);
      range.setEnd(node, index + 1);
      const rectangle = range.getClientRects()[0];
      rectangles[index] = rectangle && rectangle.width > 0.01
        ? {
          x: rectangle.left - box.left,
          y: rectangle.top - box.top,
          width: rectangle.width,
        }
        : null;
    }

    context.font = font;
    context.fillStyle = style.color;
    let ascent = ascentCache.get(font);
    if (ascent == null) {
      ascent = context.measureText("Hxg").fontBoundingBoxAscent;
      ascentCache.set(font, ascent);
    }
    if (supportsLetterSpacing) context.letterSpacing = `${spacing}px`;

    for (const run of charRuns(rectangles)) {
      const y = run.y + ascent;
      const value = transformText(text.slice(run.start, run.end), style.textTransform);
      if (supportsLetterSpacing || spacing === 0) {
        context.fillText(value, run.x, y);
      } else {
        for (let index = run.start; index < run.end; index += 1) {
          const rectangle = rectangles[index];
          if (rectangle) {
            context.fillText(
              transformText(text[index], style.textTransform),
              rectangle.x,
              y,
            );
          }
        }
      }
    }
  }

  return canvas;
}

function createTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function elementOpacity(element) {
  const style = getComputedStyle(element);
  if (style.visibility === "hidden" || style.display === "none") return 0;
  let opacity = parseFloat(style.opacity) || 0;
  let parent = element.parentElement;
  while (parent) {
    const parentStyle = getComputedStyle(parent);
    if (parentStyle.visibility === "hidden" || parentStyle.display === "none") return 0;
    opacity *= parseFloat(parentStyle.opacity) || 0;
    if (parent === document.body) break;
    parent = parent.parentElement;
  }
  return opacity;
}

function isNearViewport(rectangle) {
  return rectangle.bottom > -CULL_MARGIN
    && rectangle.top < innerHeight + CULL_MARGIN
    && rectangle.right > -CULL_MARGIN
    && rectangle.left < innerWidth + CULL_MARGIN;
}

function coverUvFor(texture, rectangle) {
  const image = texture?.image;
  const imageWidth = image?.naturalWidth || image?.videoWidth || image?.width || 0;
  const imageHeight = image?.naturalHeight || image?.videoHeight || image?.height || 0;
  if (!imageWidth || !imageHeight || !rectangle.width || !rectangle.height) {
    return {
      scaleX: 1,
      scaleY: 1,
      offsetX: 0,
      offsetY: 0,
    };
  }

  const imageAspect = imageWidth / imageHeight;
  const rectangleAspect = rectangle.width / rectangle.height;
  let scaleX = 1;
  let scaleY = 1;

  if (imageAspect > rectangleAspect) {
    scaleX = rectangleAspect / imageAspect;
  } else {
    scaleY = imageAspect / rectangleAspect;
  }

  return {
    scaleX,
    scaleY,
    offsetX: (1 - scaleX) / 2,
    offsetY: (1 - scaleY) / 2,
  };
}

export function initGlassSurface() {
  const previousRuntime = window[RUNTIME_KEY];
  previousRuntime?.destroy?.();
  if (activeRuntime && activeRuntime !== previousRuntime) activeRuntime.destroy();
  activeRuntime = null;
  document.querySelectorAll(".glass-band-canvas").forEach((element) => element.remove());

  const host = document.createElement("div");
  host.className = "glass-band-canvas";
  host.setAttribute("aria-hidden", "true");
  document.body.append(host);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    host.remove();
    return () => {};
  }

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  host.append(renderer.domElement);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
  camera.position.z = 1;
  const scene = new THREE.Scene();
  const planeGeometry = new THREE.PlaneGeometry(1, 1);
  const glass = createGlassBand();
  const entries = new Map();
  const mediaTextures = new Map();
  const resizeObserver = new ResizeObserver((records) => {
    records.forEach(({ target }) => {
      const entry = entries.get(target);
      if (entry) entry.dirty = true;
    });
  });

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let animationFrame = 0;
  let scanFrame = 0;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let glassStrength = reducedMotion.matches ? GLASS.strength : 0;
  let contextAvailable = true;

  const setDomPaint = (enabled) => {
    document.documentElement.toggleAttribute("data-glass-bands", enabled);
    if (enabled) document.documentElement.dataset.glassBands = "active";
    else delete document.documentElement.dataset.glassBands;
  };

  const release = (element) => {
    const entry = entries.get(element);
    if (!entry) return;
    resizeObserver.unobserve(element);
    scene.remove(entry.mesh);
    if (entry.ownsTexture) entry.texture?.dispose();
    entry.material.dispose();
    element.classList.remove("glass-proxy-text-ready");
    element.classList.remove("glass-proxy-media-ready");
    entries.delete(element);
  };

  const mediaTexture = (element) => {
    const style = getComputedStyle(element);
    const source = element instanceof HTMLImageElement
      ? element.currentSrc || element.src
      : backgroundImageUrl(style.backgroundImage);
    if (!source) return null;

    const absoluteSource = new URL(source, window.location.href).href;
    let record = mediaTextures.get(absoluteSource);
    if (!record) {
      record = { texture: null, state: "loading" };
      mediaTextures.set(absoluteSource, record);
      record.texture = new THREE.TextureLoader().load(
        absoluteSource,
        () => {
          record.state = "ready";
          for (const entry of entries.values()) {
            if (entry.kind === "media") entry.dirty = true;
          }
        },
        undefined,
        () => {
          record.state = "error";
        },
      );
      record.texture.colorSpace = THREE.SRGBColorSpace;
      record.texture.minFilter = THREE.LinearFilter;
      record.texture.magFilter = THREE.LinearFilter;
      record.texture.generateMipmaps = false;
    }

    return record.state === "ready" ? record.texture : null;
  };

  const register = (element) => {
    if (entries.has(element)) return;
    const blank = new THREE.DataTexture(new Uint8Array(4), 1, 1);
    blank.needsUpdate = true;
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: blank },
        uOpacity: { value: 1 },
        uUvScale: { value: new THREE.Vector2(1, 1) },
        uUvOffset: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: SURFACE_VERTEX,
      fragmentShader: SURFACE_FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(planeGeometry, material);
    mesh.frustumCulled = false;
    mesh.visible = false;
    scene.add(mesh);
    const entry = {
      element,
      kind: element.matches(MEDIA_SELECTOR) ? "media" : "text",
      material,
      mesh,
      texture: blank,
      ownsTexture: true,
      dirty: true,
      ready: false,
    };
    entries.set(element, entry);
    resizeObserver.observe(element);
  };

  const scan = () => {
    scanFrame = 0;
    for (const element of [...entries.keys()]) {
      if (!element.isConnected || !element.matches(SURFACE_SELECTOR)) {
        release(element);
      }
    }
    document.querySelectorAll(SURFACE_SELECTOR).forEach((element) => register(element));
  };

  const scheduleScan = () => {
    if (scanFrame) return;
    scanFrame = requestAnimationFrame(scan);
  };

  const rebake = (entry) => {
    const canvas = entry.kind === "text"
      ? bakeText(entry.element, pixelRatio)
      : null;
    const nextTexture = entry.kind === "media"
      ? mediaTexture(entry.element)
      : canvas && createTexture(canvas);
    if (!nextTexture) return false;
    if (entry.ownsTexture) entry.texture.dispose();
    entry.texture = nextTexture;
    entry.ownsTexture = entry.kind !== "media";
    entry.material.uniforms.uMap.value = nextTexture;
    entry.dirty = false;
    entry.ready = true;
    entry.element.classList.add(
      entry.kind === "media" ? "glass-proxy-media-ready" : "glass-proxy-text-ready",
    );
    return true;
  };

  const resize = () => {
    const nextWidth = Math.max(1, innerWidth);
    const nextHeight = Math.max(1, innerHeight);
    const nextPixelRatio = Math.min(2, devicePixelRatio || 1);
    const bandFraction = glassBandFractionForHeight(nextHeight);
    glass.material.uniforms.uBandTop.value = bandFraction;
    glass.material.uniforms.uBandBottom.value = bandFraction;
    if (nextWidth === width && nextHeight === height && nextPixelRatio === pixelRatio) return;
    width = nextWidth;
    height = nextHeight;
    pixelRatio = nextPixelRatio;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    glass.resize(Math.round(width * pixelRatio), Math.round(height * pixelRatio));
    for (const entry of entries.values()) {
      entry.dirty = true;
    }
  };

  const render = () => {
    animationFrame = requestAnimationFrame(render);
    if (!contextAvailable || document.hidden) return;
    resize();

    let bakes = 0;
    for (const entry of entries.values()) {
      const { element, mesh, material } = entry;
      if (!element.isConnected) {
        mesh.visible = false;
        continue;
      }
      const rectangle = element.getBoundingClientRect();
      const visible = rectangle.width > 0 && rectangle.height > 0 && isNearViewport(rectangle);
      if (!visible) {
        mesh.visible = false;
        continue;
      }
      if (entry.dirty && bakes < BAKES_PER_FRAME && rebake(entry)) bakes += 1;
      if (!entry.ready) {
        mesh.visible = false;
        continue;
      }

      mesh.position.set(
        rectangle.left + rectangle.width / 2 - width / 2,
        height / 2 - rectangle.top - rectangle.height / 2,
        0,
      );
      mesh.scale.set(rectangle.width, rectangle.height, 1);
      material.uniforms.uOpacity.value = elementOpacity(element);
      if (entry.kind === "media") {
        const uv = coverUvFor(entry.texture, rectangle);
        material.uniforms.uUvScale.value.set(uv.scaleX, uv.scaleY);
        material.uniforms.uUvOffset.value.set(uv.offsetX, uv.offsetY);
      } else {
        material.uniforms.uUvScale.value.set(1, 1);
        material.uniforms.uUvOffset.value.set(0, 0);
      }
      mesh.visible = material.uniforms.uOpacity.value > 0.002;
    }

    if (reducedMotion.matches) glassStrength = GLASS.strength;
    else glassStrength += (GLASS.strength - glassStrength) * 0.15;
    glass.material.uniforms.uStrength.value = glassStrength;
    renderer.setRenderTarget(glass.target);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(glass.scene, glass.camera);
  };

  const mutationObserver = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "characterData") {
        let parent = record.target.parentElement;
        while (parent) {
          const entry = entries.get(parent);
          if (entry) {
            entry.dirty = true;
            break;
          }
          parent = parent.parentElement;
        }
      }
    }
    scheduleScan();
  });
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  const onContextLost = (event) => {
    event.preventDefault();
    contextAvailable = false;
    setDomPaint(false);
  };
  const onContextRestored = () => {
    contextAvailable = true;
    glassStrength = 0;
    setDomPaint(true);
  };
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);
  renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);

  scan();
  document.fonts?.ready.then(() => {
    for (const entry of entries.values()) {
      entry.dirty = true;
    }
  });
  setDomPaint(true);
  animationFrame = requestAnimationFrame(render);

  let destroyed = false;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(animationFrame);
    cancelAnimationFrame(scanFrame);
    mutationObserver.disconnect();
    resizeObserver.disconnect();
    renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
    renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);
    for (const element of [...entries.keys()]) release(element);
    for (const record of mediaTextures.values()) record.texture?.dispose();
    mediaTextures.clear();
    planeGeometry.dispose();
    glass.dispose();
    renderer.dispose();
    host.remove();
    setDomPaint(false);
    if (activeRuntime?.destroy === destroy) activeRuntime = null;
    if (window[RUNTIME_KEY]?.destroy === destroy) delete window[RUNTIME_KEY];
  };

  activeRuntime = { destroy };
  window[RUNTIME_KEY] = activeRuntime;
  window.addEventListener("pagehide", destroy, { once: true });
  return destroy;
}

function start() {
  if (!GLASS_BANDS_ENABLED) {
    clearGlassSurfaceState();
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGlassSurface, { once: true });
  } else {
    initGlassSurface();
  }
}

start();

if (import.meta.hot) {
  import.meta.hot.dispose(() => activeRuntime?.destroy());
}
