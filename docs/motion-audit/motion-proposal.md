# Split Rhythm — proposed motion collection

**Superseded at top level by Andrew's motion review:** Home, Projects, Articles, and History now share one upward right-rail sweep. Do not implement the differing T1/T2 route effects below. See the [current implementation and verification](./unified-sweep/README.md). The remaining proposal is preserved as historical discussion, not authorization to expand scope.

Proposal for review, not an implemented or approved visual direction.

**The idea:** treat the two columns as independent moving surfaces with one shared rhythm. The division is the anchor; direction, masks, and timing express where the reader is going. Larger transitions belong to navigation. Reading remains stable.

This develops the accepted black/white split template. It does not introduce a new theme, rewrite the portfolio, replace approved imagery, re-enable glass bands, or merge the experiment into main.

## D1 — One motion grammar, six purposeful families

| Code | Transition | Where | Defining behavior |
|---|---|---|---|
| T1 | Counterflow | Home ↔ Projects | Left title field travels upward while the right media column travels downward; the incoming fields arrive from opposite edges. Fixed seam/chrome anchors keep orientation. |
| T2 | Cross-cut | Projects ↔ Articles; entry to History | A horizontal title exchange counterpoints a vertical or horizontal media shutter. Broad geometric bars briefly expose the incoming rail; no random directions. |
| T3 | Focus / return | Collection ↔ selected detail | The selected image owns the spatial transformation. Surrounding text clears first; detail text resolves only after the image has its new frame. Return retraces the same image geometry when its origin is valid. |
| T4 | Reading relay | Between complete articles/case studies | Incoming image opens within its own frame; the current title/count transfers in the left rail. Outgoing prose stays readable. No full-screen wipe between every entry. |
| T5 | Chapter cadence | History sections and authored detail groups | Section label, heading, and body enter as one restrained group. A chapter marker in the left rail updates independently; rows can follow at a small stagger without delaying reading. |
| T6 | Menu handoff | Menu closed/open/navigation/detail-close | Preserve the circle → bud → joined growth → detached rounded rectangle storyboard, but use continuous progress. Menu contraction cues the page transition; it is no longer a separate performance. |

### T1 — Counterflow: the first prototype

The left rail should actually move as a substantial field, not repeat today's 12–18px title nudge. A clipped inner surface contains its title and supporting context. The right viewport clips a separate moving media surface. The overall grid and outer frame do not move.

| Beat | Left field | Right field | Persistent elements |
|---|---|---|---|
| 0–15%: release | Context clears; title begins upward departure | Freeze the browsing loop at its exact current offset | Logo, clock, and seam origin remain fixed |
| 15–45%: counter-move | Outgoing field exits toward the top within its mask | Outgoing image/collection surface descends out of its viewport | A narrow rule at the seam may expand into a short-lived shutter edge |
| 45–65%: exchange | Incoming title enters from below | Incoming media enters from above | Destination is committed only when content can be shown |
| 65–100%: resolve | Title settles first; supporting context follows | Media settles slightly later, with one controlled deceleration | Restore focus; resume ambient loop only if the user has not paused it |

**Proposed duration:** 850–950ms total visual choreography on a prepared desktop navigation. Left/right landmarks offset by 60–90ms, not separate serial animations. Use large masked travel for drama, not longer waiting or spring overshoot. Reverse navigation reverses the geometry and sequencing rather than selecting a different entrance effect.

**Mobile translation:** there are no side-by-side columns to counter-move. The title/header band exchanges upward while the content mask reveals from the opposite vertical edge over 550–650ms. Fixed top identity and the protected bottom control region remain still. Do not translate the entire long document or shrink the desktop effect indiscriminately.

### T2 — Cross-cut: geometric contrast, not decorative noise

Projects → Articles exchanges visual work for editorial work. Let the left title leave toward the outer-left edge while **three broad horizontal bands** in the right viewport reveal the destination from right to left, each 40–60ms apart. Inside each band, imagery moves only a little against the mask to create depth without parallax on the body copy.

The bars are transition masks, not new permanent UI. Use black or near-black surfaces with a restrained light leading edge; avoid a full-screen white flash. They must reveal actual incoming content, not fill time with a loading animation.

For History, use the same bar language with a single calmer portrait-sized reveal and a vertical title exchange. It should feel like a new chapter in the same site, not a fourth unrelated animation package.

**Proposed duration:** 700–850ms desktop, 500–650ms compact. Reverse direction uses the same slices in reverse order. If content is not ready, retain the old page and use a quiet loading cue; do not strand the reader on an opaque shutter.

