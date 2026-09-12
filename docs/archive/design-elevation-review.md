# Design elevation: review handoff

This is a working proposal, not an accepted replacement for main.

- Accepted baseline: `700ba4b88e5ccdd69247d9d8957b122970fb961d`, main and origin/main.
- Experiment: `codex/design-elevation`, in `.worktrees/design-elevation`.
- Accepted preview: http://127.0.0.1:5178/
- Experiment preview: http://127.0.0.1:5179/
- Dev-only viewport comparison: http://127.0.0.1:5179/scripts/design-review.html
- No merge, deployment, or changes to the original preview are authorized by this handoff. Andrew must review the design first.

## What changed

The existing half-and-half desktop composition, black canvas, Geist families, portraits, project images, content, routes, and circular browsing model remain the foundation. Product Design's context workflow was used to ground the work in that source rather than initialize another template.

- Fluid page titles and quiet section descriptors provide a stronger hierarchy.
- A desktop section directory gives an immediately visible route into the work. A current-item label and index follow the collection; detail pages add a reading-progress line.
- Project lockups now stack title, metadata, and sentence-case description. Article cards allocate width proportionally instead of leaving a narrow text column at smaller desktop sizes.
- Reading text is 15px with a more generous line height. History retains its complete content and gains quieter section reveals and more deliberate phone experience rows.
- Top-level navigation pairs a short title/rail exit with a staggered entrance. Existing collection/detail media transitions and section-reveal controllers remain in charge of their own elements.
- Mobile/tablet get a stronger heading, fixed compact header, full-figure Home crop, and a 64px bottom-centered control. Andrew explicitly said a bottom overlay is acceptable; a side-pinned control was not adopted.
- The liquid menu keeps its shared reversible timeline. Actual geometry is resized rather than scaling its ancestor, which avoids misalignment with the library's measured SVG surface. Menu text retains 44px-high link targets. Desktop uses an 80px control at the reviewed sizes.
- Escape, outside-pointer dismissal, menu Tab handling, current detail-icon state, and bfcache reinitialization were added. Mobile detail entry clears the 64px header rather than placing the image underneath it.
- Browser zoom is no longer disabled by viewport metadata.

## Verification performed

Browser work used the in-app browser. The dev review harness embeds the actual app at explicit CSS viewport sizes; it is not a static mock. It is excluded from the production build inputs.

| Surface / behavior | Observed evidence |
| --- | --- |
| Home, 1280×720 | Desktop split, larger title, original portrait, directory, smaller centered control; menu open/closed inspected |
| Home, 390×844 | Accepted and experimental versions inspected side by side; experimental crop retains the full figure |
| Projects, 1440×1000 | Image-led loop, title/metadata/description stack, changing current-item label |
| Projects and detail, 668×907 | Collection entry, image expansion, 80px mobile top clearance, correct X state, close back to visible Projects |
| Articles, 1440×1000 | Proportional card columns and loop inspected; item counter changes with the visible work |
| Articles, 768×1024 | Found and fixed width-plus-margin overflow; measured scrollWidth 768 at viewport width 768 |
| Articles, 390×844 | Stacked cards, no horizontal overflow, 64px centered control, interrupted open/close/open settled at correct final geometry |
| Article detail, 1440×1000 | Header, article sections, next-article boundary, current-item label, reading indicator; after several screens of scrolling, Close returned to populated Articles and reset the icon |
| History, 1280×720 | Direct-page screenshot inspected: split, portrait, lead, title, navigation |
| History, 390×844 | Portrait, lead, practice prose, and multiple experience rows inspected while scrolling |
| Menu, 844×390 | Entire open panel fits; measured panel top 32px and circular control 64px |
| Keyboard | Tab from the open control focused Home; Escape dismissed the menu |
| Outside dismissal | Opened the menu on Projects, clicked the page heading, and verified the menu closed and aria-expanded returned to false |
| Reduced motion | Existing dev-only `?motion=reduce` path extended to the new choreography; static Articles and immediate complete menu state inspected. This is not an OS preference or physical-device test. |

Automated verification: production build; complete Node test suite (93 tests); Sites worker/packaging checks. New geometry tests exercise desktop, tablet, phone, and landscape sizes. Existing motion tests now account for responsive keyframe sizing and the mobile header inset.

## Review boundaries

- No full cross-browser certification, physical touch-device test, or live OS reduced-motion toggle was performed.
- Representative project/article detail records were inspected, not all 30 long-form entries individually.
- History screenshots inside the desktop iframe harness timed out; the direct desktop History page was captured and inspected successfully instead.
- Subjective motion timing, mobile overlay placement, typography, and the additional left-rail directory/context remain Andrew's visual decisions.
- The experiment is intentionally kept separate. Keep or revise individual elements before deciding whether any of this should enter main.

## Implementation map

- `src/elevation/index.js`: section/context chrome, page transitions, History reveals.
- `src/elevation/styles.css`: scoped experimental layout/type overrides.
- `src/elevation/nav-geometry.js`: responsive dimensions and keyframe scaling.
- `src/effects/center-control.js`: menu state, accessibility, geometry integration.
- `src/detail-state.js`: mobile header-aware entry inset.
- `scripts/design-review.html`: local-only viewport and baseline comparison controls.

Keep the preview process alive for review. To return to the accepted design, open the original preview; no checkout, reset, or merge is necessary.
