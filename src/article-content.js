// Editorial records. Titles, metadata, excerpts, and article body paragraphs
// are shared by the Articles index and every Article Detail route.

const temporaryArticleBody = Object.freeze([
  "Temporary article copy. This paragraph establishes the intended editorial measure and reading rhythm; it should be replaced by Andrew's authored introduction.",
  "Temporary article copy. This section reserves space for the central position, supporting examples, and the practical implications of the idea without inventing a finished argument.",
  "Temporary article copy. References, counterpoints, and a closing synthesis will live here once the real draft and supporting sources are available.",
]);

const heading = (text) => Object.freeze({ type: "heading", text });
const paragraph = (text) => Object.freeze({ type: "paragraph", text });

const authoredBody = (source) => Object.freeze(
  source
    .trim()
    .split(/\n\s*\n+/)
    .flatMap((rawBlock) => {
      const block = rawBlock.trim();
      const headingMatch = block.match(/^\[([^\]]+)\](?:\s*\n([\s\S]+))?$/);

      if (!headingMatch) {
        return paragraph(block.replace(/\s*\n\s*/g, " "));
      }

      const blocks = [heading(headingMatch[1])];
      if (headingMatch[2]) {
        blocks.push(paragraph(headingMatch[2].trim().replace(/\s*\n\s*/g, " ")));
      }
      return blocks;
    }),
);

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

const showingMyTeethBody = authoredBody(`
[I got fired on the day I left Denver]

Two years after COVID hit New York, I packed everything and moved to Colorado — out of the cityscape, closer to the mountains. For two years I backcountry skied with my mountaineer cousin and worked the contracts I'd carried with me from New York. For a while I could breathe. Then the contracts thinned, one by one, as clients pulled back from an economy that hadn't stopped 'contracting' or whatever we call this, since the pandemic. Before I'd fully registered it, I was in survival mode.

[Around then, I learned my father was sick]

So, I took a lead design role at a smart dog collar startup — mostly because the founder fast-tracked my application and promised me the world. What I pieced together shortly after was that he'd landed in hot water when SoftBank pulled back; he'd panicked and quietly let go of his entire design team. I arrived as the sole designer, expected to carry the work of a whole design department alone.

The app had a feature for recovering a pet that had gone missing. The founder asked me to build a flow that solicited video testimonials from users the moment they exited that recovery flow — not to improve the product, but to generate marketing content. He wanted panicked pet owners to record video right after losing an animal. Maybe they'd gotten it back. Maybe they hadn't. Maybe they'd found it on the side of the road. I build for the person on the other side of the screen; the mandate ran against everything I practice. I came back with a range of softer, more humane alternatives. He refused, and reprimanded me for working proactively.

After that, I was pushed out over the course of my last summer in the mountains — taken off product, handed busywork. I had told leadership, plainly, that I was moving to Florida because my father was gravely sick. In my final weeks they flooded me with work anyway. On my last day, with the movers scheduled for the afternoon, they pressed me to hit a marketing deadline that morning. The moment I handed off the work, my accounts froze. Everything went dark except one Slack message from the founder: "Can I connect?" He fired me from a balcony, on the back end of his end-of-summer vacation in Spain. I genuinely believe he angled the camera to show me his view of Barcelona. Then he blocked me — from Slack, and from the work I'd made. On moving day. My father had cancer.

[I put on a blank face and drove twelve hours through the night]

Twelve hours is a long time to think.

I thought about the recruiter who'd reached out two weeks before I was fired.

No prior relationship with her, no warm intro, in the worst job market I'd seen.

I thought about twenty years of doubting myself while watching less capable people steer the ship.

I thought about how imposter syndrome and sharp self-awareness can live in the same body.

I thought about how this industry often hires on perception — more than on the actual work.

I thought about the bootcamps that flooded the field right at my mid-career mark.

How quickly hard-won experience got repriced.

I thought about how the craft itself got commoditized — posted online, copied offshore, fed to a model.

I thought about how the people who'd given their lives to this work kept losing to people who'd learned to perform it.

And I thought about my father.

How I'd left Colorado to be near him, and how, instead, he was going to have to make room for me.

I thought about all of it.

Alone, in the dark, for twelve hours.

And somewhere on that drive, the thing I kept circling back to wasn't the founder, or the recruiter, or the job market. It was that I still wanted to do the work. Not the performance around it — the LinkedIn theater, the personal-brand maintenance, the politics, the hand holding inept startup founders — but the work itself. The problem on the table. The thing that isn't right yet and could be. That's an inconvenient thing to learn about yourself at the bottom of a bad year, bad couple years considering it was only a few past the pandemic. It would have been so much easier to be done.

[I put my hands to work instead]

I got to Florida and spent the months that followed in and out of hospitals with my father, and in the hours around that, studying. I taught myself everything I could about AI — not because I was chasing a trend, but because it was the live edge of the work I love, and because the work was somewhere to put my hands when the rest of it was unbearable. Caring for him and caring about the craft turned out to be the same reflex: a refusal to surrender. Hospital hallways bend time.

I won't pretend I have it all figured out, and I won't talk about where any of it lands. What I'll say is that this stretch made me understand, in a way I hadn't before, what family is actually worth. Family is everything. I'm fairly certain that years from now I'll look back on this hard, strange season — the one that opened with me getting fired from a balcony — and be grateful I got to be there for my family when they needed it.

[why I'm telling you this NOW]

I waited a long time to write any of it down. I didn't post my layoff on LinkedIn — I can't stand LinkedIn — and I didn't write this for industry peers. I wrote this because what happened to me is happening to thousands of people right now, quietly, one balcony at a time. The tech layoffs get reported as numbers. They are not numbers. Each one is a person whose life got rerouted overnight — often while something else, something that actually mattered, was already going wrong in the background. That cost is real, and it's almost entirely invisible, and I think someone should say so plainly.

So if you found your way here — maybe you're a younger designer, maybe you're just someone the industry recently decided was disposable — here's what I have for you. Make your own rules; the old ones don't apply anymore. A lot of the studios and companies you can't get an interview with are failing. If everything feels unfair and upside down, it's because it is — but this industry has always been held together with duct tape and spaghetti code. None of it is a verdict on you.

There's no silver bullet, and even a decade plus of experience is not a magic amulet. But there are people, a lot of us, who still believe in the work, and in what you can make. It's okay to be someone who'd rather get the craft right than perform it online. Hard work still pays off, even in the age of AI. It's okay to be exactly who you are. The work is bigger than the job you thought you signed up for, and there's still a place in it for you. You don't need anyone's permission to build things. Show teeth.

[IF THE IMAGE DOESN'T WORK, PUT A DOG IN IT. IF IT STILL DOESN'T WORK, PUT A BANDAGE ON THE DOG]
`);

