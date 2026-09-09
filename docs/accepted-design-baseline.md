# Accepted design baseline — September 9, 2026

Andrew approved committing the reviewed design-elevation work to main. This approval supersedes the earlier experiment-only merge gate, but does not request a remote push or deployment.

## Active state

- White `ANDREW ZELLINGER` wordmark with the existing Home link.
- Desktop page headings: 72px. Desktop project and article collection titles, both detail-title styles, and the History opening paragraph: 28px. Compact typography remains unchanged.
- Projects collection copy: title in the first third; metadata and description in the remaining two thirds on desktop; stacked below 992px.
- Solid-white bottom-center circle and expanded gooey menu; black plus/X and links; current link underlined. Circle remains 88px desktop / 64px compact, with 48px bottom clearance plus safe area, and a 16px menu gap.
- Coordinated upward rail transitions, masked GSAP character-title cascades, and route-specific contextual progress stacks.
- Home and History retain their current portraits and crops. A overprints are temporarily disabled, not deleted.

## Preservation

- The previous main baseline remains at `700ba4b88e5ccdd69247d9d8957b122970fb961d`.
- Keep the design-elevation branch and preview worktree available after integration.
- Preserve dormant portrait studies and the rejected refractive-glass trial without mounting them.
- Audit screenshots and trial notes describe their capture-time state, not necessarily this final accepted appearance.

## Verification scope

The 192-test suite and production build passed before integration. Recent browser checks covered title sizes on all five affected page states, the restored Projects grid across desktop/compact breakpoints, and white/black menu states. This is local verification, not a production deployment or an exhaustive new cross-browser audit.
