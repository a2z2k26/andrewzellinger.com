import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { PROJECTS } from "../src/project-content.js";
import { PROJECT_NARRATIVES } from "../src/project-narratives.js";
import { ARTICLE_DETAILS } from "../src/article-content.js";

test("all documented cases use the approved four-section model", () => {
  assert.equal(PROJECTS.filter(p => p.sections.length === 4).length, 18);
  for (const p of PROJECTS) {
    assert.equal(p.summary, PROJECT_NARRATIVES[p.slug].summary);
    assert.equal(p.sections, PROJECT_NARRATIVES[p.slug].sections);
    if (p.slug !== "amazon-fire-tv") assert.equal(p.sections[2].items.length, 3);
    else assert.equal(p.sections.length, 3);
  }
});

test("rubric has nine semantic items and the five framework steps stay explicit", () => {
  const article = ARTICLE_DETAILS.find((a) => a.slug === "you-always-let-yourself-win");
  const steps = article.body.filter((b) => b.type === "heading" && /^\d\./.test(b.text));
  assert.deepEqual(steps.map((b) => b.text), ["1. Behavioral criteria", "2. Scenario set", "3. Examples and anti-examples", "4. Review cadence", "5. Ownership and escalation"]);
  const rubric = article.body.find((b) => b.type === "list" && b.items[0].startsWith("Intent fidelity"));
  assert.equal(rubric.items.length, 9);
  assert.doesNotMatch(JSON.stringify(article), /Criterion What to look for Score/);
});

test("compact authored list lines are not flattened into a paragraph", () => {
  const company = ARTICLE_DETAILS.find(a => a.slug === "company-of-one");
  const path = company.body.find(b => b.type === "list" && b.items[0].startsWith("The primary agent"));
  assert.equal(path.items.length, 4);
  const checks = company.body.find(b => b.type === "list" && b.items[0].startsWith("The output is present"));
  assert.equal(checks.items.length, 5);
  const intent = ARTICLE_DETAILS.find(a => a.slug === "intention-deficit-disorder");
  assert.ok(intent.body.some(b => b.type === "list" && b.ordered && b.items.length === 5));
});

test("project decisions render escaped semantic lists within existing motion bodies", async () => {
  const renderer = await readFile(new URL("../src/detail-state.js", import.meta.url), "utf8");
  assert.match(renderer, /<ul class="detail-unit__decisions">/);
  assert.match(renderer, /<li>\$\{escapeHtml\(item\)\}<\/li>/);
});
