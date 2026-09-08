# Site-wide editorial audit and case-study revision plan

Prepared September 8, 2026. Audit and proposed revisions only; no site copy changed.

## Executive verdict

**F1 The site has enough substance to sell Andrew as a commercial product designer. Its main weakness is how that substance is presented and qualified, not a shortage of projects.** The strongest material describes difficult workflows, real design decisions, and hands-on AI systems. The weakest material substitutes generic lessons, company history, or declarations of sophistication for evidence of Andrew's contribution.

**D1 Prioritize credibility and comprehension before adding more copy.** Repair the article imports, reconcile chronology, replace Amazon's public placeholder, and distinguish delivered work from intended or company-wide effects. Then introduce a concise decision-led bullet section across case studies.

**D2 Keep the commercial hiring objective explicit in editorial decisions.** AI should make the designer more useful and technically credible. Neither the biography nor articles should accidentally tell a hiring team that commercial work is obsolete, that Andrew is withdrawing from employment, or that collaboration is beneath him. This does not require bland writing or disclosure of private ambitions.

## Scope, evidence, and limits

Read the complete active published narrative layer for all **19 case studies**, all **11 normalized article bodies**, their titles/summaries/metadata, the complete **History** content, and relevant page metadata, accessibility labels, and rendering code. Counted **6,761 case-study body words** and **13,986 article words**, including article headings/list text. Case-study summaries are additional. Counts use whitespace-delimited words and are editorial measurements, not reading-performance research.

Audited the working feature checkout that contains the latest changes, not the older main checkout or a deployed production site. Compared selected article openings against supplied original files and used the supplied résumé/conversation for cross-document inconsistencies. This is a source-level content audit, not a fresh visual/browser audit, accessibility certification, external fact-check, or verification of confidential project evidence. A statement appearing in the existing source is not proof that it is accurate.

Primary files: `src/project-narratives.js` (public narratives); `src/project-content.js` (records and canonical projections); `src/article-content.js` (articles and normalization); `src/biography-content.js`; `src/detail-state.js`; `src/detail-section-motion.js`; `index.html`; `info/index.html`; `articles/index.html`. Source locations are relative to this report's worktree. The résumé drafts are supporting context, not additional website pages.

Priorities: **P0** correct before outreach; **P1** next editorial pass; **P2** polish after substance. Proposed wording and bullets below require review, especially where the current narrative itself needs confirmation.

## Site-wide findings

### F2 — P0: factual confidence varies, but the writing sounds equally certain everywhere

The normalized case-study file says it adds no claims beyond source material. That is an authoring intention, not independent verification. Several recollection-based projects were expanded from limited information earlier in this conversation. Their polished process and outcome sentences need Andrew's confirmation, particularly details about testing, publishing systems, progression, educational modules, and implementation.

Examples needing an evidence check:

- Avantos: fifteen interviews, more than 100 pilot participants, more than $2 million in Series A funding, and the relationship between the design work and fundraising.
- McDonald's: about 1,000 restaurant upgrades per quarter, more than 15,000 locations, and a five-to-six-percent average-check increase. Separate program-wide reporting from results attributable to this engagement.
- Live Auctioneers: more than 500 documented components; clarify whether this counts variants, foundations, or distinct components, and what was implemented versus designed.
- Android Wear: 20 faces, launch timing, and “widely adopted.” Specify Andrew's faces and distinguish team output from individual contribution.
- Audible and WeWork: team sizes, diary-study conclusions, usability work, and delivery timing.
- Several outcomes claim improved clarity, consistency, or efficiency without saying whether those effects were observed, tested, or simply intended.

**D3 Use four distinct statuses:** designed; prototyped/tested; implemented/shipped; measured in use. A prototype can be a strong result. Do not upgrade it by implication. Use “designed to…” for an intention, “testing showed…” only with an actual finding, and “shipped…” only when the relevant delivery is confirmed.

### F3 — P0: chronology and naming conflict across the site and résumé

