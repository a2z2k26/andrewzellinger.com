# andrewzellinger.com

Andrew Zellinger's portfolio of product design work and writing.

[Website](https://andrewzellinger.com) · [Documentation](docs/README.md) · [Contributing](.github/CONTRIBUTING.md)

Built with Vite, static HTML, JavaScript DOM controllers and GSAP. Content and media live in the repository; the site does not require a CMS or API credentials to run locally.

## Development

Use Node.js 22, as specified in `.nvmrc`.

```sh
nvm use
npm ci
npm run dev
```

```sh
npm run check                     # Production build, packaging and Node tests
npx playwright install chromium   # First-time browser setup
npm run test:browser               # Checks the built site in Chromium
npm run preview                   # Preview the production build
```

## Repository map

| Path | Purpose |
| --- | --- |
| `src/` | Content, controllers, navigation and styles |
| `public/` | Files served directly: images, fonts and vendor assets |
| `assets/source/` | Original artwork and font source files |
| `articles/`, `info/`, root HTML | Vite entry shells; `info/` builds the public History route |
| `worker/`, `.openai/` | Sites routing and deployment configuration |
| `scripts/` | Build and verification tools; historical tools are under `archive/` |
| `tests/` | Node regression and packaging tests |
| `dev/` | Development-only studies and artwork galleries |
| `docs/` | Current guides and clearly separated historical records |
| `.github/` | CI, contribution guidance and pull request template |

See [architecture and routes](docs/architecture.md), [asset maintenance](docs/assets.md) and [agent instructions](AGENTS.md) before making changes.

## Content and rights

Preserve authored copy, factual provenance, original artwork and third-party notices. Public visibility does not itself grant reuse rights. No blanket open-source license has been selected for this repository; do not assume permission to reuse client material, writing, artwork or fonts.

The [public-release review](docs/public-release.md) records the remaining history, content and rights decisions. Publishing, pushing and deployment require Andrew's authorization.
