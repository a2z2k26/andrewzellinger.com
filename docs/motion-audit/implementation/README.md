# Stabilization and Counterflow proof

**Historical first pass.** Andrew subsequently approved the sweep itself but rejected its downward/right-rail direction and inconsistent route coverage. The [unified upward sweep](../unified-sweep/README.md) is now implemented for all four top-level pages; the original A2 limits and T2 next-step recommendation below are superseded.

September 8, 2026. Local experiment only; main is unchanged. This is A1 plus A2 from the approved [motion brief](../motion-proposal.md), not completion of all six transition families.

Preview: http://127.0.0.1:5179/

## Implemented

- Home ↔ Projects now exchanges the real title and media surfaces in opposite vertical directions. Reverse exchanges directions and stagger order. The identity, clock, and center control stay visually stationary above the moving surfaces. Desktop travel is 850ms with a 70ms landmark stagger; compact travel is 580ms with a 40ms stagger.
- Native cross-document View Transitions retain ordinary document navigation and history. Unsupported/reduced-motion cases retain normal navigation. No React-router rewrite, copied page DOM, or new content source was introduced.
- Destination lead imagery is prewarmed and decoded before an eligible click commits. A bounded 1.6-second readiness check shows a quiet status while keeping the current page usable; decode failure/timeout uses ordinary navigation.
- Navigation pauses the collection track for snapshot consistency. Cancellation clears obsolete navigation callbacks; viewport changes safely settle the native transition. Destination focus is applied only if the reader has not focused something else.
- The menu no longer plays a reverse morph on untouched initialization. Its panel is fitted to four complete 44px link targets, not scaled independently of its text. Short desktops use the same bottom-centered origin as compact layouts, with a 16px final surface-to-button gap.
- Collection metadata now renders at full opacity in the existing subdued-gray token. Page-heading sizes are continuous across 991/992px.
- Mobile has a protected opaque bottom control region rather than a bare circle over live prose. The redundant desktop detail Back label is removed; the accessible Close action remains.
- Pause/Resume motion is exposed for desktop Projects and Articles. Explicit pause survives document navigation; direct browsing still works while autoplay is paused. Focus, hidden-document, and navigation pauses compose without overriding that preference.
- Detail resize restores a semantic paragraph/list-item anchor. Cached documents reattach listeners idempotently. History state also preserves the anchor for a browser Back/reload that creates a new document, without overwriting the originating collection fields.

## Browser evidence

All observations below are from the Codex in-app Chromium browser against the isolated local preview. This is not physical-device or cross-browser certification.

| Check | Result |
| --- | --- |
| Desktop forward and reverse, 1440×1000 | Named native transitions reached `animating`, then `idle`. Saved frame sequences show opposing column travel and a complete stationary control above both. |
| Menu-triggered Home → Projects, 390×844 | Native compact transition ran; destination menu remained closed. Browser Back restored Home with a closed menu. |
| Resize during Home → Projects, 1440→768 | Destination settled to Projects at width 768, no remaining named surfaces or horizontal overflow. |
| Rapid Articles intent → Projects intent | Final URL/title were Projects, with no pending loading indicator or late redirect. |
| Pause preference | Paused track transform remained identical across captures; Resume state persisted across document navigation. Ambient browsing was restored for handoff. |
| Article reflow, 1440→390→1440 | Same paragraph persisted. Desktop paragraph top returned from -41px to exactly -41px. |
| Deep-scroll article Close | Returned to `/articles` with four visible collection cards, not a blank page. |
| Article → Home → browser Back | Initially failed for non-cached navigation; after history-state correction, the same paragraph restored from 64.703px to 65.703px (one-pixel rounding), without heading focus. |
| Menu at 320×568, 390×844, 844×390, 1280×400 | Visually inspected open panels; every link is contained and the fixed control remains reachable. Short-desktop overlapping context copy is suppressed. |
| 991/992 title continuity | Computed sizes 68.379px and 68.448px. No horizontal overflow. |
| Development reduced-motion override | Native/static Articles, zero loop tracks, full-opacity metadata. OS preference switching still needs separate browser/device verification. |
| Wide desktop, 1920×1080 | Home retained its half-width title region and framed right rail; navigation reached the correct endpoint without x-overflow. |
| Console | No errors or warnings in the final inspected navigation session. |

## Visual review artifacts

- [Desktop Home endpoint](./home-desktop-1440.png)
- [Desktop Projects endpoint](./projects-desktop-1440.png)
- [Forward midpoint](./forward-04.png) and [reverse midpoint](./reverse-04.png)
- Complete sampled sequences: `forward-00.png` through `forward-10.png`, `reverse-00.png` through `reverse-11.png`. These are actual successive browser captures, not a frame-rate profile or an exact percentage-timed video.
- [Compact transition midpoint](./phone-forward-mid.png)
- [Phone menu](./menu-phone-390.png), [narrow phone menu](./menu-phone-320.png), [landscape menu](./menu-landscape-844x390.png), [short-desktop menu](./menu-short-desktop.png)
- [Protected phone reading region](./article-detail-phone-390.png), [phone reflow anchor](./article-resize-phone-390.png), [Back-restored article](./article-back-restored.png)
- [Wide desktop](./home-wide-1920.png)

Matched baseline comparisons and iteration history are recorded in the project-root [Design QA](../../../design-qa.md). Original baseline captures remain in `../screenshots/`.

## Engineering checks and limits

The source suite, production build, Sites package tests, and whitespace diff check pass. Exact final counts are recorded in the root QA report. The protected hosting files were not edited. Build output includes the required client, server, and hosting configuration artifacts.

No merge, remote push, deployment, or visual acceptance is implied. The original main checkout remains at `700ba4b88e5ccdd69247d9d8957b122970fb961d`. Experimental source is in `.worktrees/design-elevation` on `codex/design-elevation`.

Still to verify before broad rollout: Safari/Firefox behavior, OS-level reduced-motion changes, actual bfcache admission on each browser, physical touch/safe-area devices, 200% text zoom, throttled cold media, and frame delivery on constrained hardware. Unit coverage for fallback and lifecycle does not substitute for those checks.

## Next review gate

Andrew reviews Home ↔ Projects in both directions, including the compact version. The next implementation stage is T2 Cross-cut and its route mapping, followed by T3 Focus/return, T4 Reading relay, T5 History cadence, and the remaining T6 menu polish. Existing detail/section/menu choreography was not replaced by those proposed families in this pass.