### T3 — Focus and return

Keep the selected card's image visually identifiable throughout its expansion. Pause the loop before measurement. Capture the source and destination rectangles after fonts and relevant media are ready. Move a single visual representation, not duplicate native and overlay images.

Article copy fades in place before the image expands. Do not transform text through the image or stretch text with the image. New title/metadata enter after the image has cleared their final region; the body follows as a group. Project copy follows the same ownership rules with a tighter overlap where geometry permits.

**Proposed duration:** 750–950ms desktop, 450–600ms compact. Return uses the same progress model and stable origin anchor. At a later long-scroll entry, choose the current entry as the destination card rather than flying back to an unrelated original card. Preserve the established history behavior where it is valid. If no trustworthy origin exists, use a short rail reveal into the collection; do not invent a shared-element journey.

### T4 — Reading relay

Use scroll position, not a timed autoplay, to reveal the next primary image. Measure progress from its untransformed wrapper. Keep all words already being read at full opacity. Let the left chapter title/count update once the next entry has genuinely become the active reading context, not when one pixel intersects the bottom edge.

The next image can reveal bottom-to-top with a 2–3% internal scale correction. Its heading/metadata resolve after the image is established. Reverse scrolling should smoothly undo only the boundary framing; already-read body sections should not repeatedly disappear. Preserve circular seam geometry and the distinct article/project spacing tokens.

On mobile this becomes mostly native scroll with a small incoming-frame reveal, not a miniature full-column effect. Reduced motion uses complete static images and copy.

### T5 — Chapter cadence

History's introduction, experience, capabilities, stack, and contact blocks get a deliberate rhythm. Update a left-rail section label on desktop. Reveal headings and associated prose together; rows may stagger by 30–40ms, with the whole group complete within 400–500ms. A group should not wait for a large fraction of a very tall section to intersect.

Case-study sections and article heading/prose groups use quieter 280–400ms reveals and 8–12px displacement. No character-by-character body animation, bouncing bullet points, added divider lines, or animated word reflow. Repeated scroll does not replay a section endlessly. Hover and focus use brief color/rule changes, not movement that makes a link hard to target.

### T6 — Menu as a navigation handoff

First fix cold-load endpoint playback and content fit. Keep the actual toggle circle fixed. The growing shape uses the accepted storyboard poses, but a smooth size/position/radius curve traverses them without stopping at each pose. Closing is the exact same progress path backwards, including labels and icon, and can reverse mid-flight without restarting.

Use approximately 600–750ms for a full open/close prototype. Reveal each link only when its complete target fits inside the shape; do not show two labels as one hard step and then the other two as another. Text remains unfiltered and unscaled.

Selecting a route starts the shared transition transaction. Let menu contraction overlap the first release beat of T1/T2; do not make the user wait for a complete menu close followed by a complete page exit. Detail-close remains a distinct action with reliable collection fallback.

## D2 — Deterministic route mapping

| From → to | Treatment | Reverse contract |
|---|---|---|
| Home → Projects | T1 Counterflow | Projects → Home reverses both column directions |
| Projects → Articles | T2 three-band Cross-cut | Articles → Projects reverses band order and horizontal direction |
| Articles → History | T2 portrait chapter variant | History → Articles restores the editorial rail through the reverse mask |
| Home → Articles | T1 with editorial destination | Reverse geometry, not another random effect |
| Home/Projects → History | T2 portrait chapter variant | Matching reverse geometry |
| Collection → detail | T3 Focus | T3 reverse where origin is valid; safe collection reveal otherwise |
| Detail → next/previous entry | T4 Reading relay | Continuous scroll reversal, no route wipe |
| Menu → any route | T6 release into the chosen route treatment | One coordinator, not two stacked timelines |

Direct loads should use a concise destination reveal without simulating a departed page. Same-route clicks should not replay the page. Modified clicks, new tabs, downloads, mail links, hashes, and external links retain native behavior.

## D3 — Architecture before additional effects

Keep the current DOM-first content model, Vite routes, shared records, and existing GSAP strengths. A React rewrite is not required to achieve this design.

