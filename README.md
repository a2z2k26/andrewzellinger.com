# andrewzellinger.com

Andrew Zellinger's commercial product design portfolio. Vite serves static HTML with DOM controllers, GSAP motion and local media. Selected effects use React. Content is checked in; no runtime CMS credentials are required.

## Routes

- `/` (Projects collection; `/projects` redirects here)
- `/articles`
- `/history`
- `/case-studies/<slug>/` (direct project details)
- `/articles/<slug>/` (direct article details)

Legacy redirects live in `vite.config.mjs` and `worker/index.js`; keep them consistent.

## Run locally

```bash
nvm use
npm ci
npm run dev
```

Production verification:

```bash
npm run check
```

## Asset policy

Project imagery, portraits, fonts and UI assets are served locally. `src/article-images.js` maps artwork across listing and detail views; `Article-Image/README.md` documents originals, assignments and the remaining spare. Preserve originals and third-party notices.

## Source map

- `src/site-navigation/`: responsive Masthead and detail-return controls.
- `src/site-motion.js`, `src/detail-state.js`: carousels and transitions.
- `src/project-content.js`, `src/project-narratives.js`: project records and editorial copy.
- `src/article-content.js`, `src/article-images.js`: articles and artwork mapping.
- `src/biography-content.js`, `src/biography.js`, `src/biography.css`: History.
- `tests/`: Node regression tests; `npm test` runs them all.
- `worker/`, `scripts/prepare-sites-build.mjs`: production routing and packaging.

## Maintenance boundaries

Use Node 22 (`.nvmrc`) and `npm ci`. `npm run check` runs tests and the production build. Follow the newest decisions in `AGENTS.md` and `docs/masthead-navigation.md`; older audit documents describe historical snapshots. Check changed visual states in a browser on desktop and compact layouts, including keyboard navigation, reduced motion and detail returns. Tests alone are not visual approval.

`scripts/mirror-source.mjs` is an archival restoration tool, not a normal build step. It can overwrite authored route shells and prune assets. It requires explicit source-capture and origin environment variables. Do not run `npm run mirror` or `npm run prune:assets` as routine cleanup.

Preserve factual provenance and third-party license notices. Do not apply an open-source license to artwork or client material without owner approval. Do not commit secrets, generated builds, dependencies or local worktrees. Deployment and pushing commits require separate authorization.
