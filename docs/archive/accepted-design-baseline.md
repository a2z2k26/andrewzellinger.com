# Accepted design baseline — September 9, 2026

Andrew approved committing all outstanding refinements and artwork to main and pushing them to GitHub. This snapshot supersedes the earlier September 9 baseline and experiment-only merge gates. It does not request a separate production deployment.

## Active state

- Projects is the landing page at `/`; `/projects` and `/portfolio` redirect there. The separate Home/Designer page is no longer mounted. Navigation and large headings read Projects, Articles and History.
- White `A. ZELLINGER` wordmark, 14px Geist Semibold 600, linking to `/`.
- Desktop page headings: 124px Geist Medium 500, .98 line height and -.035em tracking, left aligned 32px above true vertical center. Desktop project and article collection titles, both detail-title styles, and the History opening paragraph: 28px. Compact typography remains unchanged.
- Projects collection copy: title in the first third; metadata and description in the remaining two thirds on desktop; stacked below 992px.
- Avantos is first and Amazon Fire TV second; the remaining project order is preserved. Project and article titles do not dim on hover.
- Bottom-center circle: 92px desktop / 64px compact, with 48px bottom clearance plus safe area and a 16px panel-to-circle gap. Closed fill is solid white; opening smoothly changes the unified button/menu surface to 60% white with 32px backdrop blur. The plus/X and links are black. Links use Geist Semibold 600, 32px desktop / 24px compact, with 12px row gaps and no current-page underline. Preserve the smoothed reversible morph and topmost chrome layer above transition imagery.
- Coordinated upward rail transitions and masked GSAP character-title cascades remain. Projects and Articles resume carousel motion after a pointer-driven detail return without an extra click, while keyboard-visible focus, saved pause preferences and reduced-motion behavior remain respected.
- Context stacks sit 32px beneath page titles: orange 12px counters, 20px item/section names and 1.5px progress rules. Gray scroll instructions are removed. Preserve their compact/short-viewport hidden treatment.
- History retains the approved portrait crop with a static orange `A.` illustration: Geist Semibold 600, circular .17em dot, centered as one mark with baseline alignment, Overlay blending and 70% opacity. The former Home portrait and artwork remain archived.
- History's complete right column loops upward at the shared 60px-per-second desktop speed, supports direction-changing scroll impulses and tracks nine sections. Compact and reduced-motion layouts remain native. All editorial divider lines are removed; spacing follows the current divider-free History decision in `AGENTS.md`, with factual copy and the two orange editorial accents preserved.
- Case-study writeups retain only the opening divider above Context. Article listings have no dividers and use orange, non-underlined Read more labels with corrected row spacing.
- Article bodies align to the right rail's left edge in a bounded 68ch column. The opening divider spans the rail. Connected paragraphs are consolidated without changing authored wording, headings, lists or quotes; body styling is 15px/24px, with 16px paragraph gaps and 32px section gaps. Every Related work link is removed.
- All eleven articles use distinct abstract images consistently in listings, details and transitions. `src/article-images.js` owns the mapping; `Article-Image/README.md` records thirteen original files containing twelve distinct artworks, eleven assigned and one spare, plus the retained duplicate. Optimized WebP copies are served; originals and unselected studies remain preserved.

## Preservation

- The immediately previous main baseline remains at `51dd6e619c514dc80c0a1c7d78dbda165c315dab`; the earlier rollback point remains at `700ba4b88e5ccdd69247d9d8957b122970fb961d`.
- Preserve the canonical preview on port 5173 and unrelated historical branches/worktrees. The old design-elevation branch/worktree preservation instruction is historical and does not require recreating a retired experiment.
- Preserve dormant portrait studies and the rejected refractive-glass trial without mounting them.
- Preserve the image-option galleries as explorations; committing them does not select additional active article artwork.
- Audit screenshots and trial notes describe their capture-time state, not necessarily this final accepted appearance.

## Verification scope

The 223-test suite and production/Sites packaging build passed before this commit. Prior implementation browser checks covered desktop and compact title sizes, menu states and interruption, collection/detail returns, History carousel behavior and spacing, and all eleven article images in listing/detail views. The commit-and-push pass reruns automated checks and verifies GitHub/local main parity; it is not a new exhaustive cross-browser audit or proof of a production deployment.
