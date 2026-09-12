# Production browser verification

The production module graph must be tested independently of Vite dev mode.

September 10 fixes:

- The bundled shared motion module evaluates before the Projects entry builds
  its cards. Start initial motion at DOMContentLoaded, after deferred entries
  finish, rather than treating `interactive` as content-ready.
- Vite replaces module script tags and drops the authored `blocking="render"`.
  Restore that attribute on built entries so Chrome's `pagereveal` event cannot
  precede installation of the incoming rail/title transition handlers.
- Handle the ViewTransition `ready` rejection on skipped outgoing/incoming
  transitions, including early exits.

Run `npm run check`, `npx playwright install chromium`, then
`npm run test:browser`. The browser suite serves `dist/client` directly. It
checks all collection loops, direction reversal, detail entry/return, browser
Back, actual native page transitions, compact navigation, reduced motion and
every detail URL. JavaScript errors and failed resource responses fail checks.
Screenshots on failure are saved under `/tmp/portfolio-browser-check`.

Set `BROWSER_CHANNEL=chrome` to use installed Google Chrome. Set
`BROWSER_BASE_URL=https://www.andrewzellinger.com` to run against production.
Run the built-site checks before publishing, then rerun against the live alias.
HTTP 200 responses and unit tests alone do not verify motion or visual fidelity.
