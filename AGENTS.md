# Working on this portfolio

## Latest approved refinements

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
