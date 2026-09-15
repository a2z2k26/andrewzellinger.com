# Projects return modal layering QA

Date: September 14, 2026

## Symptom and root cause

On a desktop navigation from Articles back to Projects, the introduction modal began its 240ms entrance while the cross-document Projects return transition was still active. The modal used `z-index: 10000`, but cross-document view-transition snapshots paint in the browser's top layer above every normal DOM stacking context. The returning carousel therefore painted over the partially visible modal until the transition finished, creating the observed jump from underneath the content to the correct top position.

The red-capable Playwright probe sampled every animation frame during `pagereveal`. Before the fix, the modal became visible about 61–65ms after arrival and overlapped the active browser transition for 88–94 sampled frames at 1440px. The same probe had no overlap at 390px.

## Changed behavior

`src/welcome-preface.js` now registers an early `pagereveal` gate. If an incoming cross-document view transition exists, the modal is not mounted until `event.viewTransition.finished` settles. If no transition exists, including direct Projects loads, unsupported browsers and reduced-motion navigation, mounting remains immediate. The modal's accepted entrance animation, contents, focus lock, dismissal behavior, title-cascade handoff and carousel choreography are unchanged.

The production browser suite now asserts that no modal opacity above 0.01 occurs while the incoming Projects return transition is pending.

## Visual evidence

- [Before: modal painting beneath the Articles-to-Projects transition](../../artifacts/qa/modal-layering/before-desktop-return.png)
- [After: return transition paints with the modal intentionally absent](../../artifacts/qa/modal-layering/after-desktop-return-during-transition.png)
- [After: modal enters topmost once the browser top layer clears](../../artifacts/qa/modal-layering/after-desktop-return-modal-topmost.png)

All screenshots use a 1440×900 viewport and the same Articles-to-Projects navigation path.

## Verification

- Original 1440px Playwright repro: zero overlapping frames after the fix.
- 390px Projects return: zero overlapping frames after the fix.
- Regression seam: `scripts/check-browser.mjs`, “Projects introduction waits for the return transition top layer”.
- Required repository checks: recorded after the final production build in the implementation report.

Browser emulation does not replace physical-device review. The regression directly covers Chromium's cross-document view-transition top layer, which is the mechanism that caused this defect.
