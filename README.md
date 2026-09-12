```
    _              _                     _____    _ _ _
   / \   _ __   __| |_ __ _____      __ |__  /___| | (_)_ __   __ _  ___ _ __
  / _ \ | '_ \ / _` | '__/ _ \ \ /\ / /   / // _ \ | | | '_ \ / _` |/ _ \ '__|
 / ___ \| | | | (_| | | |  __/\ V  V /   / /|  __/ | | | | | | (_| |  __/ |
/_/   \_\_| |_|\__,_|_|  \___| \_/\_/   /____\___|_|_|_|_| |_|\__, |\___|_|
                                                              |___/
```

# andrewzellinger.com

The source for [andrewzellinger.com](https://www.andrewzellinger.com), Andrew Zellinger's commercial product design portfolio and writing archive.

The site brings together selected client work, long-form articles, and a professional history in a custom editorial interface. It is deliberately built as a repository-owned, DOM-first website: content, motion, responsive behavior, and deployment configuration are versioned together without a CMS or runtime API dependency.

## About Andrew

Andrew Zellinger is a hands-on product design lead working across complex workflows, design systems, and AI products. His background spans art direction, branding, product design, design leadership, teaching, and design engineering. He works between research, strategy, interaction design, systems thinking, and implementation, from defining ambiguous product problems through detailed delivery.

His experience includes independent consulting and leadership roles across early-stage teams, established organizations, and design studios. More recently, he has expanded that practice through building AI products and automation systems, applying the same product judgment to agentic workflows, evaluation, control, and implementation.

- [Portfolio](https://www.andrewzellinger.com)
- [LinkedIn](https://www.linkedin.com/in/andrewzellinger/)
- [GitHub](https://github.com/a2z2k26)
- [Substack](https://substack.com/@andrewzellinger)

## The project

This repository is both a portfolio and a custom interaction-design project. Its core experience includes:

- 19 project case studies and 11 authored articles across 33 canonical routes
- continuous, direction-aware desktop collection rails driven by GSAP
- reversible collection-to-detail transitions that preserve context between views
- responsive navigation and native document scrolling on compact layouts
- circular desktop detail collections with route-aware browser history
- a motion-safe fallback for reduced-motion preferences
- a responsive introductory modal and Cal.com booking overlay
- repository-managed editorial content, imagery, fonts, and downloadable assets

The visual system is intentionally restrained: black canvas, white and gray typography, a focused orange accent, Geist Sans and Geist Mono, and Times Newer Roman for selected narrative text. Motion supplies continuity and spatial context without replacing semantic HTML or native browser behavior.

## Technical approach

The production experience uses static HTML entry points bundled with Vite. JavaScript DOM controllers manage content rendering, navigation, continuous rails, detail states, and page transitions. GSAP drives the accepted desktop motion system. React and Three.js remain available for isolated effects and retained experiments, but the public site itself stays DOM-first.

| Area | Implementation |
| --- | --- |
| Build | Vite 6 and Node.js 22 |
| Interface | Static HTML, CSS, and JavaScript DOM controllers |
| Motion | GSAP with native reduced-motion and compact-layout fallbacks |
| Content | Versioned JavaScript records and repository-managed assets |
| Browser QA | Playwright against the production build |
| CI | GitHub Actions with pinned actions and read-only permissions |
| Hosting | Vercel static deployment from `dist/client` |

### Routes

| Source | Public route |
| --- | --- |
| `index.html` | `/` — Projects |
| `articles/index.html` | `/articles` — Articles |
| `info/index.html` | `/history` — Professional history |
| `detail-shell.html` | `/case-studies/<slug>/` and `/articles/<slug>/` |

Legacy portfolio paths are normalized through the Vite development server, the packaged worker, and Vercel redirects.

## Local development

Use Node.js 22, as specified in `.nvmrc`.

```sh
nvm use
npm ci
npm run dev
```

The Vite development server will print the local preview URL.

### Build and verification

```sh
npm run check
```

`npm run check` creates the production build, prepares the static/Sites package, and runs the Node regression suite.

For browser-level verification:

```sh
npx playwright install chromium
npm run test:browser
```

To inspect the production build locally:

```sh
npm run preview
```

## Repository structure

| Path | Purpose |
| --- | --- |
| `src/` | Active content, DOM controllers, navigation, motion, and styles |
| `public/` | Production images, fonts, vendor files, and downloads |
| `assets/source/` | Original artwork and retained font source files |
| `articles/`, `info/`, root HTML | Vite page-entry shells |
| `tests/` | Node regression, routing, content, and packaging tests |
| `scripts/` | Build, asset, browser-check, and archival utilities |
| `worker/`, `.openai/` | Static routing and Sites-compatible deployment output |
| `dev/` | Development-only visual studies and artwork galleries |
| `docs/` | Architecture, assets, release guidance, and historical records |
| `.github/` | Continuous integration and contribution guidance |

Start with the [documentation index](docs/README.md) for deeper project guidance:

- [Architecture and routes](docs/architecture.md)
- [Asset maintenance](docs/assets.md)
- [Contribution guide](.github/CONTRIBUTING.md)
- [Public-release review](docs/public-release.md)

## Accessibility and resilience

The site preserves semantic links, headings, lists, and route-backed URLs beneath its animated presentation. Keyboard focus, browser Back/Forward behavior, reduced-motion preferences, native compact scrolling, and direct detail-page loading are covered by the regression suite. Animation is treated as progressive enhancement rather than a prerequisite for reaching the work.

## Deployment

The production site is deployed to Vercel from `main`. The build command is `npm run build`, and the published output is `dist/client`. Redirect behavior is defined in `vercel.json`; route or packaging changes should keep Vite, Vercel, and the Sites worker aligned.

## Content and rights

Unless explicitly stated otherwise, the writing, case studies, client work, artwork, photography, and other portfolio content in this repository remain the property of their respective rights holders. Public visibility does not grant permission to reuse them.

No blanket open-source license has been selected for this repository. Preserve third-party notices and review [public-release guidance](docs/public-release.md) before changing repository visibility, redistributing assets, or publishing historical material.

## Contact

For product design leadership, design engineering, AI product work, or collaboration:

- [hello@andrewzellinger.com](mailto:hello@andrewzellinger.com)
- [Schedule time on Cal.com](https://cal.com/andrewzellinger/15min)
