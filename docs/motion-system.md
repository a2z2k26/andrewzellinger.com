# Motion system

The motion system has a dedicated phone profile below 600px. Tablet and desktop retain their established rail transitions, title cascades and layout. This is a continuation of the accepted design, with no new animation dependency.

## Shared phone vocabulary

`src/motion/profile.js` owns phone durations, distances and easing. `src/motion/phone.js` derives CSS custom properties from it so CSS and GSAP share values.

| Purpose | Duration | Movement |
| --- | --- | --- |
| Press / return feedback | 120ms | Opacity only |
| Drawer response | 240ms | Existing drawer travel |
| Reading / structural arrival | 440ms; header sequence up to 560ms | 12px, 60ms group stagger |
| Collection change | 360ms | Content arrives 8px upward |
| Detail exit | 160ms | 8px downward |

Collection titles retain the established per-character masked cascade on phones as well as tablet/desktop. Each glyph has its own native snapshot; the shared cascade timing remains unchanged. The initial page entrance waits for the welcome introduction to close instead of playing behind it.

On a cross-document return to Projects, the welcome introduction waits for the incoming browser view transition to finish before it mounts. View-transition snapshots occupy the browser top layer above ordinary DOM z-index values; this gate prevents the modal from painting underneath the returning carousel. Direct Projects loads and reduced-motion arrivals have no active transition layer, so the introduction mounts immediately. The accepted modal entrance and the collection return choreography are otherwise unchanged.

Collection changes fade the old content away before the destination appears. Identity, clock and the closed phone navigation control are separate anchored snapshots. Unrelated project images and article text never share a media snapshot on phones. The drawer closes before capture. Supported browsers use native document transitions; otherwise ordinary navigation and the destination entrance remain usable without waiting for image decoding.

Phone detail titles uncover through a mask, then metadata and lede follow at 60ms intervals. Visible opening sections arrive concurrently, with labels leading their body text. Close first restores the collection's saved position, then gives its content a short opacity return. Off-screen phone sections remain visible until observed; sections already passed during a fast scroll are not hidden to replay a reveal. Restored reading anchors skip the entrance. Body paragraphs are not split into characters or individually staggered.

Pressed states affect opacity, not control size or typography. The accepted drawer geometry, handle and threshold-based swipe behavior remain intact; CSS shares one response timing. Project hover lockups remain stationary.

## Ownership and cancellation

- `src/elevation/counterflow.js`: native cross-document capture, including the phone route profile.
- `src/motion/phone.js`: cancellable phone reading and arrival handles. Every handle resolves and releases owned styles on completion or interruption.
- `src/detail-state.js`: URL/history, selected story, focus, scroll position and breakpoint reconstruction.
- `src/detail-section-motion.js` and `src/elevation/text-motion-system.js`: shared structural reveals, with shorter phone timing.
- `src/site-navigation/index.js`: drawer state and synchronous pre-capture closing.

Resize, page departure and reduced-motion changes cancel phone animation handles. Reduced motion shows content immediately and preserves navigation, focus and return state. The CSS profile is restricted to phone widths. Existing desktop/tablet constants remain unchanged.

## Validation

Run `npm run check` and `npm run test:browser`. The browser suite includes 320/390/430px phone page changes, drawer state, settled reading content, Close, reduced motion and preference interruption, actual advancing/staggered title snapshot frames at 390/820/1440px, first-visit title entrance after dismissing the introduction, alongside desktop motion and existing tablet, deep-link, Back/Forward, resize and scroll-restoration checks.

Browser emulation does not replace physical-device review. Check iPhone Safari and Android scrolling, browser Back gestures, interruptions, safe areas and slow navigation before treating the visual direction as accepted.
