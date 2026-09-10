// Editorial records. Titles, metadata, excerpts, and article body paragraphs
// are shared by the Articles index and every Article Detail route.
import { ARTICLE_IMAGES } from './article-images.js';

const temporaryArticleBody = Object.freeze([
  "Temporary article copy. This paragraph establishes the intended editorial measure and reading rhythm; it should be replaced by Andrew's authored introduction.",
  "Temporary article copy. This section reserves space for the central position, supporting examples, and the practical implications of the idea without inventing a finished argument.",
  "Temporary article copy. References, counterpoints, and a closing synthesis will live here once the real draft and supporting sources are available.",
]);

const heading = (text) => Object.freeze({ type: "heading", text });
const paragraph = (text) => Object.freeze({ type: "paragraph", text });
const list = (items, ordered = false) => Object.freeze({
  type: "list",
  ordered,
  items: Object.freeze([...items]),
});

const listItemMatch = (block) => {
  if (block?.type !== "paragraph") return null;
  const match = block.text.match(/^(-|\d+\.)\s+([\s\S]+)$/);
  if (!match) return null;
  return {
    ordered: match[1] !== "-",
    text: match[2],
  };
};

// Paragraph boundaries are edited in each authored body, never merged by count at runtime.
const normalizeArticleBody = (blocks) => {
  const normalized = [];

  for (let index = 0; index < blocks.length;) {
    const match = listItemMatch(blocks[index]);
    if (!match) {
      normalized.push(blocks[index]);
      index += 1;
      continue;
    }

    const items = [];
    const ordered = match.ordered;
    while (index < blocks.length) {
      const item = listItemMatch(blocks[index]);
      if (!item || item.ordered !== ordered) break;
      items.push(item.text);
      index += 1;
    }
    normalized.push(items.length > 1 ? list(items, ordered) : blocks[index - 1]);
  }

  return Object.freeze(normalized);
};

