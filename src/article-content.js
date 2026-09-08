// Temporary editorial records. Titles, metadata, excerpts, and article body
// paragraphs are shared by the Articles index and every Article Detail route.

const temporaryArticleBody = Object.freeze([
  "Temporary article copy. This paragraph establishes the intended editorial measure and reading rhythm; it should be replaced by Andrew's authored introduction.",
  "Temporary article copy. This section reserves space for the central position, supporting examples, and the practical implications of the idea without inventing a finished argument.",
  "Temporary article copy. References, counterpoints, and a closing synthesis will live here once the real draft and supporting sources are available.",
]);

const heading = (text) => Object.freeze({ type: "heading", text });
const paragraph = (text) => Object.freeze({ type: "paragraph", text });

const companyOfOneBody = Object.freeze([
  heading("At its worst, my agents waited in line"),
  paragraph(`A manager needed the expensive model to do its job. So did four others. There was one account, one lock, and a five-minute timeout — so they queued, by priority, one at a time, while the rest of the system stalled waiting on a decision that hadn't happened yet. Underneath, a call graph I never wrote was assembling itself at runtime: one agent deciding it needed another, that one escalating to a third, the whole thing spidering outward through hops I couldn't predict and couldn't price. When it broke, I had recovery systems and failover systems to catch it, which is the politest possible way of admitting the coordination itself was brittle.`),
  paragraph(`That was the predecessor. I tore it down and built something from scratch — a harness that runs as a 24/7 agent system, the thing I actually operate every day. This is the story of what I built and the one conviction it's built on: emergent coordination doesn't scale — and it scales worse as the agents get smarter. Not the agents themselves; the wiring between them. The decision I made was to fix the structure and free the cognition: let each agent be as capable as the model allows, but never let the agents themselves decide, at runtime, who talks to whom. I'm a designer by trade; I had no business building a distributed agent system, so naturally the first one I built was the maximal version. It taught me the lesson the new one encodes.`),
  heading("Where it came from"),
  paragraph(`The thing I tore down was not a small thing. It was roughly thirty-eight thousand files, eight hundred thousand lines of source, half a gigabyte on disk. I'd branded it the "40 Thieves" — five department chiefs and thirty-five specialists, an org chart of agents modeled on a real company. It was ambitious in a way I'm still a little proud of. It also did about five things well and thirty-five things incompletely, and the reason was always the same.`),
  paragraph(`Every problem in that system was a coordination problem, and I kept solving coordination by adding more coordination. There were five overlapping orchestrators — one queue-based, one that batched agents into waves, one that watched git, one that managed the lossy handoffs between agents, one that tried to unify the other four. There was a "chameleon" manager that tried to eliminate handoffs entirely by having a single manager absorb whichever expertise it needed, which only relocated the complexity into a caching layer. There was a mutex lock so the managers wouldn't trample each other reaching for the one expensive model. Every layer I added to fix the coordination became a new thing that needed coordinating.`),
  paragraph(`That is the signature of emergence at scale. You don't design the behavior; you design the agents and hope the behavior that emerges from their interaction is the one you wanted. At forty agents, hope is expensive. The bill arrives as latency, as dollars, and — worst of all — as not being able to say what your own system will do next. So I stopped asking how to make agents coordinate, and started asking a different question: how do I make one mind operate many capabilities? Everything I built next follows from that one turn.`),
  heading("The hero, in one decision: agents as tools, not peers"),
  paragraph(`Here is the whole system in a single choice. The harness has forty-eight agents — six chiefs and forty-two specialists across six departments. Most of them never speak to each other. That sounds like a limitation. It is the entire point. In the old system, agents were peers: they talked, negotiated, handed work back and forth, and the path any task took through them was decided at runtime by the agents themselves. In the harness, agents are tools. There is one main mind — the primary agent — and it calls departments the way you call a function. "Send it to the board." "Ask strategy." "Spin up QA." The agents underneath don't form a committee; they're invoked, they run, they return, they're gone.`),
  paragraph(`The difference this buys is the difference between a call graph you hope converges and one you drew. When no agent can summon another agent, there is no surprise cascade — no third-party escalation you didn't ask for, no recursive spiral, no lossy compression of context as work crosses from one agent's head into a message and back out into another's. The main mind holds the context. The tools do the work. The path is knowable because I'm the one who laid it down, every time, the same way. This is what "determinism over emergence" actually means in practice. It is not that the agents are dumb or scripted — each one is a capable model doing real reasoning. It's that the structure connecting them is fixed and legible instead of negotiated and emergent. I gave up the fantasy that the right behavior would arise on its own, and in exchange I got a system whose behavior I can predict before I run it. For something that runs 24/7 and spends real money, that trade isn't close.`),
  heading("Model distribution as control, not just thrift"),
  paragraph(`Once the structure is fixed, where you place each model becomes a design surface — and I use it deliberately. The chiefs all run on Claude Sonnet, for a specific reason: a chief's job is to delegate, and delegation requires real tool-calling — the ability to invoke a specialist and consume a structured result. So the role that must call tools runs on the model that calls tools cleanly. The specialists underneath mostly run on a cheaper execution model, because their job is to do bounded work and return prose, not to orchestrate. The expensive capability sits exactly where it's needed and nowhere else. Then there's the board — the part of the system whose entire purpose is to argue with me before I make a hard call. Its seats run on different models on purpose. If I want genuine disagreement, I can't get it from one model wearing nine different prompt-hats; that's a single set of priors costumed as a panel. Real divergence has to come from the substrate, so the contrarian seat and the long-term seat and the cross-vendor seat are genuinely different engines reaching genuinely different conclusions. Notice what this is and isn't. The old system distributed models too — across three providers and five-plus models — but as a cost optimization that the coordination overhead promptly ate, plus a mutex lock to keep the managers from fighting over the pricey one. Here, model placement is a behavior-control lever: tool-calling where I need reliability, cheap where I need volume, diverse where I need honest dissent. The cost savings are real, but they're the dividend, not the design goal. I'm choosing how the system thinks, and the bill goes down as a side effect.`),
  heading("The gates: the system refuses to ship garbage"),
  paragraph(`A deterministic structure is only worth anything if "done" means something. So before any department's output is allowed to leave the system, it passes eight checks. Output isn't empty. No error or refusal markers in the text. Structured results actually parse. Cost came in under the department's budget. Duration came in under the limit. The specialist count didn't exceed what was configured — and, the gate I care about most, it didn't fall below the floor. That last one is the Delegation Floor: a chief that was supposed to delegate to at least one specialist but came back having done the work itself, alone, fails. The run is marked unsuccessful and rejected.`),
  paragraph(`Fail any check and the result doesn't get a pass with an asterisk — it comes back success=False. There is no "mostly worked, ship it anyway," because that path doesn't exist in the code. The old system trusted its output by vibes, which is how silent failures happen: something degrades, nobody notices, the bad result flows downstream wearing the costume of a good one. The gates make that impossible. Every output is checked against budget, time, and completion before I ever see it, and anything that fails surfaces as a loud, legible failure instead of a quiet wrong answer.`),
  paragraph(`This is determinism as integrity. The structure decides how work flows; the gates decide whether the work was real. Together they turn "I hope the agents did their job" into "the system verified the job or told me it couldn't."`),
  heading("Cost as a first-class constraint"),
  paragraph(`The predecessor's cost was emergent: it fell out of whatever the agents decided to do, and the mutex lock was the closest thing it had to a budget. The harness's cost is a number I set. Three things make that true. There's a hard leash on the self-improvement loop — the part of the system allowed to propose changes to itself runs on roughly a couple of dollars a day, because an autonomous process with an open-ended budget is a process you've stopped governing. There's cost accounting that refuses to lie: when the system doesn't actually know what a call cost, it records unknown and will fail closed against a strict budget rather than quietly calling it zero — because "we don't know" silently becoming "$0" is exactly how overspend hides. And there's the lifecycle itself: departments aren't kept resident, idling and consuming context. They're built fresh when called, they run, and they're torn down. Nothing sits around costing money for capability I'm not using this second. None of this is a feature I bolted on at the end. It's the same conviction as everything else, pointed at money: a cost you can predict beats a cost that emerges. I'd rather have a system that tells me "this would exceed budget, I'm stopping" than one that surprises me with a bill and a shrug.`),
  heading("What I built"),
  paragraph(`There's one department the system doesn't have, and its absence is the whole lesson in miniature: there is no engineering team. Engineering is the work the system exists to do — so instead of fanning it out across a roster of agents I'd then have to coordinate, I kept it at the center. The main mind is the engineer. The hardest restraint in the whole build was not adding agents, because adding agents is what I knew how to do. The empty seat is the most deliberate decision in the system.`),
  paragraph(`So that's the hero: a real, operable agent harness, built from scratch, running every day — forty-eight agents that never talk to each other, models placed to control behavior rather than just cut cost, eight gates standing between any result and my desk, and a budget I set instead of one I discover. It is not the biggest thing I've built. The biggest thing I built is the one I threw away.`),
  heading("This isn't a bet against capable agents"),
  paragraph(`I want to be exact about what I'm not saying, because it's the easiest thing to misread. None of this is a bet against agents getting smarter. It's the opposite bet. The agents inside the harness are as capable as the models I can give them, and when the models improve, the harness inherits it — the cells get smarter while the structure holds. What I constrained was never the intelligence. It was the wiring — who can summon whom, what leaves the system unverified, what gets to spend without a ceiling. And that constraint matters more as the agents get more capable, not less. A more capable agent that can spawn other agents spirals faster, spends harder, and fails in more plausible ways — and a plausible failure is exactly the one that slips past a system running on trust. The smarter the thing you're operating, the more you need to be able to predict, price, and verify it. Determinism isn't the opposite of capability. It's the substrate that lets you deploy capability without lying awake about it. The more powerful the agent, the more it needs a harness it can't escape.`),
  paragraph(`What I actually learned, across all those years and all that wasted scale, was not how to build something more impressive. It was this: emergence is what you reach for when you don't yet know what you want the system to do. Determinism is what you build once you do. I finally knew what I wanted. So I built something I can operate — and the fact that I can operate it, no matter how capable the thing inside it becomes, is the only success metric that ever mattered.`),
]);

function article({ slug, title, issue, date, category, meta, summary, body = temporaryArticleBody, index }) {
  const articleMeta = meta ?? [issue, date, category];
  return Object.freeze({
    kind: "article",
    slug,
    path: `/articles/${slug}/`,
    collectionPath: "/articles",
    title,
    meta: Object.freeze([...articleMeta]),
    summary,
    body: Object.freeze([...body]),
    media: Object.freeze({
      label: `Tasman Glacier landscape stand-in for article ${index}`,
    }),
  });
}

export const ARTICLE_DETAILS = Object.freeze([
  article({
    index: 1,
    slug: "company-of-one",
    title: "Company of One",
    meta: ["Andrew Zellinger", "Jun 2nd 2026"],
    summary: "I spent years building agent systems the wrong way before I built one that works. This is the story of the one that works — a 24/7 harness I built from scratch — and the single conviction underneath it: a system whose behavior you can actually predict is what lets you deploy capable agents, instead of just hoping they behave.",
    body: companyOfOneBody,
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
