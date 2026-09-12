# Architecture and routes

The production site uses Vite to bundle static HTML and JavaScript DOM controllers. GSAP drives the accepted desktop motion. Retained React and effect experiments exist in the source tree; their presence does not mean they are mounted by the current entry points.

## Entry points

| Source | Public route |
| --- | --- |
| `index.html` | `/` — Projects |
| `articles/index.html` | `/articles` |
| `info/index.html` | `/history` after build packaging |
| `detail-shell.html` | `/case-studies/<slug>/` and `/articles/<slug>/` |

The current content defines 19 projects and 11 articles: 33 canonical routes including the three collections. Legacy aliases such as `/projects`, `/info` and `/biography` resolve through the Vite and hosting routing rules. Keep `vite.config.mjs`, `vercel.json` and `worker/index.js` consistent when changing routes.

## Runtime map

- `src/site-motion.js`: collection motion and route transitions.
- `src/site-navigation/`: responsive navigation and detail-return controls.
- `src/detail-state.js` and related detail modules: detail rendering, history and motion.
- `src/project-content.js`, `src/project-narratives.js`: project records and editorial overrides.
- `src/article-content.js`, `src/article-images.js`: authored articles and retained artwork assignments.
- `src/biography-content.js`, `src/biography.js`, `src/biography.css`: History.
- `src/welcome-preface.js`, `src/cal-overlay.js`: introduction and booking overlay.

Public HTML and its imported module graph determine active behavior. Do not remove apparently dormant source, dependencies or vendor files without tracing references and confirming the retained rollback intent.

## Build and checks

`npm run build` runs Vite followed by `scripts/prepare-sites-build.mjs`. Deployment output is `dist/client/`, `dist/server/index.js` and `dist/.openai/hosting.json`. Build output is ignored by Git.

`npm run check` builds first, then runs the Node tests in `tests/`. `npm run test:browser` serves `dist/client/` and exercises production routes with Playwright Chromium. This includes desktop motion, compact navigation, direct detail URLs, Back/Forward and reduced motion. It does not establish Safari, physical-device or deployment acceptance.

The GitHub workflow runs build, Node and browser checks using Node 22. It uses pinned action revisions and read-only repository permissions.
