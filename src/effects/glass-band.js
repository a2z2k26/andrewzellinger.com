/**
 * Top/bottom glass-band post-process.
 *
 * Cloned from AZRAEL's `src/components/home/glassBand.ts` on 2026-09-03.
 * The source repository remains read-only. This local copy keeps the
 * original refraction, circular edge sag, dispersion, and colour handling;
 * only TypeScript annotations and the parked click-ripple path were removed.
 */
import * as THREE from "three";

// Reversible global switch for the viewport-edge bands only. The separate
// center navigation lens does not read this flag.
export const GLASS_BANDS_ENABLED = true;

export const GLASS = {
  band: 0.08,
  bandReductionPx: 24,
  strength: 1.5,
  curve: 1,
  chromatic: 0.03,
};

export function glassBandFractionForHeight(viewportHeight) {
  const safeHeight = Math.max(1, viewportHeight);
  const reducedBandHeight = Math.max(
    0,
    safeHeight * GLASS.band - GLASS.bandReductionPx,
  );
  return reducedBandHeight / safeHeight;
}

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform float uBandTop;
  uniform float uBandBottom;
  uniform float uStrength;
  uniform float uCurve;
  uniform float uChromatic;
  varying vec2 vUv;

  float sag(float t) {
    t = clamp(pow(t, uCurve), 0.0, 1.0);
    return 1.0 - sqrt(1.0 - t * t);
  }

  void main() {
    vec2 uv = vUv;
    vec2 displacement = vec2(0.0);

    if (uBandTop > 0.0 && uv.y > 1.0 - uBandTop) {
      float t = (uv.y - (1.0 - uBandTop)) / uBandTop;
      float edge = sag(t);
      displacement.y -= edge * uBandTop * uStrength;
    } else if (uBandBottom > 0.0 && uv.y < uBandBottom) {
      float t = (uBandBottom - uv.y) / uBandBottom;
      float edge = sag(t);
      displacement.y += edge * uBandBottom * uStrength;
    }

    float distanceMoved = length(displacement);
    uv = clamp(uv + displacement, 0.0, 1.0);

    vec4 colour;
    if (distanceMoved < 1e-5 || uChromatic == 0.0) {
      colour = texture2D(tDiffuse, uv);
    } else {
      vec2 direction = displacement / distanceMoved;
      vec3 accumulated = vec3(0.0);
      vec3 weightSum = vec3(0.0);
      float alphaAccumulated = 0.0;
      float alphaWeight = 0.0;

      for (int i = 0; i < 16; i++) {
        float t = float(i) / 15.0;
        vec3 weight = vec3(
          smoothstep(0.8, 0.2, t),
          smoothstep(0.0, 0.5, t) * smoothstep(1.0, 0.5, t),
          smoothstep(0.2, 0.8, t)
        );
        float shift = (t - 0.5) * uChromatic * distanceMoved * 30.0;
        vec4 sampleColour = texture2D(
          tDiffuse,
          clamp(uv + direction * shift, 0.0, 1.0)
        );
        accumulated += sampleColour.rgb * weight;
        weightSum += weight;
        float scalarWeight = weight.r + weight.g + weight.b;
        alphaAccumulated += sampleColour.a * scalarWeight;
        alphaWeight += scalarWeight;
      }

      colour = vec4(accumulated / weightSum, alphaAccumulated / alphaWeight);
    }

    vec3 straight = colour.a > 0.0001 ? colour.rgb / colour.a : vec3(0.0);
    gl_FragColor = vec4(straight, colour.a);
    #include <colorspace_fragment>
    gl_FragColor.rgb *= gl_FragColor.a;
  }
`;

export function createGlassBand() {
  const target = new THREE.WebGLRenderTarget(1, 1, {
    samples: 4,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  });
  target.texture.colorSpace = THREE.LinearSRGBColorSpace;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: target.texture },
      uBandTop: { value: GLASS.band },
      uBandBottom: { value: GLASS.band },
      uStrength: { value: 0 },
      uCurve: { value: GLASS.curve },
      uChromatic: { value: GLASS.chromatic },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  });

  const scene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  scene.add(quad);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  let width = 0;
  let height = 0;

  return {
    target,
    material,
    scene,
    camera,
    resize(nextWidth, nextHeight) {
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      target.setSize(nextWidth, nextHeight);
    },
    dispose() {
      target.dispose();
      material.dispose();
      quad.geometry.dispose();
    },
  };
}
