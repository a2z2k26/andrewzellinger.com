# Contributing

This is Andrew Zellinger's personal portfolio. Agree on scope before proposing changes to design, authored text or factual claims. Follow [AGENTS.md](../AGENTS.md) and the relevant documented decisions.

## Local workflow

1. Use Node 22 and install from the lockfile with `npm ci`.
2. Work on a focused branch. Keep unrelated assets and experiments out of the diff.
3. Run `npm run check`. For route or interaction changes, install Playwright Chromium if needed and run `npm run test:browser` against a fresh build.
4. Inspect changed visual states on desktop and compact layouts. Check keyboard access, reduced motion and detail returns where affected.
5. Describe the problem, final behavior, verification and remaining limitations in the pull request. Include screenshots for visual changes.

Preserve original media, factual provenance and third-party notices. Do not commit credentials, generated output, dependencies, private resume inputs or local worktrees. Do not use archived import/prune tools for ordinary development. Publication, pushing and deployment require Andrew's authorization.

See [architecture](../docs/architecture.md), [asset maintenance](../docs/assets.md) and [public-release review](../docs/public-release.md).
