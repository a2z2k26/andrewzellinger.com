import assert from "node:assert/strict";
import test from "node:test";

import { BIOGRAPHY, BIOGRAPHY_CONTACT } from "../src/biography-content.js";

test("biography contains the approved editorial structure and experience record", () => {
  assert.equal(
    BIOGRAPHY.lead,
    "Andrew Zellinger has spent two decades helping companies turn ideas into working products. He is a product designer, creative director, and fractional partner who builds from first principles through product launch.",
  );
  assert.equal("supportingLead" in BIOGRAPHY, false);
  assert.equal(BIOGRAPHY.practice.label, "Design practice");
  assert.equal(
    BIOGRAPHY.practice.body,
    "Andrew’s independent practice spans strategy, research, interaction design, brand, and front-end implementation across studios, agencies, startups, and large technology companies. More recently, he has applied that range to AI-native product development, designing and building products around emerging models and agentic systems while helping teams decide where automation belongs, where human agency matters, and how new technology earns trust.",
  );
  assert.equal(BIOGRAPHY.experience.label, "Experience");
  assert.deepEqual(
    BIOGRAPHY.experience.entries.map(({ organization }) => organization),
    [
      "Independent practice",
      "Cosmos Holodeck",
      "Avantos",
      "Sketch / Amazon Fire TV",
      "Live Auctioneers",
      "Modern Age",
      "I&Co / Audible Sleep",
      "Philosophie",
      "Ueno / Reuters TV",
      "Red Antler / Foursquare",
      "Method",
      "ustwo",
      "School of Visual Arts",
    ],
  );
  assert.ok(BIOGRAPHY.experience.entries.every(({ role, dates }) => role && dates));
  assert.equal("consulting" in BIOGRAPHY, false);
  assert.equal("foundation" in BIOGRAPHY, false);
  assert.equal(BIOGRAPHY.capabilities.groups.length, 4);
  assert.ok(BIOGRAPHY.capabilities.clients.length >= 12);
  assert.equal(
    BIOGRAPHY.availability.body,
    "Andrew is available for fractional, project, and advisory work. He can serve as the design function early on or embed alongside an existing team to move a product from first principles to a built and deployed release.",
  );
});

test("biography draft avoids disputed metrics and private runtime source paths", () => {
  const publicContent = JSON.stringify({ BIOGRAPHY, BIOGRAPHY_CONTACT });
  assert.doesNotMatch(publicContent, /\b\d+(?:\.\d+)?%|\$\d|million|conversion|revenue/i);
  assert.doesNotMatch(publicContent, /\.pdf|\/Users\/|Desktop\/|A-Z Profile/i);
  assert.equal(BIOGRAPHY_CONTACT.email, "hello@andrewzellinger.com");
});
