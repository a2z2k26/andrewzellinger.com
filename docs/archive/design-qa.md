# Design QA

result: passed

## History X.com removal — September 10, 2026

final result: passed

- Decision: remove X.com from the live History contact row and public biography contact data.
- Preserved content: email, LinkedIn, GitHub, and Cal.com remain in their existing order and retain the current white, underline-free interaction treatment.
- Live evidence: `http://127.0.0.1:5175/history` was refreshed and captured inline in the Codex in-app browser at 319×907 CSS pixels and device-pixel ratio 2. The contact row visibly contains LinkedIn, GitHub, and Cal.com with no X.com link.
- DOM evidence: the live contact section contains exactly four anchors: email, LinkedIn, GitHub, and Cal.com. The X.com label and URL are absent.
- Fidelity: retained links preserve their order, labels, destinations, spacing, wrapping, color, hover treatment, and keyboard-focus behavior. No History copy, media, section spacing, or carousel behavior changed.
- Verification: 11 focused biography and History tests passed. The production build and all 229 source tests passed; `git diff --check` also passed.
- Residual limits: visual verification used the Codex in-app Chromium browser. Safari, Firefox, and physical devices were not recertified for this isolated content removal.

## History portrait reversion — September 10, 2026

final result: passed

- Decision: restore `public/images/history/az-headshot-extended-v1.png` as the live History portrait and return the accessibility label to `Andrew Zellinger in profile`.
- Reversibility: retain `public/images/history/az-headshot-extended-v2.png` as an inactive frontal alternative; no generated asset was deleted.
- Scope: preserve the existing 3:2 frame, centered crop behavior, counterflow transition preload, History carousel motion, layout, and copy.
- Live evidence: `http://127.0.0.1:5175/history` was refreshed and captured inline in the Codex in-app browser at 319×907 CSS pixels and device-pixel ratio 2. The rendered background resolves to `/images/history/az-headshot-extended-v1.png`, and the focused capture visibly shows the earlier side-profile portrait wearing the Mets cap.
- Accessibility: the live element reports `Andrew Zellinger in profile`, matching the restored pose.
- Fidelity: the earlier portrait asset itself was not edited or recompressed. Frame dimensions, centered background positioning, 3:2 crop, surrounding layout, and opening-copy rhythm remain unchanged.
- Verification: 38 focused biography, History-carousel, portrait-study, and media-surface tests passed. The production build and all 229 source tests passed; `git diff --check` also passed.
- Residual limits: the available browser pane was compact. The asset mapping and shared geometry are route-wide, but Safari, Firefox, and physical devices were not recertified for this isolated reversion.

## History portrait replacement — September 10, 2026

final result: passed

- Source visual truth: `/Users/az/Documents/A-Z Profile/A-Z Avatar/ig_09eb24a3da62c2db016a1b561a3ec481998862ff72e56e8aa0.png`, supplied at 1254×1254 pixels, is the exact identity and central-image source. The former active portrait is `public/images/history/az-headshot-extended-v1.png` at 1536×1024.
- Intended implementation: preserve the supplied square portrait in a centered 1024×1024 region and extend only its gray studio background laterally to a 1536×1024 3:2 canvas. The frontal figure remains centered and more prominent than the prior profile portrait while keeping modest headroom and side space.
- Asset workflow: built-in ImageGen produced the matching lateral background extension; deterministic compositing restored the scaled original square source across the complete center region so generated facial, clothing, and central-background pixels are not shipped. Final workspace asset: `public/images/history/az-headshot-extended-v2.png`.
- Rendered implementation: `http://127.0.0.1:5175/history`, refreshed and captured inline from the Codex in-app browser at a 319×907 CSS viewport and device-pixel ratio 2. The active CSS resolves to `/images/history/az-headshot-extended-v2.png` at centered 50%/50% positioning inside the existing 271×180.664 CSS-pixel compact frame.
- Full-view and focused evidence: the live History capture shows the new frontal portrait centered in the established 3:2 media slot, with intact headroom, visible shoulders, balanced gray side space, and no overlay. The figure is visibly more prominent than the earlier profile portrait while the surrounding page hierarchy and opening copy remain unchanged.
- Identity and pixel preservation: an exact PSNR comparison between the shipped asset's centered 1024×1024 crop and the supplied source scaled to 1024×1024 returned infinite PSNR across RGB. This confirms pixel identity across the complete central region; only the 256px left and right background bands are generated.
- Fonts and typography: no type, copy, wrapping, or text hierarchy changed.
- Spacing and layout rhythm: portrait frame dimensions, aspect ratio, crop position, carousel geometry, and opening-copy spacing are unchanged.
- Colors and visual tokens: the source's neutral gray studio background and black sweater remain intact; the generated lateral bands continue the same tonal field without added color treatment.
- Image quality and asset fidelity: the output is a 1536×1024 PNG. The supplied face, body, clothing, lighting, expression, and central background are retained exactly after deterministic scaling; no facial generation is shipped.
- Copy and accessibility: page copy is unchanged. The image label now accurately reads `Portrait of Andrew Zellinger` instead of describing the former profile pose.
- Comparison history: the first generated outpaint established the lateral background and framing but subtly regenerated the subject, so it was rejected as the final asset. The approved workspace version composites the exact source back into the center and uses generated pixels only outside that source region.
- Verification: 38 focused biography, History-carousel, portrait-study, and media-surface tests passed. The production build packaged the new asset and all 229 source tests passed; `git diff --check` also passed.
- Residual limits: the available live browser pane was compact, so a same-size desktop screenshot comparison was not available. Safari, Firefox, and physical devices were not recertified for this isolated asset replacement.