| Record | Case-study date | History date | Required resolution |
|---|---|---|---|
| Modern Age | 2021, also stated in Context | 2022–2023 | Confirm engagement period versus project date. |
| Reuters TV | 2015 | Ueno 2017–2018 | Separate original product launch from Andrew's engagement. |
| Foursquare | 2014, July launch in narrative | Red Antler 2015–2016 | Confirm whether Andrew worked on the launch identity or later applications. |
| McDonald's | 2018 | Method 2015–2016 | Establish correct project/engagement timeline. |
| Android Wear | 2017 | ustwo 2013–2015 | Confirm project date and historical platform terminology. |
| Audible | 2021 | I&Co 2021–2022 | Potentially compatible; define what the year tag means. |

Different dates can legitimately mean different things. The current site does not explain them. Preserve URLs while fixing display labels. “Thompson Reuters” conflicts with the record's “Thomson Reuters”; consider the clearer project title “Reuters TV.” “Proctor & Gamble” needs brand-name correction to “Procter & Gamble.” Normalize I&Co versus IxCo. Keep user-approved creative titles unless Andrew approves changes; do not silently replace all short titles with corporate names.

### F4 — P0: search/share copy describes a different professional identity

The Home meta description still says “I am a web designer” and refers to curated work in culture and technology. History metadata says principal AI product designer, strategist, design engineer, and fractional partner. History's visible lead says product designer and fractional partner. The new résumé leads with product design leadership. Those are four different emphases.

**D4 Choose one base positioning sentence** for search/share descriptions and adapt it minimally by page: commercial product design, complex workflows, systems, and AI implementation depth. Preserve the approved minimal visible Home heading; this is not a proposal to add a new Home paragraph. Articles' “Articles by Andrew Zellinger” is accurate but fails to explain the subject matter.

### F5 — P1: the case-study template is encouraging filler

Eighteen case studies are forced into a 325–410-word band. Work and Outcome each combine two former sections into one paragraph. This makes distinct projects sound similarly paced and similarly conclusive. Work reaches 201 words on Modern Age and 207 on Gero before a reader gets a break.

Recurring language includes coherent frameworks, practical foundations, restraint, clarity, and what a project reinforced. Those ideas are valid; repeating them across most of the portfolio weakens differentiation. Many Outcomes spend as much space on philosophy as on what was delivered.

**D5 Replace the minimum word quota with an upper budget and completeness checks.** Do not enlarge a thin record to match a rich one. Target roughly 260–350 body words where the evidence supports it, with exceptions. Each case should answer: problem, personal responsibility, consequential decisions, delivery status, and evidence/limitation.

### F6 — P1: summaries often claim benefit without revealing the differentiating work

“A connected digital journey,” “a coherent framework,” and “a scalable foundation” are too reusable. The two-line description constraint is useful, but write for meaning before clamping. Suggested pattern: **product + audience + distinctive intervention**, not an unverified result.

Example direction: “Appointment and checkout design connecting Modern Age's website with in-person care.” For Live Auctioneers: “A shared Figma and Storybook system for web and native auction experiences.” These are proposed shorter formulations, not approved replacements. Keep full detail descriptions semantically available; a two-line clamp is a rendering limit, not a fixed desktop word count.

### F7 — P1: accessibility text needs its own copy pass

Gero's label calls it a smartwatch fitness project, although it is a Pomodoro timer. Article images use numbered glacier stand-in labels. Some project labels retain old names or call an interface a generic website. Keep labels accurate to the image and useful to a nonvisual reader; do not claim visible details not inspected. Decide whether repeated decorative article placeholders should be hidden from assistive technology rather than announced as eleven different project illustrations.

## Case-study audit: every project

The bullets in the next section specify how to revise; this table identifies the individual editorial problem. Priority is not a judgment of the quality of Andrew's actual work.

