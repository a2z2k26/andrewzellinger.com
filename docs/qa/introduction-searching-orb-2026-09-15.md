# Introduction searching orb QA

Date: September 15, 2026

The Projects introduction replaces its prior SVG globe with `thinking-orbs@0.3.1` searching geometry. The app stays DOM-first: `src/thinking-orb-icon.js` uses the package's public frame and paint exports on a 2D canvas, without a React root. The 64px searching preset draws a 68px-high frame in a 112×68px canvas. Only projected x coordinates spread, by 1.72; the dots remain round. Dark-surface ink is pinned for the black modal. The canvas is decorative (`aria-hidden`) because the dialog's existing title and description already provide its meaning.

The orb's bright scan now sweeps at 60% of its previous speed, with base rotation unchanged. The close circle's white fill is 4% opacity at rest and hover. The visual swap and refinement do not alter the exact modal copy, 240ms entrance/close choreography, focus and scroll lock, title-cascade handoff, or the September 14 gate that waits for the browser's incoming view-transition top layer before mounting on a Projects return. The unrelated History portrait globe retains its original animation.

## Measured dimensions

The production browser test temporarily renders the accepted prior CSS footprint after capturing the current state. These are actual `getBoundingClientRect()` measurements, not inferred from stylesheet text.

| Viewport | Prior panel | Refined panel | Title-to-copy gap | Painted orb silhouette |
| --- | --- | --- | --- | --- |
| 320px | 240×412px | 236×≈384px | 24→20px | 83×49px, 1.69:1 |
| 390px | 296×412px | 292×≈384px | 24→20px | 83×49px, 1.69:1 |
| 1440px | 400×464px | 376×448px | 36→32px | 97×58px, 1.67:1 |

The phone panels are now 4px narrower and about 28px shorter than the accepted pre-orb baseline after the 12px phone-width increase and later 12px height reduction. They render at 383.984px, effectively 384px, with 48px top / 50.2px bottom padding. Desktop is 24px narrower and 16px shorter than the accepted baseline after the additional 8px width reduction. The desktop orb's measured panel-top gap remains exactly 4px farther than before the width/top-gap refinement; its 18px top / 14px bottom padding split compensates for the smaller close circle. Desktop panel height and internal content gaps remain unchanged. The title-to-copy gap is 4px tighter than the accepted baseline. The canvas drawing resolution remains 112×68px, while its phone CSS footprint is 95.2×57.8px; the silhouette values are the alpha-pixel envelope at rendered size.

## Screenshots

- [Prior 64×64px orb and panel, direct phone at 390px](../../artifacts/qa/modal-orb/direct-phone-390.png)
- [Refined orb and panel, direct phone at 320px](../../artifacts/qa/modal-orb/final-direct-phone-320.png)
- [Refined orb and panel, direct phone at 390px](../../artifacts/qa/modal-orb/final-direct-phone-390.png)
- [Prior 64×64px orb and panel, direct desktop at 1440px](../../artifacts/qa/modal-orb/direct-desktop-1440.png)
- [Refined orb and panel, direct desktop at 1440px](../../artifacts/qa/modal-orb/final-direct-desktop-1440.png)
- [Refined Articles-to-Projects return, phone at 320px](../../artifacts/qa/modal-orb/final-return-phone-320.png)
- [Refined Articles-to-Projects return, phone at 390px](../../artifacts/qa/modal-orb/final-return-phone-390.png)
- [Refined Articles-to-Projects return, desktop at 1440px](../../artifacts/qa/modal-orb/final-return-desktop-1440.png)

The refined orb reads clearly horizontal rather than spherical in all three direct-arrival captures. The return captures show it on the topmost modal after the cross-document transition, without the earlier flash beneath the carousel. Copy and close controls remain inside the smaller panel.

The linked still captures establish the wider orb and smaller panel. They predate the final scan-speed, close-fill, additional desktop width/top-gap, phone-width, close-control, and phone orb/height adjustments; the current states were reviewed live and measured in the browser below.

## Final live visual pass