## Experience register density and casing — September 10, 2026

final result: passed

- Source visual truth: `/var/folders/00/nrg_xrgs33g5v8nm_s1zn77r0000gn/T/TemporaryItems/NSIRD_screencaptureui_U2umof/Screenshot 2026-09-10 at 3.57.44 PM.png`. The supplied 1758×1820 desktop screenshot identifies uppercase organization names, generous row spacing, and a wide three-column register as the change target.
- Rendered implementation: `http://127.0.0.1:5175/history`, refreshed and captured inline from the Codex in-app browser at a 319×907 CSS viewport and device-pixel ratio 2. The supplied desktop source and compact live capture are not treated as a pixel-matched comparison.
- Full-view and focused evidence: the focused compact capture shows authored casing throughout the visible register, including Independent practice, Cosmos Holodeck, Avantos, Sketch / Amazon Fire TV, SketchDeck, Fi, Live Auctioneers, Modern Age, AKQA, I&Co / Audible Sleep, and Greater Than One. Computed style reports `text-transform: none`; the first organization resolves to `Independent practice`.
- Desktop layout evidence: the 992px+ stylesheet constrains the register to 90%, reduces row gap to 10px, sets column gap to 16px, and tightens tracks to `1.15fr / .9fr / auto`. Focused regression coverage asserts all four desktop values while retaining the base and phone layouts.
- Fonts and typography: organization font family, 15px size, 500 weight, leading, tracking, and white color are unchanged. Roles and dates retain their prior Geist/mono typography and colors.
- Spacing and layout rhythm: only the desktop register width, row gap, column gap, and track proportions changed. Section separation, heading gap, content order, and phone two-row structure remain unchanged.
- Colors and visual tokens: no palette or interaction-state tokens changed.
- Image quality and asset fidelity: no media or image assets changed.
- Copy and content: organization, role, and date records are unchanged. Title case is presentation-only and preserves intentional acronyms and brand styling.
- Comparison history: the supplied source showed uppercase organizations with a wide, loose desktop register. The live compact view confirms casing and responsive preservation; static CSS and focused tests verify the requested desktop measure and rhythm.
- Verification: 11 focused biography and History tests passed. The production build and all 229 source tests passed; `git diff --check` also passed.
- Residual limits: the available live browser pane was compact, so desktop geometry was verified from the shipped CSS and regression tests rather than a same-size browser capture. Safari, Firefox, and physical devices were not recertified for this isolated refinement.

## Select Clients casing and separators — September 10, 2026

final result: passed

