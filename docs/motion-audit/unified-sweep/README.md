# One upward rail-sweep system

September 8, 2026. Implemented only in the isolated design-elevation experiment. Main remains untouched.

Andrew's review supersedes the original route-specific T1/T2 proposal. All twelve distinct ordered transitions among Home, Projects, Articles, and History now share the successful full-right-rail sweep: old content leaves upward, new content arrives from below, and Projects/Articles continue upward at baseline speed. Left titles counter-move downward, with the same duration, easing, and stagger regardless of destination or Back/Forward direction. Desktop duration remains 850ms plus a 70ms stagger; compact duration remains 580ms plus 40ms. The menu, identity, clock, and seam remain stationary.

## Implementation

- `counterflow-model.js` classifies every top-level pair. Same-route, cross-origin, and detail transitions are excluded.
- `counterflow.js` names the actual rendered surfaces for native cross-document View Transitions. All three page entries register before first paint. Destination media preparation uses each route's actual imagery and has a bounded timeout.
- History captures one viewport of its real content, retaining document height and the exact reading offset. Temporary fixed positioning and names are removed on completion, skip, interruption, and resize; no content is duplicated or rasterized into permanent UI.
- Arrival resets collection direction and impulse without moving its current phase or clearing user/focus pauses. User input can change direction again after the transition.
- Hard navigation pauses stop active smooth-scroll tweens and suppress ordinary scrolling while the snapshot is frozen. User-only autoplay Pause still allows browsing. Browser shortcuts and native mobile History remain intact.
- Pending destination preparation is cancelled on pagehide, preventing an old preparation from redirecting a restored page later.
- Existing project/article detail entry, close, and reading animations remain outside this change. Unsupported and reduced-motion navigation retain their fallback.

## Browser verification

Codex in-app Chromium, local development preview. All 12 ordered desktop pairs were exercised at 1440×1000. Each reported the upward rule during animation and returned to idle with zero retained transition names, no horizontal overflow, and upward collection continuation where applicable. Matching `from-to-mid.png` captures accompany this report.

| From | Destinations verified |
| --- | --- |
| Home | Projects, Articles, History |
| Projects | Home, Articles, History |
| Articles | Home, Projects, History |
| History | Home, Projects, Articles |

Additional checks:

- History Back after scrolling 4227px restored exactly 4227px. Attempted wheel input during arrival did not change that position. `history-scrolled-before.png` and `history-back-end.png` show matching reading geometry; `history-back-mid.png` records the transfer.
- Projects was deliberately moving downward before departure. Back returned it to upward baseline with no direction reversal after arrival.
- Pausing Projects, then opening Articles, retained the explicit pause (Resume motion control); resuming remained functional.
- Menu-driven Home→Articles→History at 390×844; History→Projects at 834×1112 and 992×900. No overflow or retained transition styles. Mobile History remains native; collections remain static below 992px.
- Development reduced-motion History departure used ordinary navigation with no sweep marker. OS-level preference switching remains a separate unverified case.
- Final inspected browser warnings/errors: none.

## Evidence and limits

The root [design QA](../../../design-qa.md) records source/implementation comparisons, image dimensions, fidelity surfaces, and iteration history. Main is still at the accepted baseline; no merge, commit, push, or deployment was performed in this pass.

Source suite: 139/139 passing. Production build, seven Sites packaging tests, and whitespace checks pass. Safari/Firefox, physical touch/safe-area devices, constrained-device frame profiling, throttled media, and proof of actual bfcache admission remain unverified. Back/Forward behavior was exercised, but does not establish which caching mode the browser chose.

The original A1/A2 report and six-family proposal remain historical records. They are not the current top-level motion specification. Andrew's visual acceptance of this unified version remains the review gate.
