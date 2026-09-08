// Historical, no longer imported: approved three-project editorial pilot. Dates, summaries, Context and
// Outcome stay unchanged pending the separate factual-review decisions.
export const PILOT_SECTION_LABELS = Object.freeze(["Context", "Work", "Key decisions", "Outcome"]);

export const PROJECT_EDITORIAL_PILOT = Object.freeze({
  "audible-sleep": {
    work: "As UX Lead, I established the experience direction with a multidisciplinary team of 15 designers and product strategists. I translated research into the application architecture and wireframes, focusing on the session player and its interaction states. Research with sleep specialists, market material, personas, and user feedback shaped Home, Browse, and Profile. I partnered with visual design, Audible's internal team, and subject-matter experts, using prototypes to test personalized sessions, playback controls, and the balance between guidance and low stimulation.",
    decisions: [
      "Separate bedtime, rise-time, and mood configuration from playback so the session player can remain minimal.",
      "Organize sessions around fall-asleep, stay-asleep, and wake phases rather than require listeners to manage an ordinary audio queue.",
      "Test both in-app and lock-screen controls so guidance can recede once a sleep session begins.",
    ],
  },
  avantos: {
    work: "As AI Product Designer, I led research, journey mapping, information architecture, interaction design, UI, prototypes, and implementation specifications across customer and operator experiences. I worked with leadership, engineers, and financial-services experts, and shaped investor-facing concepts alongside the MVP. Fifteen interviews with advisors, relationship service associates, and regional vice presidents informed the workflow model. More than 100 investment bankers participated in pilot testing, refining terminology, filtering, confidence display, and progress feedback.",
    decisions: [
      "Pair AI-extracted values with confidence scores and source references so operators can verify information rather than accept it without review.",
      "Give clients guided progress and an embedded assistant, while operators receive dense dashboards, configurable templates, task controls, and collaboration tools.",
      "Model journeys as phases, actions, groups, sub-actions, and tasks to support configurable onboarding across institutions.",
    ],
  },
  foursquare: {
    work: "I worked with Red Antler to develop the assets and applications of Foursquare's new identity. My contribution was production-intensive brand design: translating the strategic direction into a coherent system across the app and its wider touchpoints. The work centered on the superhero-inspired F monogram, which also suggested a map pin, flag, and speech bubble. Close iteration with Foursquare's internal team connected the identity's expression to the needs of the product.",
    decisions: [
      "Evaluate the identity against the app as its primary canvas, including recognition at mobile-icon scale.",
      "Apply the bold blue, pink, and white palette consistently across product and marketing contexts.",
      "Develop a system that signals the move toward local discovery while retaining recognition through a distinctive F emblem.",
    ],
  },
});

export function applyEditorialPilot(slug, sections) {
  const pilot = PROJECT_EDITORIAL_PILOT[slug];
  if (!pilot) return sections;
  return Object.freeze([
    sections[0],
    Object.freeze({ label: "Work", paragraphs: Object.freeze([pilot.work]) }),
    Object.freeze({ label: "Key decisions", paragraphs: Object.freeze([]), items: Object.freeze([...pilot.decisions]) }),
    sections[2],
  ]);
}