- Source visual truth: `/var/folders/00/nrg_xrgs33g5v8nm_s1zn77r0000gn/T/TemporaryItems/NSIRD_screencaptureui_SJtozW/Screenshot 2026-09-10 at 3.56.42 PM.png`. The supplied 1844Õ726 source screenshot identifies uppercase client names and centered-dot separators as the change target.
- Rendered implementation: `http://127.0.0.1:5175/history`, captured and emitted inline from the Codex in-app browser at a 319×907 CSS viewport and device-pixel ratio 2. The source and implementation are not treated as a pixel-matched layout comparison because the source isolates a desktop region while the available live browser is compact.
- Full-view and focused evidence: the source and live implementation were inspected in the same task. The focused live capture shows authored title casing and comma-space separators across the complete client list. Computed style reports `text-transform: none`; DOM text contains commas and no middle-dot characters.
- Fonts and typography: Geist family, 16px body size, weight, leading, tracking, white color, and the uppercase mono Select Clients label remain unchanged. Intentional brand forms such as IBM, LG, Fi, PwC, Coca-Cola, McDonald's, and WeWork are preserved from source records.
- Spacing and layout rhythm: section position, width, wrapping behavior, and gap to Work With Me are unchanged; natural line breaks shift only because commas are narrower than the former spaced dots.
- Colors and visual tokens: no color or state tokens changed.
- Image quality and asset fidelity: no media or image assets changed.
- Copy and content: client names and ordering are unchanged. Only presentation casing and separators changed.
- Comparison history: the sole P1 mismatch was the uppercase, dot-separated presentation shown in the supplied source. The renderer now joins names with `, ` and the live style no longer uppercases them. Post-fix DOM and visual evidence confirm both corrections.
- Verification: focused biography and History-carousel tests passed. The production build and all 229 source tests passed; `git diff --check` also passed.
- Residual limits: visual verification used the Codex in-app Chromium browser. Safari, Firefox, and physical devices were not recertified for this isolated typography change.

## History tools-section removal — September 10, 2026

final result: passed

- Source visual truth: `/var/folders/00/nrg_xrgs33g5v8nm_s1zn77r0000gn/T/TemporaryItems/NSIRD_screencaptureui_IpQ9Kj/Screenshot 2026-09-10 at 3.56.05 PM.png`. The supplied 1874Ö70 source screenshot identifies the complete Tools & Technologies section as the removal target.
- Rendered implementation: `http://127.0.0.1:5175/history`, captured and emitted inline from the Codex in-app browser at a 319×907 CSS viewport and device-pixel ratio 2. The source and implementation are not treated as a pixel-matched layout comparison because the source isolates a desktop region while the available live browser is compact.
- Full-view and focused evidence: the source and live implementation were inspected in the same task. Live DOM inspection found zero `.biography-block--stack` or `.biography-tools__list` nodes and no Tools & Technologies heading. The focused live capture shows Work With Me following Select Clients directly with the expected section separation.
- Fonts and typography: all retained History typography, wrapping, weights, and casing remain unchanged.
- Spacing and layout rhythm: the removed section contributes no DOM height or reserved spacing. Work With Me inherits the shared 64px desktop/tablet and 48px phone section separation.
- Colors and visual tokens: no palette, opacity, border, or interaction-state treatment changed.
- Image quality and asset fidelity: no media or image assets changed.
- Copy and content: only the requested Tools & Technologies presentation was removed. Its source records remain inactive in `biography-content.js`; Select Clients and Work With Me retain their complete copy.
- Comparison history: the sole P1 mismatch was the unwanted Tools & Technologies block. Its renderer and unused presentation hooks were removed. The post-fix capture and DOM inspection confirm a direct Select Clients to Work With Me sequence with no empty stack container.
- Verification: focused biography and History-carousel tests passed. The production build and all 229 source tests passed; `git diff --check` also passed.
- Residual limits: visual verification used the Codex in-app Chromium browser. Safari, Firefox, and physical devices were not recertified for this isolated deletion.

## History capability-block removal — September 10, 2026

final result: passed

