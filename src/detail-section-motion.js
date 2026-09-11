import {
  TEXT_MOTION,
  prepareStructuralText,
  resetStructuralText,
  revealStructuralText,
} from "./elevation/text-motion-system.js";

export const SECTION_REVEAL = Object.freeze({
  offsetY: TEXT_MOTION.distance.reveal,
  labelDuration: TEXT_MOTION.duration.response,
  bodyDuration: TEXT_MOTION.duration.reveal,
  bodyStart: TEXT_MOTION.stagger.structural,
  totalDuration: TEXT_MOTION.duration.reveal + TEXT_MOTION.stagger.structural,
});

function sectionParts(section) {
  const project = section.matches(".detail-unit__section--project");
  if (!project && section.matches(".detail-unit__article-opening")) {
    return { label: null, body: section };
  }
  return {
    label: section.querySelector(project
      ? ".detail-unit__section-label"
      : ".detail-unit__article-section h3"),
    body: section.querySelector(project
      ? ".detail-unit__section-body--project"
      : ".detail-unit__article-section-body"),
  };
}

export function createDetailSectionMotion({ view, enabled = false }) {
  const sections = enabled
    ? [...view.querySelectorAll(
      ".detail-unit__section--project, .detail-unit__article-opening, .detail-unit__article-section",
    )]
    : [];
  const timelines = new Map();
  let observer = null;
  let started = false;

  sections.forEach((section) => {
    prepareStructuralText(sectionParts(section));
  });

  const reveal = (section) => {
    if (timelines.has(section)) return;
    const parts = sectionParts(section);
    const timeline = revealStructuralText(parts);
    timelines.set(section, timeline);
  };

  const start = () => {
    if (started || !sections.length) return;
    started = true;
    if (typeof IntersectionObserver !== "function") {
      sections.forEach(reveal);
      return;
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = entry.target;
        observer.unobserve(section);
        reveal(section);
      });
    }, {
      root: null,
      rootMargin: "0px 0px -12% 0px",
      threshold: .12,
    });
    sections.forEach((section) => observer.observe(section));
  };

  const destroy = () => {
    observer?.disconnect();
    observer = null;
    timelines.forEach((timeline) => timeline.kill());
    timelines.clear();
    sections.forEach((section) => {
      resetStructuralText(sectionParts(section));
    });
  };

  return { start, destroy };
}
