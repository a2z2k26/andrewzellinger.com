# Cinematic Case-Study Transitions

Date: 2026-09-07
Status: Approved design

## Objective

Add cinematic, scroll-driven transitions between the Projects collection and project case studies, and between adjacent case studies, without changing the site's approved layouts, content hierarchy, routes, or circular navigation model.

The motion should make project imagery and text feel spatially connected across views. It must remain readable, reversible, interruptible, responsive, and compatible with reduced-motion preferences.

## Approved Direction

Use a shared-frame editorial reveal implemented with the site's existing GSAP and DOM architecture. Do not introduce Framer Motion or migrate the site to another UI framework.

The approved characteristics are:

- cinematic editorial styling;
- unchanged page and case-study layouts;
- continuously scroll-driven boundary transitions;
- no snapped or pinned case-study sections;
- a reverse image morph when returning to Projects; and
- restrained effects that support the imagery rather than competing with it.

## Scope

### Included

- Projects-card to project-detail entrance choreography.
- Project-detail to Projects reverse choreography.
- Scroll-linked transitions between adjacent project case studies.
- Motion for the project image, title, metadata, and description.
- Desktop, tablet, mobile, and reduced-motion behavior.
- Focus restoration, transition cancellation, resize handling, and circular-set continuity.
- Regression tests and browser-based motion QA.

### Excluded

- Layout redesigns or changes to approved spacing and typography.
- Article-detail transition changes.
- New project content, images, or routes.
- Character-by-character text splitting.
- New glass distortion or WebGL effects.
- Scroll snapping, mandatory pinning, or autoplay navigation.
- Framer Motion or another animation dependency.

## Architecture

Preserve the existing DOM, URLs, history behavior, native scrolling, and circular project-detail sequence. Extend `src/detail-state.js` and its related styles rather than creating a parallel navigation system.

The implementation has two coordinated motion layers:

1. A shared-element route transition that promotes a clone of the selected project image into a fixed overlay and morphs it between the collection and detail rectangles.
2. A boundary-motion controller inside the existing detail-scroll runtime that derives normalized progress from the current positions of adjacent case-study units and applies reversible transforms to their media and header copy.

The boundary controller must use the existing scroll listener and animation frame batching. It should avoid adding ScrollTrigger unless implementation proves the current runtime cannot provide stable progress. Circular scroll wrapping and boundary progress must share one measurement model so resets between duplicate sets are visually continuous.

Animate compositor-friendly properties wherever possible: transforms and opacity. A vertical reveal may use `clip-path` on the incoming media. If browser QA shows material frame loss, replace it with an overflow-hidden wrapper and transform-only reveal without changing the approved visual sequence.

## Project-to-Detail Entrance

The selected collection card is the transition source. Its saved rectangle, media clone, route state, collection scroll position, and origin slug remain the source of truth.

Sequence:

1. Fade the selected card's title, tags, and description while translating the copy downward by 12px.
2. Promote the cloned image above the collection and morph it into the selected detail unit's existing 3:2 media frame.
3. Use approximately 700ms with `power3.inOut` for the image morph.
4. During the final third of the image motion, reveal the detail title from 24px below.
5. Follow with metadata and description at 35–45ms offsets using a short ease-out.
6. Keep body sections stationary until the route transition finishes.
7. Remove the overlay and restore the native detail image without a duplicate frame or flash.
8. Move focus to the selected case-study title after the entrance completes.

The image must retain its existing cover crop and 3:2 frame throughout. The transition must never stretch the image or expose two visible copies.

## Boundary Transition Between Case Studies

Case-study body content scrolls normally. Choreography begins only when the next project's media approaches the boundary between complete detail units.

For a normalized boundary progress from 0 to 1:

- 0–0.35: fade the outgoing header copy and translate it upward by no more than 20px.
- 0.15–0.70: scale the outgoing image toward approximately 0.96, slightly reduce brightness through a restrained overlay, and let it move upward more slowly than the document.
- 0.30–1.00: reveal the incoming image upward while translating it from approximately 40px below and scaling it from approximately 1.04 to 1.
- 0.65–1.00: resolve the incoming title, metadata, and description at slightly different progress offsets.

All values are derived directly from scroll position. Scrolling backward must reverse the complete sequence without starting a separate timeline. No boundary animation may seize scrolling, snap to completion, or delay access to body content.

The next unit's title and metadata may travel at subtly different rates, but the complete text stack must remain structurally unchanged and readable. Body paragraphs do not receive decorative motion.