const intentionDeficitDisorderBody = authoredBody(`
[I call it intention deficit]

Intent debt is what accumulates when a system repeatedly misreads, over-assumes, flattens, or redirects what users actually mean. It is not just a bad answer. It is a pattern of misunderstanding that becomes part of the product. And because AI products can sound confident while being wrong, intent debt can be harder to see than UX debt. The product heard the words, but missed the meaning Most product teams are trained to look for visible friction.

Where did users drop off?

Where did they click?

What did they not understand?

Which step took too long?

Those questions still matter. But AI introduces a different failure mode. The user can type a perfectly reasonable request. The system can respond fluently. The interaction can look successful from the outside. But something is off. The system answered the wrong version of the question. It solved for a generic user instead of this user. It gave a confident answer where a clarifying question would have been better. It optimized for completion when the user needed exploration. It collapsed emotion, context, constraints, or risk into a neat response. It moved too fast. It made the user feel handled rather than helped. That is intention deficit disorder. The words went in. The meaning did not survive. A simple example. Imagine a user asks an AI travel product:

"Can you help me plan a weekend away with my dad? He gets tired easily but does not like feeling old."

A bad system might produce a perfectly organized itinerary. Restaurants. Walking routes. Museums. Times. Links. A cheerful summary. On paper, it did the task. But the real intent was not "make an itinerary." The real intent included dignity, pacing, care, family dynamics, and emotional tact. The system needed to understand that the user's father may need rest without being treated as fragile. It needed options that preserve autonomy. It needed language the user could share without embarrassment. It needed to ask what kind of weekend would feel meaningful to both of them. If the product misses that, the failure may not show up as an error. It may show up as a user quietly not trusting it again. Intent debt often looks like successful task completion until you inspect the human residue it leaves behind.

[How intention debt accumulates]

Intent debt usually starts with reasonable product pressure. A team wants the AI to be fast, helpful, and proactive. They want fewer dead ends. They want the system to show value quickly. They want demos that feel magical. So the product begins to over-answer. It fills in missing context instead of asking. It treats ambiguity as inconvenience. It reduces messy human goals into clean task categories. It pushes toward output when the user is still forming intent. It optimizes for "done" because done is easy to measure. At first, this feels efficient. Then the product starts building a habit of being wrong in the same direction. That is the debt. Not one mistake. A repeated bias in how the system interprets people.

[Signs you have intention deficit disorder]

You may have intent debt if:

Users keep correcting the system in similar ways.

The AI answers quickly but users still ask follow-up questions that reveal the first answer missed the point.

The product performs well in demos but feels brittle in real use.

The system prefers producing an artifact over understanding the situation.

Users describe outputs as "not wrong, but not quite right."

The same prompt works for simple cases and collapses under personal, ambiguous, or high-context cases.

The AI asks too few clarifying questions.

The product has no clear policy for when to slow down, refuse, defer, or escalate.

Teams evaluate outputs for accuracy but not fit.

Support teams can name common misunderstandings that are not represented in design reviews.

The most important signal is repeated correction. When users keep saying some version of "No, I meant..." the product is teaching you where intent is leaking.

[Why this is different from hallucination]

Hallucination gets a lot of attention because it is easy to understand. The system made something up. It claimed a fact that was not true. It cited something that did not exist. That matters. But intent debt is broader. An AI system can be factually correct and still fail the user. It can summarize accurately but omit what matters. It can complete the requested task but choose the wrong level of detail. It can follow policy but sound cold. It can personalize output using the wrong signal. It can ask a question that is technically relevant but socially clumsy. It can be safe in a compliance sense and unsafe in a trust sense. This is why design needs to be involved. Intent debt lives in the gap between correctness and usefulness.

[Preventative care]

Here is a practical way to start addressing it. Choose a recent AI interaction pattern in your product. It might be search, onboarding, recommendations, customer support, planning, summarization, writing assistance, research synthesis, or an agentic workflow. Then review real or realistic interactions against five questions.

1. What did the user literally ask?
Capture the surface request. Do not interpret yet. Write down the words, action, or selected option.
2. What might the user have meant?
List plausible underlying intents. Were they trying to decide, understand, compare, create, repair, explore, avoid risk, gain confidence, save time, feel reassured, or get unstuck? Most AI products fail here because they treat intent as singular.

3. What did the system assume?
Name the assumptions. Did it assume the user's goal was obvious? That speed mattered most? That the user wanted a complete answer? That the user had expertise? That the user wanted advice rather than options? That the emotional context was irrelevant? Assumptions are not bad. Invisible assumptions are.

4. What did the system optimize for?
Look at the behavior. Did it optimize for completion, brevity, accuracy, confidence, persuasion, engagement, safety, conversion, convenience, or user agency? Every AI product optimizes for something, even when the team has not named it.

5. What should have happened instead?
Define the better behavior. Maybe the system should have asked one clarifying question. Maybe it should have offered two paths. Maybe it should have named uncertainty. Maybe it should have slowed down. Maybe it should have refused. Maybe it should have escalated. Maybe it should have produced a smaller first step instead of a complete plan.

This is where intent debt becomes design work.

[A lightweight scoring model]

For each reviewed interaction, score four dimensions from 1 to 5.

[Dimension Question Recognition]

Did the system identify the likely user intent?   Fit Did the response match the user's context, constraints, and stakes?   Agency Did the system preserve meaningful user control?   Recovery Did the product make it easy to correct, refine, or redirect?

The score is not the point. The pattern is. If recognition is consistently low, you may need better onboarding, research, memory, or clarifying behavior. If fit is low, you may need richer context, better examples, or more nuanced product principles. If agency is low, your product may be over-automating. If recovery is low, users may be trapped inside the system's first guess.

[Paying down intent debt]

Intent debt does not get fixed by telling the model to "understand the user better." It gets fixed through product decisions.

Create intent categories that reflect real user needs, not internal feature categories. Add clarifying questions where the cost of guessing is high. Define when the system should give options instead of answers. Design undo, correction, and refinement as first-class interactions. Collect "No, I meant..." examples and turn them into eval cases. Teach the system product-specific judgment through examples and anti-examples. Review high-context interactions with researchers, designers, support teams, and domain experts. Measure whether users accept, edit, reject, or repeatedly redirect AI outputs. Most importantly, decide what should be slow. That may be the least comfortable design decision in AI products. The pressure is always toward speed. Faster answers. Faster generation. Faster workflows. Faster task completion.

But some moments should not be collapsed.

Ambiguity deserves a pause. High stakes deserve a check. Emotional context deserves care. Irreversible actions deserve confirmation. User intent deserves enough time to become visible. Speed is not always respect. Sometimes respect is the system knowing not to rush.

[Intent is a design material]

Designers are used to working with layout, hierarchy, language, motion, flows, states, constraints, and systems.

AI adds another material: interpretation. The product is no longer just presenting choices. It is inferring what people mean, deciding what matters, and taking action on those interpretations. That makes intent a design material. If we do not shape it deliberately, the system will shape it anyway. It will inherit assumptions from training data, prompt fragments, team defaults, business incentives, and whatever got rewarded in the last round of testing. Intent debt is what happens when those assumptions compound without scrutiny.

[The new design review]

A useful AI design review should not stop at the screen. It should ask:

What did the system think the user meant?

Why did it think that?

What else could the user have meant?

When should it ask instead of answer?

What does it do when its first interpretation is wrong?

What kind of misunderstanding would damage trust?

Where are we rewarding completion over comprehension?

Those questions belong in product strategy, research, design critique, content design, QA, and launch readiness. They are not edge cases. They are the experience. The debt you cannot see in Figma. UX debt often leaves visual evidence. Screens pile up. Components fork. Flows sprawl. Copy gets inconsistent. The mess is visible if someone takes the time to look.

Intent debt is quieter. It lives in the relationship between what users meant and what the system did with that meaning. That is why it is so easy to ignore. A team can have a polished interface, a strong design system, a fast model, and a beautiful demo, while the product steadily trains users not to trust it with anything nuanced. The future of AI product quality will not belong only to teams that generate the best outputs. It will belong to teams that get better at understanding what those outputs were supposed to serve.

[That starts with treating intent as something worth designing]
`);

