// Temporary editorial records. Titles, metadata, excerpts, and article body
// paragraphs are shared by the Articles index and every Article Detail route.

const temporaryArticleBody = Object.freeze([
  "Temporary article copy. This paragraph establishes the intended editorial measure and reading rhythm; it should be replaced by Andrew's authored introduction.",
  "Temporary article copy. This section reserves space for the central position, supporting examples, and the practical implications of the idea without inventing a finished argument.",
  "Temporary article copy. References, counterpoints, and a closing synthesis will live here once the real draft and supporting sources are available.",
]);

function article({ slug, title, issue, date, category, summary, index }) {
  return Object.freeze({
    kind: "article",
    slug,
    path: `/articles/${slug}/`,
    collectionPath: "/articles",
    title,
    meta: Object.freeze([issue, date, category]),
    summary,
    body: temporaryArticleBody,
    media: Object.freeze({
      label: `Tasman Glacier landscape stand-in for article ${index}`,
    }),
  });
}

export const ARTICLE_DETAILS = Object.freeze([
  article({
    index: 1,
    slug: "designing-for-systems-that-change",
    title: "Designing for systems that change",
    issue: "Issue 01",
    date: "Sep 2026",
    category: "Practice",
    summary: "Temporary notes on shaping products that adapt over time without losing clarity, trust, or a recognizably human point of view.",
  }),
  article({
    index: 2,
    slug: "the-interface-is-becoming-a-conversation",
    title: "The interface is becoming a conversation",
    issue: "Issue 02",
    date: "Sep 2026",
    category: "Interfaces",
    summary: "A provisional essay about moving beyond fixed screens toward products that listen, respond, and make their reasoning easier to understand.",
  }),
  article({
    index: 3,
    slug: "prototypes-as-instruments-for-thinking",
    title: "Prototypes as instruments for thinking",
    issue: "Issue 03",
    date: "Aug 2026",
    category: "Prototyping",
    summary: "Draft reflections on using working models to expose assumptions, sharpen decisions, and bring difficult product questions into view.",
  }),
  article({
    index: 4,
    slug: "working-at-the-edge-of-certainty",
    title: "Working at the edge of certainty",
    issue: "Issue 04",
    date: "Aug 2026",
    category: "Strategy",
    summary: "Temporary editorial copy about making useful product decisions when the technology, customer behavior, and opportunity are still moving.",
  }),
  article({
    index: 5,
    slug: "building-fluency-before-building-features",
    title: "Building fluency before building features",
    issue: "Issue 05",
    date: "Jul 2026",
    category: "Teams",
    summary: "A replaceable first-pass piece on helping teams develop shared judgment before committing emerging capabilities to a roadmap.",
  }),
  article({
    index: 6,
    slug: "where-judgment-enters-the-loop",
    title: "Where judgment enters the loop",
    issue: "Issue 06",
    date: "Jul 2026",
    category: "Systems",
    summary: "Temporary observations on deciding which parts of an intelligent product should adapt, ask, explain, or remain deliberately fixed.",
  }),
  article({
    index: 7,
    slug: "the-cost-of-invisible-decisions",
    title: "The cost of invisible decisions",
    issue: "Issue 07",
    date: "Jun 2026",
    category: "Craft",
    summary: "A mock editorial note about the product choices users may never see, but feel through pace, confidence, and coherence.",
  }),
  article({
    index: 8,
    slug: "designing-alignment-before-interfaces",
    title: "Designing alignment before interfaces",
    issue: "Issue 08",
    date: "Jun 2026",
    category: "Leadership",
    summary: "Replaceable copy on helping product teams agree on the problem, the tradeoffs, and the standard of evidence before drawing screens.",
  }),
  article({
    index: 9,
    slug: "what-prototypes-make-discussable",
    title: "What prototypes make discussable",
    issue: "Issue 09",
    date: "May 2026",
    category: "Research",
    summary: "A provisional reflection on how tangible experiments give teams a shared object for critique, learning, and better disagreement.",
  }),
  article({
    index: 10,
    slug: "a-practical-optimism-for-emerging-tools",
    title: "A practical optimism for emerging tools",
    issue: "Issue 10",
    date: "May 2026",
    category: "Futures",
    summary: "Temporary notes on staying ambitious about new capabilities while remaining specific about people, consequences, and real value.",
  }),
]);
