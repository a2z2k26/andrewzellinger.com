# Portrait A-study — September 9, 2026

Exploratory work on `codex/design-elevation`; not an accepted brand direction or a merge to main.

## Current live trial: photographs without overlays

Both A overlays are temporarily disabled with `PORTRAIT_ARTWORK_ENABLED = false` in `src/elevation/portrait-artwork.js`. Navigation now uses solid white with black icon/text, superseding the orange and clear-glass trials. No image assets or crop rules changed. The authored static compositions below remain intact and can be restored by enabling that flag.

## Preserved direction: two static artworks

Andrew selected still compositions after reviewing the animation studies. The live site now imports `portrait-artwork.js`, not the animation laboratory. No timeline, randomized take, flashing, controls or scrubber is mounted on either portrait. All prior studies and tests remain preserved in source for recovery.

- History retains the oversized, centered Monument from the supplied September 9 00:30:30 screenshot: the original `min(width × 1.65, height × 1.22)` font sizing, grid centering and orange overlay blend.
- Home follows the ten sparse Signal positions in the supplied 00:31:22 screenshot. Several letters are smaller or larger; the arrangement does not change between visits. Letters can extend through the image crop but cannot spill into the surrounding canvas. Source coordinates and size multipliers live in `portrait-artwork-model.js`.
- Both use the actual Geist Semibold 600 face. The photo files, media transforms, outer layout, other route animations and main remain untouched.
- The layout-grid and typography-scale skills informed responsive coordinates and relative sizes; the supplied screenshots remain the composition reference.

Static browser checks: Home holds identical glyph rectangles, opacity and transforms over time; ten glyphs and no laboratory UI render. History renders one glyph with the same original Monument sizing/centering. At 1728×906 Home remains 832×858, History 832×554.664; at 390×844 they remain 342×427.5 and 342×228. At 768×1024 History remains 720×480. The phone Home glyph rectangles have zero overlaps; stage scrollTop stays zero and document width stays 390. Both static compositions were visually inspected on desktop and phone.

The static pass passes all 184 project tests, production build, seven Sites packaging checks and whitespace checks. The center menu was used for Home → History → Home: each route has exactly one artwork layer, the expected ten/one glyphs, the loaded Semibold face and no study UI. Browser error logs are empty. Main remains clean; this is still isolated work awaiting visual review, not a merge or deployment.

## Earlier motion laboratory (preserved, not mounted)

The following describes the previous laboratory interface, no longer present on the live pages:

- Overprints · all cycles only the selected seven: Signal, Chorus, Columns, Lattice, Stack, Relay and Monument, with clean photo-only intervals. The earlier large sliced-A tests, Rows and Orbit remain under Earlier tests, excluded from the automatic sequence.
- Every portrait A uses the actual bundled Geist Semibold 600 face, including Monument and Chorus. No unrelated site typography changes.
- Overlay retains an orange light/texture interaction. Difference deliberately shifts color according to the photograph; Normal uses a translucent orange layer.
- Pause freezes the current composition. Selecting another motif while paused shows a representative still. Replay generates a new seeded grid and overprint take. The readout identifies the current grid dimensions. Select an individual study to enable the scrubber and inspect any intermediate frame, forward or backward. Original photo hides the overlay. Reduced motion uses a still composition with playback controls disabled.

## Current direction: stationary overprints with varied density

Andrew's subsequent feedback supersedes the smooth motion tests: preserve the selected compositions' structure but remove sliding, shrinking, folding and interpolated opacity. Letters stay at identity transforms and cut directly between visible and hidden. Irregular combinations and dropout rhythms evoke imperfect algorithmic overprint and older technology. Field edits are at least 0.56 seconds apart; Monument uses longer holds. This is not rapid whole-image flashing.

The follow-up grid revision intentionally favors larger A's instead of repeating a four-by-four grid. A new page mount seeds a take; Replay advances it and changes the grid. Grid geometry stays fixed during playback and scrubbing, so no visible composition changes size mid-vignette. Glyph size follows both cell width and cell height without stretching, on either portrait.

| Selected study | Grid choices and behavior |
| --- | --- |
| Monument | One oversized A; long holds and abrupt disappearance. |
| Chorus | 2×2, 2×3 or 3×2; large letters accumulate and drop out. |
| Columns | 2×3, 3×2 or 2×2; whole column banks switch. |
| Lattice | Nested 3×3, 3×4 or 4×3 grid: one or two large 2×2 tiles alongside smaller 1×1 tiles. Large-tile placement varies between takes; shared cell occupancy prevents overlap. |
| Stack | 1×2 or 1×3; stationary vertical overprints in changing combinations. |
| Relay | 2×2, 3×2 or 2×3; a single large accent cuts around the perimeter. |
| Signal | 5×6, 6×5 or 5×5; the one dense treatment, with irregular partial-field cuts. |

GSAP timeline guidance supports one seekable lifecycle; animation-principles guidance informs pause/reduced-motion safeguards and staging. The user's explicit hard-cut art direction overrides generic smooth-easing recommendations. Each vignette is 6.4 seconds including its clean interval, not added navigation delay.

## Earlier exploration: ten additions (historical)

The following records the first pass, before Andrew selected the stationary overprint direction. Active selected studies now use the behavior above; the other earlier tests are comparison-only. All now share weight 600.

