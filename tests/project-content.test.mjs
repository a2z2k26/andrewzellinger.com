import assert from "node:assert/strict";
import test from "node:test";

import { CASE_STUDIES } from "../src/detail-content.js";
import {
  ALL_PROJECTS,
  HIDDEN_PROJECT_SLUGS,
  PROJECTS,
} from "../src/project-content.js";
import { PROJECT_SECTION_LABELS } from "../src/project-narratives.js";

const expectedTitles = [
  "Avantos",
  "Amazon",
  "Audible",
  "Turner Media",
  "Obagi",
  "WeWork",
  "Google",
  "Live Auctioneers",
  "Andrew Eccles",
  "P&G",
  "Modern Age",
  "Fi",
  "Thompson Reuters",
  "Gero",
  "Foursquare",
  "PwC",
  "NW Mutual",
  "McDonalds",
  "Positive Intelligence",
];

test("project content exposes the complete approved project collection", () => {
  assert.equal(ALL_PROJECTS.length, 19);
  assert.deepEqual(ALL_PROJECTS.map(({ title }) => title), expectedTitles);
  assert.equal(new Set(ALL_PROJECTS.map(({ slug }) => slug)).size, ALL_PROJECTS.length);
  assert.deepEqual(HIDDEN_PROJECT_SLUGS, []);
  assert.equal(PROJECTS.length, 19);
  assert.deepEqual(PROJECTS.map(({ title }) => title), expectedTitles);
  assert.deepEqual(
    ALL_PROJECTS.filter(({ slug }) => ["juuice-app", "tred-auto", "seattle-genetics"].includes(slug)),
    [],
  );

  for (const project of ALL_PROJECTS) {
    assert.equal(project.kind, "project");
    assert.equal(project.collectionPath, "/");
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
  for (const project of ALL_PROJECTS) {
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
          "Procter & Gamble digital experience project image",
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
          "Gero Timer Pomodoro app for Apple Watch and iPhone",
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
    assert.ok(project.sections.every((section) => section.label && (section.paragraphs.length > 0 || section.items?.length > 0)));
  }

  const runtimeContent = JSON.stringify(ALL_PROJECTS);
  assert.doesNotMatch(runtimeContent, /notion\.so|api\.notion|prod-files|attachment:/i);
  assert.doesNotMatch(runtimeContent, /"slug":"(?:ustwo|talentai)"/i);
});

test("case-study routes consume the canonical project collection", () => {
  assert.equal(CASE_STUDIES, PROJECTS);
});

test("Gero uses the approved USTWO client tag", () => {
  const gero = ALL_PROJECTS.find(({ slug }) => slug === "gero-app");
  assert.equal(gero?.metadata.client, "USTWO");
  assert.equal(gero?.meta[0], "USTWO");
});

test("Amazon uses the approved AMAZON client tag", () => {
  const amazon = PROJECTS.find(({ slug }) => slug === "amazon-fire-tv");
  assert.equal(amazon?.metadata.client, "AMAZON");
  assert.equal(amazon?.meta[0], "AMAZON");
});

test("Obagi uses the approved 2020 year tag", () => {
  const obagi = ALL_PROJECTS.find(({ slug }) => slug === "obagi");
  assert.equal(obagi?.metadata.year, "2020");
  assert.equal(obagi?.meta[2], "2020");
});

test("Turner Media uses the approved TURNER client tag", () => {
  const turner = PROJECTS.find(({ slug }) => slug === "turner-tv");
  assert.equal(turner?.metadata.client, "TURNER");
  assert.equal(turner?.meta[0], "TURNER");
});

test("Positive Intelligence uses the approved 2018 year tag", () => {
  const positiveBrand = PROJECTS.find(({ slug }) => slug === "pi-app");
  assert.equal(positiveBrand?.metadata.year, "2018");
  assert.equal(positiveBrand?.meta[2], "2018");
});

test("case studies use substantive decisions without a padding quota", () => {
  for (const project of ALL_PROJECTS) {
    assert.deepEqual(project.sections.map(s => s.label), PROJECT_SECTION_LABELS);
    assert.deepEqual(project.sections.map(s => s.paragraphs.length), [1,0,1]);
    assert.equal(project.sections[0].label, "Context");
    assert.equal(project.sections[0].paragraphs.length, 1);
    assert.ok(!project.sections.some(section => section.label === "Work"));
    assert.equal(project.sections[1].items.length, 3);
    assert.ok(project.sections[1].items.every(item => item.trim().split(/\s+/).length >= 10));
    const words = project.sections.flatMap(s => [...s.paragraphs, ...(s.items ?? [])]).join(" ").split(/\s+/).length;
    assert.ok(words <= 350, project.slug + " exceeds the editorial upper budget");
    assert.ok(project.summary.length > 30);
  }
});