- Source visual truth: `/var/folders/00/nrg_xrgs33g5v8nm_s1zn77r0000gn/T/TemporaryItems/NSIRD_screencaptureui_vzfpnD/Screenshot 2026-09-10 at 3.55.17 PM.png`. The supplied 1844×640 source screenshot identifies AI Systems, Product, Delivery, and Direction as the complete removal target.
- Rendered implementation: `http://127.0.0.1:5175/history`, captured and emitted inline from the Codex in-app browser at a 319×907 CSS viewport and device-pixel ratio 2. The source and implementation are not treated as a pixel-matched layout comparison because the supplied source isolates a desktop region while the available live browser is compact.
- Full-view and focused evidence: the source and live implementation were inspected in the same task. Live DOM inspection found zero `.biography-capability` or `.biography-capabilities` nodes and none of the four labels. Select Clients remains and now follows Education as an ordinary History section; the focused live capture shows it flowing directly into Tools & Technologies without a residual capability gap.
- Fonts and typography: the retained History sections preserve their existing Geist and Geist Mono styles, sizes, weights, leading, tracking, casing, and wrapping.
- Spacing and layout rhythm: the removed block contributes no DOM height or reserved margin. Select Clients inherits the shared 64px desktop/tablet and 48px phone section separation; its internal 24px label gap remains unchanged.
- Colors and visual tokens: no palette, opacity, border, or state treatment changed.
- Image quality and asset fidelity: the clean History portrait from the prior pass remains untouched; no assets changed.
- Copy and content: only the four requested capability presentations were removed. Select Clients, Tools & Technologies, Experience, Education, Work With Me, and Contact remain unchanged. Capability source records remain inactive in `biography-content.js` for reversibility.
- Comparison history: the sole P1 mismatch was the unwanted four-part capability presentation. Rendering and now-unused presentation hooks were removed. The post-fix capture and DOM inspection show the section sequence closing correctly with no capability nodes.
- Verification: focused biography and History-carousel tests passed. The production build and all 229 source tests passed; `git diff --check` also passed.
- Residual limits: visual verification used the Codex in-app Chromium browser. Safari, Firefox, and physical devices were not recertified for this isolated deletion.

## History portrait overlay removal — September 10, 2026

final result: passed

- Source visual truth: `/var/folders/00/nrg_xrgs33g5v8nm_s1zn77r0000gn/T/TemporaryItems/NSIRD_screencaptureui_Vdshx4/Screenshot 2026-09-10 at 3.54.03 PM.png`, supplied at 1814×1410 pixels and displayed by the task at 1792×1392 pixels. It identifies the colorized `A.` overlay as the sole removal target.
- Rendered implementation: `http://127.0.0.1:5175/history`, captured and emitted inline from the Codex in-app browser. The CUA capture is ephemeral and exposes no filesystem path. Browser evidence used a 319×907 CSS viewport at device-pixel ratio 2. The source and implementation are not treated as a pixel-matched layout comparison because the supplied source is desktop and the available live viewport is compact.
- Full-view and focused evidence: the supplied source and live implementation were inspected in the same task. The source visibly contains the orange `A.`; the revised portrait is the unmodified `az-headshot-extended-v1.png` with no overlay. The portrait itself is fully legible in the full-view compact capture, so no separate detail crop was needed. Live DOM inspection found zero `.portrait-artwork-layer` or `.portrait-artwork-stage` nodes and retained the expected portrait background URL.
- Fonts and typography: no text styles, font loading, hierarchy, wrapping, or truncation changed; the removed mark no longer introduces a portrait-only font layer.
- Spacing and layout rhythm: portrait dimensions, crop, frame, History carousel geometry, surrounding gaps, and responsive flow are unchanged. At the inspected viewport the portrait remains 271×180.664 CSS pixels at x24/y198.875.
- Colors and visual tokens: the orange blended overlay is absent. The portrait, black canvas, white text, gray metadata, and navigation colors are unchanged.
- Image quality and asset fidelity: the original local portrait remains the active `background-image`; it was not regenerated, edited, stretched, or replaced.
- Copy and content: no History copy, labels, links, or metadata changed.
- Comparison history: the only P1 mismatch was the unwanted colorized `A.` shown in the supplied source. The History route mapping was removed while keeping the artwork implementation archived. The post-fix live capture and DOM inspection confirm the overlay is absent with the portrait and layout intact.
- Verification: focused History, biography, and portrait-artwork tests passed. The production build and all 229 source tests passed; `git diff --check` also passed.
- Residual limits: visual verification used the Codex in-app Chromium browser. Desktop absence is guaranteed by the route-level no-mount rule and regression coverage, but Safari, Firefox, and physical devices were not recertified for this isolated deletion.

## Page-title character cascade

The fixed-mask GSAP title cascade, descender-clearance correction, and Projects initialization fix are documented in [title-motion-qa.md](docs/title-motion-qa.md). The approved rail sweep and same-heading detail transitions are retained. Main remains untouched.

## Case-study → Home correction — September 8, 2026

final result: passed

