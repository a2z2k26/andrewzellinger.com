# Historical records

This directory preserves previous audits, design studies, source records, QA screenshots, handoffs and the full former `AGENTS.md`. Files may describe superseded behavior, rejected experiments, private factual questions or paths from the old layout. Their inclusion is preservation, not publication approval.

The current starting points are [documentation](../README.md) and the root [agent instructions](../../AGENTS.md). Read relevant dated decisions before visual changes; later decisions supersede earlier ones.

## Relocation table

| Previous path | Current path |
| --- | --- |
| `docs/<path>` | `docs/archive/<path>` |
| `AGENTS.md` (full historical text) | `docs/archive/agent-decisions.md` |
| `design-qa.md` | `docs/archive/design-qa.md` |
| `asset-manifest.json` | `docs/archive/source-capture.json` |
| `Article-Image/` | `assets/source/articles/` |
| `Project-Images/` | `assets/source/projects/` |
| `History-Image/` | `assets/source/history/` |
| `Home-image/` | `assets/source/home/` |
| `TimesNewerRoman/` | `assets/source/fonts/times-newer-roman/` |
| Root artwork gallery HTML files | `dev/artwork/` (same filenames) |
| `scripts/mirror-source.mjs` | `scripts/archive/mirror-source.mjs` |
| `scripts/prune-unused-assets.mjs` | `scripts/archive/prune-unused-assets.mjs` |

Historical document bodies are preserved unchanged, so old relative links and absolute machine paths may need this table. The editorial source snapshot remains a regression-test fixture; do not delete it as unused documentation.
