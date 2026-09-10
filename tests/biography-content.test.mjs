import assert from "node:assert/strict";
import test from "node:test";

import { BIOGRAPHY, BIOGRAPHY_CONTACT } from "../src/biography-content.js";

test("biography contains the approved editorial structure and experience record", () => {
  assert.ok(BIOGRAPHY.lead.length > 0);
  assert.equal("supportingLead" in BIOGRAPHY, false);
  assert.equal(BIOGRAPHY.practice.label, "Design practice");
  assert.ok(BIOGRAPHY.practice.body.length > 0);
  assert.equal(BIOGRAPHY.experience.label, "Experience");
  assert.deepEqual(
    BIOGRAPHY.experience.entries.map(({ organization }) => organization),
    [
      "Independent practice",
      "Cosmos Holodeck",
      "Avantos",
      "Sketch / Amazon Fire TV",
      "SketchDeck",
      "Fi",
      "Live Auctioneers",
      "Modern Age",
      "AKQA",
      "I&Co / Audible Sleep",
      "Greater Than One",
      "Studio Rodrigo",
      "Philosophie",
      "Ueno / Reuters TV",
      "Noom",
      "Red Antler / Foursquare",
      "Method",
      "Pod1",
      "ustwo",
      "Crispin Porter & Bogusky",
      "School of Visual Arts",
      "Razorfish",
      "Iris Nation",
    ],
  );
  assert.ok(BIOGRAPHY.experience.entries.every(({ role, dates }) => role && dates));
  assert.equal("consulting" in BIOGRAPHY, false);
  assert.equal("foundation" in BIOGRAPHY, false);
  assert.equal(BIOGRAPHY.capabilities.groups.length, 4);
  assert.ok(BIOGRAPHY.capabilities.clients.length >= 12);
  assert.ok(BIOGRAPHY.availability.body.length > 0);
  assert.doesNotMatch(BIOGRAPHY.lead, /decades|years of experience/i);
  assert.equal(BIOGRAPHY.perspective.paragraphs.length, 1);
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