- **P1 resolved:** Home links from case studies used the old fade. The actual click-handler regression failed because this route pair never entered preparation, and the page-swap regression separately failed because detail surfaces were rejected. The route now joins the existing upward sweep; a temporary viewport capture preserves the visible reading pixels without capturing all circular detail sets or the hidden Projects collection. Resize/settle restores original inline styles. Close detail, detail entry, and other detail route pairs are unchanged.
- **Source and comparison:** opened `docs/motion-audit/unified-sweep/projects-home-mid.png` and `case-home-desktop-mid.png` together in the same comparison input. Both are 1440×1000 pixels at the same CSS viewport, 1:1 density. These are different outgoing content and approximate animation moments, so the comparison establishes matching full-rail direction, masking, fixed chrome, and incoming Home treatment, not pixel-identical intermediate content. Matched Home endpoints `home-before.png` and `case-home-desktop-end.png` were also opened together; they preserve the portrait crop, title, frame, and chrome. The full-resolution controls and headings are readable; separate focused crops were not needed.
- **Fidelity:** existing Geist typography and wrapping, 24px desktop frame and half split, black/white palette and orange navigation state, original portrait/project assets, and all public copy are unchanged. The detail title's temporary capture width aligns it with the shared left field; resting detail geometry is restored. No image regeneration, stretching, new surface color, or content changes.
- **Browser evidence:** direct-loaded Andrew Eccles → logo → Home swept upward at 1440×1000; Back restored 42623px. After scrolling another 1000px, the in-page Home link also swept; Back restored 43623px exactly with a static rail and no residual transform. Direct-detail Close returned to populated Projects. Projects → Audible Sleep (in-page expansion) → logo → Home also swept despite the hidden collection DOM; Back and Close restored all 19 source cards. Phone 390×844 return completed with the existing compact geometry treatment. Captures: `case-home-desktop-before/mid/end.png`, `case-home-scrolled-before/mid.png`, `case-home-inline-mid.png`, and `case-home-phone-before/mid/end.png` in the same folder. The exploratory 440px `case-home-before.png` is not used as desktop evidence.
- **Verification:** 142/142 source tests, production build, 7/7 Sites tests passed. Browser error/warning log was empty after the round trip. No temporary debug instrumentation. Main unchanged; no merge, commit, deployment, or external write.
- **Limits:** Chromium in-app preview only. Safari/Firefox, physical devices, OS reduced-motion changes, and throttled media were not re-certified in this correction. Other detail-to-page transitions intentionally retain their prior behavior. No remaining actionable P0/P1/P2 issue in this confirmed Home-return scope; visual acceptance remains Andrew's.

Completed checklist: reproduce the confirmed path; test route selection and detail capture before the fix; reuse the existing sweep; verify direct and in-page detail departures, Back, Close, phone, and unchanged Home endpoint.

## Unified upward rail sweep — September 8, 2026

final result: passed

Scope: the current experiment's Home, Projects, Articles, and History transitions, not a whole-site redesign or cross-browser certification. Andrew's review replaces differing top-level transition families with one coherent upward right-rail sweep. Detail-reading choreography is unchanged. Main remains clean and unmodified.

### Source truth, comparison, and fidelity

- Source motion: the successful existing Home→Projects full-rail exchange, captured in `docs/motion-audit/implementation/forward-04.png`, with Andrew's explicit correction to upward travel and uniform coverage. Timing, fixed chrome, full-column masking, and opposing title movement are retained; changing the direction is intentional, not fidelity drift.
- Rendered implementation: `docs/motion-audit/unified-sweep/home-projects-mid.png`, `home-articles-mid.png`, `articles-history-mid.png`, and `history-projects-mid.png` were opened together in one comparison input. They show the same full-rail, upward exchange across photographic, project, editorial, and biography surfaces, with stationary control/identity. Full-resolution images make these large motion surfaces legible; no separate focused crop was needed.
- Matched History endpoint: source `docs/motion-audit/screenshots/07-history-desktop-1440.png` and implementation `docs/motion-audit/unified-sweep/history-desktop.png` were opened together. Both are 1440×1000 pixels at 1440×1000 CSS viewport (1:1); the source capture has lower sharpness, so compression differences were not treated as layout drift. Portrait, frame, lead wrapping, title, and supporting content align.
- Matched deep-reading state: `history-scrolled-before.png` and `history-back-end.png` in the unified-sweep folder were opened together at 1440×1000, 1:1. Exact scroll position and content geometry match after Back, including attempted wheel input during arrival.
- Compact evidence: `phone-home-articles-mid.png`, `phone-articles-end.png`, `phone-articles-history-mid.png`, `phone-history-end.png`, at 390×844 pixels/CSS, 1:1. Existing responsive composition is preserved; only the bounded lead-media region moves, not the entire long document. Tablet/desktop-boundary captures are `history-projects-834-mid.png` (834×1112) and `history-projects-992-mid.png` (992×900).
- Fonts/typography: Geist family, weights, line height, title hierarchy, and editorial wrapping preserved. Title clipping is limited to the animated exchange, not the resting heading.
- Spacing/layout: fixed desktop 24px outer frame, 688×952 rail at 1440×1000, existing split and control origin preserved. History's temporary viewport does not change native content height. No tested horizontal overflow.
- Colors/tokens: black/white palette, existing subdued metadata, orange active navigation, and control treatment unchanged. No new shutters, flashes, borders, or color layer.
- Image fidelity: original supplied portraits/project imagery and existing article landscape retained. No scaling or substitute assets introduced; snapshots match the actual viewport geometry.
- Copy/content: no public factual copy changed. Temporary destination status now accurately names Articles/History as well as Home/Projects.