1. **Define route and state descriptors.** Each view exposes its title surface, context surface, right viewport, selected media, focus target, and stable scroll anchor. Do not use one generic selector to infer every view.
2. **Introduce a single transition transaction.** `idle → prepare → exit → commit → enter → settle`. It owns cancellation, history, focus, loading readiness, and loop suspension. Exceptions restore a usable page; they cannot leave opacity zero or pointer events disabled.
3. **Assign transform ownership.** Outer route surfaces own page transitions; loop tracks own collection movement; stable detail wrappers own measurement; child media owns boundary reveals. The menu owns only its own surfaces. Never animate the same transform from two systems.
4. **Prototype cross-document continuity without changing the router first.** The native [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using) supports separate named old/new visual surfaces and cross-document handoffs. Use it as a capability-detected progressive enhancement, with explicit route-pair styling and browser testing. Keep a reliable regular-navigation fallback. Do not claim equal browser behavior without verifying it.
5. **Keep in-document detail transitions on the shared coordinator.** Existing GSAP media transitions can be adapted rather than discarded. A persistent DOM-router migration is an alternative only if cross-document constraints prevent the accepted direction; that would be a separate, reviewed architecture decision.
6. **Suspend/resume correctly.** Handle `pagehide/pageshow`, visibility, reduced-motion changes, viewport changes, image/font readiness, and browser Back/Forward. Preserve user pause preferences and semantic reading position.
7. **Prevent event races.** Before commit, a newer navigation intent may supersede the old one. After commit, coalesce subsequent input to the latest valid destination and settle cleanly. Escape during menu-only motion reverses it. Do not let a delayed completion callback navigate to a stale destination.

### Proposed tokens

| Token | Initial value/range | Use |
|---|---|---|
| feedback | 120–180ms | Hover/focus feedback, non-spatial state changes |
| reading | 280–400ms | Heading/prose groups |
| chapter | 400–500ms | History groups / secondary context |
| navigation-compact | 550–650ms | Stacked-layout navigation |
| navigation-grand | 850–950ms | Desktop Counterflow |
| menu | 600–750ms | Full gooey morph; same reverse path |
| landmark-stagger | 40–90ms | Deliberate left/right or bar offsets |
| travel | Container-relative | Full-field motion belongs to clipped surfaces, not arbitrary page pixels |

Use one continuous ease-in-out curve for large spatial transfers and a quick ease-out for supporting text. No bounce/elastic overshoot. Values are prototype starting points, not final claims about perceived quality.

## D4 — Reduced motion and interruption are designed states

- Reduced motion: no column travel, shutters, scaling, liquid morph, automatic loop, or hidden essential text. Instant swap or a short opacity dissolve, with identical content and navigation semantics.
- Slow/unready media: keep the old view usable until the destination can be shown. Never extend an artificial animation to disguise indefinite loading.
- Resize/orientation during movement: finish safely to the correct layout and preserve a semantic anchor; never interpolate desktop geometry into a mobile target that no longer exists.
- Keyboard: no focus enters hidden outgoing content. Commit focus after the destination is usable; menu focus remains coherent while its shape grows. A screen reader must not encounter duplicate proxy content.
- Long reading: no dramatic effects on every paragraph. Preserve the user's location and pace.

## A1–A4 — Implementation order after approval

**A1 — Stabilize:** cold-load menu guard, content-fit menu, metadata contrast, protected reading/control region, pause mechanism, cache/resize lifecycle. Expand tests to reproduce the actual failures.

**A2 — Prove one signature:** implement Home ↔ Projects Counterflow, including menu-triggered navigation, desktop, phone, reduced motion, Back, and interrupted navigation. Present recorded forward/reverse movement plus endpoint screenshots for Andrew's judgment. Do not mistake green tests for visual approval.

**A3 — Extend the collection:** apply Cross-cut to the remaining top-level route pairs; adapt Focus/return and Reading relay. Preserve content, route restoration, and all existing input modes.

**A4 — Polish and audit:** History cadence, local hover/focus, typography boundary consistency, all supported breakpoints and browser capability fallbacks. Keep the whole result on the experiment branch until reviewed.

### Acceptance gate

- Inspect 0/25/50/75/100% of forward and reverse transitions at the same geometry.
- No initial menu playback, duplicate imagery, corner-radius snap, exposed content underneath masks, blank return, or detached labels.
- Rapid open/close, navigation while closing, repeated route clicks, Back/Forward, direct detail load, long-scroll return, and resize during entry all settle predictably.
- Validate all six templates at 320, 390, 600, 768, 991/992, 1440, 1920; include short-height desktop, landscape, safe areas, and 200% text zoom.
- Profile actual frame delivery and image decode on constrained hardware; avoid asserting smoothness from source inspection.
- Run source tests, production build, and Sites packaging checks. Verify Safari/Firefox/Chromium paths and physical touch before claiming cross-browser completion.
- Andrew reviews the visual direction before any merge to main.
