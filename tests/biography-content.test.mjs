import assert from "node:assert/strict";
import test from "node:test";

import { BIOGRAPHY, BIOGRAPHY_CONTACT } from "../src/biography-content.js";

test("biography contains the approved editorial structure and experience record", () => {
  assert.equal(
    BIOGRAPHY.lead,
    "I’m Andrew Zellinger, a hands-on product design lead working across complex workflows, design systems, and AI products. I connect research, strategy, design, and engineering. This site is the standing record of my commercial product design career and the body of work that established my practice.",
  );
  assert.equal("supportingLead" in BIOGRAPHY, false);
  assert.equal(BIOGRAPHY.practice.label, "Design practice");
  assert.equal(
    BIOGRAPHY.practice.body,
    "I work best where products are complex, the path forward is unclear, and design needs to do more than produce screens. My background spans art direction, branding, product design, leadership, and teaching, and I’ve worked both as the design function for early teams and within established organizations. Across that work, I connect customer needs and business decisions to system behavior and implementation details. Over the past two and a half years, I’ve expanded that practice by building AI products and launching an automation consultancy. That newer body of work is not represented in this collection, but it grows from the same foundation and has made me a more technical designer while keeping the work grounded in the people who use it.",
  );
  assert.equal("perspective" in BIOGRAPHY, false);
  assert.equal(BIOGRAPHY.experience.label, "Experience");
  assert.deepEqual(
    BIOGRAPHY.experience.entries.map(({ organization }) => organization),
    [
      "Independent",
      "Cosmos",
      "Avantos",
      "Sketch Deck",
      "SketchDeck",
      "Fi",
      "Live Auctioneers",
      "Modern Age",
      "AKQA",
      "I&Co",
      "GTO",
      "Studio Rodrigo",
      "Philosophie",
      "Ueno",
      "Noom",
      "Red Antler",
      "Method",
      "Pod1",
      "Ustwo",
      "CP&B",
      "SVA",
      "Razorfish",
      "Iris Nation",
    ],
  );
  assert.ok(BIOGRAPHY.experience.entries.every(({ role, dates }) => role && dates));
  assert.ok(BIOGRAPHY.experience.entries.every(({ role }) => !role.includes("Contract")));
  assert.deepEqual(
    BIOGRAPHY.experience.entries
      .filter(({ organization }) => ["Studio Rodrigo", "Noom", "Pod1"].includes(organization))
      .map(({ role }) => role),
    ["Product Designer", "Product Designer", "Product Designer"],
  );
  assert.equal("consulting" in BIOGRAPHY, false);
  assert.equal("foundation" in BIOGRAPHY, false);
  assert.equal(BIOGRAPHY.capabilities.groups.length, 4);
  assert.deepEqual(BIOGRAPHY.capabilities.clients, [
    "Adidas",
    "Adult Swim",
    "Amazon",
    "American Express",
    "Apple",
    "Audible",
    "Avantos",
    "Cosmos",
    "Fi",
    "Foursquare",
    "Google",
    "IBM",
    "Instrumental",
    "Live Auctioneers",
    "McDonald's",
    "Mercedes-Benz",
    "MetLife",
    "Microsoft",
    "Modern Age",
    "NBCUniversal",
    "Noom",
    "Northwestern Mutual",
    "Procter & Gamble",
    "PwC",
    "Seattle Genetics",
    "Thomson Reuters",
    "Turner Media",
    "WeWork",
  ]);
  assert.equal(
    BIOGRAPHY.availability.body,
    "I’m open to senior or lead product design roles, particularly where complex workflows, design systems, AI, and hands-on product development intersect. I can establish design for an early team or contribute within an established organization, from problem definition through detailed interaction design and delivery.",
  );
  assert.doesNotMatch(BIOGRAPHY.lead, /decades|years of experience/i);
  assert.match(BIOGRAPHY.education.body, /School of Visual Arts/);
  const tools = BIOGRAPHY.stack.groups.flatMap(({ items }) => items);
  assert.equal(tools.length, new Set(tools).size);
  assert.ok(tools.includes("Figma") && tools.includes("ComfyUI / SDXL"));
});

test("biography draft avoids disputed metrics and private runtime source paths", () => {
  const publicContent = JSON.stringify({ BIOGRAPHY, BIOGRAPHY_CONTACT });
  assert.doesNotMatch(publicContent, /\b\d+(?:\.\d+)?%|\$\d|million|conversion|revenue/i);
  assert.doesNotMatch(publicContent, /\.pdf|\/Users\/|Desktop\/|A-Z Profile/i);
  assert.equal(BIOGRAPHY_CONTACT.email, "hello@andrewzellinger.com");
  assert.deepEqual(BIOGRAPHY_CONTACT.socialLinks.map(({ label }) => label), ["LinkedIn", "GitHub", "Cal.com"]);
  assert.doesNotMatch(publicContent, /"label":"X\.com"|"url":"https:\/\/x\.com\//i);
});