### Findings and iteration history

1. [P1, resolved] The old downward right-rail entry reversed into upward autoplay and only covered Home/Projects. Failing tests reproduced scope/direction mismatch. All twelve top-level pairs now use upward out/in, and arrival clears prior impulse/direction without clearing pause preferences. Midpoint captures and browser direction checks confirm this.
2. [P1, resolved] Scrolling during frozen History capture could move the document and jump at release. The reviewer reproduced an active scroll tween during hard pause. Regression-first input gating now cancels those tweens and rebases on release. Browser Back at 4227px retained 4227px before, during attempted input, and after cleanup; matched captures show no geometry jump.
3. [P1, resolved] A pending preparation survived pagehide and could redirect a cached return. Actual-source regression reproduced the stale commit; pagehide cancellation now passes along with superseding navigation tests.
4. No remaining actionable P0/P1/P2 differences in the tested scope. Root report and historical motion proposal now clearly identify the superseded route-specific approach.

### Verification and residual limits

All twelve desktop pairs reached `rail-sweep-up`, then idle with zero retained transition names; collection arrivals were up. Mobile menu navigation, 834/992 boundary, Back/Forward, explicit Pause persistence, downward-input→Back reset, History frozen-input cleanup, and development reduced-motion departure were checked. Final inspected browser logs: no errors/warnings. Source suite 139/139; production build, seven Sites tests, and diff whitespace check pass.

Safari/Firefox, physical touch/safe-area devices, OS reduced-motion changes, throttled cold media, constrained-device frame performance, and actual bfcache admission remain unverified. Product Design guidance drove the matched visual comparisons and viewport-specific QA; test success is not user visual acceptance. Nothing has been merged or deployed. See `docs/motion-audit/unified-sweep/README.md` for the durable handoff.

## Stabilization and Home ↔ Projects Counterflow — September 8, 2026

final result: passed

Scope: local A1/A2 implementation on the isolated design-elevation experiment. This result covers the comparisons and interactions listed here; it is not approval to merge, completion of T2–T6, or a whole-site accessibility/cross-browser certification. Prior reports below are historical snapshots.

### Source truth and matched comparison

The source target is the existing experiment, with Andrew's approved independent-column motion direction and the corrections in `docs/motion-audit/motion-proposal.md`. Existing assets, factual copy, black canvas, Geist typography, split, and stationary chrome remain the foundation. Baseline defects are intentionally corrected, not copied.

| State / CSS viewport | Source capture | Revised capture | Pixel size / normalization |
| --- | --- | --- | --- |
| Home, 1440×1000 | `docs/motion-audit/screenshots/02-home-desktop-1440.png` | `docs/motion-audit/implementation/home-desktop-1440.png` | Both 1440×1000, 1:1 CSS pixels |
| Open menu, 1280×400 | `docs/motion-audit/screenshots/22-menu-short-desktop-1280x400.png` | `docs/motion-audit/implementation/menu-short-desktop.png` | Both 1280×400, 1:1 CSS pixels |
| Article opening, 390×844 | `docs/motion-audit/screenshots/13-article-detail-phone-390.png` | `docs/motion-audit/implementation/article-detail-phone-390.png` | Both 390×844, 1:1 CSS pixels |

Source and implementation images were opened together in the same comparison input. Full-view inspection verified framing, image crop, title wrapping, and chrome. Separate image crops were unnecessary: the menu boundaries, 44px targets, phone text/control collision, and complete desktop heading are directly legible at these capture sizes. Baseline images have softer raster quality; that difference was not mistaken for a font change. A mid-article resize capture is additional interaction evidence, not a falsely matched opening-state comparison.