## Detail-to-Projects Return

Closing a case study or using browser Back should reverse the relationship established on entry when the originating collection card is available.

Sequence:

1. Stop and cleanly cancel any active boundary presentation state.
2. Fade and slightly recede the active detail header copy.
3. Promote the active detail image into the shared overlay.
4. Restore the collection at its exact saved scroll position while keeping its native source image temporarily hidden.
5. Morph the overlay into the originating card's current media rectangle.
6. Reveal the card copy, restore the native card image, remove the overlay, resume the collection loop, and return focus to the originating card link.

If the originating card cannot be found, the route was loaded directly, or the environment changes during transition, use the existing immediate collection fallback without attempting a reverse morph.

## Responsive and Reduced Motion

### Desktop

Use the complete shared-image morph and boundary choreography. Preserve the circular detail sequence and its inert duplicate sets.

### Below 992px

Keep native document scrolling and the static source set. Use reduced motion distances, omit expensive masking if necessary, and retain the same conceptual ordering. Do not create loop clones or introduce pinned behavior.

### Reduced Motion

When `prefers-reduced-motion: reduce` is active, skip shared overlays, parallax, scaling, masking, and staggered reveals. Perform the route change immediately, retain ordinary native scrolling, and preserve focus and history behavior.

## Interaction and State Rules

- Every motion sequence must be cancellable and safe to restart.
- A second navigation action, browser Back, resize, breakpoint change, or reduced-motion preference change must kill active GSAP work and restore every temporarily hidden element.
- Only one shared transition overlay may exist at a time.
- Source and duplicate circular sets must share equivalent visual state, while duplicate sets remain `aria-hidden` and inert.
- Circular scroll wrapping must not occur while a visible boundary is in an inconsistent intermediate state. Wrapping should transfer equivalent progress to the matching set without a flash or jump.
- Route history, canonical URL updates, document titles, collection position restoration, close-button behavior, and active navigation state remain unchanged.
- Touch, wheel, trackpad, keyboard, and browser navigation remain usable throughout.
- The existing top and bottom glass bands and center navigation remain unchanged.

## Accessibility

- Preserve semantic card links and case-study article markup.
- Do not duplicate accessible media labels on transition overlays; overlays are `aria-hidden`.
- Do not split visible text into inaccessible generated fragments.
- Move focus to the selected detail title only after entry settles.
- Restore focus to the originating project card after a successful reverse morph.
- Reduced-motion behavior must contain no decorative spatial motion.
- Motion must not block reading or require precise gesture timing.

## Performance

- Batch scroll reads and writes in one animation frame.
- Cache unit measurements and refresh them after image readiness, resize, and breakpoint changes.
- Prefer `gsap.set`, `quickSetter`, or an equivalent low-overhead update path for scroll-linked values.
- Animate transforms and opacity by default.
- Apply `will-change` only during active transitions and clear it afterward.
- Avoid permanent filters and large blurred layers.
- Target smooth 60fps behavior on a typical laptop without sacrificing input responsiveness.

## Testing

### Automated coverage

- Shared overlay creation and guaranteed cleanup.
- Native source and target visibility restoration after completion and cancellation.
- Reverse transition restores the originating collection position and focus.
- Direct-loaded details use the non-morph fallback.
- Boundary progress is reversible and clamped.
- Circular source and clone sets receive equivalent motion state.
- Resize and motion-preference changes cancel safely.
- Reduced-motion mode creates no transition overlay or boundary transforms.
- Existing detail semantics, metadata, URLs, content order, and layout hooks remain unchanged.
- Production build and Sites packaging continue to pass.

### Browser QA

Test the complete interaction on representative project routes at desktop and mobile widths:

- open a project from the collection;
- reverse direction during the entrance;
- scroll forward and backward through at least two case-study boundaries;
- cross a circular set boundary;
- close back to the correct collection card;
- use browser Back;
- rapidly alternate scroll direction;
- resize during an active transition;
- load a case-study URL directly; and
- verify reduced-motion behavior.

Acceptance requires no altered layout geometry, no stretched or duplicated images, no flashing native backgrounds, no stale transforms, no broken focus state, and no perceptible jump at circular boundaries.

## Implementation Boundaries

The implementation should remain isolated to the shared transition runtime, detail motion styles, and focused tests. It must not refactor unrelated glass, navigation, content, media, or layout systems. Existing motion constants should be named and grouped so timing and distance can be tuned after visual QA without changing behavior code.
