import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const rootUrl = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, rootUrl), "utf8");
}

function assertPortfolioTreatment(source, label) {
  assert.match(source, /html\.works-motion-route\s*\{[^}]*--works-card-gap:\s*40px;/s, `${label} must define the 40px Projects card gap`);
  assert.match(source, /\.works-motion-field\s*\{[^}]*row-gap:\s*var\(--works-card-gap\);/s, `${label} must apply the card gap to the static field`);
  assert.match(source, /\.works-motion-track,[\s\S]*?\.works-motion-set\s*\{[^}]*row-gap:\s*var\(--works-card-gap\);/s, `${label} must apply the card gap inside and between loop sets`);
  assert.match(source, /\.works-media-spacing\s*\{[^}]*margin-bottom:\s*32px;/s, `${label} must keep a 32px image-to-copy gap`);
  assert.match(source, /@media screen and \(min-width:\s*992px\)\s*\{\s*html\.works-motion-route \.works-motion-card \.works-meta-spacing\s*\{[^}]*margin-bottom:\s*8px;/s, `${label} must keep the 8px tag-to-description gap desktop-only`);
  assert.match(source, /\.heading-style-h2\.new\s*\{[^}]*font-family:\s*"Geist",\s*sans-serif;[^}]*font-size:\s*16px;[^}]*line-height:\s*1\.08;[^}]*font-weight:\s*500;[^}]*letter-spacing:\s*\.01em;[^}]*text-transform:\s*none;/s, `${label} must define the project-title treatment`);
  assert.match(source, /\.display-inlineflex\.categories\s*\{[^}]*font-family:\s*var\(--fonts--family-mono\);[^}]*font-size:\s*var\(--typography--mono-size\);[^}]*line-height:\s*13px;[^}]*text-transform:\s*uppercase;/s, `${label} must define the tag treatment`);
  assert.match(source, /\.works-project-description\s*\{[^}]*font-family:\s*"Geist",\s*sans-serif;[^}]*font-size:\s*13px;[^}]*line-height:\s*22px;[^}]*text-transform:\s*uppercase;/s, `${label} must define the description treatment`);
  assert.match(source, /\.works-project-description\s*\{[^}]*display:\s*-webkit-box;[^}]*overflow:\s*hidden;[^}]*-webkit-box-orient:\s*vertical;[^}]*-webkit-line-clamp:\s*2;[^}]*line-clamp:\s*2;/s, `${label} must cap project descriptions at two rendered lines`);
  assert.match(source, /margin-bottom space-small works-media-spacing/, `${label} must apply the semantic media-spacing hook`);
  assert.match(source, /margin-bottom space-medium works-meta-spacing/, `${label} must apply the semantic metadata-spacing hook`);
  assert.match(source, /makeElement\("p",\s*"works-project-description",\s*projectCardDescription\(project\)\)/, `${label} must apply the shared description through its semantic hook`);
  assert.match(source, /projectCardTags\(project\)/, `${label} must use the shared project tag projection`);
  assert.match(source, /projectCardDescription\(project\)/, `${label} must use the shared project description projection`);
}

test("authored Projects cards keep the approved typography and spacing", async () => {
  assertPortfolioTreatment(await read("index.html"), "index.html");
});

test("the mirror generator preserves the approved Projects treatment", async () => {
  assertPortfolioTreatment(await read("scripts/archive/mirror-source.mjs"), "mirror-source.mjs");
});
