# Shared context stacks — September 8, 2026

Implemented only in the design-elevation worktree. Main is not changed or merged.

## Behavior

- Home uses a static design-practice introduction grounded in the existing biography. No scroll instruction or progress rule.
- Projects and Articles show the current canonical item name and ordinal. Progress divides the logical collection into equal item portions and advances continuously through the visible item. Loop clones reuse the canonical ordinal, so progress wraps at the seam and follows either direction.
- Both detail types preserve progress inside the active piece, not the entire detail loop.
- History tracks nine real section headings, including nested Selected clients and Contact. Progress reflects document scroll distance. At the bottom the context resolves to Contact and says End of history.
- All desktop blocks, including their visible progress rule, are vertically centered between the large title's bottom edge and clock's top edge. Without a rule, no rule gap is reserved. Existing left inset, typography, 25px text-to-rule gap, and compact-layout visibility are retained.
- Neither collection exposes a Pause/Resume button. Saved user pause preferences, focus/visibility pause, and reduced-motion logic are retained.

## Browser evidence

- Home, Projects, Articles, History, case study, and article detail inspected in the experimental preview.
- At 1440×1000, scrolling variants have approximately 157.26px of space on both sides of the complete context block; Home without a rule has approximately 170.26px. Left edge stays 24px.
- Case-study context at 1024×676 has approximately 102.29px on both sides. Article detail at 1280×720 has approximately 108.96px. No title or clock movement was needed.
- Articles progress advanced from approximately .430 to .751 during autoplay with document scroll position still zero. Thus progress follows the carousel, not its scroll spacer.
- Projects reverse-direction check changed direction to down, with progress moving backward from .029 through the seam to .959 and ordinal 19/19.
- History moved from Design practice at zero to Experience during reading, then Contact / 09 of 09 / End of history at progress 1.
- Closing article detail restored its collection name, browsing cue, ordinal, and collection progress.
- At 390×844 the context and rule remain hidden, preserving the existing mobile layout. Browser console error check was empty.

## Verification boundary

Node tests and production build/Sites packaging checks pass. Browser evidence is local preview evidence, not deployment or user visual acceptance. This context-stack pass predates the separately implemented [character-cascade title animation](title-motion-qa.md); the approved right-rail sweep remains unchanged.