### Findings and correction history

1. P1: short-desktop menu links escaped a height-scaled panel. Replaced container scaling with content-derived dimensions and a bottom origin. Revised 1280×400 capture shows all four targets within the white panel and a separate fixed X. Matched comparison passed.
2. P2: phone X covered live article sentences. Added a protected bottom region and scroll/focus inset. Revised 390×844 opening capture keeps the original image, header, and paragraph positions while separating the reading area from the control. Matched comparison passed.
3. P2: Home context text collided with its title on a 400px-tall desktop. Suppressed context/reading decoration at constrained desktop heights. Revised short-menu screenshot shows a clear title and retained navigation/clock.
4. P1: moving media snapshot painted over half the center circle. Assigned stationary chrome its own higher native transition layer and initialized the control synchronously. Forward/reverse frame sequences show the full control throughout the sampled motion.
5. P2: compact snapshot switched between differently proportioned Home and Projects frames abruptly. Enabled native geometry interpolation and preserved snapshot aspect ratios. Compact forward captures show a moving image edge without stretching the figure.
6. P1: closed menu initialized through a full reverse playback. Added an endpoint guard while preserving mid-flight reversal; repeated direct loads remained closed in inspected states. Behavioral regression test passes.
7. P1: Back without a cached document reset a reading article to its header. Persisted a semantic block anchor in history state and restored it for Back/reload. Live retest returned the same paragraph within one pixel and did not steal focus.
8. P1: deterministic coordination tests reproduced a delayed internal navigation overriding a newer native external/hash click. Moved cancellation before native-link eligibility filtering, while preserving modified/new-tab/download behavior. All twelve behavioral coordination tests now pass; these race cases are harness evidence, not external-site browser navigation.

No actionable P0/P1/P2 mismatch remains in these inspected A1/A2 states. The broader audit remains the backlog, not an implied completed checklist.

### Required fidelity surfaces

- Typography: existing Geist family/weights, title placement, desktop wrapping, and source case preserved. Intentional breakpoint correction changes 991px title size to 68.379px versus 68.448px at 992px.
- Spacing/layout: preserved desktop half split and 24px exterior frame. Short-menu sizing and the phone control strip are intentional corrections. At 1920px, the media rail measures x968–1896, y24–1056; the title region is exactly half width.
- Colors/tokens: black canvas, white shapes, orange active indication retained. Collection metadata now uses `rgb(147,147,143)` at opacity 1 instead of inheriting 0.45 opacity.
- Image fidelity: original local portrait and approved project images retained, with no new assets or replacement drawings. Native snapshots preserve the existing crop; compact snapshots preserve proportions during geometry changes.
- Content: no project, article, or biography factual copy changed. New control/status copy is limited to Pause/Resume motion and the bounded preparation indication.

### Interaction and engineering verification

- Live native forward/reverse desktop motion, compact menu-triggered navigation, browser Back, deep-article Close, pause persistence, 1440→390→1440 reading-anchor recovery, 991/992 continuity, 1920px endpoint, and resize during transition checked.
- Rapid Articles→Projects intent finished on Projects with no late redirect or loading indicator.
- Full source suite: 130 tests passed, including twelve behavioral route-coordination checks. Production build, seven Sites package tests, and `git diff --check` passed.
- Final inspected browser logs contained no errors or warnings.
- Evidence and implementation details: `docs/motion-audit/implementation/README.md`.

### Residual limits / next action

Safari/Firefox, physical touch/safe-area devices, OS-level reduced-motion switching, 200% text zoom, constrained-device frame profiling, and throttled cold-media behavior remain unverified. Development reduced-motion and deterministic readiness/lifecycle tests are narrower evidence. Andrew's visual review of this first transition family is the next gate; nothing is merged into main.

## Geist-wide typography experiment — 2026-09-08

result: passed