| ID / project | Keep | Shortcoming and next action |
|---|---|---|
| C01 Audible Sleep — P1 | Session phases, lock-screen work, sleep-specific restraint. | Cut broad pandemic setup. Clarify prototype versus shipping. Verify team size and research. Explain one player decision rather than list every app territory. Reconcile the articles' exact two-interaction claim with setup and optional controls. |
| C02 Turner Media — P1 | Participatory workshop to prototypes within days. | Name one idea that survived and one that did not. The WarnerMedia/HBO Max ending implies proximity to a major launch without demonstrating influence. Replace corporate trajectory with the actual handoff and decision supported. |
| C03 Obagi Care — P1 | Direct purchase versus clinician-guided journeys is a real design tension. | Confirm the exact clinician/booking service and what shipped. “Two-sided commerce” is less precise than two customer pathways here. Verify added educational and promotional specifics. Distinguish UX direction from ownership of engineering. |
| C04 WeWork Studio — P1 | Observed sales behavior and nonlinear tablet use. | Broad corporate expansion context is not needed. Preserve the diary study if confirmed, but show one resulting change. Clearly call the deliverable a high-fidelity prototype, not a deployed sales platform. |
| C05 Android Wear — P0 | Named watch faces, hardware testing, legibility trade-offs. | Resolve date/platform language and individual ownership. Verify 20 faces and adoption. Avoid retrospectively calling all early platform work Wear OS without historical qualification. |
| C06 Live Auctioneers — P1 | Migration, missing states, Figma/Storybook agreement. | Define the 500-component count and adoption scope. Replace generalized efficiency gains with one example of a duplicated or missing pattern resolved. Explain maintenance/ownership if known. |
| C07 Andrew Eccles — P1 | Quiet, image-led design for a photographer. | Current copy is plausible but generic and expanded beyond the brief supplied. Confirm content organization, overview/detail behavior, publishing flexibility, and launch status. Show one actual image-layout decision. |
| C08 Procter & Gamble — P1 | Kew garden, collection journey, orientation in 3D. | Correct display spelling. Be precise about responsibility for the Kew segment versus the whole Beauty Sphere. Separate client sustainability messaging from independently established environmental impact. Name an accessibility decision rather than imply comprehensive compliance. |
| C09 Modern Age — P0 | Appointment/checkout/location continuity. | Resolve dates. Copy says customers had clearer paths without supporting observation. Distinguish delivered features from proposed patterns; explain one removed uncertainty in booking. Reduce the near-200-word Work paragraph. |
| C10 Fi Collar — P1 | Safety-state design alongside growth and subscription work. | Too broad to reveal the strongest contribution. Prioritize Lost Dog Mode and a second concrete flow. Cross-check post-recovery feedback language against Showing My Teeth; explain design alternatives without implying Andrew endorsed every requested marketing tactic. |
| C11 Reuters TV — P0 | Time-bounded news proposition; touch versus television. | Resolve name/date and personal platform scope. Product launch and closure are company history, not Andrew's outcome. State which iterations he worked on and avoid implying original invention of the whole proposition. |
| C12 Gero Timer — P1 | Watch/phone division of responsibility, early SDK constraints. | Cut etymology unless it earns space; verify it if retained. Replace “every pixel” and “hands tied” clichés with a particular SDK compromise. Correct fitness alt text. Keep Product Hunt/launch claim only with supporting record. |
| C13 Foursquare Brand — P0 | Production-intensive identity work and app-icon constraints. | Resolve 2014 versus 2015–2016. Attribute the monogram concept and strategy precisely; the current role appropriately avoids claiming sole authorship and should stay that way. Press visibility is not proof of individual impact. |
| C14 Amazon Fire TV — P0 | Client, role, date, approved image. | The page repeatedly tells the public that source material is missing. Replace with a short factual record after reconciling the résumé's component-library claim; do not hide uncertainty by manufacturing a full narrative. Hold a four-section version until enough contribution detail exists. |
| C15 PwC Audit — P1 | Field research, verification instead of transcription, role ownership. | Clarify what the document reader actually did and Andrew's design responsibility. “Securely parsed” and security-fit statements need confirmation. Prefer one review-state decision over a catalog of every surface. |
| C16 NW Mutual — P1 | Mobile/desktop hierarchy and emotional stakes of finance. | Context spends too much on acquisition value, user counts, and headcount. Outcome is almost entirely the company's later history. Replace with the specific designed surface, delivery stage, and a decision Andrew can defend. |
| C17 McDonalds Kiosk — P0 | Ordering/customization and operational constraints. | Resolve dates; verify research-market scope. Do not attribute rollout and check-size metrics to Andrew without a documented link. Distinguish contributed UX decisions from the wider global digital program. |
| C18 Avantos — P0 | Provenance, human review, client/operator differences, workflow model. | Strong flagship candidate. Confirm investment banking versus advisor/wealth-management terminology, role title, pilot count, financing round, and prototype status. Articles currently say shipped where this case says MVP prototype. Make the six-level model consistent across all references. |
| C19 Positive Brand — P1 | Brand plus first application concept is a clear zero-to-one story. | Name Positive Intelligence immediately despite the shortened project title. Clarify MVP/V1/concept vocabulary. Confirm lessons/prompts/progression details added during expansion; include an actual identity decision rather than only “optimism” and “coherence.” |

