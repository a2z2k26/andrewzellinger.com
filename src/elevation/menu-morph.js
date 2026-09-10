// Keep the approved bud -> neck -> panel poses, but carry velocity through
// them instead of restarting ease-in-out at every pose. One sampled path is
// played in either direction, including interruptions.
export const MENU_MORPH_DURATION_MS = 900;
const POSES = [
  [0, 36, 36, 0],
  [.2, 36.5, 36.5, 50],
  [.4, 96, 112, 88],
  [.6, 176, 200, 132],
  [.8, 232, 252, 198],
  [1, 280, 320, 238],
];
const TIMES = POSES.map(pose => pose[0]);
const clamp01 = value => Math.max(0, Math.min(1, value));
const smoothstep = value => { const t = clamp01(value); return t * t * (3 - 2 * t); };

// Shape-preserving cubic Hermite interpolation: common tangents on both
// sides of each pose, no overshoot, and zero velocity only at the endpoints
// or a genuine direction change (the radius's round-to-rectangular peak).
function curve(values) {
  const slopes = values.slice(1).map((value, i) => (value - values[i]) / (TIMES[i + 1] - TIMES[i]));
  const tangents = values.map((_, i) => {
    if (i === 0 || i === values.length - 1) return 0;
    const left = slopes[i - 1], right = slopes[i];
    return left * right <= 0 ? 0 : 2 * left * right / (left + right);
  });
  return progress => {
    const p = clamp01(progress);
    const i = Math.min(TIMES.length - 2, Math.max(0, TIMES.findIndex(time => time > p) - 1));
    if (p === 1) return values.at(-1);
    const span = TIMES[i + 1] - TIMES[i], t = (p - TIMES[i]) / span;
    const t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * values[i]
      + (t3 - 2 * t2 + t) * span * tangents[i]
      + (-2 * t3 + 3 * t2) * values[i + 1]
      + (t3 - t2) * span * tangents[i + 1];
  };
}

export function menuMorphFrames(geometry) {
  const widths = POSES.map(pose => pose[1] * geometry.scale);
  const heights = POSES.map(pose => pose[2] * geometry.panelHeight / 320);
  const radii = POSES.map((_, i) => i < 4 ? Math.min(widths[i], heights[i]) / 2 : (i === 4 ? 64 : 56) * geometry.scale);
  const widthAt = curve(widths), heightAt = curve(heights), radiusAt = curve(radii);
  const travelAt = curve(POSES.map(pose => pose[3] * geometry.travel / 238));
  return Array.from({length:181}, (_, i) => {
    const offset = i / 180, width = widthAt(offset), height = heightAt(offset);
    return {
      offset, width: `${width}px`, height: `${height}px`,
      // Animate the actual used radius. A 999px sentinel stays browser-clamped
      // for most of a segment, then collapses abruptly near its end.
      borderRadius: `${Math.max(0, Math.min(radiusAt(offset), width / 2, height / 2))}px`,
      transform: `translate(-50%, calc(-50% - ${travelAt(offset)}px))`,
      easing: 'linear',
    };
  });
}

export function menuListFrames(scale) {
  return Array.from({length:181}, (_, i) => ({
    offset:i / 180,
    marginTop:`${40 * scale * (1 - smoothstep((i / 180 - .8) / .2))}px`,
    easing:'linear',
  }));
}

export function menuIconProgress(progress) {
  return smoothstep(progress / .27);
}

export function menuFillOpacity(progress) {
  return 1 - .4 * smoothstep(progress);
}
