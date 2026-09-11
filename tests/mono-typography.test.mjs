import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sourcePaths = [
  "../public/css/site-base.css",
  "../index.html",
  "../articles/index.html",
  "../scripts/mirror-source.mjs",
  "../src/biography.css",
  "../src/detail-state.css",
];

test("every authored Geist Mono rule uses the shared 11px metadata size", async () => {
  const base = await readFile(new URL("../public/css/site-base.css", import.meta.url), "utf8");
  assert.match(base, /--typography--mono-size:\s*11px;/);

  for (const sourcePath of sourcePaths) {
    const source = await readFile(new URL(sourcePath, import.meta.url), "utf8");
    const monoRules = source.match(/[^{}]+\{[^{}]*font-family:\s*var\(--fonts--family-mono\);[^{}]*\}/g) ?? [];
    assert.ok(monoRules.length > 0, `${sourcePath} must retain at least one Geist Mono rule`);
    for (const rule of monoRules) {
      assert.match(rule, /font-size:\s*var\(--typography--mono-size\);/, `${sourcePath} has an unscaled Geist Mono rule: ${rule}`);
    }
  }

  const elevated = await readFile(new URL("../src/elevation/styles.css", import.meta.url), "utf8");
  for (const selector of ["#h", ".detail-unit__section-label", ".detail-unit__article-heading"]) {
    assert.match(
      elevated,
      new RegExp(`${selector.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")} \\{[^}]*font-size: var\\(--typography--mono-size\\);`),
      `${selector} must use the shared Geist Mono size`,
    );
  }
  assert.match(elevated, /\.categories,[\s\S]*?\.detail-unit__meta \{\s*font-size: var\(--typography--mono-size\) !important;/);
});