## Article audit

### F8 — P0: several introductions were lost during content migration

Verified against supplied source text:

- **Two-Dollar Bill:** the original establishes the two-dollar incident before “Because here's what two dollars represents.” The site starts at “Because.” Restore the setup in the body; the new overview does not replace it.
- **Cut, Defer or Build:** the original explains the room where vision exceeds budget. The published body begins “I've been in that room many times” with no antecedent.
- **Product Design Principles:** the original introduces principles dying in decks; the site begins “The set that worked best for me…” without establishing the set.
- **What Makes a Real MVP?:** the source's introductory framing is absent. This opening still makes sense, but the removal should be intentional rather than an import side effect.

Check all eleven against original sources before another copy pass. Do not restore private source annotations as public content. These are examples of a wider migration risk, not a claim that every omission is a bug.

### F9 — P0: publication dates create a false chronology

The dates were deliberately assigned earlier, not recovered publication dates. For example, What Makes a Real MVP? is dated October 2023 but describes the Avantos pilot, while that case is dated 2024–2025. This creates an avoidable factual inconsistency regardless of the essay's merit.

**D6 Replace invented publication dates with actual release dates, or label genuinely documented writing/revision dates accurately.** An older project can be discussed in a newly published retrospective. Do not fabricate backdated authority. Recompute read time after edits; the current calculation is a reasonable estimate at 200 words/minute, not a promised duration.

### F10 — P1: paragraph merging was mechanical, not editorial

`consolidateParagraphRun()` groups more than three consecutive paragraphs into two or three based on their count, not meaning. It saves space but creates paragraphs up to 326 words. Inline emphasis and blockquote syntax are stripped by the Markdown importer. This can erase the distinction between a principle and its explanation.

In **You Always Let Yourself Win**, the eval rubric is a flattened text table beginning “Criterion What to look for Score.” Its five-part numbered framework is interrupted by separate bullet lists; the normalizer cannot represent the nesting as one continuous ordered list. These are actual content-model shortcomings, not subjective typography complaints.

**D7 Preserve semantic paragraphs and lists, then reduce repetition editorially.** Use a real table or definition list for the rubric, nested lists with stable numbering where required, and explicit quote/callout treatment where appropriate. Retain the user-approved compact layout and single opening divider; restoring semantic structure need not restore excessive spacing or internal rules.

### F11 — P1: strong voice sometimes turns into unsupported certainty

Distinguish practical advice from universal laws. Examples: “You couldn't build a screen that violated it”; “the gates make that impossible”; “Everyone inside… can no longer see the gaps”; “Users asking for what you cut is the sign you scoped correctly.” Each is stronger than the evidence in the essay establishes. Keep the point of view while naming scope, exceptions, and actual observations.

In Company of One, fixed orchestration is not equivalent to predictable or correct model output. The prose says agents cannot summon others, but also says chiefs delegate to specialists. Explain the allowed hierarchy instead of implying no delegation exists. It announces eight gates but the nearby enumeration is not clearly eight distinct checks. Correct the count or show the actual list. Vendor/model diversity also does not by itself establish independent judgments.

