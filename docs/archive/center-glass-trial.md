# Clear-glass navigation trial — September 9

Rejected after browser review and preserved only for recovery. The latest active control is solid white with black foreground, following the intervening orange reversal. `center-refractive-gooey-surface.jsx` and `center-glass-material.js` retain this trial but are not imported by the live renderer. Re-enabling the trial also requires restoring its controller material-sync hooks. The following describes the historical trial, not the current appearance.

## Material and preserved behavior

- `center-glass-material.js` imports the preserved `DOM_GLASS_DEFAULTS` and the original displacement-map generator. The former controller, global filter host, layout, glass bands, and tuning panel stay inactive.
- Frost is zero, blur is 1px, refraction is 40, and chromatic separation is 2. The original rim/shadow strengths inform a soft highlight and shadow around the current merged silhouette. No opaque white or orange background remains.
- A cached displacement image is fitted separately to the stationary circle and animated panel. The circle's map paints over the panel map at overlap, so the hidden bud does not add another lens in the closed state.
- The existing reversible 900ms timeline remains the only motion clock. Its progress updates map bounds; layout reads are batched before writes. No perpetual material animation or per-frame canvas generation is added.
- The liquid silhouette masks the backdrop once. The same silhouette supplies the rim across the connected bud and detached states. Both mask and highlight drawing bounds explicitly include the upward panel.
- The white icon and text are outside all filtering. Desktop remains 88×88px; compact remains 64px. Bottom clearance remains 48px plus any device safe-area inset; the open panel gap remains 16px.
- Home and History portrait A overlays remain disabled and preserved.

## Verification

- Browser inspected at 1440×1000 and 390×844: clear background, visible seam/image refraction, complete rim, white links, and opening/closing states. The button's opening bud stays connected to the circle.
- Desktop and compact measurements confirm 48px bottom clearance and a 16px open panel gap.
- Direct-loaded Audible Sleep detail with reduced motion retains an 88px white-X close control and one material filter; Close returns to Projects with one filter, not a duplicate.
- Home restored in the preview; no browser errors reported.
- All 189 tests, production build, seven Sites packaging checks, and whitespace checks pass. Main remains clean and unchanged.

Browser verification is Chromium only, using responsive viewport emulation, not physical devices. The CSS includes a lightly blurred clear-glass fallback where SVG backdrop-filter syntax is unsupported; syntax support alone is not a promise of identical Safari/Firefox rendering. Cross-engine visual parity remains unverified. Visual acceptance of this material is Andrew's decision.