| Study | Motion idea |
| --- | --- |
| 03 Multiplicity | Eight offset vertical slices of duplicated A glyphs align into one complete letter. |
| 04 Registers | Seven horizontal strips arrive from alternating sides and align. |
| 05 Mosaic | Sixteen masked copies converge as a tiled, full-letter composition. |
| 06 Quadrants | Four magnified copies move and scale into exact registration. |
| 07 Columns | A four-column grid descends in a timed canon. |
| 08 Rows | Alternating rows traverse their cell masks in opposing directions. |
| 09 Signal | Four cells at a time switch in deterministic, spaced cuts. |
| 10 Relay | One accent follows a rectangular grid path with a brief crossfade. |
| 11 Lattice | The repeated field expands from the center and folds away from its edges. |
| 12 Stack | Three oversized A glyphs roll through separate horizontal masks. |

The first four earlier tests share full-frame glyph coordinates, not stretched or differently cropped letter fragments. Each has a fully assembled hold before departure. They are not part of automatic playback.

This is live typography over unchanged photo files, not a generated or rasterized replacement. The existing brand-orange token is reused. Blend behavior uses CSS [mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mix-blend-mode).

## Implementation boundaries

One decoration layer per portrait, aria-hidden and pointer-transparent; the accessible image remains intact. Home keeps its existing frame and 1.1 crop transform. History gains a neutral isolated wrapper with identical dimensions. Clipping uses overflow:clip so focusing the experiment controls cannot scroll the enlarged photo inside its frame. No raster files are written, regenerated, or replaced.

The study pauses for reduced motion, explicit user pause, shared navigation pause, offscreen visibility, background tabs, and pagehide. Cleanup disposes timelines, subscriptions, observers, and wrappers. Compact History transitions capture the complete wrapper so the decoration travels with the photograph.

To roll back only this experiment, set PORTRAIT_STUDY_ENABLED=false in src/elevation/portrait-study.js and reload; no original media or layout reconstruction is required.

## Verification history

- Before/after captures inspected together for both existing photos at 1440×1000. Home remains 688×952 at (728,24); History remains 688×458.664 at (728,24). Photo framing, titles, content, and outer layout are preserved.
- All three motifs, overlay/difference modes, pause, paused motif selection, and Original photo were exercised in the browser. Difference visibly changes the gray-background letters toward blue/purple while dark garment areas retain orange, as expected.
- Home control focus initially scrolled the hidden-overflow box by 47.5px. The clipping fix was verified with scrollTop=0 and the decoration rectangle exactly matching the photo frame afterward.
- At 390×844 the Home frame and overlay both measure 342×427.5; controls remain inside the photo and the document width stays 390px.
- The earlier expanded set passed all 174 project tests, the production build, seven Sites packaging checks, and git diff whitespace checks. The subsequent hard-cut/600 revision passed 176 project tests and the same build/packaging checks.
- Earlier pass: all ten new studies were selected and visually inspected on desktop Home; intermediate frames were inspected for all four split-letter assemblies. Before/after History comparison retained the exact 688×458.664 frame and unchanged photo crop. The original 500/600 split has now been superseded by 600 throughout. Manual scrubbing and replay were exercised. History pauses after its portrait leaves the viewport.
- At 390×844 the expanded controls occupy 326×72 entirely inside both portraits; Home remains 342×427.5 and History 342×228, with no horizontal document overflow. History's reduced-motion preview holds assembled glyphs at identity transforms and disables playback/scrubbing. Projects renders no study layer or controls. The final Home browser error log is empty.

Browser evidence is from the local Chromium preview. Physical devices and Safari/Firefox are not certified. Andrew's visual review decides which motifs, if any, should survive this experiment.

### Current hard-cut/grid revision

- Seventeen focused tests pass, including every supported grid across multiple seeds, bounded cell indices, distinct adjacent grid takes, larger-cell bias, binary opacity, identity transforms, forward/backward scrub parity and complete non-overlapping mixed-size tiling. The small-grid tests caught and fixed negative perimeter wrapping in Relay before handoff.
- Browser-computed typography confirms the loaded Geist Study face at 600 for every portrait glyph, including Monument and Chorus. The build includes the actual Geist-SemiBold WOFF2 asset.
- Desktop Home remains exactly 688×952 at (728,24), with stage scrollTop=0. The sampled grid take ranges from 4/6-cell large fields to 12-cell Lattice and 30-cell Signal, with distinct computed font sizes. Replay changed Chorus from 3×2 to 2×2. Three live Relay samples showed different active cells, only opacity 0/1, and unchanged identity transforms.
- The final mixed-size addition replaces the uniform Lattice field with six non-overlapping tiles. Desktop History remains 688×458.664 at (728,24); the inspected 3×4 composition pairs two 160.7px letters with four 80.3px letters. At 390×844 History remains 342×228 with 79.9px/39.9px letters, zero overlapping glyph rectangles, all glyphs contained, and document width 390. Reduced-motion History keeps the mixed composition still and disables transport/scrubbing.
- Final grid/mixed-scale pass: all 179 project tests, production build, seven Sites packaging checks and whitespace checks pass. Mobile Home retains its 342×427.5 frame, stage scrollTop=0 and document width 390; its inspected 3×3 mixed field uses 209.8px/104.9px letters. The desktop Home preview is left playing Overprints · all; every glyph computes to 600, the Semibold face is loaded, and browser error logs are empty. Main is still clean.