### Article-by-article report

| ID / article | Current size | Verdict and revision |
|---|---|---|
| A01 Company of One | 2,098 words; 11 MIN | **Keep; substantial edit.** Best opportunity to prove AI depth. Trim repeated emergence/determinism arguments and boast-like repository-size material. Replace “I had no business building…” self-disqualification. Explain allowed delegation, gate limits, and version/date. Add a small architecture artifact and one observed failure/recovery example. Target 1,200–1,500 words if substance survives. |
| A02 A Free Surf Lesson | 1,685; 9 MIN | **Rework.** Clear stance, little project evidence. Several sections repeat “taste is insufficient.” Title does not reveal subject without the summary. Add one design decision where technical understanding changed the result; consolidate to three or four arguments. Avoid unsupported claims about who is thriving. Consider a descriptive subtitle, not necessarily a new title. |
| A03 Showing My Teeth | 1,240; 7 MIN | **Publication decision before outreach.** Strong personal writing, but it directly exposes the employment frustration the new positioning keeps private. The company is inferable from the portfolio, and the essay includes allegations and inferred motives. Recommend keeping it off the employer-facing collection or making a separate, consciously chosen personal publication. Do not silently delete it or sanitize away its meaning. If retained here, distinguish witnessed events from interpretations and decide knowingly what to disclose. This is editorial/reputational advice, not a legal conclusion. |
| A04 Intention Deficit Disorder | 1,711; 9 MIN | **Keep; tighten.** The travel-with-father example and recovery rubric are strong. Fix the missing punctuation in “missed the meaning Most product teams…” and turn embedded heading-like phrases into proper structure. Standardize “intent debt” versus “intention debt.” Consider “Intent Debt” as a less medicalized title. Reduce overlapping warning lists and add a before/after evaluation example. |
| A05 Two-Dollar Bill | 1,839; 10 MIN | **Keep; repair and substantiate.** Restore the opening. Strong operational specificity, but cost claims need accounting scope: per-call price, subscription cost, runtime, and comparable output quality. A 50× call-cost change is not automatically 50× total savings. Reconcile strict fail-closed claims with unknown subscription costs. Explain halt limits rather than promise every surface is covered without evidence. |
| A06 You Always Let Yourself Win | 1,662; 9 MIN | **Keep; structural repair.** Practical, relevant to AI design leadership. Fix rubric and nested numbering first. Distinguish a proposed weekly ritual from one Andrew actually ran. Add one scored example and clarify human calibration, regressions, and evaluation limitations. Reduce repeated contrasts between demos and real quality. |
| A07 Cut, Defer or Build | 730; 4 MIN | **Keep; near-ready after facts.** Restore the missing opening. Reconcile “shipped” with the Avantos prototype. Validate pilot/fundraising claims. Cut the absolute rule that requests for deferred work prove correct scope; unmet essential needs could produce the same signal. |
| A08 Product Design Principles | 806; 5 MIN | **Keep; clarify causality.** Restore opening. The principles are useful, but “future concepts stayed mockups because they lacked principles” conflicts with the prerequisite/scope explanation in Cut, Defer or Build. Explain multiple causes rather than tell whichever lesson suits the essay. A data model constrains UI; it does not make bad UI impossible. |
| A09 Embedded Product Design Lessons | 873; 5 MIN | **Keep; differentiate.** Good breadth, but repeats the same Avantos, sleep, and pet-safety examples used elsewhere. Expand the lesson about collaboration/coherence with a concrete working practice. Remove “fifteen years” from the index summary if avoiding tenure emphasis. Avoid claims that clients undergo onboarding only once in their lives or that the data model cannot be changed later. |
| A10 The Constraint Was the Brief | 683; 4 MIN | **Keep; strong commercial-design essay.** Define the two-interaction constraint as the in-session happy path, not total user actions: the same essay describes setup and optional controls. “Visuals replaced feedback” is misleading; visualizations are feedback. Avoid claiming full teams automatically create coherence. |
| A11 What Makes a Real MVP? | 659; 4 MIN | **Keep; resolve chronology and evidence.** Useful completion-focused argument. The October 2023 date conflicts with its later project example. “She would abandon it in four minutes” reads like a measured result but is hypothetical; label it as such or remove the invented precision. Distinguish persona assumptions from observed behavior. |