- Reviewed the local preview at 1440×900, 390×844, and 320×720 on September 15. The horizontal dot silhouette stayed centered and visibly animated without a bright flash. The code applies `scanMul × 0.6` while retaining the preset's base rotation speed; the visual pass found the sweep subdued. A still frame alone cannot quantify the perceived 40% speed change against the earlier live version.
- The 4%-white resting close circle and grey X remained discernible on the dark panel at all three widths. At 320px, the 224px-wide panel and its copy remained within the viewport without clipping.
- Keyboard Tab focus on the close button produced a clear white outline at desktop and 390px phone widths. The hover rule retains the 4% fill while turning the X white and applying a small scale change; that rule was source-checked but not pointer-hovered in the in-app browser.
- Port 3017 had stopped before this pass. The existing Vite preview was restarted at `http://127.0.0.1:3017/` and the final Home introduction rendered in the in-app browser. No production code or other route was changed during this visual pass.

## Desktop width and orb top-gap follow-up

- The September 15 desktop follow-up narrows only that panel from 384×448px to 376×448px. A later phone-width follow-up enlarges the 320px and 390px panels from 224×396px to 236×396px and from 280×396px to 292×396px, respectively; desktop and tablet dimensions are unchanged by it.
- With flex centering, the desktop panel originally used a 20px top / 12px bottom padding split to move the complete lockup 4px down. After the close circle shrank, 18px top / 14px bottom preserves that exact rendered offset. The browser test renders the earlier 384px / symmetric-16px-padding / 52px-close style as a temporary override and measures the orb-to-panel-top difference at exactly 4px. Internal orb/title/copy/visit/close gaps remain unchanged.
- A fresh 1440×900 production-bundle capture was visually reviewed: the orb, copy, and close control remain centered and contained in the narrower panel. The local preview was reloaded in the in-app browser. The production build and 263 Node tests pass; the full browser suite, including desktop and phone modal and Projects-return checks, exits 0.
- The later 12px phone enlargement was browser-measured at 320×844 and 390×844. At that stage, both panels remained 396px tall with the same 20px title-to-copy gap; the browser test compares their actual width against the immediately preceding phone rule, rather than inferring the change from CSS text.

## Close-control sizing follow-up

- Desktop's visible circle changed from 52×52px to 48×48px and its X viewport from 14×14px to 12×12px. Phone's visible circle changed from 42×42px to 38×38px and its X viewport from 12×12px to 10×10px. Tablet retains the base 48×48px circle and 14×14px X.
- Phone's transparent `::before` extension now reaches 5px outside each side, preserving the 48px touch surface. The button top and all preceding content positions stayed put at that stage; 52px bottom padding replaced 48px to hold the content-sized panel at 396px before the later phone orb/height refinement. Desktop's 18px/14px padding split holds the accepted orb top gap while keeping the panel 448px high.
- Browser measurements and new direct-arrival captures at 320×844, 390×844, and 1440×900 confirm the button and X sizes, containment, and unchanged panel geometry. Visual review found the smaller gray X discernible against the 4%-white circle at both phone widths and desktop. The in-app preview was reloaded with the new control visible.

## Phone orb and modal-height follow-up

- Below 600px only, the 112×68px canvas renders at 95.2×57.8px, exactly 85% in both axes; the projected dots remain round. Browser alpha-pixel measurement gives an approximately 83×49px painted silhouette at both 320px and 390px.
- The content-sized phone panel changes from 396px to 383.984px rendered height, a 12.016px reduction after CSS pixel rounding. It retains the 236px/292px widths, 48px top inset, all copy and internal gaps, and the 38px close circle with its 48px touch extension. The 50.2px bottom inset balances the orb's 10.2px height reduction to hit the requested panel reduction.
- New 320×844 and 390×844 browser captures show the smaller orb centered, with copy and Close contained. Desktop remains at 376×448px with its 112×68px orb. The in-app preview was reloaded after this phone-only change.

## Checks

- Production build and 263 Node tests: `npm run check` passed.
- Production-bundle browser suite: `npm run test:browser` covers direct Home at 320/390/1440, painted silhouette ratio and round-dot geometry, exact prior/current panel measurements, copy and close containment, reduced-motion static frame, and Projects return top-layer regression at 320/390/1440.
- Visual inspection of the prior and refined direct-arrival screenshots and the refined desktop return found no clipped orb, panel overflow, or change to the dialog's copy and controls.
- Local review preview: `http://127.0.0.1:3017/` loaded in the in-app browser with the searching orb visibly rendered in the introduction.

Browser emulation is not a physical-device acceptance test. The visual direction remains Andrew's decision.