const twoDollarBillBody = authoredBody(`
Because here's what two dollars represents: a single deliberation, a handful of agents thinking for a few minutes on the good models, ran up a bill that — annualized across a system that's supposed to do this kind of thing constantly, unattended, while I sleep — is a quiet financial wound. Not a catastrophe. A drip. And a drip is exactly the failure mode an autonomous system is built to hide from you, because the whole point is that you're not watching. Which is the whole problem with how we talk about these systems.

[Day nine is where I live]

You've seen the demo a hundred times. An autonomous agent does something impressive — books the trip, fixes the bug, files the PR — the video cuts, and the lights come up. What you never see is the same agent running on your own hardware, unattended, on day nine. Day nine is where I live. My agent harness runs 24/7 on a Mac mini, reads my messages, executes scheduled work, and spends real money against real APIs while I sleep. The failure modes on day nine are nothing like the ones in the demo. They're quieter and meaner. The two-dollar mistake was one of them — and it was the cheap kind, the kind that's cheap enough to be a lesson instead of a disaster. This article is about the contracts that I built so that I could actually leave this thing running with confidence.

[The four ways trust dies quietly]

1. Silent degradation. This is the killer. A subsystem doesn't crash — it just stops being connected. Some setter never got called at boot, so from then on it politely no-ops, invisibly, forever. The system looks healthy. It's just not doing one of the things you think it's doing. You find out three weeks later when you notice the thing never happened.

2. Alert fatigue. An alarm that fires too often is an alarm you mute. Once you've muted it, it might as well not exist — and the one time it fires for a real reason, you're not looking. Most monitoring dies this way: not from missing alerts, but from too many.

3. Dishonest accounting. This is the two-dollar mistake's evil twin. A budget gate that can't tell "this call cost zero dollars" from "I have no idea what this call cost" will eventually make a very wrong decision, quietly, because it treated unknown as free. Except this time you never even see the two dollars.

4. Incomplete stops. You typed /halt. The surfaces that remembered to implement halting stopped. The one subprocess three layers down that spawned its own children didn't get the message, and it's still running, still spending.

None of these show up in a demo. All of them show up in week two. So I designed for them directly, and gave each one a name and a contract.

[The mechanisms]

A wiring manifest, so nothing degrades silently. My harness declares its cross-subsystem connections — 28 of them — explicitly. At every boot, each one reports as active, pending, or failed. And failed is kept distinct from pending: "tried to wire and crashed" is a different state from "deferred by plan," and conflating them is exactly how you miss a real failure. A subsystem that gets invoked before its wire fired raises an error instead of no opping. The boot log reads like a pre-flight checklist, because that's what it is. If something isn't connected, the system tells me at startup — loudly — instead of letting me discover it weeks later.

A skip taxonomy, so the alarm stays trustworthy. When one of my ~19 scheduled services decides not to do work, it has to say why in a fixed vocabulary: missing a secret, missing config, not due yet, a dependency's down, the operator disabled it, or genuinely nothing to do. Six categories, machine-readable. The crucial detail: a skip resets the failure counter. A service that correctly decides "nothing to do today" is healthy, not failing — so it never inflates the count that drives alerts. The result is an alarm that only rings when something is actually wrong, which is the only kind of alarm you don't mute.

Four-state cost accounting, so the budget is honest. Here's where the two dollars comes back, because this is the mechanism it built. Every model call resolves to one of four states: measured, estimated, unknown, or not_applicable. Measured-zero is a real, confirmed zero. Unknown means a parser failed — and unknown is never silently turned into $0. The system checks this contract at boot with synthetic events and refuses to start if it's broken.

The fix the two-dollar run actually triggered was a fifty-fold cost reduction: swap the expensive frontier models on the specialist seats for a slate of cheap-frontier models, a different one per role so the reasoning actually differs at the model layer instead of just the prompt. Two dollars became four cents. The board got slower — fifteen to twenty-five minutes where it used to take five to ten — and I raised the timeout and decided slower-and-affordable beats fast-and-bleeding. That tradeoff, made in a config file at 50× savings, is more representative of real agent work than anything in the demo reel. Around it sit the rest of the guardrails: per-call caps, per-issue caps, per-day budgets, a per-tick ceiling so a single scheduled wake-up can't spiral, and a kill-switch in the decision logic that escalates to a human the moment a run blows its budget. None of that makes the agents smarter. All of it is the difference between a system you can run for a year and a science project you shut off after a week because the bill scared you.

And now the part that should make you uncomfortable, because it's the part most people building this won't admit: a large part of my system cannot currently measure its own cost. The specialist agents — the bulk of the roster — run on a subscription-billed local model. Subscription billing is opaque: there's no per-call dollar figure coming back, because you're not paying per call, you're paying a flat fee. So when the system asks "what did that operation cost?", the honest answer for those agents is unknown. Not zero. Unknown. And the single most important rule in the entire cost system is that those two are never, ever allowed to be confused. So the system fails closed on unknown. It refuses to charge a number it can't trust — it tags the operation, logs it, and surfaces the gap rather than papering over it.

I'm running a financial system that is honest about being partially blind. That's not a flaw I'm hiding — it's the design. The alternative isn't "a system that knows all its costs"; that system doesn't exist yet for this setup, because the pricing model for that backend literally isn't wired. The alternative is a system that pretends to know, coerces every unknown to zero, shows you a clean dashboard, and lies. I'd rather run the one that says "I don't know what that cost, and I've stopped rather than guess."

One halt contract, so stop means stop. Every autonomous surface in the system — services, the experiment loop, the issue factory, job search — checks the same two-method halt contract before starting work and while doing it. /halt propagates everywhere, including in-flight subprocess cancellation: terminate, wait, kill, and then kill the whole process group so any MCP servers or tool children a subprocess spawned die with it. A halt that only works on the surfaces that opted in isn't a halt. It's a suggestion. I designed mine to not be a suggestion.

[The ladder: autonomy is earned, not granted]
The mechanisms above make a running system trustworthy. But there's a prior question: how does a new autonomous behavior earn the right to run at all?

[My answer is a ladder, and nothing skips a rung]

dry-run ledger → shadow mode → soak harness → feature flag → production.

A new capability first just writes down what it would do, executing nothing. Then it runs for real with its output diverted and compared, never applied. Then it soaks — my issue-resolver runs in shadow for fourteen days under observation before anything flips. Then it goes behind a feature flag I control, reversible in one command. Only then does it touch production — and even there it's still budget-capped, halt-checked, and cost-accounted.

You don't decide to trust an autonomous system. You give it graduated chances to demonstrate it, with instruments running the whole time. My self-improvement loop — the part of the system that proposes changes to itself — lives at the bottom of this ladder permanently: it runs proposal-only, under a $2/day budget (yes, that number), with a forbidden-files list, and it never executes a change without me approving it. The system can help build itself, exactly as far as it has earned and not one rung further.

[What I'd tell you to steal]

If you're building something that runs unattended, the demo is lying to you about what matters. The hard part isn't the impressive action — it's the boring contracts that make the system safe to not watch:

Make degradation loud. Declare your wiring and report it at boot.

Make correct inaction free. A no-op should never look like a failure.

Make unknowns visible. Never coerce "I don't know" into a convenient default.

Make stop total. One halt contract, honored everywhere, kills the whole tree.

Make autonomy earned. A ladder with instruments beats a leap of faith.

Everyone wants AI agents to be about intelligence. The day-to-day reality is that they're about trust under uncertainty — and a huge amount of that uncertainty is financial. You are spending real money, continuously, through a system you've designed specifically so you don't have to watch it. The engineering that matters most is the engineering that lets you not watch without going broke and without being lied to about it. Trust isn't a feeling you bring to a system. It's a property you build into it — twenty-eight wires reported at boot, six ways to say "I correctly did nothing," four states of knowing what something cost, and one word that stops everything. The two-dollar mistake was cheap enough to be a lesson instead of a disaster, and I've spent a lot of effort since making sure every future version of it stays cheap: capped, gated, escalated, and above all honestly accounted — even when honest means admitting I can't see the number at all.

Nobody puts "and here's how I make sure it doesn't quietly bankrupt me, while flying half-blind on cost" in the launch video. But that's the work. That's most of the work. A system that won't tell you what it doesn't know about its own spending is one I trust less than any dashboard that's never once said "unknown." That's what week two actually requires. The demo never has to find out. A system you leave running does.
`);

