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

const aFreeSurfLessonBody = Object.freeze([
  heading("It's a comforting story. It's also incomplete"),
  paragraph(`I'm not here to argue that taste doesn't matter. It does. The problem is that taste is being positioned as a life raft when it's actually just one plank in a much larger vessel. And clinging to a single plank in rough water is a poor survival strategy. The professionals who will navigate the next decade successfully won't be those with the most refined aesthetic sensibilities. They'll be the ones who can operationalize their judgment—who understand systems deeply enough to make their taste consequential at scale. Taste without infrastructure is just opinion. And opinion, however sophisticated, doesn't ship products, build businesses, or solve complex problems.`),
  heading("The taste thesis, honestly stated"),
  paragraph(`Let's steelman the argument before we complicate it. AI tools have gotten remarkably good at execution. They can generate code, produce images, write copy, and synthesize research at speeds that would have seemed absurd five years ago. The mechanical act of making things is becoming cheaper by the month. When everyone has access to the same generative capabilities, the thinking goes, the bottleneck shifts from production to selection. Knowing what to make becomes more valuable than knowing how to make it.`),
  paragraph(`This tracks. When output is abundant, curation matters more. When anyone can generate a thousand variations, the person who can identify the right one holds disproportionate power. The role evolves from craftsperson to editor, from maker to orchestrator. The taste advocates aren't wrong about the direction. They're wrong about what it actually takes to get there.`),
  heading("Taste is an abstraction, not a skill"),
  paragraph(`Here's the first problem: taste isn't a discrete capability you can develop in isolation. It's an emergent property of other things—domain knowledge, contextual understanding, exposure to both success and failure, and the hard-won pattern recognition that comes from years of seeing what works and what doesn't. When someone demonstrates "good taste" in product design, they're actually demonstrating compressed knowledge about user behavior, technical constraints, business viability, and cultural context. When a creative director makes a call that elevates a campaign, they're drawing on accumulated understanding of brand positioning, audience psychology, competitive dynamics, and execution feasibility. The taste is visible. The substrate is invisible.`),
  paragraph(`This matters because you can't optimize for taste directly. You can only optimize for the inputs that produce it. And those inputs—systems thinking, domain expertise, strategic context—are precisely what the taste-as-salvation narrative tends to overlook. Telling someone to "develop better taste" without addressing these foundations is like telling someone to "be more insightful." It's not actionable. It mistakes the output for the process.`),
  heading("The self-attribution problem"),
  paragraph(`Here's the second problem, and it's more fundamental: everyone thinks they have good taste. This isn't cynicism. It's psychology. Taste is subjective enough that self-assessment becomes nearly impossible. The designer who favors maximalist aesthetics believes minimalists lack sophistication. The minimalist believes the maximalist lacks restraint. Both are convinced their judgment is superior. Both can point to successful work that validates their perspective. If taste is the differentiator, and everyone believes they possess it, what's the actual filtering mechanism? Markets don't reward self-perception. They reward outcomes. And outcomes are determined by far more than aesthetic judgment.`),
  paragraph(`The taste economy thesis assumes that good taste is scarce and identifiable—that the market will reliably surface and reward those who possess it. But taste is culturally contingent, context-dependent, and often only legible in retrospect. The campaign that seemed tasteful and restrained might have been merely forgettable. The choice that felt bold might have been reckless. You frequently can't distinguish between the two until the results are in. This doesn't mean taste is meaningless. It means taste is insufficient as a career strategy. Betting your professional future on a quality that can't be objectively measured, that everyone claims to possess, and that only reveals its value after the fact is not a plan. It's a hope.`),
  heading("What actually differentiates"),
  paragraph(`If not taste alone, then what? The answer isn't a single attribute but a capability stack—a combination of skills and dispositions that compound over time. Having observed what separates practitioners who consistently deliver impact from those who occasionally produce good work, the pattern becomes clear. It's rarely about who has the most refined sensibilities. It's about who can translate judgment into outcomes reliably, repeatedly, at scale.`),
  paragraph(`System literacy. The ability to understand how things connect—how a design decision affects engineering constraints, how a product choice ripples through business operations, how a creative direction interacts with distribution channels. Taste tells you what's good. Systems literacy tells you what's possible, what's sustainable, and what will actually survive contact with reality. In an age of AI, this extends to understanding how these tools actually work—not at the level of neural network architecture, but at the level of practical capability and constraint. What can current models do well? Where do they fail? How do you construct workflows that leverage their strengths while compensating for their weaknesses? This isn't technical knowledge for its own sake. It's the systems understanding required to make AI a genuine multiplier rather than a novelty.`),
  paragraph(`Domain depth. Taste that isn't grounded in domain expertise is just aesthetic preference. The professional who can look at a solution and immediately identify its flaws isn't exercising some mystical faculty. They've seen enough implementations to recognize the patterns. They understand the problem space deeply enough to know what "good" actually means in context. This is particularly crucial when working with AI tools. The models don't know your industry, your users, your constraints. They produce outputs that look plausible but may be fundamentally misaligned with the actual problem. Domain expertise is what allows you to direct these tools effectively—to prompt with precision, to evaluate outputs critically, to know when the plausible-looking answer is actually wrong.`),
  paragraph(`Strategic context. Taste that ignores business reality is self-indulgence. The most elegant solution is worthless if it doesn't serve the actual objective. Understanding what you're optimizing for—and who you're optimizing for—is prerequisite to any judgment having value. This means understanding stakeholder dynamics, market positioning, resource constraints, and competitive context. It means being able to articulate why a particular direction serves the strategy, not just why it's aesthetically superior. The professionals who consistently deliver impact aren't those with the purest creative vision. They're those who can align creative vision with strategic intent.`),
  paragraph(`Agency and grit. Perhaps most importantly, the ability to actually make things happen. To push through ambiguity, navigate organizational friction, iterate past failure, and ship despite imperfect conditions. The taste discourse tends to emphasize judgment and curation—fundamentally evaluative postures. But evaluation without execution is commentary. The differentiating factor isn't just knowing what's good. It's having the drive and capability to bring good things into existence against all the forces that conspire to prevent it. This is the unsexy truth that the taste narrative glosses over. Success in any field requires grinding through problems that don't have elegant solutions. It requires working with people who don't share your sensibilities. It requires making decisions with incomplete information and living with the consequences. Taste is a component of this. It's not a substitute for it.`),
  heading("Operationalizing judgement"),
  paragraph(`The real opportunity in the age of AI isn't to retreat into taste as a protected domain. It's to build systems that make your judgment scale. This is where the conversation should be heading. Not "how do I preserve my value as a tastemaker?" but "how do I construct workflows, processes, and capabilities that allow my judgment to have impact beyond what I can personally touch?" This might mean developing fluency with agentic workflows—understanding how to orchestrate AI tools in sequences that accomplish complex tasks with appropriate human oversight at decision points. It might mean building evaluation frameworks that encode your judgment into repeatable processes. It might mean creating feedback loops that allow you to refine AI outputs systematically rather than one-off.`),
  paragraph(`The practitioners who are thriving right now aren't those who've circled the wagons around "human creativity." They're the ones who've figured out how to amplify their capabilities by integrating AI thoughtfully into their practice. They haven't abandoned judgment. They've found ways to apply it at leverage points where it matters most, while offloading execution to tools that handle it better and faster. This requires learning new skills. Understanding how models work. Getting comfortable with prompt engineering and context design. Building mental models for what automation can and can't do. None of this diminishes the importance of taste. It contextualizes taste within a broader capability set that actually delivers results.`),
  heading("The path forward"),
  paragraph(`None of this is an argument against developing your aesthetic sensibilities, your critical faculties, your ability to discern good from bad. These remain valuable. They're just not sufficient. The argument is for expanding your conception of what it takes to succeed. For recognizing that taste is one node in a network of capabilities, not the whole network. For investing in systems literacy and domain depth and strategic thinking with the same seriousness you bring to developing your creative judgment.`),
  paragraph(`The professionals who will thrive in the coming years will be those who can hold multiple frames simultaneously—who can exercise taste and understand systems, who can make aesthetic judgments and navigate business complexity, who can curate and build. This is more demanding than retreating into taste as a safe harbor. It requires continuous learning in domains that may feel foreign. It requires engaging with technical and strategic dimensions of work that creative professionals have historically been able to avoid. It requires accepting that the boundaries of your role are expanding, and that maintaining impact means growing to fill the new space. But it's also more honest than pretending that taste alone will see you through. The transformation underway is real. The tools are getting better. The competitive landscape is shifting. Meeting this moment requires more than pointing to your sensibilities and hoping that's enough. Taste matters. It always has. But taste has always been in service of something larger—a problem solved, a business built, a vision realized. The goal was never the taste itself. The goal was the impact.`),
  heading("Develop your judgement, but build the machinery that makes it matter. Ride the wave."),
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
    slug: "a-free-surf-lesson",
    title: "A Free Surf Lesson",
    meta: ["Andrew Zellinger", "Jan 9th 2026"],
    summary: "Good taste alone won't save you from the crashing wave. Judgement alone isn't enough to thrive in the age of AI. There's a narrative gaining traction in design and technology circles. It goes something like this: as AI commoditizes execution, human taste becomes the ultimate differentiator. The ability to discern good from bad, to curate rather than create, to know what should exist—this is what will separate professionals who thrive from those who get automated into irrelevance.",
    body: aFreeSurfLessonBody,
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
