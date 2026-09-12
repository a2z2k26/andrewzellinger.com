# Page-title cascade

Implemented only in the design-elevation worktree. Main is not merged or modified.

## Motion contract

- Fixed masks; outgoing letters move downward with left-to-right stagger. Incoming letters start above their masks after the complete outgoing title has cleared.
- GSAP owns timing, stagger, and easing. Eight-letter desktop titles take approximately 925ms end-to-end; compact titles take approximately 725ms. Easing contains no bounce or overshoot.
- The existing upward right-rail sweep, viewport captures, autoplay handoff, stable chrome, route boundaries, and detail-reading transitions remain unchanged.
- Direct/fallback title motion animates DOM characters. Native cross-document transitions capture independently named character masks; GSAP drives paused browser snapshot animation clocks, since direct DOM animation would be hidden underneath the transition layer.
- Mask padding with equal negative margins provides descender and glyph-edge clearance without changing title geometry. Home exposes one accessible Designer heading, not duplicated responsive text.
- Projects shares Home's source document. Canonical route text now resolves before splitting. The later DOMContentLoaded setup and detail chrome only assign text if the label differs, preserving existing character masks and their capture names.
- Same-heading collection/detail entry and Close retain their current behavior rather than introducing a redundant title change.

## Verification

- Live Chromium preview, desktop 1440×1000: outgoing Home letters visibly stagger downward through fixed masks; incoming Projects, Articles, and History stagger from above. Home's g is fully visible at rest with the heading at its prior position.
- After the Projects setup correction, incoming Projects was captured from each of Home, Articles, and History. All eight incoming character snapshots were present, with stagger visible at roughly 580–600ms. Temporary snapshot-count instrumentation was removed after verification.
- Browser Back from History to Articles showed the incoming cascade. Projects to Home returned to a complete, unclipped Designer heading.
- Phone 390×844: Home's complete g remains visible, there is no horizontal overflow, and Home to Projects visibly cascades through compact masks alongside the existing media handoff.
- Direct-loaded case study to Home also visibly cascaded at 1440×1000. The development reduced-motion override on Projects yielded eight untransformed characters, no capture names, and an idle transition. Browser console error checks were empty. The viewport override was reset afterward.
- Automated coverage executes a real GSAP timeline against paused snapshot animations, checks stagger order and the clear-before-enter boundary, verifies cancellation, and tests canonical Projects capture surviving repeat/late same-label initialization. Existing navigation-intent, detail, motion, and packaging regressions remain included.
- Full Node suite: 162 passing tests. Production build and all seven Sites packaging tests pass. Local preview evidence is not a deployment or a new cross-browser certification.

## Remaining boundary

Safari/Firefox, physical devices, and OS-level reduced-motion toggles have not been visually recertified in this pass. User judgment remains the visual acceptance gate.