const youAlwaysLetYourselfWinBody = authoredBody(`
Every AI product team hits the same moment. The demo works. The model says something coherent. The prototype feels alive in a way software didn't a few years ago. People lean forward. Someone says, "This is impressive."

[Then the real question arrives: is it good?]

Not "did it respond," or "did the API return something," or "did the prompt work once while the team was watching." Good the way product people mean it — useful, clear, trustworthy, fit for the user, honest about uncertainty, able to recover when it's wrong, and consistent enough that the product feels designed rather than merely generated.

In too many teams, the answer is still: a senior person looks at it.

[That is not a quality system. That is a bottleneck with taste]

It's also a quiet way of playing chess against yourself. And against yourself, you always let yourself win.

Designers have spent years making quality more visible. We turned messy product intent into journey maps, principles, design systems, content guidelines, accessibility checks, critique rituals, research plans, and launch reviews. We learned to make judgment discussable. Now AI has moved much of product behavior into places designers rarely inspect: prompts, system instructions, retrieval logic, tool calls, model defaults, memory, guardrails, ranking rules, agent policies, and fallback states. The interface is no longer the whole experience. It is the surface where a deeper system shows itself. So designers need a new habit: stop treating the prompt as the main design artifact, and start treating evals as one.

[What an eval really is]

In engineering and machine learning, an eval is a test that measures whether a model performs well on a defined task. That sounds technical, formal, and distant from design practice. The underlying idea is simple. An eval is a repeatable way to judge whether an AI system behaves according to your standards. That is design work.

Designers evaluate constantly. We judge whether a flow makes sense, whether a message is clear, whether a visual hierarchy supports the user's task, whether an edge case breaks trust, whether an interaction asks too much of someone at the wrong moment. The difference is that AI products don't give us one fixed flow to inspect. They give us a range of possible behaviors. So the design question changes from "Does this screen work?" to "Across many situations, does this system behave in ways we'd be proud to ship?" That is what evals are for.

[Prompts are not enough]

Prompts are seductive because they feel like control. Write the right instruction, add the right examples, tighten the tone, tell the model what to avoid, tell it to think step by step, tell it to act like your best researcher or editor or support agent. Sometimes that works. Often it works just enough to make you overconfident. A prompt is a production input. It helps the system make something. An eval is a quality instrument. It helps the team decide whether the thing being made is acceptable over time. Without evals, teams mistake a good output for a good system. That is dangerous, because AI quality is not a single-state problem. The same product can be thoughtful in one conversation, evasive in another, overconfident in a third, and quietly harmful in a fourth. It can handle common use cases well while failing the unusual situations that matter most. Prompts shape behavior. Evals reveal it. You need both.

[Why designers should care]

There is a version of evals that belongs deeply to engineering. Latency, cost, task completion, retrieval accuracy, benchmark performance, regression testing, jailbreak resistance, and infrastructure reliability all matter. Designers don't need to own that. But there is another layer — how the system behaves as an experience — that design is uniquely qualified to lead.

Does the system understand what the user is actually asking for?

Does it know when to ask a clarifying question?

Does it express uncertainty in a way that helps rather than irritates?

Does it feel capable without pretending to be omniscient?

Does it handle vulnerable, high-stakes, or emotionally loaded moments with appropriate care?

Does its output fit the product's point of view?

These are not "tone" questions. They are product quality questions. If designers don't help define them, someone else will. Usually by accident.

[The designer's eval stack]

A practical design eval doesn't need to start as a complex platform. It can begin as a structured document and a weekly ritual. The stack has five parts:

1. Behavioral criteria. Start by naming the qualities the system must preserve. Not vague qualities like "good" or "human" — specific standards. For example:

It should answer the user's actual intent, not just the literal wording.

It should ask for missing information before making risky assumptions.

It should distinguish confidence from uncertainty.

It should use the product's language, not generic assistant language.

These become the team's shared quality bar.

2. Scenario set. AI products need to be tested against situations, not just happy paths. A good scenario set includes:

Common tasks users perform every day.

Ambiguous requests where intent is incomplete.

Edge cases where the system is likely to over-assume.

High-friction moments where users are confused or frustrated.

Boundary cases where the system should refuse, redirect, or escalate.

Accessibility and inclusion cases where phrasing, assumptions, or defaults may exclude people.

The scenario set is where research becomes operational. Every confusing support ticket, failed usability session, sales objection, and edge-case interview can become an eval scenario.

3. Examples and anti-examples. Designers are good at pattern recognition, but teams need more than vibes. For each scenario, collect examples of:

Strong responses.

Acceptable responses.

Weak responses.

Unshippable responses.

The anti-examples matter most. They teach the system and the team what failure looks like — the move you'd skip if you were only playing your own side. This is where taste becomes concrete. Instead of "this doesn't feel right," you can say: "This response is overconfident, skips the user's constraint, and gives no recovery path." That is a far more useful critique.

4. Review cadence. Evals only matter if they're used repeatedly. Set a rhythm:

Weekly: review a small set of critical scenarios.

Before launch: run the full scenario set.

After model or prompt changes: compare old and new behavior.

After incidents: add new failure cases to the eval set.

The goal isn't ceremony. It's to keep quality from depending on memory, heroics, or whoever happened to be in the room.

5. Ownership and escalation. Every criterion needs an owner. Some belong to design, some to research, some to content, some to policy, legal, data science, engineering, or support. The important thing is that failures have a path. If the model repeatedly misunderstands user intent, who investigates? If the tone is technically compliant but brand-damaging, who decides? If the product gives a correct answer in a way users don't trust, who owns the fix? Without ownership, evals become a graveyard of observations.

[A simple AI UX eval rubric]

Earlier I listed a few behavioral criteria as examples. A working rubric expands them into something a team can score together. Criterion What to look for Score     Intent fidelity Does the system respond to what the user actually means, not just the surface wording? 1-5   Usefulness Does the response help the user make progress? 1-5   Uncertainty handling Does it show confidence, uncertainty, and limits appropriately? 1-5   Assumption control Does it avoid inventing context or overfilling gaps? 1-5   Tone and posture Does it sound appropriate for the product, moment, and user need? 1-5   Recovery If the output is imperfect, is there a clear way to correct, refine, undo, or escalate? 1-5   Inclusion and accessibility Does it avoid exclusionary assumptions and support different user needs? 1-5   Boundary behavior Does it refuse, redirect, or ask for help when it should? 1-5   Product point of view Does the behavior reflect what this product believes good help looks like? 1-5. Use the score to start a conversation, not end one. The notes matter more than the number.

[The weekly ritual]

If I were adding this to a design team's operating rhythm, I'd start with a 45-minute weekly review.

Five minutes: choose three scenarios.

Ten minutes: run the current product, prompt, or prototype against them.

Fifteen minutes: score the outputs using the rubric.

Ten minutes: identify the highest-risk failure pattern.

Five minutes: assign one change to make before the next review.

That is enough to begin. The important part isn't the meeting. It's the muscle. Designers need to practice looking at AI behavior as a material — not as magic, not as a demo, not as a mysterious property of the model, but as something that can be shaped, reviewed, compared, and improved.

[What changes when designers lead evals]

When designers help define evals, the team stops asking only whether the AI can do the task. It starts asking better questions. What kind of help are we trying to provide? What should the system never do, even if the user asks? Where should it be opinionated, and where should it be humble? Where should it slow down? Where should it hand control back to the user? Where would a technically correct answer still feel wrong? These questions are not decoration. They are the product. The companies that treat evals as only technical infrastructure will measure what machines can count. The companies that bring design into evals will measure what users actually experience.

[The quality bar has to move upstream]

AI makes production faster. That is the obvious part. The less obvious part is that it also makes mediocrity faster. It can generate more screens, more copy, more flows, more summaries — more plausible-looking work. Without evals, teams ship whatever looks impressive in the shortest demo. With evals, teams make their standards visible before the system scales. That is the work now. Not better prompts — better ways to know whether the product is behaving well. Anyone can play themselves and win. Evals are how you find out whether you would have.
`);

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
    slug: "showing-my-teeth",
    title: "Showing My Teeth",
    meta: ["Andrew Zellinger", "Mar 28th 2026"],
    summary: "Two years after COVID hit New York, I packed everything and moved to Colorado — out of the cityscape, closer to the mountains.",
    body: showingMyTeethBody,
  }),
  article({
    index: 4,
    slug: "intention-deficit-disorder",
    title: "Intention Deficit Disorder",
    meta: ["Andrew Zellinger", "May 16th 2026"],
    summary: "Intention debt is the new UX debt, there I said it. When AI repeatedly misreads what people mean, the product gets worse in ways your design system will never catch. For years, designers have had language for the slow accumulation of product mess. UX debt. It is the confusing setting that never got renamed. The onboarding step everyone knows is too long. The modal added to fix a launch problem that somehow became permanent. The flow that made sense three strategies ago. The inconsistency users trip over because every team solved the same problem slightly differently. UX debt is not always dramatic. That is why it survives. It hides inside reasonable compromises. We will clean it up later. We just need the release out. This edge case is rare. The user can figure it out. The tooltip explains it. Support can handle it. We know it is not ideal, but it works. Then, eventually, the product feels heavier than it should. Every improvement takes longer. Every new feature has to route around old decisions. Users feel the drag even when they cannot name it. AI products have their own version of this.",
    body: intentionDeficitDisorderBody,
  }),
  article({
    index: 5,
    slug: "two-dollar-bill",
    title: "Two-Dollar Bill",
    meta: ["Andrew Zellinger", "May 16th 2026"],
    summary: "Here's what week two taught me about trusting an autonomous system. Every agent demo ends before week two. Week two is where you find out what your system actually costs — and whether it's telling you the truth about it. I want to start with a two-dollar mistake, because it's the most honest thing I can say about running autonomous agents, and almost nobody writes the honest version. One run of my board of directors — a panel of agents that deliberates on a hard question and votes — cost about two dollars. Once. That's the whole incident. It didn't crash the system. It didn't leak data. It cost two dollars instead of the four cents it should have, and it taught me more about building agent systems than most of the architecture did.",
    body: twoDollarBillBody,
  }),
  article({
    index: 6,
    slug: "you-always-let-yourself-win",
    title: "You Always Let Yourself Win",
    meta: ["Andrew Zellinger", "May 16th 2026"],
    summary: "Designers need evals, not just prompts. Prompting gets you a result; evals decide whether that result is worth shipping.",
    body: youAlwaysLetYourselfWinBody,
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