- Scope: every visible selector previously assigned Times Newer Roman now uses Geist Sans Medium (`500`) while preserving its existing size, line height, tracking, capitalization, and layout.
- Updated surfaces: global page headings, Projects and Articles collection titles, detail titles, the History editorial lead, generic detail ledes, and generic detail-section prose.
- The Times Newer Roman asset and display token remain dormant for a reversible rollback; no visible selector references them.
- Browser check: Codex in-app browser at 668 × 907 on Home, Projects, Articles, one Article Detail, and History.
- Computed styles verified in the first title pass: page, project, article, and detail titles resolve to `Geist, sans-serif` at weight `500`; the expanded History and detail-prose pass is verified separately below.
- Visual check: title geometry, wrapping, spacing, media layout, and center-control placement remained intact at the tested viewport.
- Focused typography regression tests: 20 of 20 passed. Full suite: 91 of 91 passed. Production build and Sites packaging checks: passed.
- Expanded browser check: History lead resolves to `Geist, sans-serif` at weight `500`; the case-study detail contains zero visible elements whose computed font family includes Times. Existing Geist-specific description and body overrides remain regular weight, preserving their prior hierarchy.

## Center navigation storyboard pass — 2026-09-08

result: passed

- Visual sources: `Screenshot 2026-09-08 at 3.43.24 PM.png` and `Screenshot 2026-09-08 at 3.44.02 PM.png` supplied by Andrew.
- Implementation: `src/effects/center-control.js`, `src/effects/center-control.css`, and `src/effects/center-gooey-surface.jsx`.
- Comparison artifact: `docs/qa/center-menu-storyboard-comparison-2026-09-08.png`.
- Browser check: Codex in-app browser at 668 × 907 on `http://127.0.0.1:5178/`.
- Open sequence verified as: plus circle, connected bud, same-width connected oval, large connected oval, detached two-link panel, detached four-link panel.
- Close runs the exact Open animation instance backward from its current progress; panel geometry, link thresholds, menu-list position, and Plus/X rotation all resolve from that shared timeline.
- Labels remain hidden until their containing silhouette can hold them; no text paints over the portrait outside the white panel.
- Final menu panel is separated from the circular control by 30px, 6px more than the preceding state.
- The six storyboard frames now form one interruptible 900ms Web Animations timeline with symmetric `cubic-bezier(.45,0,.55,1)` segment easing. The `liquid-gooey` observer tracks that geometry directly and no longer adds a separate damped spring behind it.
- Animated surface radii remain pixel-based from bud through final panel, eliminating the percentage-to-pixel interpolation flash. Open and Close therefore sample identical radius values at identical progress points.
- Live in-app browser verification: Open and Close both traversed the detached panel, connected oval, emerging bud, and reabsorbed circle states; the final open state retained the approved 30px separation.
- Focused center-control tests: 5 of 5 passed. Full suite: 91 of 91 passed. Production build: passed.

Reviewed: 2026-09-03

## Scope

- Five retained routes: Selected works (`/`), Archive, Articles, Index, and Biography (`/info`).
- Removed routes: Photography, Video, Discography, and Projects.
- Desktop reference viewport: 1440 x 900.
- Mobile reference viewport: 390 x 844.
- No video surfaces or video-file references remain in the retained site.
- Articles is intentionally a title-only placeholder. Index is temporarily a duplicate of Selected works.

## Fidelity evidence

- The circular menu source contains Selected works, Archive, Articles, Index, and Biography on every authored page.
- Source CSS, font, imagery, content order, typography, spacing, breakpoints, and Webflow interaction runtime are localized rather than recreated approximately.
- The background is solid black with no grain/noise overlay, and Home-page projects have no divider rules between them.
- The original three routes retain their prior 1440 x 900 and 390 x 844 checks. Browser visual QA was not requested for this route addition.

## Interaction evidence

- Circular navigation opens, closes, supports keyboard activation, and navigates to clean route URLs.
- The Home carousel advances to different slides.
- Biography accordions expand from zero height and support keyboard activation.
- Archive hover presentation retains the source markup and source CSS behavior.
- Photography, Video, Discography, and Projects return 404 instead of falling back to Home.

## Accessibility

- Navigation and accordion controls are keyboard reachable and expose expanded state.
- Source focus-visible treatment and image alternative text are preserved.
- Reduced-motion preferences disable circular text rotation.
- Mobile tap targets and responsive stacking match the reference implementation.

## Engineering verification

- `npm run build`: passed.
- `npm run test:sites`: passed.
- Six of six tests passed, including explicit removed-route coverage.
- Asset localization manifest: 233 localized assets, zero skipped video references, and zero download failures.
- Asset pruning removed 962 unreferenced files totaling 165.45 MB across the two cleanup passes.
- The production `/index` artifact is an exact copy of the Selected works artifact.
- Remote asset hotlinks: none found in HTML or CSS.
