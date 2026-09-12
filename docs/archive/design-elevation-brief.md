# Design elevation experiment

Baseline: `700ba4b` on main, also saved on GitHub. This work lives only on `codex/design-elevation` in its own worktree. Main is an approval gate, not an automatic merge target.

Andrew's brief: make a more refined, compelling version of the complete site using the current design as its foundation. Preserve the recognizable desktop half-and-half architecture. Improve tablet and phone layouts deliberately. Every retained page, state, component, and transition is in scope. Keep commercial claims and authored content intact.

## Direction: a living editorial index

The left rail becomes a strong typographic anchor and a useful index; the right rail remains the place to browse and read. Use black, white, restrained orange, Geist Sans, and Geist Mono. Improve hierarchy through scale, alignment, and text measure. Avoid ornamental backgrounds and additional hero imagery.

- Home: stronger fluid typography, a full-height portrait on desktop, an intentional portrait crop and generous headline on mobile, visible routes into the work.
- Projects: image-led cards with quieter metadata, more legible descriptions, gentle hover feedback, and a live left-rail indication of the item in view.
- Articles: repair the narrow text column on smaller desktops; improve headline hierarchy and reading measure, preserving semantic lists and the shared content source.
- History: clear career introduction, readable supporting prose, disciplined experience rows, and quiet reveals at meaningful section boundaries.
- Details: improve reading type and section alignment, keep the established media expansion, close/back behavior, and circular sequence; show current item and reading progress outside the text column.
- Navigation: retain the liquid silhouette and its reversible shape sequence; make the control smaller, give it a clear label, add Escape/outside dismissal and keyboard focus handling. Keep the mobile control bottom-centered at 64px, with its menu fully inside the viewport. Andrew is comfortable with a bottom overlay and prefers reviewing a smaller, better-treated version before a side-pinned alternative.
- Page changes: coordinate the title and content rail with a short exit/entrance sequence. Keep shared chrome stable. Respect reduced motion and browser Back.

## Verification

Inspect Home, Projects, Articles, History, one project detail, and one article detail in the browser. Exercise menu open/close, page changes, collection-to-detail, detail close/back, and interrupted interactions. Check desktop, tablet, and phone layouts where browser controls permit. Run the build and current regression suite. Record limitations rather than claiming unobserved viewport coverage.

Acceptance of the visual direction belongs to Andrew. A passing build is not design approval.
