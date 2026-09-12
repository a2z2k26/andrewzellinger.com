# Asset maintenance

## Originals and served files

`assets/source/` preserves original artwork in `articles/`, `projects/`, `history/` and `home/`, plus the retained font package in `fonts/times-newer-roman/`. These are source materials, not Vite build entries. `public/` contains files copied into the served build. Moving an original does not change its served derivative.

The [article inventory](../assets/source/articles/README.md) records all 13 original files, assignments and the available spare. The current article presentation is text-only; artwork mappings and derivatives are retained. `src/article-images.js` owns those mappings. `node scripts/prepare-article-images.mjs` recreates the assigned WebP derivatives and requires `cwebp`; do not regenerate media during unrelated maintenance.

Project presentation uses the media references in the HTML and project records. Any intentional asset replacement must check collection, detail, build and browser behavior. Preserve originals and notices, including the font package's license document.

## Development galleries

The five image-option galleries live in `dev/artwork/`. With the Vite dev server running, open their `.html` paths directly. They reference originals under `/assets/source/projects/` and are not production build entries.

## Archival tools

`npm run archive:mirror` restores a historical source capture and can overwrite authored route shells. It requires `PORTFOLIO_IMPORT_ROOT` and `PORTFOLIO_IMPORT_ORIGIN`. It no longer runs pruning automatically.

`npm run archive:assets` reports what the legacy scanner considers unreferenced without deleting files. That scanner does not follow the current application's full module graph: its report is not deletion approval. Direct `--apply` also requires `PORTFOLIO_ALLOW_ARCHIVE_PRUNE=1`; do not enable it as routine cleanup. Review exact references, make a backup and obtain authorization for destructive removals.

Do not infer redistribution rights from an asset's presence here. See [public-release review](public-release.md).