const authoredBody = (source) => Object.freeze(
  source
    .trim()
    .split(/\n\s*\n+/)
    .flatMap((rawBlock) => {
      const block = rawBlock.trim();
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      if (lines.every((line) => /^(?:-|\d+\.)\s+/.test(line))) {
        return lines.map((line) => paragraph(line));
      }
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

const stripInlineMarkdown = (text) => text
  .replace(/\*\*([^*]+)\*\*/g, "$1")
  .replace(/\*([^*]+)\*/g, "$1")
  .trim();

const authoredMarkdownBody = (source) => Object.freeze(
  source
    .trim()
    .split(/\n\s*\n+/)
    .flatMap((rawBlock) => {
      const block = rawBlock.trim();
      if (!block || block === "---") return [];

      const headingMatch = block.match(/^##\s+(.+)$/s);
      if (headingMatch) return heading(stripInlineMarkdown(headingMatch[1]));

      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      if (lines.every((line) => line.startsWith(">"))) {
        return Object.freeze({ type: "quote", text: stripInlineMarkdown(lines.map((line) => line.replace(/^>\s?/, "")).join(" ")) });
      }
      if (lines.every((line) => /^(?:-|\d+\.)\s+/.test(line))) {
        return lines.map((line) => paragraph(stripInlineMarkdown(line)));
      }

      return paragraph(stripInlineMarkdown(lines
        .map((line) => line.replace(/^>\s?/, ""))
        .join(" ")));
    }),
);

const companyOfOneBody = authoredBody(`I spent years building agent systems the wrong way before I built one I could operate. The turning point was not a more capable model. It was separating the system's coordination rules from the reasoning happening inside each task.
This is an account of my own harness, not a benchmark or a claim that one architecture solves every multi-agent problem. The practical question was whether I could understand what it was doing, constrain what it could spend, and recognize a failed run without watching every step.

[At its worst, my agents waited in line]

A manager needed the expensive model to do its job. So did four others. There was one account, one lock, and a timeout. They queued while the rest of the system waited on decisions that had not happened.
Underneath that bottleneck, the call graph could grow at runtime. One agent requested help from another; that agent escalated again. Recovery and failover mechanisms caught some problems, but they also added more coordination to a system already struggling with it. I kept trying to repair the structure by adding another layer.

The predecessor, which I called the 40 Thieves, modeled departments and specialists on a company. It had several overlapping orchestration approaches: queues, batches, repository watchers, handoff managers. Each did something useful. Together, they made it hard to say which mechanism was responsible when work stalled.
The lesson was not that delegation was wrong. It was that delegation needed an explicit boundary. A system becomes difficult to operate when each component can redefine the relationships that the operator thought were fixed.

[Agents as bounded tools]

In the replacement harness, the primary agent holds the main task context and invokes departments. Chiefs can delegate to designated specialists within configured limits. Specialists return bounded results; they do not freely create a new chain of peers.
That distinction matters. Saying “agents cannot call agents” would be inaccurate: the chiefs do delegate. The constraint is on who can invoke whom, how far that delegation can go, and what must come back. The structure is configured rather than negotiated afresh during each run.

The working model is simple:

- The primary agent frames the task and invokes a department.
- The chief assigns bounded work to its configured specialists.
- Specialists return results to the chief rather than spawn an open-ended chain.
- The department result passes through checks before returning to the primary agent.

This makes the allowed route legible. It does not make model output deterministic. A model can still misunderstand the task, return different answers across runs, or produce a plausible error. Fixing the call graph reduces one source of uncertainty; it does not remove uncertainty from the work.

[Model placement is a design decision]

I assign models according to the role. A chief needs reliable tool use and the ability to consume specialist results. A specialist may need focused execution rather than orchestration. Paying for the same capability everywhere is not automatically the best use of the system.

The deliberation panel uses different models to seek a broader range of responses. But vendor diversity is not proof of independent judgment. Different models can share assumptions and repeat the same error. I still need to inspect the reasons behind disagreement, check evidence, and notice when apparent consensus is only repeated framing.
That is the design surface I care about: what each role can do, what context it receives, and what evidence it must return. The model name alone does not define those properties.

[Checks establish a contract, not truth]

A completed call is not necessarily completed work. The harness checks basic conditions before accepting a department result:

- The output is present.
- Structured results parse when a structure is required.
- Error and refusal markers are surfaced.
- Recorded cost and duration meet the applicable limits.
- Delegation stays within the configured specialist bounds.

One useful check is the delegation floor. If a chief is required to consult a specialist but returns work it produced alone, that run has not followed the requested process. Marking that explicitly is better than silently accepting a different workflow.

These checks catch particular failures. They do not establish that the reasoning is correct, the research is sufficient, or the implementation works for a user. A well-formed wrong answer can pass structural checks. Content evaluation, tests, and human review remain separate responsibilities.
I want a failed check to produce a visible failure state, not an apparently successful result with the problem buried in its prose. That gives the operator something actionable: retry, change the task, inspect the evidence, or stop.

[Cost belongs in the operating model]

Cost is part of the system's behavior. It should not be discovered only after a task completes.
The harness distinguishes measured, estimated, unknown, and not-applicable costs. Unknown is not zero. Where a strict monetary budget requires a known value, an unknown cost cannot satisfy that requirement. Subscription-backed calls create an accounting limit because a flat fee does not automatically translate into a trustworthy per-call dollar figure.

There are also limits on the self-improvement loop. Its role is to propose changes for review, not grant itself authority to apply them. A budget, a restricted file scope, and an approval step serve different purposes; none substitutes for the others.

Short-lived department calls reduce the need to keep every role resident with its own accumulating context. They do not eliminate latency or expense, but they make a task's lifecycle easier to inspect: invoked, running, returned, accepted or rejected.

[What failure taught me]

The queueing failure in the predecessor was useful because it was concrete. Several managers competed for one resource while the wider system waited. Better prompts would not have removed that contention. The coordination structure had to change.
That changed how I approached the next build. Instead of beginning with the largest roster I could imagine, I began with the task path I needed to explain. Which component owns the request? Where can it delegate? What happens if a dependency fails? What does the operator see?

The result is a working application I operate as part of my independent practice. The account here describes its design and my use, not production adoption by customers. Exact model assignments and operational limits can change; the important evidence is whether the configured controls behave as intended in the version being reviewed.

[The work is in the boundaries]

I am not arguing against capable agents or delegation. I am arguing for a system in which both have explicit limits.
The structure should tell me where work can go. The checks should tell me which contract a result satisfied. The accounting should tell me what it knows and what it cannot measure. Review should establish what those mechanical checks cannot.
That is a more useful success criterion than the number of agents in the diagram. I want to build something I can operate, inspect, and improve without confusing activity with dependable work.`);

const aFreeSurfLessonBody = authoredBody(`Good taste alone will not carry a product through delivery. It matters, but it becomes useful through the decisions it helps a team make: what to build, what to leave out, and how to tell whether the result works.
There is an appealing argument that cheaper AI-generated output makes selection the main human contribution. If anyone can produce a thousand options, the valuable person is the one who recognizes the right one. I agree with part of that. I disagree that selection can be separated from understanding how a product is built.

[Taste needs something to stand on]

What looks like instinct is often compressed knowledge. A designer recognizes a weak flow because they understand the user, have seen similar failures, or know which technical constraint the interface is ignoring.
That knowledge can be aesthetic, behavioral, technical, or commercial. The important part is being able to unpack it. “This feels wrong” can begin a critique, but it should not be the only reason a team has for changing direction.
AI makes this more visible. A plausible screen can be generated without resolving the state model beneath it. An elegant response can answer the wrong question. Selection requires knowing what the output has left unresolved, not just which version looks best.

[One constraint that changed the design]

On the Audible sleep prototype, the player was not designed for an alert listener managing a queue. It was designed for someone preparing to sleep. That changed what control should mean.
We separated setup from the session and aimed for a simple in-session path: start and stop, with additional controls still available when needed. Bedtime, rise time, and personalization belonged before playback. The player could then recede instead of asking the listener to keep managing it.

The important judgment was not choosing a calmer-looking player from several variations. It was recognizing that a conventional media-player structure asked for the wrong kind of attention. The visual direction followed an interaction decision.
The same distinction matters in AI work. A polished interface is not enough if its underlying process spends without a limit, loses context between steps, or gives users no way to correct an assumption. Those are design questions even when their implementation lives below the screen.

[Make judgment operational]

For me, that requires four connected capabilities:

- Systems literacy: understand how a decision affects behavior, dependencies, and the cost of change.
- Domain understanding: know enough about the user's work to distinguish a plausible answer from a useful one.
- Strategic context: connect the proposed solution to the actual objective and constraints.
- Execution: prototype, test, and revise the decision rather than leave it as a persuasive opinion.

None requires every designer to become an infrastructure engineer. It does require enough technical fluency to ask better questions and collaborate on the answers. When a model generates code, I need to understand the relevant behavior well enough to inspect it, test it, or identify where engineering review is necessary.
A practical way to develop that fluency is to carry one decision further than the mockup. Follow it into a prototype. Exercise the error state. Ask what happens when the data is incomplete. Watch where a person hesitates. Those encounters change judgment because they reveal consequences that a static presentation can conceal.

[Build the feedback loop]

The goal is not to defend taste as a private gift. It is to make a team's standards visible enough that work can improve.
Write down what a good result must preserve. Keep examples and counterexamples. Distinguish a preference from a requirement. Evaluate the same scenario after the implementation changes. When an output disappoints, explain the missed condition rather than merely asking for something better.

There is still room for intuition. Some decisions begin with a hunch before there is evidence. The responsibility is to recognize that status and give the hunch a useful test.
I do not know which titles or workflows will dominate the next iteration of this industry. I do know the contribution I want to make: connect judgment with enough understanding and execution that it changes the product. Taste is part of that work. It is not a substitute for doing it.`);

const showingMyTeethBody = authoredBody(`
[I got fired on the day I left Denver]

Two years after COVID hit New York, I packed everything and moved to Colorado — out of the cityscape, closer to the mountains. For two years I backcountry skied with my mountaineer cousin and worked the contracts I'd carried with me from New York. For a while I could breathe. Then the contracts thinned, one by one, as clients pulled back from an economy that hadn't stopped 'contracting' or whatever we call this, since the pandemic. Before I'd fully registered it, I was in survival mode.

[Around then, I learned my father was sick]

So, I took a lead design role at a smart dog collar startup — mostly because the founder fast-tracked my application and promised me the world. What I pieced together shortly after was that he'd landed in hot water when SoftBank pulled back; he'd panicked and quietly let go of his entire design team. I arrived as the sole designer, expected to carry the work of a whole design department alone.

The app had a feature for recovering a pet that had gone missing. The founder asked me to build a flow that solicited video testimonials from users the moment they exited that recovery flow — not to improve the product, but to generate marketing content. He wanted panicked pet owners to record video right after losing an animal. Maybe they'd gotten it back. Maybe they hadn't. Maybe they'd found it on the side of the road. I build for the person on the other side of the screen; the mandate ran against everything I practice. I came back with a range of softer, more humane alternatives. He refused, and reprimanded me for working proactively.

After that, I was pushed out over the course of my last summer in the mountains — taken off product, handed busywork. I had told leadership, plainly, that I was moving to Florida because my father was gravely sick. In my final weeks they flooded me with work anyway. On my last day, with the movers scheduled for the afternoon, they pressed me to hit a marketing deadline that morning. The moment I handed off the work, my accounts froze. Everything went dark except one Slack message from the founder: "Can I connect?" He fired me from a balcony, on the back end of his end-of-summer vacation in Spain. I genuinely believe he angled the camera to show me his view of Barcelona. Then he blocked me — from Slack, and from the work I'd made. On moving day. My father had cancer.

[I put on a blank face and drove twelve hours through the night]

Twelve hours is a long time to think. I thought about the recruiter who'd reached out two weeks before I was fired: no prior relationship, no warm intro, in the worst job market I'd seen.

I thought about twenty years of doubting myself while watching less capable people steer the ship. I thought about how imposter syndrome and sharp self-awareness can live in the same body; how this industry often hires on perception more than on the actual work; how the bootcamps flooded the field right at my mid-career mark; and how quickly hard-won experience got repriced. I thought about how the craft itself got commoditized — posted online, copied offshore, fed to a model — and how the people who'd given their lives to this work kept losing to people who'd learned to perform it.

And I thought about my father: how I'd left Colorado to be near him, and how, instead, he was going to have to make room for me. I thought about all of it, alone in the dark for twelve hours.

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

const intentionDeficitDisorderBody = authoredBody(`Intent debt is what accumulates when a system repeatedly misreads, over-assumes, or redirects what users mean. The answer may be fluent and factually correct while still solving the wrong problem.
Traditional UX measures help us see where people drop off or struggle with a step. They are less useful when the system completes a task that the person did not quite ask it to do. That is the failure I call intention deficit: the words went in, but something important did not survive the interpretation.

[A request is not the whole intent]

Consider this hypothetical request to an AI travel product: “Can you help me plan a weekend away with my dad? He gets tired easily but does not like feeling old.”

An itinerary full of walking routes could satisfy “plan a weekend” and fail the rest. The request also carries concerns about pacing, dignity, and choice. The product should not diagnose the father or assume it understands the family. It could ask what activities they both enjoy, offer a lower-exertion option, and make rest flexible rather than label him as fragile.
That distinction is a design problem. The user needs help expressing constraints, inspecting the system's interpretation, and correcting it without starting over.

[How intent debt accumulates]

Pressure to demonstrate value can reward immediate output. The system fills gaps, chooses a direction, and presents a complete artifact. For simple requests, that can be useful. For ambiguous or consequential ones, the same behavior can hide assumptions that should have been discussed.

Look for repeated correction rather than isolated disappointment:

- Users keep saying “No, I meant…” in similar situations.
- Outputs look complete, but follow-up questions reveal a missed constraint.
- The system offers an artifact when the user needs help deciding what to do.
- People describe the answer as “not wrong, but not quite right.”
- There is no clear way to revise an assumption or reverse an action.

These are signals to investigate, not proof of one particular cause. A weak response might reflect missing context, retrieval problems, model limitations, interface design, or several of them together.

[A review that reaches beneath the screen]

Take a real interaction, with appropriate permission, or a clearly labeled scenario. Review it through five questions:

1. What did the person literally ask? Keep the original wording before interpreting it.
2. What other intentions are plausible? Name alternatives rather than decide there is only one.
3. What did the system assume? Distinguish supplied facts from inferred context.
4. What did it optimize for? Speed, completion, persuasion, safety, or something else?
5. What behavior would have served the user better? A question, options, a smaller first step, or escalation?

The last question turns a critique into a design decision. “Understand intent better” is not an implementation brief. “Before committing to a nonrefundable booking, show the interpreted dates and ask for confirmation” is.

[An illustrative before and after]

For the travel scenario, an inadequate response might immediately supply a packed itinerary and describe it as suitable for an older traveler. It has converted a nuanced request into an age-based assumption.

A better first move could be: “What does your dad most enjoy doing on a trip? I can suggest a relaxed plan with optional activities and easy places to pause.” That leaves room for the user's knowledge of their father rather than replacing it.
This is an illustrative contrast, not a tested response or a medical recommendation. The point is to make the behavior being evaluated explicit. A team could then compare alternatives with users instead of treating my preferred wording as the answer.

[Four dimensions to inspect]

A lightweight rubric can make the review more consistent:

- Recognition: did the system identify the likely intent without treating its interpretation as certain?
- Fit: did the response respect the supplied context and constraints?
- Agency: could the person choose, correct, or redirect meaningfully?
- Recovery: was there a clear next step when the first attempt was wrong?

Scores from one to five can help compare examples, but only after reviewers agree on what those scores mean. Keep notes, examine disagreements, and retain failed scenarios as regression cases. A high average must not hide a rare but consequential failure.

[Make correction part of the product]

Collect repeated misunderstandings and use them to revise the experience. Add a clarifying question where guessing is costly. Show the assumptions behind an action. Offer alternatives when the choice belongs to the person. Give correction, undo, and escalation the same attention as the first successful response.
Not every ambiguity needs another question. Excessive clarification can also obstruct the user. The design task is to judge the cost of a wrong assumption and provide proportionate control.

Speed is valuable when it helps someone make progress. It is less valuable when it efficiently commits to the wrong goal. Intent deserves a place in design reviews because interpretation is now part of product behavior, not merely an input to it.`);

const twoDollarBillBody = authoredBody(`One run of my agent deliberation panel cost about two dollars instead of the roughly four cents I wanted to spend. It did not crash or leak data. It exposed a simpler problem: a process intended to run repeatedly could be individually inexpensive and still have the wrong economics.
That was a small incident in my own harness, not a controlled benchmark. It pushed me to treat accounting, failure states, and stopping behavior as part of the product rather than administrative details around it.

[The work after the demo]

I run the harness on a Mac mini for messages and scheduled tasks. An impressive single result says little about how that system behaves when a dependency disappears, a service has nothing to do, or a subprocess keeps running after its parent should have stopped.

The failures I worry about are often quiet. A component can appear healthy while no longer being connected. An alert can be technically correct and so frequent that it becomes useless. A dashboard can turn a missing cost into a reassuring zero.
I began organizing those problems into contracts I could inspect and test.

[Four ways trust erodes]

- Silent degradation: a dependency never connects, but the system continues without making the missing capability visible.
- Alert fatigue: ordinary skips inflate failure counts until the operator stops paying attention.
- Misleading accounting: an unknown cost is treated as free.
- Incomplete stopping: a parent task ends while a child process continues working or spending.

These are categories from operating my own system. They are not an exhaustive safety model. Their usefulness is that each suggests a specific behavior to test rather than a general instruction to “be reliable.”

[Make wiring visible]

The harness declares connections between subsystems and reports their status at startup. Active, pending, and failed mean different things. A connection deliberately deferred should not look like one that tried to initialize and crashed.

The intended behavior is for an invocation of an unwired dependency to surface an error rather than quietly do nothing. That turns an invisible loss of capability into a diagnostic event. It still requires tests: a manifest can describe the expected wiring without proving every runtime path follows it.
The question I want startup diagnostics to answer is straightforward: what can this instance actually do now, and what is unavailable?

[Distinguish a skip from a failure]

Scheduled work needs a vocabulary for not running. Missing configuration, unavailable dependencies, operator-disabled behavior, a task not being due, and nothing to do are not interchangeable states.
A legitimate skip should not automatically count as a failed task. At the same time, “skipped” must not become a bucket that hides broken configuration forever. The reason has to be available for review.

This is an interaction-design problem as much as a monitoring problem. The operator needs enough information to decide whether to intervene without receiving the same alarming message for every ordinary pause.

[Keep the accounting honest]

Each model call is classified as measured, estimated, unknown, or not applicable. A measured zero is a known value. An unknown value is an accounting gap, not a discount.

For the panel run, changing specialist model assignments brought the reported per-run API cost from about two dollars to about four cents. The trade-off was slower deliberation, around fifteen to twenty-five minutes instead of five to ten in my observations.
That comparison concerns reported API charges for those runs. It does not establish a fifty-fold reduction in total operating cost. It excludes a full allocation of subscriptions, hardware, retries, and my time; it also is not a controlled comparison of output quality.

Subscription-backed calls are especially important here. A flat subscription does not provide a trustworthy dollar price for each operation. Where a strict monetary budget requires known cost, an unknown value cannot pass as zero. Recording and surfacing the gap is distinct from proving that every execution path has been blocked. That enforcement must be checked at the call sites.
The useful rule is not “everything is cheap now.” It is “the system must tell me which numbers it knows.”

[Stopping is a behavior to test]

The halt design uses a shared contract for autonomous services and cancellation of in-flight subprocesses. It aims to stop new work and terminate work already in progress, including child processes.
I would not treat the existence of that contract as proof of a universal stop. Each entry point and process tree needs testing. An external request may already have completed, and cancellation cannot undo a side effect that has already occurred.

A useful test asks what happens before work starts, during a model call, during tool execution, and after an external action. “Stopped” should describe observed state, not just the fact that a halt button was pressed.

[Let autonomy earn its scope]

My intended progression is dry-run recording, shadow execution, observed testing, a reversible feature flag, then enabled operation within the approved scope.
Each stage answers a different question. A dry run reveals proposed actions without performing them. Shadow work lets me compare outputs without applying them. Longer observation exposes repetition and recovery behavior that a single demo misses. A feature flag provides a practical way to disable the capability.

The self-improvement loop is deliberately narrower: it proposes changes for my approval. Generating a proposed change is not permission to apply it, and passing a test does not confer new authority.
This is a rollout discipline, not a guarantee. The stages still depend on representative tests, good instrumentation, and an operator who inspects the evidence.

[What I would reuse]

If I were starting again, I would establish these rules before increasing autonomy:

- Report missing connections rather than silently degrade.
- Explain why work did not run.
- Keep unknown cost distinct from zero.
- Test cancellation through the actual child-process tree.
- Separate a proposal from permission to act.
- Expand scope only when the observed behavior supports it.

The two-dollar mistake mattered because it was small enough to examine without becoming a crisis. It exposed a question I had not made explicit enough: what must the system demonstrate before I let it repeat this action unattended?
That is the operating problem behind the demo. The goal is not a dashboard that never reports uncertainty. It is a system that makes uncertainty visible enough for me to make a responsible next decision.`);

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

There is a version of evals that belongs deeply to engineering. Latency, cost, task completion, retrieval accuracy, benchmark performance, regression testing, jailbreak resistance, and infrastructure reliability all matter. Designers do not need to own all of that, but should collaborate on thresholds that affect the experience. But there is another layer — how the system behaves as an experience — that design is uniquely qualified to lead.

- Does the system understand what the user is actually asking for?

- Does it know when to ask a clarifying question?

- Does it express uncertainty in a way that helps rather than irritates?

- Does it feel capable without pretending to be omniscient?

- Does it handle vulnerable, high-stakes, or emotionally loaded moments with appropriate care?

- Does its output fit the product's point of view?

These are not "tone" questions. They are product quality questions. If designers don't help define them, someone else will. Usually by accident.

[The designer's eval stack]

The following is a proposed working method, not a report of a measured team rollout. A design eval can begin as a structured document and a weekly ritual. The stack has five parts:

[1. Behavioral criteria]

Start by naming the qualities the system must preserve. Not vague qualities like "good" or "human" — specific standards. For example:

- It should answer the user's actual intent, not just the literal wording.

- It should ask for missing information before making risky assumptions.

- It should distinguish confidence from uncertainty.

- It should use the product's language, not generic assistant language.

These become the team's shared quality bar.

[2. Scenario set]

AI products need to be tested against situations, not just happy paths. A good scenario set includes:

- Common tasks users perform every day.

- Ambiguous requests where intent is incomplete.

- Edge cases where the system is likely to over-assume.

- High-friction moments where users are confused or frustrated.

- Boundary cases where the system should refuse, redirect, or escalate.

- Accessibility and inclusion cases where phrasing, assumptions, or defaults may exclude people.

The scenario set is where research becomes operational. Every confusing support ticket, failed usability session, sales objection, and edge-case interview can become an eval scenario.

[3. Examples and anti-examples]

Designers are good at pattern recognition, but teams need more than vibes. For each scenario, collect examples of:

- Strong responses.

- Acceptable responses.

- Weak responses.

- Unshippable responses.

The anti-examples matter most. They teach the system and the team what failure looks like — the move you'd skip if you were only playing your own side. This is where taste becomes concrete. Instead of "this doesn't feel right," you can say: "This response is overconfident, skips the user's constraint, and gives no recovery path." That is a far more useful critique.

[4. Review cadence]

Evals only matter if they're used repeatedly. Set a rhythm:

- Weekly: review a small set of critical scenarios.

- Before launch: run the full scenario set.

- After model or prompt changes: compare old and new behavior.

- After incidents: add new failure cases to the eval set.

The goal isn't ceremony. It's to keep quality from depending on memory, heroics, or whoever happened to be in the room.

[5. Ownership and escalation]

Every criterion needs an owner. Some belong to design, some to research, some to content, some to policy, legal, data science, engineering, or support. The important thing is that failures have a path. If the model repeatedly misunderstands user intent, who investigates? If the tone is technically compliant but brand-damaging, who decides? If the product gives a correct answer in a way users don't trust, who owns the fix? Without ownership, evals become a graveyard of observations.

[A simple AI UX eval rubric]

Earlier I listed a few behavioral criteria as examples. A working rubric expands them into something a team can score together. Score each criterion from 1 to 5:

- Intent fidelity — Does the system respond to what the user actually means, not just the surface wording?

- Usefulness — Does the response help the user make progress?

- Uncertainty handling — Does it show confidence, uncertainty, and limits appropriately?

- Assumption control — Does it avoid inventing context or overfilling gaps?

- Tone and posture — Does it sound appropriate for the product, moment, and user need?

- Recovery — If the output is imperfect, is there a clear way to correct, refine, undo, or escalate?

- Inclusion and accessibility — Does it avoid exclusionary assumptions and support different user needs?

- Boundary behavior — Does it refuse, redirect, or ask for help when it should?

- Product point of view — Does the behavior reflect what this product believes good help looks like?

Use the score to start a conversation, not end one. Calibrate the rubric with multiple reviewers, record disagreements, and retain failures as regression cases. Model-based grading can help triage examples, but should not be the only judge of nuanced behavior.

[An illustrative scoring example]

Suppose a user asks a writing assistant to shorten an email without changing its meaning. The response deletes a deadline and gives no indication that it removed a requirement. A reviewer might score intent fidelity 2 out of 5 and recovery 2 out of 5: the text is shorter, but the constraint was lost and the change is hard to spot.
A second response preserves the deadline and highlights the edits. It could score higher on those criteria, but the team should compare judgments rather than accept one reviewer's number as truth. This is a hypothetical calibration exercise, not a reported evaluation result.

[The weekly ritual]

If I were adding this to a design team's operating rhythm, I'd start with a 45-minute weekly review.

- Five minutes: choose three scenarios.

- Ten minutes: run the current product, prompt, or prototype against them.

- Fifteen minutes: score the outputs using the rubric.

- Ten minutes: identify the highest-risk failure pattern.

- Five minutes: assign one change to make before the next review.

That is enough to begin. The important part isn't the meeting. It's the muscle. Designers need to practice looking at AI behavior as a material — not as magic, not as a demo, not as a mysterious property of the model, but as something that can be shaped, reviewed, compared, and improved.

[What changes when designers lead evals]

When designers help define evals, the team stops asking only whether the AI can do the task. It starts asking better questions. What kind of help are we trying to provide? What should the system never do, even if the user asks? Where should it be opinionated, and where should it be humble? Where should it slow down? Where should it hand control back to the user? Where would a technically correct answer still feel wrong? These questions are not decoration. They are the product. Technical measures and experience review answer different questions. Bringing them together gives the team a better chance of catching a response that is mechanically successful but unhelpful.

[The quality bar has to move upstream]

AI makes production faster. That is the obvious part. The less obvious part is that it also makes mediocrity faster. It can generate more screens, more copy, more flows, more summaries — more plausible-looking work. Without evals, teams ship whatever looks impressive in the shortest demo. With evals, teams make their standards visible before the system scales. That is the work now. Not better prompts — better ways to know whether the product is behaving well. Anyone can play themselves and win. Evals are how you find out whether you would have.
`);

const cutDeferOrBuildBody = authoredMarkdownBody(`
Every 0-1 engagement reaches a point where the vision outruns the budget. You've mapped the future state, the client has seen it, everyone is excited, and someone finally has to decide what actually gets designed in the weeks that remain.
I've been in that room many times. The decision is always the same three options: cut it, defer it, or build it. And the default answer is almost always the wrong one.

On a recent engagement, designing an AI-powered onboarding platform for financial-services teams, we spent real time imagining what the product could eventually do. Predictive personalization. Automated escalation on flagged issues. Proactive guidance based on client behavior. Interactive meeting summaries. Good ideas, all of them, and none belonged in the MVP prototype we delivered.
The gap between what the technology could do and what the MVP delivered was a constant creative tension for the whole engagement. Managing that tension well is most of the job.

## When to cut

Cutting is hardest because the idea is usually good. That's what makes it dangerous. A good idea nobody asked for still consumes the same weeks as a bad one.
Ask:

- Did this come from research, or from the team's enthusiasm?
- Did any user describe the problem it solves, in their own words, unprompted?
- If it shipped alone, would anyone notice?
- Does it require a capability that doesn't exist yet in the product or the org?
- Is it here because it demos well?

That last question is the sharp one. Some features exist to make a stakeholder presentation land. That's a real need, but it's a marketing need, and it should be funded and scoped as one, not smuggled into a build.

## When to defer

Defer is for good ideas with a missing prerequisite. Usually data, sometimes trust.
Ask:

- Does this depend on behavior the product hasn't accumulated yet? Personalization needs a history to personalize against.
- Would users accept it before they trust the basics? Automation lands very differently once someone has watched the system get simple things right for a month.
- Can you design the seam now so it drops in later without a rebuild?
- Is the concept worth documenting even though it isn't worth building?

Deferred work should still be designed to a level that proves it's coherent. On that same engagement, the future-state concepts served a real purpose even unbuilt. They helped communicate the roadmap to investors. That is a different purpose from a feature available to users; neither presentation work nor funding establishes production delivery.

## When to build

Build is for the thing that changes the user's day.
Ask:

- Did this show up in interviews as an actual complaint rather than a wish?
- Does the workflow break without it?
- Can you name the moment in the journey it occurs, and who is present?
- If you shipped only this, would the product still be worth using?

Research pointed at one answer over and over: manual data entry was the single largest source of frustration for the operators managing these relationships. Repetitive, error-prone, endless. So the MVP centered on document ingestion and pre-population, which turned their job from typing into checking. Everything else waited.
Pilot feedback supported prioritizing document entry and verification, while also raising requests for deeper AI capabilities. Those requests required further investigation: they could signal a useful roadmap, an unmet essential need, or a mismatch between the concept and the task.

## The scope review

Make it a recurring meeting, not a one-time negotiation, because the answers change as research comes in.
The agenda I use:

1. Restate the problem the product is solving, in one sentence.
2. Review what was learned since last time, from users specifically.
3. Walk the current scope list and mark each item cut, deferred, or building.
4. Say what each decision is based on. "Research showed X" or "we don't have the data yet" or "this is for the investor deck."
5. Confirm the deferred list is written down somewhere the client will actually find it.

The last step matters more than it sounds. Deferred ideas that vanish get reinvented six months later at full cost. Deferred ideas that are documented become the roadmap.

## Key lessons

1. The default answer is "build it," and the default answer is usually wrong.
2. Enthusiasm is not evidence. Interviews are.
3. Features that exist to demo well are a real need, scoped as the wrong thing.
4. Defer needs a written home or it becomes cut by accident.
5. Requests for deferred work are evidence to investigate, not proof that the scope was correct.
6. Cut and defer are the two decisions that make the MVP shippable. Build is the easy one.
`);

const designPrinciplesBody = authoredMarkdownBody(`
Most design principles die in the deck they were born in. They're written at the wrong altitude, agreed to by everyone, and then never invoked in an actual decision. "Be delightful." "Put the user first." Nobody disagrees, which is exactly the problem. A principle that nothing can violate isn't steering anything.

The set that worked best for me came out of a project where the stakes made vagueness impossible: designing AI-assisted onboarding for financial-services clients. Sensitive financial documents. Regulatory exposure. Users who were, in one persona's case, a woman with a complex family trust structure who found most digital tools intimidating and was openly skeptical that software could handle her situation without her advisor in the loop.
You cannot design that with "be delightful."

## Write principles at the decision level

The test of a good principle is whether it resolves an argument you're actually going to have. Ours did, because each one named a specific trade-off the team hit weekly.

**Pre-population over manual entry.** The AI reads the uploaded documents and fills the form. The person's role shifts from typing to checking. This one principle reorganized the entire customer experience, because every screen then had to answer a different question: not "what do we need from you," but "here's what we found, is it right?"

**Every extracted value carries its provenance.** Any data point the system pulled had to show its source document and line reference, with a confidence score. No number appears in the interface as if it simply knew.

**Every automated action has a human checkpoint.** Automation proposes. A person confirms. In a regulated domain this isn't a nicety, but the useful part is that it settled dozens of small design arguments before they started.

**Progressive disclosure with stated reasons.** Step by step, with a visible indicator of where you are and an explanation of why each piece of information is needed. Research had shown clients felt lost, unsure what was expected or how long it would take. The principle addressed that directly.

Notice that each one is falsifiable. You can look at a screen and say "this violates the second principle," and everyone in the room will agree. That's the bar.

## Principles come from research, not from a workshop

We ran stakeholder interviews with relationship associates, regional VPs, and advisors before writing any of this. The technique that produced the most was using a journey map as the interview prompt rather than a question list. We'd built a comprehensive map of the analog process, from verbal commitment through the first ninety days after handoff, and walked people through it stage by stage.
Grounding the conversation in a concrete workflow got us pain points that abstract questions never surface. People are bad at answering "what's frustrating about your job" and very good at answering "walk me through what happens here."

Four findings came out of it, and each one turned into a principle. Manual entry was the biggest source of frustration. Clients felt lost. Coordination between roles was fragmented across email and phone. Trust and transparency were non-negotiable given the sensitivity of the data.
That's the actual method. Research, then patterns, then principles. Writing principles first produces a description of the designer you'd like to be.

> Principles you write from ambition describe you. Principles you write from research describe the problem.

## The part that didn't work

Alongside the MVP, we developed a set of future-state concepts: predictive personalization, automated escalation, proactive guidance. Those didn't get principles. They got mockups.
They remained future-state work because of scope and missing prerequisites, not simply because they lacked principles. But the absence of explicit criteria made their assumptions harder to challenge. I would separate those two questions next time: is this feasible now, and would it be useful if it were?

If I were doing it again, I'd hold the speculative work to the same test as the buildable work. Not to constrain the imagining, but because a future-state concept that can't satisfy your own principles is telling you something useful about the future state.

## Put the principle in the structure

The most durable principle I've written wasn't in a document at all. It was in the data model.
We defined a hierarchy for the onboarding journey: journey, phase, action, sub-action group, sub-action, task. Six levels. That structure decided the navigation, the progress indicators, the operator's ability to configure a journey per client, and the customer's sense of where they were in a long process.

The data model was as much a design decision as any screen. It gave navigation and progress a shared structure, making some inconsistencies harder to introduce. It could not prevent confusing interfaces by itself; the way we presented that structure still needed review and testing.
That's the strongest version of a design principle: one that has been built into a structure, where following it is easier than not.

## What I'd tell someone writing them

1. If nobody could disagree, it isn't a principle.
2. Derive them from research, not from a workshop with sticky notes.
3. Name the trade-off each one resolves.
4. Hold speculative work to explicit criteria, even when its prerequisites keep it outside current scope.
5. The best principle is one you've encoded in the structure, where following it becomes easier to sustain.
`);

const embeddedProductDesignLessonsBody = authoredMarkdownBody(`
The pattern of my career has been showing up inside someone else's company, usually small, usually under pressure, and being responsible for the product experience end to end. Research through interface, sometimes through the marketing site. The lessons below are the ones I'd want a younger version of me to have.

## Use the artifact as the interview

> People are bad at answering "what's frustrating?" and very good at answering "walk me through what happens here."

On a project mapping the client onboarding process for financial-services teams, we built a comprehensive journey map before conducting a single interview. It covered everything from verbal commitment through the first ninety days after handoff.
Then we used the map itself as the interview prompt. Conversations with relationship associates, regional VPs, and advisors were grounded in walking the map together stage by stage.

The difference in output was dramatic. Abstract questions produce abstract answers and a lot of generic complaints about "communication." A concrete workflow in front of someone produces specifics: this handoff is where things get dropped, this document always arrives late, this is the third place I retype the same number.
Build the artifact first. Then let people correct it. Correction is easier than recall.

## The data model is a design decision

> Structure is design, and changing it later can be expensive.

The same project needed a way to represent an onboarding journey that could flex across different institutions with different processes. We ended up with six levels: journey, phase, action, sub-action group, sub-action, task.
That structure wasn't preliminary work before the design. It was the design. It determined the navigation, the progress indicators, what an operator could configure per client, and how a person experienced moving through a long, intimidating process.

I've watched teams treat information architecture as engineering's problem and then spend months fighting an interface that can't express what users need. Get into the model early. It's the highest-leverage hour a designer spends.

## Design for the state the user is actually in

> Nobody is calm when they use the feature you're most proud of.

On a pet-tech product, one of the flows I worked on was the mode that activates when a dog escapes its safe zone and the owner has to track it live. The person using that screen is panicking. Their vocabulary has narrowed. They are moving.

On an audio sleep product, the opposite extreme: the person is in bed, lights off, and about to lose consciousness. We designed the in-session happy path around start and stop, with setup beforehand and optional controls still available. Controls faded on inactivity and handed off to the lock screen.

Both are the same lesson. The default design persona is an alert, seated, unhurried person who has never existed. Ask what state your user is in at that exact screen, and design for that person instead.

## When the team shrinks, you own coherence

> A small team doesn't produce less work. It produces less-connected work.

I joined one engagement shortly after the company had gone through layoffs, and inherited a scope normally spread across several people: research, wireframes, prototypes, interface, the corporate site, marketing materials.

What surprised me wasn't the volume. It was that coherence needed explicit time alongside delivery. Larger teams also have to work at consistency; critique and shared systems do not make it automatic. A useful small-team practice is to review the same flow across product, website, and supporting messages before calling any one surface finished.
If you're the last designer standing, schedule the coherence pass. It won't happen on its own, and it's the first thing to go.

## Two-sided products require constant empathy-switching

> One user is unfamiliar with the process. The other works in it repeatedly. They need different levels of guidance.

The onboarding platform had two audiences: prospective clients going through an unfamiliar process infrequently, anxious and unfamiliar, and financial operators managing dozens of these relationships simultaneously.
One side needed guidance, reassurance, progressive disclosure, and explanation of why each piece of information mattered. The other needed density, filtering, status at a glance, and the ability to drill into any relationship in two clicks.
The mistake is designing one and adapting it. They need distinct vocabularies over a shared system. What holds them together is the underlying model, not the interface conventions.

## Pilot beyond the room

> Internal consensus is the cheapest and least reliable validation available.

We tested the platform prototype with financial-services professionals. The feature they responded to most strongly was the one research had predicted, which was reassuring. But the testing also surfaced things no amount of internal review would have: terminology that didn't match how they spoke, filtering needs on the dashboard we hadn't anticipated, specific points where clients got confused about progress.

Participant count alone does not establish useful coverage. Include people beyond the stakeholder circle and examine what their roles and tasks represent. Internal reviewers remain useful, but can share assumptions that external participants challenge.

## The list

- **Interview with an artifact.** Correction beats recall.
- **The data model is design.** Get in early.
- **Design for the actual state.** Panicked, half-asleep, interrupted.
- **Small team, deliberate coherence.** It stops being automatic.
- **Two audiences, two vocabularies, one model.**
- **Validate outside the building.** Your stakeholders share your blind spots.
`);

const constraintWasTheBriefBody = authoredMarkdownBody(`
## The challenge

An audio company wanted to enter the sleep market. The premise was straightforward: sessions of audio content that help people fall asleep, stay asleep, and wake up better. Our studio was brought in to design and prototype the mobile experience, working with designers and product strategists on the concept.

The obvious approach for a media app is to give the listener control. Playback, scrubbing, track skipping, queue management, volume, browse-while-playing. That's the vocabulary the category runs on, and it's what a stakeholder expects to see in a player mockup.
It's also completely wrong for this product, and figuring out why took reframing the constraint as the brief.

## Reframing the question

The person using a sleep player is not a listener in any normal sense. They're in bed, in the dark, at the point of losing consciousness. Every interaction we designed was an interaction that would keep them awake.
So the constraint stopped being "how few controls can we get away with" and became the actual specification: **the intended in-session happy path is start and stop. Setup happens beforehand; optional controls remain available.**
That is a scoped interaction target, not a claim that every user action fits into two taps. It helps distinguish essential in-session behavior from configuration that belongs elsewhere.

## What the constraint produced

Working backward from two taps forced a set of decisions we'd never have reached by subtraction.

**Setup moved out of the session.** If you can't configure during playback, configuration has to happen before, and it has to be light enough that someone will actually do it every night. That produced the bedtime and rise time inputs, adjustable daily because real schedules move. It also produced a mood forecast: the listener picks from a small fixed set, stressful, busy, active, mellow, quiet, and the session is generated to suit. Both are pre-session inputs that make the in-session interface unnecessary.

**Controls learned to disappear.** After a period of inactivity the controls faded and the device handed off to a minimal lock screen player, with only the essentials reachable through a menu. The interface removed itself once it had done its job.

**The session got modalities instead of a queue.** Fall asleep, stay asleep, rise. Three phases the system moves through on its own, rather than content the listener has to steer.

**Ambient visuals replaced dense playback information.** An ambient calming visualization instead of the usual progress and metadata furniture, while essential controls remained available. The visualization is still feedback; it simply serves a different purpose from detailed playback metadata.

None of that is a subtracted version of a normal player. It's a different object, and the constraint is what produced it.

## The same move, elsewhere

I've since used a similar reframe on projects that looked nothing alike.
On a pet-tech product, the flow that activates when a dog escapes its safe zone has a comparable constraint pointing the other direction. The user is panicking, outdoors, moving. That's not "make it simple" either. It's a specific state with specific implications: large touch targets, live location as the entire screen, no decisions that require reading a paragraph.

On another engagement I joined shortly after the company had gone through layoffs, the constraint was headcount. My scope covered work normally spread across several people. The productive reframe there wasn't "how do I do five jobs." It was recognizing that coherence needed scheduled attention alongside delivery. Critique and shared systems support it in any team, but do not make it automatic. Naming it that way made it survivable.

> A vague constraint is a complaint. A specific one is a brief.

## Key lessons

1. Convert the limitation into a number. Two taps, six weeks, one person. Vague constraints resolve nothing.
2. Ask what the constraint implies rather than how to escape it. The implication is usually the design.
3. Work backward from the constrained moment. What has to happen before, so nothing has to happen during?
4. The user's state is a constraint, and it's the one most often ignored.
5. Constrained solutions aren't reduced versions of the unconstrained one. They're a different object, usually better.
6. When resources are the constraint, name what stops happening automatically. That's the thing to schedule.
`);

const realMvpBody = authoredMarkdownBody(`
I've spent most of my career building zero-to-one products for startups, which means I've spent most of my career arguing about what belongs in a first version. The argument is never really about features. It's about what "viable" means.
An MVP is three things:

1. **The fewest features that get the job done.**
2. **A path someone can complete without giving up.**
3. **Something that delivers real value at the end.**

Most failed first versions satisfy one and three. They're small, and the value is genuinely there for anyone who reaches it. They fail on two, and nobody reaches it.

## Minimal is the easy part

Cutting scope is a skill teams already have. What teams are bad at is noticing when the cut has broken the path.

On a project designing AI-assisted onboarding for financial-services clients, one persona was a woman in her fifties with a complex financial picture spread across real estate and trusts. Not particularly comfortable with digital tools. Openly skeptical that software could handle her situation without her advisor involved. The persona represented an infrequent user unfamiliar with this process, not an observed individual whose future behavior we could predict.

A minimal version for her is easy to imagine: a form, an upload field, a submit button. Minimal, and the value is real at the end. It could fail that persona's need for guidance. That is a design hypothesis to test, not a measured abandonment time.

What made it viable was the work that looks like overhead on a scope list. Pre-population, so the system read her documents and she checked rather than typed. Progress indicators, because she needed to know where she was in something long. Explanations of why each piece of information was needed, because trust was the actual constraint. An assistant available at every step to answer the questions she'd otherwise have called her advisor about.
None of that is minimal. All of it is viable.

## The completion test

The test is simple and most teams skip it: hand a person a goal and watch.
Not a demo. Not a walkthrough where you narrate. Give them the objective and stay quiet. The moment you're listening for is the one where they stop and say some version of "I don't know what to do now." If they can't resolve it within reasonable effort, you have a product that is minimal and not viable.

We put the platform prototype in front of financial-services professionals during pilot testing. It confirmed the thing research had predicted, that automating manual data entry was the feature that mattered most, and it surfaced things internal review never would have: terminology that didn't match how they talked, filtering they needed on the dashboard, specific points where clients lost the thread of their own progress.
What matters is including relevant people outside the team, with tasks that expose the limits of the design. Internal reviewers can catch problems too, but may share assumptions about how the product is supposed to work.

## Viability is state-dependent

The same feature set can be viable for one user and unusable for another, based purely on the condition they're in.
Designing a sleep product taught me this. The listener is in bed, in the dark, half-conscious. Every control is an obstacle. We designed the in-session happy path around start and stop, with setup beforehand, optional controls available, and controls fading on inactivity. Adding features there would have reduced viability.

Designing the flow for a pet owner whose dog has escaped teaches the opposite. That person is panicked and moving. They need less on screen and bigger targets, but they also need more certainty: live location, unambiguous next action, no paragraph to read.

Both are viable. Neither is minimal in a way that would survive a generic scope-cutting exercise. The question isn't "what's the least we can build," it's "what's the least this person, in this state, needs to finish."

## The real lesson

Stop asking whether the first version is impressive. Ask whether someone can finish.
Impressive first versions are common and mostly useless. They demo beautifully, they raise money, and then real users hit the third screen and stop. The unglamorous work of a real MVP is almost entirely about the middle of the journey, which is exactly the part that never appears in a pitch.
Clarity is what makes something viable. Everything else is decoration on a path nobody completes.
`);

const articleReadMinutes = (body) => {
  const wordCount = body
    .flatMap((block) => block.type === "list" ? block.items : [block.text])
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;

  return Math.max(1, Math.ceil(wordCount / 200));
};

const articleOrder = [
  "the-constraint-was-the-brief", "intention-deficit-disorder", "company-of-one",
  "cut-defer-or-build", "design-principles-that-actually-shape-the-product",
  "lessons-from-fifteen-years-of-embedded-product-design", "what-makes-a-real-mvp",
  "you-always-let-yourself-win", "two-dollar-bill", "a-free-surf-lesson", "showing-my-teeth",
];

function article({ slug, title, date, summary, body = temporaryArticleBody, index }) {
  const normalizedBody = normalizeArticleBody(body);
  return Object.freeze({
    kind: "article",
    slug,
    path: `/articles/${slug}/`,
    collectionPath: "/articles",
    title,
    // Assigned historic dates remain in the private source records, not as publication claims.
    meta: Object.freeze(["Andrew Zellinger", "Reviewed Sep 8th 2026", `${articleReadMinutes(normalizedBody)} MIN`]),
    summary,
    body: normalizedBody,
    media: Object.freeze({
      src: ARTICLE_IMAGES[slug].src,
      label: "Abstract material sculpture",
      decorative: true,
    }),
  });
}

export const ARTICLE_DETAILS = Object.freeze([
  article({
    index: 1,
    slug: "company-of-one",
    title: "Company of One",
    date: "Aug 14th 2026",
    summary: "How a working agent harness uses bounded delegation, explicit checks, and honest cost accounting to make uncertain behavior easier to inspect.",
    body: companyOfOneBody,
  }),
  article({
    index: 2,
    slug: "a-free-surf-lesson",
    title: "A Free Surf Lesson",
    date: "Jun 19th 2026",
    summary: "Why design judgment needs systems understanding and hands-on execution, with a sleep-player example showing how constraints shape the work.",
    body: aFreeSurfLessonBody,
  }),
  article({
    index: 3,
    slug: "showing-my-teeth",
    title: "Showing My Teeth",
    date: "Mar 28th 2026",
    summary: "A personal account of professional loss, family crisis, survival, and choosing integrity when the design industry turns hostile.",
    body: showingMyTeethBody,
  }),
  article({
    index: 4,
    slug: "intention-deficit-disorder",
    title: "Intention Deficit Disorder",
    date: "Jan 12th 2026",
    summary: "How AI products accumulate intent debt when they misread users, and how design teams can identify, measure, and prevent it.",
    body: intentionDeficitDisorderBody,
  }),
  article({
    index: 5,
    slug: "two-dollar-bill",
    title: "Two-Dollar Bill",
    date: "Oct 23rd 2025",
    summary: "What a two-dollar agent mistake revealed about cost visibility, operational trust, and why autonomous systems must earn freedom.",
    body: twoDollarBillBody,
  }),
  article({
    index: 6,
    slug: "you-always-let-yourself-win",
    title: "You Always Let Yourself Win",
    date: "Jul 8th 2025",
    summary: "Why designers need evals to define product quality, expose weak outputs, and keep AI experiences useful, clear, and trustworthy.",
    body: youAlwaysLetYourselfWinBody,
  }),
  article({
    index: 7,
    slug: "cut-defer-or-build",
    title: "Cut, Defer or Build",
    date: "Apr 17th 2025",
    summary: "A practical framework for deciding what an early product should cut, defer, or build when ambition outruns time and budget.",
    body: cutDeferOrBuildBody,
  }),
  article({
    index: 8,
    slug: "design-principles-that-actually-shape-the-product",
    title: "Product Design Principles",
    date: "Jan 30th 2025",
    summary: "How research-grounded design principles resolve real trade-offs, survive delivery pressure, and actively shape product decisions.",
    body: designPrinciplesBody,
  }),
  article({
    index: 9,
    slug: "lessons-from-fifteen-years-of-embedded-product-design",
    title: "Embedded Product Design Lessons",
    date: "Sep 12th 2024",
    summary: "Lessons in research, workflow structure, and delivery from embedding with product teams across complex commercial design projects.",
    body: embeddedProductDesignLessonsBody,
  }),
  article({
    index: 10,
    slug: "the-constraint-was-the-brief",
    title: "The Constraint Was the Brief",
    date: "Apr 4th 2024",
    summary: "How treating severe constraints as the brief can clarify the problem, reject familiar patterns, and produce a better product.",
    body: constraintWasTheBriefBody,
  }),
  article({
    index: 11,
    slug: "what-makes-a-real-mvp",
    title: "What Makes a Real MVP?",
    date: "Oct 26th 2023",
    summary: "Why a real MVP is not the smallest demo, but the smallest complete journey a user can finish clearly and with confidence.",
    body: realMvpBody,
  }),
].sort((a, b) => articleOrder.indexOf(a.slug) - articleOrder.indexOf(b.slug)));
