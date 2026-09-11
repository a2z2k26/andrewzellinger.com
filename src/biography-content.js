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
  lead: "I’m Andrew Zellinger, a hands-on product design lead working across complex workflows, design systems, and AI products. I connect research, strategy, design, and engineering. This site is the standing record of my commercial product design career and the body of work that established my practice.",
  practice: Object.freeze({
    label: "Design practice",
    body: "I work best where products are complex, the path forward is unclear, and design needs to do more than produce screens. My background spans art direction, branding, product design, leadership, and teaching, and I’ve worked both as the design function for early teams and within established organizations. Across that work, I connect customer needs and business decisions to system behavior and implementation details. Over the past two and a half years, I’ve expanded that practice by building AI products and launching an automation consultancy. That newer body of work is not represented in this collection, but it grows from the same foundation and has made me a more technical designer while keeping the work grounded in the people who use it.",
  }),
  experience: Object.freeze({
    label: "Experience",
    entries: Object.freeze([
      Object.freeze({
        organization: "Independent practice",
        role: "Design Consultant",
        dates: "Present",
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
        organization: "SketchDeck",
        role: "Design Lead · Contract",
        dates: "2023 — 2024",
      }),
      Object.freeze({
        organization: "Fi",
        role: "Design Lead",
        dates: "2023 — 2024",
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
        organization: "AKQA",
        role: "UX Design Lead · Contract",
        dates: "2022 — 2023",
      }),
      Object.freeze({
        organization: "I&Co / Audible Sleep",
        role: "UX Design Lead",
        dates: "2021 — 2022",
      }),
      Object.freeze({
        organization: "Greater Than One",
        role: "Director of UX · Contract",
        dates: "2020 — 2021",
      }),
      Object.freeze({
        organization: "Studio Rodrigo",
        role: "Senior Product Designer · Contract",
        dates: "2019 — 2020",
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
        organization: "Noom",
        role: "Senior Product Designer · Contract",
        dates: "2016 — 2020",
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
        organization: "Pod1",
        role: "Senior Product Designer · Contract",
        dates: "2014 — 2015",
      }),
      Object.freeze({
        organization: "ustwo",
        role: "Senior Product Designer",
        dates: "2013 — 2015",
      }),
      Object.freeze({
        organization: "Crispin Porter & Bogusky",
        role: "Senior Designer · Contract",
        dates: "2010 — 2012",
      }),
      Object.freeze({
        organization: "School of Visual Arts",
        role: "Adjunct Instructor",
        dates: "2010 — 2012",
      }),
      Object.freeze({
        organization: "Razorfish",
        role: "Product Designer · Contract",
        dates: "2009 — 2010",
      }),
      Object.freeze({
        organization: "Iris Nation",
        role: "Art Director",
        dates: "2007 — 2010",
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
        items: Object.freeze(["Product strategy", "Qualitative and quantitative research", "Information architecture", "Interaction design", "Usability testing"]),
      }),
      Object.freeze({
        label: "Delivery",
        items: Object.freeze(["Design engineering", "Front-end development", "Rapid prototyping", "QA and deployment"]),
      }),
      Object.freeze({
        label: "Direction",
        items: Object.freeze(["Design systems", "Branding and creative direction", "Workshop facilitation", "Design mentorship and critique", "Team building and hiring", "Product roadmapping"]),
      }),
    ]),
    clients: Object.freeze([
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
    ]),
  }),
  education: Object.freeze({
    label: "Education",
    body: "B.F.A. in Design, School of Visual Arts, New York City.",
  }),
  stack: Object.freeze({
    label: "Tools & technologies",
    groups: Object.freeze([
      Object.freeze({ label: "Design & prototyping", items: Object.freeze(["Figma", "Sketch", "Adobe Creative Cloud", "Framer", "Webflow", "Rive", "Storybook"]) }),
      Object.freeze({ label: "Code & development", items: Object.freeze(["React", "JavaScript", "TypeScript", "HTML / CSS", "Node.js", "Python", "GSAP", "Three.js", "Cursor", "Claude Code", "Codex", "GitHub"]) }),
      Object.freeze({ label: "AI & image workflows", items: Object.freeze(["Claude", "ChatGPT", "Llama", "ComfyUI / SDXL", "Midjourney", "Krea", "Magnific", "Runway"]) }),
      Object.freeze({ label: "Motion & 3D", items: Object.freeze(["Spline", "Blender", "Cinema 4D", "Cavalry"]) }),
      Object.freeze({ label: "Data & deployment", items: Object.freeze(["Supabase", "Pinecone", "Vercel", "Docker", "Cloudflare"]) }),
      Object.freeze({ label: "Collaboration", items: Object.freeze(["Notion", "Confluence", "Jira", "Google Workspace", "Slack", "Discord"]) }),
    ]),
  }),
  availability: Object.freeze({
    label: "Work with me",
    body: "I’m open to senior or lead product design roles, particularly where complex workflows, design systems, AI, and hands-on product development intersect. I can establish design for an early team or contribute within an established organization, from problem definition through detailed interaction design and delivery.",
  }),
});

export const BIOGRAPHY_CONTACT = Object.freeze({
  email: "hello@andrewzellinger.com",
  socialLinks: Object.freeze([
    Object.freeze({ label: "LinkedIn", url: "https://www.linkedin.com/in/andrewzellinger/" }),
    Object.freeze({ label: "GitHub", url: "https://github.com/a2z2k26" }),
    Object.freeze({ label: "Cal.com", url: "https://cal.com/andrewzellinger" }),
  ]),
});
