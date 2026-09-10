import test from "node:test";
import assert from "node:assert/strict";
import {
  articleCopyFrame,
  boundaryProgress,
  clamp01,
  motionFrame,
  rangeProgress,
} from "../src/detail-motion-values.js";

test("clamp01 and rangeProgress clamp reversible progress", () => {
  assert.equal(clamp01(-1), 0);
  assert.equal(clamp01(2), 1);
  assert.equal(rangeProgress(.5, .25, .75), .5);
  assert.equal(rangeProgress(.1, .25, .75), 0);
  assert.equal(rangeProgress(.9, .25, .75), 1);
});

test("boundaryProgress maps the next media through the transition window", () => {
  assert.equal(boundaryProgress(1000, 1000), 0);
  assert.equal(boundaryProgress(550, 1000), .5);
  assert.equal(boundaryProgress(100, 1000), 1);
});

test("boundary motion engages as soon as incoming media crosses the viewport edge", () => {
  assert.equal(boundaryProgress(1000, 1000), 0);
  assert.ok(boundaryProgress(999, 1000) > 0);
});

test("motionFrame resolves outgoing and incoming media and incoming copy", () => {
  assert.deepEqual(motionFrame(0, false), {
    outgoingMediaScale: 1,
    outgoingMediaY: 0,
    outgoingShade: 0,
    incomingMediaScale: 1.04,
    incomingMediaY: 40,
    incomingReveal: 0,
    incomingTitleY: 24,
    incomingTitleOpacity: 0,
    incomingMetaY: 18,
    incomingMetaOpacity: 0,
    incomingLedeY: 14,
    incomingLedeOpacity: 0,
  });
  const end = motionFrame(1, false);
  assert.equal(end.outgoingMediaScale, .96);
  assert.equal(end.incomingMediaScale, 1);
  assert.equal(end.incomingMediaY, 0);
  assert.equal(end.incomingReveal, 1);
  assert.equal(end.incomingTitleOpacity, 1);
  assert.equal(end.incomingMetaOpacity, 1);
  assert.equal(end.incomingLedeOpacity, 1);
  assert.ok(motionFrame(.5, true).incomingMediaY < motionFrame(.5, false).incomingMediaY);
});

test("incoming media reveals immediately and resolves before its copy", () => {
  const justInside = motionFrame(.01, false);
  const imageComplete = motionFrame(.65, false);

  assert.ok(justInside.incomingReveal > 0);
  assert.equal(imageComplete.incomingReveal, 1);
  assert.equal(imageComplete.incomingTitleOpacity, 0);
});

test("article copy resolves in the lower viewport entry zone", () => {
  const atEdge = articleCopyFrame(0, false);
  const beforeMidpoint = articleCopyFrame(.3, false);

  assert.equal(atEdge.incomingTitleOpacity, 0);
  assert.equal(atEdge.incomingMetaOpacity, 0);
  assert.equal(atEdge.incomingLedeOpacity, 0);
  assert.equal(beforeMidpoint.incomingTitleOpacity, 1);
  assert.equal(beforeMidpoint.incomingMetaOpacity, 1);
  assert.equal(beforeMidpoint.incomingLedeOpacity, 1);
  assert.equal(articleCopyFrame(.278, false).incomingLedeOpacity, 1);
  assert.ok(articleCopyFrame(.1, false).incomingTitleOpacity > 0);
});
