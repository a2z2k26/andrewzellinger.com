import assert from "node:assert/strict";
import test from "node:test";

import { CASE_STUDIES } from "../src/detail-content.js";
import { PROJECTS } from "../src/project-content.js";
import { PROJECT_SECTION_LABELS } from "../src/project-narratives.js";

const expectedTitles = [
  "Audible Sleep",
  "Android Wear",
  "Fi Smart Collar",
  "WeWork Studio",
  "Foursquare",
  "Live Auctioneers",
  "Proctor & Gamble",
  "Thompson Reuters",
  "Price Waterhouse Coopers",
  "Avantos",
  "Turner TV",
  "McDonalds",
  "Northwestern Mutual",
  "Amazon Fire TV",
];

test("project content keeps the approved order and stable routes", () => {
  assert.equal(PROJECTS.length, 14);
  assert.deepEqual(PROJECTS.map(({ title }) => title), expectedTitles);
  assert.equal(new Set(PROJECTS.map(({ slug }) => slug)).size, PROJECTS.length);

  for (const project of PROJECTS) {
    assert.equal(project.kind, "project");
    assert.equal(project.collectionPath, "/projects");
    assert.equal(project.path, `/case-studies/${project.slug}/`);
  }
});

test("project detail data is complete and uses no runtime Notion source references", () => {
  for (const project of PROJECTS) {
    assert.ok(project.title);
    assert.ok(project.headline);
    assert.ok(project.summary);
    assert.ok(project.media?.label);
    if (
      project.slug === "audible-sleep"
      || project.slug === "android-wear"
      || project.slug === "fi-smart-collar"
      || project.slug === "wework-studio"
      || project.slug === "foursquare"
      || project.slug === "proctor-and-gamble"
      || project.slug === "thompson-reuters"
      || project.slug === "price-waterhouse-coopers"
      || project.slug === "avantos"
      || project.slug === "mcdonalds"
      || project.slug === "amazon-fire-tv"
    ) {
      const expectedMedia = {
        "audible-sleep": [
          "/images/projects/audible-sleep-screen-array.png",
          "Audible Sleep screen array project image",
        ],
        "android-wear": [
          "/images/projects/android-wear-array.png",
          "Android Wear watch face array project image",
        ],
        "fi-smart-collar": [
          "/images/projects/fi-screen-array.png",
          "Fi Smart Collar app screen array project image",
        ],
        "wework-studio": [
          "/images/projects/wework-screen.png",
          "WeWork Studio sales tool project image",
        ],
        "foursquare": [
          "/images/projects/foursquare-branding.png",
          "Foursquare branding project image",
        ],
        "proctor-and-gamble": [
          "/images/projects/pandg-tablets.png",
          "Proctor & Gamble tablet experience project image",
        ],
        "thompson-reuters": [
          "/images/projects/reuters-tv-scene.png",
          "Reuters TV project scene image",
        ],
        "price-waterhouse-coopers": [
          "/images/projects/pwc-website.png",
          "Price Waterhouse Coopers website project image",
        ],
        "avantos": [
          "/images/projects/avantos-screen.png",
          "Avantos product interface project image",
        ],
        "mcdonalds": [
          "/images/projects/mcdonalds.png",
          "McDonald's self-order kiosk project image",
        ],
        "amazon-fire-tv": [
          "/images/projects/amazon-fire-tv.png",
          "Amazon Fire TV interface displayed in a vehicle",
        ],
      }[project.slug];
      assert.equal(project.media.src, expectedMedia[0]);
      assert.equal(project.media.label, expectedMedia[1]);
    } else {
      assert.match(project.media.label, /Tasman Glacier landscape stand-in/);
      assert.equal(project.media.src, undefined);
    }
    assert.ok(project.metadata.client);
    assert.ok(project.metadata.studio);
    assert.ok(project.metadata.year);
    assert.ok(project.metadata.role);
    assert.equal(project.meta.length, 4);
    assert.ok(project.sections.length > 0);
    assert.ok(project.sections.every((section) => section.label && section.paragraphs.length > 0));
  }

  const runtimeContent = JSON.stringify(PROJECTS);
  assert.doesNotMatch(runtimeContent, /notion\.so|api\.notion|prod-files|attachment:/i);
  assert.doesNotMatch(runtimeContent, /"slug":"(?:ustwo|talentai)"/i);
});

test("case-study routes consume the canonical project collection", () => {
  assert.equal(CASE_STUDIES, PROJECTS);
});

test("published case studies share one editorial structure and reading length", () => {
  const wordCount = (value) => value.trim().split(/\s+/).filter(Boolean).length;

  for (const project of PROJECTS) {
    assert.deepEqual(
      project.sections.map(({ label }) => label),
      PROJECT_SECTION_LABELS,
      project.slug + " must use the shared section sequence",
    );
    assert.deepEqual(
      project.sections.map(({ paragraphs }) => paragraphs.length),
      [1, 1, 1],
      project.slug + " must render Context, Work, and Outcome as one paragraph each",
    );

    const bodyWords = project.sections.reduce(
      (total, section) => total + section.paragraphs.reduce(
        (sectionTotal, paragraph) => sectionTotal + wordCount(paragraph),
        0,
      ),
      0,
    );

    if (project.slug === "amazon-fire-tv") {
      assert.ok(bodyWords >= 100, "the provisional Amazon entry must explain its source limits");
    } else {
      assert.ok(
        bodyWords >= 325 && bodyWords <= 410,
        project.slug + " must remain within the 325–410 word editorial band; received " + bodyWords,
      );
    }
  }
});
