# Design QA

result: passed

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
