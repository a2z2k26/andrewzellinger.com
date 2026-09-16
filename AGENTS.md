# Working on this portfolio

## Latest approved refinements

- September 15 modal destination: display `temporary.com` in the Projects welcome modal and link it to `https://andrewzellinger.framer.website/`. Preserve the `visit` label, new-tab behavior, security relationship, typography, spacing, modal behavior, and every non-link element.

- September 15 History portrait orb verdict: remove the trial thinking-orb overlay completely from the profile portrait and all desktop carousel copies. Keep the source portrait, framing, History content/motion, and the separate Projects welcome-modal orb unchanged. Do not restore the earlier SVG globe.

- September 15 phone orb and modal height: below 600px, render the searching orb canvas at 85% of its prior 112×68px footprint (95.2×57.8px), uniformly scaling the dots, and shorten the content-sized welcome panel by 12px from 396px to about 384px through a 50.2px bottom inset. Preserve the phone panel width, 48px top inset, copy, internal gaps, 38px close circle and 48px touch target; desktop/tablet and the orb's animation/reduced-motion behavior remain unchanged.

- September 15 welcome close-button sizing: desktop (992px+) visible circle is 48×48px with a 12×12px X; phone (below 600px) visible circle is 38×38px with a 10×10px X and an invisible 5px perimeter extension retaining a 48px touch target. Tablet stays at 48×48px with a 14×14px X. Preserve the desktop orb's rendered top gap and the phone panel's 396px content-sized height while resizing the close control; keep all copy, modal motion, return gating and reduced-motion behavior unchanged.

- September 15 History portrait refinement: remove the ghosted animated globe over Andrew's profile photo at every breakpoint and from desktop carousel copies. Preserve the portrait image, its framing, History content/motion, and the separate Projects introduction orb.

- September 15 mobile modal width refinement: below 600px, widen the Projects welcome panel by exactly 12px using `min(292px, calc(100vw - 84px))`. Keep desktop/tablet dimensions, the close touch target, copy, motion, and return-layer behavior unchanged.

- September 15 desktop modal refinement: narrow the Projects welcome panel by another 8px, from 384px to 376px, without changing its 448px height or phone/tablet dimensions. Increase the rendered gap from panel top to thinking orb by exactly 4px, preserving the centered content group's internal gaps, modal behavior and close control.

- September 15 orb scan and close-circle refinement: slow only the searching orb's bright highlight sweep to 60% of its previous speed, keeping the globe's base rotation unchanged. Set the welcome modal close circle's white background fill to 4% opacity at rest and hover; preserve its size, X contrast, focus ring and touch target.

- September 15 introduction refinement: widen the searching orb's projected silhouette to about 1.7:1 using the package's public frame geometry; leave its dots round and its vertical presence modestly larger. Reduce the modal panel's rendered width and height by 16px, and its title-to-paragraph gap by exactly 4px from the accepted baseline. Keep the phone's content-sized panel at 396px actual height by balancing the tighter gap with 48px top/bottom padding. Preserve all existing copy, controls, motion, reduced-motion behavior, return-layer gating and History's independent globe.

- September 15 introduction icon swap: replace only the Projects welcome modal globe with the 64px `thinking-orbs` `searching` visual. Keep the site DOM-first by using the package's canvas engine rather than introducing a React root. Preserve exact modal copy, dialog/close behavior, responsive geometry, reduced motion, the entrance/title choreography and the September 14 top-layer return gate. History's portrait globe is unchanged.

- September 14 Projects-return modal layering: on cross-document returns to Projects, do not mount the introduction until the browser view-transition top layer has finished. The modal must be topmost in every visible frame; a short intentional delay is preferable to painting beneath the returning carousel. Preserve direct-load behavior, reduced motion, the accepted modal entrance, title cascade and collection return choreography.

- September 12 phone detail upper boundary: isolated case-study and article detail views must begin at the document's true upper scroll boundary. Never expose collection-only footer actions above a selected story when the reader scrolls upward. Preserve collection actions on collection pages and leave tablet/desktop detail behavior unchanged.

