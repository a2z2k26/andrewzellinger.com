import test from "node:test";
import assert from "node:assert/strict";
import {
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
  assert.equal(boundaryProgress(900, 1000), 0);
  assert.equal(boundaryProgress(500, 1000), .5);
  assert.equal(boundaryProgress(100, 1000), 1);
});

test("motionFrame resolves outgoing and incoming media and copy", () => {
  assert.deepEqual(motionFrame(0, false), {
    outgoingMediaScale: 1,
    outgoingMediaY: 0,
    outgoingShade: 0,
    outgoingCopyY: 0,
    outgoingCopyOpacity: 1,
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
  assert.equal(end.outgoingCopyOpacity, 0);
  assert.equal(end.incomingMediaScale, 1);
  assert.equal(end.incomingMediaY, 0);
  assert.equal(end.incomingReveal, 1);
  assert.equal(end.incomingTitleOpacity, 1);
  assert.equal(end.incomingMetaOpacity, 1);
  assert.equal(end.incomingLedeOpacity, 1);
  assert.ok(motionFrame(.5, true).incomingMediaY < motionFrame(.5, false).incomingMediaY);
});