### D8 — proposed editorial roles and ordering

Avoid eleven essays competing to repeat the same thesis. Give each a job:

- Commercial judgment: The Constraint Was the Brief; Cut, Defer or Build; Product Design Principles.
- Collaboration and delivery: Embedded Product Design Lessons; What Makes a Real MVP?
- AI experience quality: Intention Deficit Disorder; You Always Let Yourself Win.
- Technical depth: Company of One; Two-Dollar Bill.
- Opinion: A Free Surf Lesson.
- Personal memoir: Showing My Teeth, subject to an explicit publication decision.

For employer-facing discovery, lead with one concise commercial essay, one AI-quality essay, and one systems essay. This is a proposed future order, not an applied change. Add relevant case-study links so a principle can lead to evidence. Preserve essay voice; trim repetition rather than turn every piece into corporate copy.

## History / biography audit

**B01 — P0: the recent expansion still reflects the earlier brief.** The lead emphasizes fractional partnership, the body discusses a separate future site, and the closing lists several engagement types. The latest objective is winning the next commercial role. Lead with hands-on product design leadership; describe AI development as added capability. Avoid a narrative of retiring one body of work for another. The separate site is not necessary to explain current value.

**B02 — P1: the AI paragraph undersells the work.** “Exploring,” “experiments,” and “growing technical practice” accumulate. The latest conversation says functioning applications exist. Replace that cluster with two concrete, accurately scoped examples after reviewing artifacts. Do not use hours worked or comparative claims about other designers as the evidence.

**B03 — P0: the experience register needs verified definitions.** Twenty-three rows now capture much more of the supplied background, including Greater Than One. Preserve that material, but distinguish umbrella independent practice, paid engagements, employment, and self-directed work. “2013–Present” must not imply continuous paid work if that is not the case. Resolve the project/History date table above rather than automatically declaring the résumé correct.

**B04 — P1: capabilities and tools are an inventory, not yet an argument.** Six tool groups are readable categorization, but they combine everyday tools, exploratory use, languages, frameworks, and infrastructure. Put the strongest job-relevant tools first; describe use rather than imply equal proficiency. Pair a small number with work examples. More tool names do not establish more engineering depth.

**B05 — P1: substantial proof remains unused.** The supplied testimonials could demonstrate collaboration and hands-on leadership more efficiently than additional self-description. Consider one concise attributed quote, preserving meaning and confirming public-use permission and attribution. Do not invent an endorsement or use it as evidence of technical claims it does not address. Education without the disputed year is appropriate pending reconciliation.

**B06 — P1: client breadth needs relationship clarity.** The expanded list can imply direct engagement with every organization. A short qualifier such as work delivered directly and through studios may be appropriate if accurate. Avoid a logo list that suggests employment or endorsement. Keep the full career record available without requiring a recruiter to read it before understanding Andrew's contribution.

**B07 — P2: reduce overlap among Profile, Design practice, Evolving practice, and Work with me.** Give them distinct jobs: identity/value; working method; evidence of current technical work; contact. Proposed opening direction: “I'm Andrew Zellinger, a hands-on product design lead working across complex workflows, design systems, and AI products.” This is a draft, not an approved replacement.

## Four-section case-study proposal

### D9 — Context → Work → Key decisions → Outcome

Bullet points are useful here because they make judgment easy to inspect. A generic skills list would add height without adding evidence.

| Section | Job | Suggested budget |
|---|---|---|
| Context | Audience, problem, consequential constraint. | 45–65 words |
| Work | Andrew's role, scope, collaborators, method. | 65–95 words; one or two paragraphs |
| Key decisions | Three specific choices, each with a reason or trade-off. | Three bullets, usually 15–25 words each |
| Outcome | Actual deliverable/status, observed result if supported, one useful limit or reflection. | 45–75 words |

