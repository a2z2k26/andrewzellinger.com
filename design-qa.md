# Design QA

result: passed

## Geist-wide typography experiment — 2026-09-08

result: passed

- Scope: every visible selector previously assigned Times Newer Roman now uses Geist Sans Medium (`500`) while preserving its existing size, line height, tracking, capitalization, and layout.
- Updated surfaces: global page headings, Projects and Articles collection titles, detail titles, the History editorial lead, generic detail ledes, and generic detail-section prose.
- The Times Newer Roman asset and display token remain dormant for a reversible rollback; no visible selector references them.
- Browser check: Codex in-app browser at 668 × 907 on Home, Projects, Articles, one Article Detail, and History.
- Computed styles verified in the first title pass: page, project, article, and detail titles resolve to `Geist, sans-serif` at weight `500`; the expanded History and detail-prose pass is verified separately below.
- Visual check: title geometry, wrapping, spacing, media layout, and center-control placement remained intact at the tested viewport.
- Focused typography regression tests: 20 of 20 passed. Full suite: 91 of 91 passed. Production build and Sites packaging checks: passed.
- Expanded browser check: History lead resolves to `Geist, sans-serif` at weight `500`; the case-study detail contains zero visible elements whose computed font family includes Times. Existing Geist-specific description and body overrides remain regular weight, preserving their prior hierarchy.

## Center navigation storyboard pass — 2026-09-08

result: passed

- Visual sources: `Screenshot 2026-09-08 at 3.43.24 PM.png` and `Screenshot 2026-09-08 at 3.44.02 PM.png` supplied by Andrew.
- Implementation: `src/effects/center-control.js`, `src/effects/center-control.css`, and `src/effects/center-gooey-surface.jsx`.
- Comparison artifact: `docs/qa/center-menu-storyboard-comparison-2026-09-08.png`.
- Browser check: Codex in-app browser at 668 × 907 on `http://127.0.0.1:5178/`.
- Open sequence verified as: plus circle, connected bud, same-width connected oval, large connected oval, detached two-link panel, detached four-link panel.
- Close runs the exact Open animation instance backward from its current progress; panel geometry, link thresholds, menu-list position, and Plus/X rotation all resolve from that shared timeline.
- Labels remain hidden until their containing silhouette can hold them; no text paints over the portrait outside the white panel.
- Final menu panel is separated from the circular control by 30px, 6px more than the preceding state.
- The six storyboard frames now form one interruptible 900ms Web Animations timeline with symmetric `cubic-bezier(.45,0,.55,1)` segment easing. The `liquid-gooey` observer tracks that geometry directly and no longer adds a separate damped spring behind it.
- Animated surface radii remain pixel-based from bud through final panel, eliminating the percentage-to-pixel interpolation flash. Open and Close therefore sample identical radius values at identical progress points.
- Live in-app browser verification: Open and Close both traversed the detached panel, connected oval, emerging bud, and reabsorbed circle states; the final open state retained the approved 30px separation.
- Focused center-control tests: 5 of 5 passed. Full suite: 91 of 91 passed. Production build: passed.

Reviewed: 2026-09-03

## Scope

- Five retained routes: Selected works (`/`), Archive, Articles, Index, and Biography (`/info`).
- Removed routes: Photography, Video, Discography, and Projects.
- Desktop reference viewport: 1440 x 900.
- Mobile reference viewport: 390 x 844.
- No video surfaces or video-file references remain in the retained site.
- Articles is intentionally a title-only placeholder. Index is temporarily a duplicate of Selected works.

## Fidelity evidence

- The circular menu source contains Selected works, Archive, Articles, Index, and Biography on every authored page.
- Source CSS, font, imagery, content order, typography, spacing, breakpoints, and Webflow interaction runtime are localized rather than recreated approximately.
- The background is solid black with no grain/noise overlay, and Home-page projects have no divider rules between them.
- The original three routes retain their prior 1440 x 900 and 390 x 844 checks. Browser visual QA was not requested for this route addition.

## Interaction evidence

- Circular navigation opens, closes, supports keyboard activation, and navigates to clean route URLs.
- The Home carousel advances to different slides.
- Biography accordions expand from zero height and support keyboard activation.
- Archive hover presentation retains the source markup and source CSS behavior.
- Photography, Video, Discography, and Projects return 404 instead of falling back to Home.

## Accessibility

- Navigation and accordion controls are keyboard reachable and expose expanded state.
- Source focus-visible treatment and image alternative text are preserved.
- Reduced-motion preferences disable circular text rotation.
- Mobile tap targets and responsive stacking match the reference implementation.

## Engineering verification

- `npm run build`: passed.
- `npm run test:sites`: passed.
- Six of six tests passed, including explicit removed-route coverage.
- Asset localization manifest: 233 localized assets, zero skipped video references, and zero download failures.
- Asset pruning removed 962 unreferenced files totaling 165.45 MB across the two cleanup passes.
- The production `/index` artifact is an exact copy of the Selected works artifact.
- Remote asset hotlinks: none found in HTML or CSS.
