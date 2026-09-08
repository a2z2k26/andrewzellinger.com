import assert from "node:assert/strict";
import test from "node:test";

import { CASE_STUDIES } from "../src/detail-content.js";
import { PROJECTS } from "../src/project-content.js";
import { PROJECT_SECTION_LABELS } from "../src/project-narratives.js";

const expectedTitles = [
  "Audible Sleep",
  "Turner Media",
  "Obagi Care",
  "WeWork Studio",
  "Android Wear",
  "Live Auctioneers",
  "Andrew Eccles",
  "Proctor & Gamble",
  "Modern Age",
  "Fi Collar",
  "Thompson Reuters",
  "Gero Timer",
  "Foursquare Brand",
  "Amazon Fire TV",
  "PwC Audit",
  "NW Mutual",
  "McDonalds Kiosk",
  "Avantos",
  "Positive Brand",
];

test("project content keeps the approved order and stable routes", () => {
  assert.equal(PROJECTS.length, 19);
  assert.deepEqual(PROJECTS.map(({ title }) => title), expectedTitles);
  assert.equal(new Set(PROJECTS.map(({ slug }) => slug)).size, PROJECTS.length);
  assert.deepEqual(
    PROJECTS.filter(({ slug }) => ["juuice-app", "tred-auto", "seattle-genetics"].includes(slug)),
    [],
  );

  for (const project of PROJECTS) {
    assert.equal(project.kind, "project");
    assert.equal(project.collectionPath, "/projects");
    assert.equal(project.path, `/case-studies/${project.slug}/`);
  }
});

test("dense phone-array thumbnails are separated in the circular sequence", () => {
  const denseProjects = new Set(["audible-sleep", "android-wear", "fi-smart-collar"]);

  for (let index = 0; index < PROJECTS.length; index += 1) {
    const current = PROJECTS[index];
    const next = PROJECTS[(index + 1) % PROJECTS.length];
    assert.equal(
      denseProjects.has(current.slug) && denseProjects.has(next.slug),
      false,
      `${current.title} and ${next.title} must not be adjacent`,
    );
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
      || project.slug === "live-auctioneers"
      || project.slug === "proctor-and-gamble"
      || project.slug === "thompson-reuters"
      || project.slug === "price-waterhouse-coopers"
      || project.slug === "avantos"
      || project.slug === "turner-tv"
      || project.slug === "mcdonalds"
      || project.slug === "northwestern-mutual"
      || project.slug === "amazon-fire-tv"
      || project.slug === "andrew-eccles"
      || project.slug === "modern-age"
      || project.slug === "pi-app"
      || project.slug === "obagi"
      || project.slug === "gero-app"
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
        "live-auctioneers": [
          "/images/projects/liveauctioneers-screen.png",
          "Live Auctioneers website project image",
        ],
        "proctor-and-gamble": [
          "/images/projects/proctor-screen.png",
          "Proctor & Gamble digital experience project image",
        ],
        "thompson-reuters": [
          "/images/projects/reuters-screen.png",
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
        "turner-tv": [
          "/images/projects/turner-media-screen.png",
          "Turner TV streaming interface project image",
        ],
        "mcdonalds": [
          "/images/projects/mcdonalds-kiosk.png",
          "McDonald's self-order kiosk project image",
        ],
        "northwestern-mutual": [
          "/images/projects/nwmutual-screen.png",
          "Northwestern Mutual predictive planning project image",
        ],
        "amazon-fire-tv": [
          "/images/projects/amazon-fire-tv.png",
          "Amazon Fire TV interface displayed in a vehicle",
        ],
        "andrew-eccles": [
          "/images/projects/andrew-eccles-screen.png",
          "Andrew Eccles website project image",
        ],
        "modern-age": [
          "/images/projects/modern-age-screen.png",
          "Modern Age website project image",
        ],
        "pi-app": [
          "/images/projects/positiveintelligence-screen.png",
          "P.I. App mobile product project image",
        ],
        obagi: [
          "/images/projects/obagi-screen.png",
          "Obagi skincare website project image",
        ],
        "gero-app": [
          "/images/projects/gero-screen.png",
          "Gero App smartwatch fitness project image",
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
    assert.ok(project.metadata.role);
    if (project.slug !== "pi-app" && project.slug !== "obagi") {
      assert.ok(project.metadata.year);
    }
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

test("Gero Timer uses the approved USTWO client tag", () => {
  const gero = PROJECTS.find(({ slug }) => slug === "gero-app");
  assert.equal(gero?.metadata.client, "USTWO");
  assert.equal(gero?.meta[0], "USTWO");
});

test("Amazon Fire TV uses the approved AMAZON client tag", () => {
  const amazon = PROJECTS.find(({ slug }) => slug === "amazon-fire-tv");
  assert.equal(amazon?.metadata.client, "AMAZON");
  assert.equal(amazon?.meta[0], "AMAZON");
});

test("Obagi Care uses the approved 2020 year tag", () => {
  const obagi = PROJECTS.find(({ slug }) => slug === "obagi");
  assert.equal(obagi?.metadata.year, "2020");
  assert.equal(obagi?.meta[2], "2020");
});

test("Turner Media uses the approved TURNER client tag", () => {
  const turner = PROJECTS.find(({ slug }) => slug === "turner-tv");
  assert.equal(turner?.metadata.client, "TURNER");
  assert.equal(turner?.meta[0], "TURNER");
});

test("Positive Brand uses the approved 2018 year tag", () => {
  const positiveBrand = PROJECTS.find(({ slug }) => slug === "pi-app");
  assert.equal(positiveBrand?.metadata.year, "2018");
  assert.equal(positiveBrand?.meta[2], "2018");
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
      assert.ok(bodyWords >= 75, "provisional entries must explain their source limits");
    } else {
      assert.ok(
        bodyWords >= 325 && bodyWords <= 410,
        project.slug + " must remain within the 325–410 word editorial band; received " + bodyWords,
      );
    }
  }
});