These budgets are guidance, not padding targets. Do not preserve the old 325-word minimum or append bullets to unchanged prose. Move decisions out of Work, remove duplicated reflection, and keep total reading effort stable or lower. Section three should contain semantic bullets, not numbered steps. Prefer “Key decisions” over “Key achievements” until results are substantiated.

### Proposed bullet directions for all 19 cases

These draft bullets are derived from current narratives; they are not newly verified facts. The evidence gates in C01–C19 still apply.

**K01 Audible Sleep**

- Separate session setup from playback so nighttime controls can stay minimal.
- Organize audio around falling asleep, staying asleep, and waking rather than an ordinary listening queue.
- Adapt controls for in-app and lock-screen use to reduce interaction during a session.

**K02 Turner Media**

- Use participatory exercises to surface viewer priorities before selecting features.
- Translate selected ideas into interactive prototypes rather than leave the workshop as a strategy deck.
- Test how concepts behave, not only whether participants find them appealing.

**K03 Obagi Care**

- Distinguish direct purchase from clinician-guided pathways before customers reach the wrong next step.
- Connect product education with navigation and checkout rather than isolate it in marketing content.
- Reuse content patterns across products while keeping consultation requirements explicit.

**K04 WeWork Studio**

- Support multiple presentation paths so representatives can respond to a prospect rather than follow a script.
- Make location media and supporting information retrievable during a live conversation.
- Use a diary study to examine the prototype in recurring work, not only a single test session.

**K05 Android Wear**

- Test legibility on watch hardware rather than rely on enlarged design canvases.
- Balance personal expression with immediate time recognition.
- Refine contrast, type, and motion for device and lighting constraints.

**K06 Live Auctioneers**

- Audit states and behavior alongside visual differences before rebuilding the component library.
- Develop Figma and Storybook documentation together to reduce ambiguity at handoff.
- Establish reusable foundations before expanding into larger interface patterns.

**K07 Andrew Eccles**

- Give photography priority over interface decoration.
- Support varied image formats without forcing every shoot into identical presentation.
- Connect overview and detailed browsing so visitors can move through related work. Confirm this behavior before publication.

**K08 Procter & Gamble**

- Structure the Kew environment as a navigable journey rather than an unconstrained 3D space.
- Make collection progress and crossroads understandable during exploration.
- Connect educational media with the spatial experience without losing orientation.

**K09 Modern Age**

- Treat location discovery, booking, and checkout as one customer journey.
- Use the chatbot to support the primary pathways rather than replace navigation.
- Design reusable promotional modules so changing offers do not require a new page structure.

**K10 Fi Collar**

- Prioritize understandable tracking and next actions in Lost Dog Mode.
- Connect subscription decisions with checkout so purchase requirements are easier to follow.
- Keep safety, community, and marketing interactions coherent without giving them identical emotional tone.

**K11 Reuters TV**

- Make available viewing time an immediate input to the news experience.
- Keep playlist controls accessible without competing with playback.
- Adapt shared product logic to touch and television contexts. Confirm Andrew's ownership on each platform.

**K12 Gero Timer**

- Keep sprint and break customization on the phone so the watch stays focused.
- Surface cycle changes without demanding continuous attention.
- Exclude dashboards and gamification to preserve the core work-and-break routine.

**K13 Foursquare Brand**

- Carry the identity consistently across app and marketing applications.
- Evaluate the emblem at app-icon scale, where recognition cannot depend on detail.
- Preserve a distinctive visual system through a substantial product repositioning. Attribute concept authorship separately.

**K14 Amazon Fire TV — evidence required, not public bullet copy yet**

- Which component families or patterns did Andrew own?
- Which device differences required a design-system decision?
- What was delivered, adopted, or handed off, and how can it be demonstrated?

Do not turn these questions into generic accomplishments. The requested universal four-section structure has one legitimate content blocker. Collect the answers, then write the bullets. If answers are unavailable, use a shorter approved record rather than publish empty four-section theater.

**K15 PwC Audit**

