# Public-release review

Repository organization is complete only as a maintenance change; it does not authorize making this repository public.

## Evidence at the cleanup baseline

On September 12, 2026, the repository was private and local `main` was at `7a65cb7b02a6eef1acadad2d1ce00e7aeed63880`. Gitleaks 8.30.1 scanned all local Git refs (76 commits) with redacted reporting and found no secrets. This is automated evidence, not a guarantee; remote-only refs, Actions logs, issues, attachments and asset rights were not cleared by that scan.

A local Git bundle and tracked-file archive were created before reorganization. Concurrent introduction-modal changes were subsequently captured in a separate working-file archive and preserved in the validation baseline. The cleanup preserves originals, historical records, license notices, runtime routes and public assets. No history was rewritten and no visibility change was made.

## Owner decisions before publication

1. Review historical source material, `docs/archive/resume/`, the claim ledger, editorial snapshots, screenshots and the decision log for personal or client information. Moving material to an archive does not hide it from a public repository.
2. Review `src/project-content.js`: superseded narratives remain in source and in the current JavaScript bundle even though later editorial overrides control displayed prose. Decide what is appropriate to disclose before a public source release.
3. Confirm redistribution rights for client work, artwork, portraits, fonts, vendor files and any captured reference material. Preserve existing third-party notices. Choose a code license separately from content and media permissions; no blanket license is added by this cleanup.
4. Decide whether to publish this repository with its full history or prepare a separately reviewed source-only release. Do not rewrite or delete existing history without explicit approval. Review every branch and tag intended for publication.
5. Review GitHub Actions logs and other repository surfaces, rerun secret scanning on the release candidate, and confirm local resume inputs, environment files and scratch folders remain untracked.
6. Review the final diff and checks, then obtain Andrew's explicit authorization for any push, deployment or visibility change.

Making a repository public exposes repository contents and history; GitHub also makes Actions history and logs visible. An ignored file is protected from ordinary future adds, but `.gitignore` does not remove anything already committed.

Sources: [About repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories), [repository visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility), [licensing](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository).