- September 12 motion correction: Andrew rejected the phone title-cascade removal and found the additions too subtle. Preserve the established character title animation at every breakpoint; additions should remain visibly legible. The initial entrance waits for the introduction modal to close. Phone reading uses a masked title followed by metadata and lede, with a 12px / 60ms structural vocabulary. Visual acceptance remains Andrew's decision.

- September 12 motion continuation: implement the approved D1–D4 phone motion profile below 600px: coherent collection changes, coordinated reading entry/return, restrained heading and structural reveals, and tactile controls. Preserve desktop/tablet choreography and resting layout. Use `src/motion/profile.js` for shared phone timing and `docs/motion-system.md` for behavior, cancellation and QA. Keep native reading, exact collection returns and reduced-motion support.

- September 12 resume spacing follow-up: use the shared `--biography-section-gap` between the second introduction paragraph and Download resume, replacing the prior 24px gap (64px desktop/tablet, 40px mobile).

- September 12 History resume download: show a left-aligned “Download resume” control 24px below the second introduction paragraph at every breakpoint, reusing the Cal.com/Email button style. Andrew explicitly authorized serving the supplied `Resume/Andrew Zellinger [2026].pdf` as `/downloads/andrew-zellinger-resume-2026.pdf`; preserve the ignored original and its bytes.

- September 12 introduction copy follow-up: use exactly “Years of building with AI has reshaped my design practice. This site documents what came before, here’s what’s next:” at every breakpoint. Preserve the chosen “has” wording and all styling.

- September 12 mobile introduction modal: increase its content-sized height by 16px using 56px top/bottom padding (previously 48px). Use a 65% black page dimmer below 600px. Preserve the dark panel, 42px close circle, internal gaps, typography and desktop/tablet styling.

## Scope and verification

- Keep changes within Andrew's requested scope. Repository grooming does not authorize redesign, content changes, publication, deployment or history rewriting.
- Before editing, inspect Git state and preserve other work. Do not delete local inputs, original media or retained experiments as routine cleanup.
- Use Node 22 and `npm ci`. Run `npm run check` for code or packaging changes; run `npm run test:browser` after a build when routes or interactions are affected. Check changed visual states in a browser; tests are not visual acceptance.
- Run the local server and open the available browser yourself when previewing work.
- Keep the site DOM-first. Preserve desktop motion, native compact scrolling, keyboard access, reduced motion and route-backed detail returns.
- Below 600px, details isolate the selected story. Tablet retains the static document; motion-capable desktop retains circular details. Do not generalize a phone change to desktop without authorization.
- Do not activate dormant effects or reintroduce rejected experiments without an explicit request.

## Design and editorial authority

- The complete prior instruction file is preserved unchanged in [the decision log](docs/archive/agent-decisions.md). Read the relevant decisions before changing visuals, motion or copy. Later dated decisions supersede earlier ones; current accepted code supplies the starting state. Historical experiments do not authorize new work.
- Before substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal.
- Record new durable user decisions in this file with their date and scope.
- Preserve source-supported claims and authored text. Do not invent employment dates, outcomes, publication history, pricing, availability or rights. The [claim ledger](docs/archive/content-claim-ledger.md) contains unresolved factual questions.
- Article publication dates are fixed user-authorized provisional dates, not verified historical publication dates. Never regenerate them at runtime.
- Preserve original images and third-party notices. Follow [asset maintenance](docs/assets.md).

## Structure and hosting

- Use [architecture](docs/architecture.md) and [documentation](docs/README.md) to locate active code. Historical paths in `docs/archive/` may refer to the previous layout; consult its relocation table.
- Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs` and `tests/sites-worker.test.mjs` intact for Sites handoff.
- Before a Sites handoff, run `npm run build` and `npm run test:sites`; verify `dist/client/index.html`, `dist/server/index.js` and `dist/.openai/hosting.json` exist.
- `scripts/archive/` contains restoration tools, not normal maintenance. Never use its legacy reference scanner to infer that a current asset is safe to delete.
- Do not commit credentials, dependencies, generated builds, local worktrees or private resume inputs. Follow [public-release review](docs/public-release.md) before any visibility change.
