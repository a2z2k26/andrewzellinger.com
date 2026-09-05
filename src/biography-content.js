// @ts-check

/**
 * Static biography draft captured from Andrew Zellinger's resume set on
 * 2026-09-03. The 2026 two-page resume is the primary source; AZ_1 and AZ_2
 * are supporting sources. The PDFs are private authoring inputs only and are
 * not fetched, linked, or required by the website at runtime.
 *
 * Private source provenance:
 * - /Users/az/Documents/A-Z Profile/A-Z Dsn Resume/AndrewZellinger_Resume[2026].pdf
 * - /Users/az/Desktop/AZ_1.pdf
 * - /Users/az/Desktop/AZ_2.pdf
 */

/** @typedef {{ organization: string, role: string, dates: string }} BiographyExperience */
/** @typedef {{ label: string, items: readonly string[] }} BiographyCapabilityGroup */

export const BIOGRAPHY = Object.freeze({
  lead: "Andrew Zellinger has spent two decades helping companies turn ideas into working products. He is a product designer, creative director, and fractional partner who builds from first principles through product launch.",
  practice: Object.freeze({
    label: "Design practice",
    body: "Andrew’s independent practice spans strategy, research, interaction design, brand, and front-end implementation across studios, agencies, startups, and large technology companies. More recently, he has applied that range to AI-native product development, designing and building products around emerging models and agentic systems while helping teams decide where automation belongs, where human agency matters, and how new technology earns trust.",
  }),
  experience: Object.freeze({
    label: "Experience",
    entries: Object.freeze([
      Object.freeze({
        organization: "Independent practice",
        role: "Lead Product Designer",
        dates: "2013 — Present",
      }),
      Object.freeze({
        organization: "Cosmos Holodeck",
        role: "Design Engineer",
        dates: "2025 — 2026",
      }),
      Object.freeze({
        organization: "Avantos",
        role: "Design Lead",
        dates: "2024 — 2025",
      }),
      Object.freeze({
        organization: "Sketch / Amazon Fire TV",
        role: "Design Lead",
        dates: "2024 — 2025",
      }),
      Object.freeze({
        organization: "Live Auctioneers",
        role: "Systems Design Lead",
        dates: "2022 — 2023",
      }),
      Object.freeze({
        organization: "Modern Age",
        role: "Lead Product Designer",
        dates: "2022 — 2023",
      }),
      Object.freeze({
        organization: "I&Co / Audible Sleep",
        role: "UX Design Lead",
        dates: "2021 — 2022",
      }),
      Object.freeze({
        organization: "Philosophie",
        role: "Design Director",
        dates: "2018 — 2020",
      }),
      Object.freeze({
        organization: "Ueno / Reuters TV",
        role: "Senior Product Designer",
        dates: "2017 — 2018",
      }),
      Object.freeze({
        organization: "Red Antler / Foursquare",
        role: "Senior Designer",
        dates: "2015 — 2016",
      }),
      Object.freeze({
        role: "Design Lead",
        organization: "Method",
        dates: "2015 — 2016",
      }),
      Object.freeze({
        organization: "ustwo",
        role: "Senior Product Designer",
        dates: "2013 — 2015",
      }),
      Object.freeze({
        organization: "School of Visual Arts",
        role: "Adjunct Instructor",
        dates: "2010 — 2012",
      }),
    ]),
  }),
  capabilities: Object.freeze({
    label: "Capabilities",
    groups: Object.freeze([
      Object.freeze({
        label: "AI systems",
        items: Object.freeze(["AI product design", "Agentic and conversational interfaces", "Multi-agent orchestration", "Prompt and context engineering"]),
      }),
      Object.freeze({
        label: "Product",
        items: Object.freeze(["Product strategy", "UX research", "Interaction and systems design", "Fractional design leadership"]),
      }),
      Object.freeze({
        label: "Delivery",
        items: Object.freeze(["Design engineering", "Front-end development", "Rapid prototyping", "QA and deployment"]),
      }),
      Object.freeze({
        label: "Direction",
        items: Object.freeze(["Design systems", "Branding and creative direction", "Workshop facilitation", "Founder and leadership partnership"]),
      }),
    ]),
    clients: Object.freeze([
      "Amazon",
      "American Express",
      "Apple",
      "Avantos",
      "Cosmos",
      "Foursquare",
      "Google",
      "IBM",
      "Live Auctioneers",
      "McDonald's",
      "Microsoft",
      "Modern Age",
      "Northwestern Mutual",
      "PwC",
      "Thomson Reuters",
      "Turner Media",
      "WeWork",
    ]),
  }),
  availability: Object.freeze({
    label: "Work with me",
    body: "Andrew is available for fractional, project, and advisory work. He can serve as the design function early on or embed alongside an existing team to move a product from first principles to a built and deployed release.",
  }),
});

export const BIOGRAPHY_CONTACT = Object.freeze({
  email: "hello@andrewzellinger.com",
  websiteLabel: "andrewzellinger.com",
  websiteUrl: "https://andrewzellinger.com",
});
