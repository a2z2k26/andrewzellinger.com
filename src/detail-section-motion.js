import { gsap } from "gsap";

export const SECTION_REVEAL = Object.freeze({
  offsetY: 12,
  lineDuration: .54,
  labelDuration: .38,
  bodyDuration: .46,
  labelStart: .12,
  bodyStart: .17,
  totalDuration: .63,
});

function sectionParts(section) {
  const project = section.matches(".detail-unit__section--project");
  if (!project && section.matches(".detail-unit__article-opening")) {
    return { label: null, body: section, hasRule: false };
  }
  return {
    label: section.querySelector(project
      ? ".detail-unit__section-label"
      : ".detail-unit__article-section h3"),
    body: section.querySelector(project
      ? ".detail-unit__section-body--project"
      : ".detail-unit__article-section-body"),
    hasRule: project && section.matches(":first-child"),
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
    const { label, body, hasRule } = sectionParts(section);
    if (hasRule) section.style.setProperty("--detail-section-rule-progress", "0");
    gsap.set([label, body].filter(Boolean), {
      autoAlpha: 0,
      y: SECTION_REVEAL.offsetY,
      willChange: "transform,opacity",
    });
  });

  const reveal = (section) => {
    if (timelines.has(section)) return;
    const { label, body, hasRule } = sectionParts(section);
    const text = [label, body].filter(Boolean);
    const timeline = gsap.timeline({
      onComplete: () => {
        section.style.removeProperty("--detail-section-rule-progress");
        gsap.set(text, { clearProps: "transform,opacity,visibility,willChange" });
      },
    });
    timelines.set(section, timeline);
    if (hasRule) {
      timeline.to(section, {
        "--detail-section-rule-progress": 1,
        duration: SECTION_REVEAL.lineDuration,
        ease: "power2.out",
      }, 0);
    }
    if (label) {
      timeline.to(label, {
        autoAlpha: 1,
        y: 0,
        duration: SECTION_REVEAL.labelDuration,
        ease: "power2.out",
      }, hasRule ? SECTION_REVEAL.labelStart : 0);
    }
    if (body) {
      timeline.to(body, {
        autoAlpha: 1,
        y: 0,
        duration: SECTION_REVEAL.bodyDuration,
        ease: "power2.out",
      }, hasRule ? SECTION_REVEAL.bodyStart : .06);
    }
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
      const { label, body } = sectionParts(section);
      section.style.removeProperty("--detail-section-rule-progress");
      gsap.set([label, body].filter(Boolean), {
        clearProps: "transform,opacity,visibility,willChange",
      });
    });
  };

  return { start, destroy };
}