- Shift document handling toward checking extracted information rather than repeating transcription.
- Make assignment ownership and review states visible across specialist and manager workflows.
- Use field research to capture workarounds missing from the official process.

**K16 NW Mutual**

- Use desktop space for comparison while emphasizing immediate status on mobile.
- Preserve an approachable consumer tone within an institutional planning environment.
- Sequence financial information to support orientation before deeper inspection.

**K17 McDonalds Kiosk**

- Reduce navigation depth while preserving menu and customization choice.
- Integrate upsell opportunities into the ordering sequence rather than interrupt it.
- Connect customer-facing interaction decisions with restaurant operations and other digital surfaces.

**K18 Avantos**

- Expose document provenance and confidence so extracted values remain reviewable.
- Give clients guided progress and operators configurable, information-dense workflows.
- Center the MVP on document entry and verification while separating future AI concepts from committed scope.

**K19 Positive Brand**

- Develop identity and early product interfaces together rather than apply branding afterward.
- Translate a broad teaching framework into manageable study and practice moments.
- Keep navigation and progression straightforward so the instructional material remains central. Confirm the exact V1 mechanics.

## Implementation plan, after approval

**P1 — factual/editorial repair first.** Resolve the launch blockers, restore missing openings, fix the rubric, and decide the personal essay's publication context. Build a private claim ledger: claim, source, Andrew's scope, delivery status, public-use approval. Do not add all private evidence to the public site.

**P2 — pilot the four-section treatment on three different cases.** Use Avantos for complex AI workflow, Audible for interaction design, and Foursquare for brand work. Review prose and bullets together. Then migrate the other fifteen sufficiently documented cases and complete Amazon once its information is supplied.

**P3 — extend the content model without disturbing the transition system.** Add an explicit bullet-list section type or `items` field to project sections. Update `projectSectionsMarkup()` to render escaped `<ul><li>` content; it currently only renders paragraphs. Use a stable section key for class names rather than interpolating a label containing spaces. Preserve the existing label/body grid, single primary image, canonical header, and collection description.

**P4 — integrate with existing motion and semantics.** The section-motion controller already reveals the entire section body; use that same wrapper for the list, not an animation per bullet. Keep reduced-motion content immediately visible. Use real section headings instead of the current plain label div where compatible with styling. Lists must remain readable in long-scroll clones, direct entry, close/back restoration, and mobile flow.

**P5 — update guards that currently enforce the old structure.** `PROJECT_SECTION_LABELS`, the one-paragraph-per-section assertions, and the 325–410-word tests explicitly encode the three-section format. Replace them with checks for correct section order, real bullets, no empty content, canonical headers, no fabricated placeholder claims, and preserved circular order. Update durable project documentation only when the new structure is approved.

**P6 — verify the content as well as the code.** Check each record in the renderer, test desktop/mobile/reduced motion, and replay long-scroll close behavior. Confirm article read times after edits; compare original versus normalized text to prevent another dropped introduction. Validate metadata and accessibility labels alongside visible text. No deployment is implied by this plan.

## Decisions for the next session

- **D10 Recommended:** approve Context / Work / Key decisions / Outcome, with three substantive bullets and shorter surrounding prose.
- **D11 Recommended:** repair inaccurate chronology and import defects before stylistic rewriting.
- **D12 Recommended:** hold Showing My Teeth outside the employer-facing collection unless Andrew deliberately chooses otherwise.
- **D13 Recommended:** revise History and search/share descriptions to match the employer-facing résumé positioning; keep concrete AI evidence, not a retirement-of-commercial-work narrative.
- **Q1:** what component work can support the Amazon case and its three decisions?
- **Q2:** which case-study dates are engagement dates versus product launch dates?
- **Q3:** which two working AI artifacts can substantiate the article and biography claims?

## Completion record

All 19 active case studies and 11 active articles have an individual finding above. History, collection copy, metadata, and accessibility text are included. Source-level word counts and rendering limitations were checked. Original articles were spot-compared to establish import loss; a complete source-to-publication diff remains an implementation task. No published content, résumé draft, route, layout, or animation was modified by this audit.
