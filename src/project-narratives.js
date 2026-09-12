// @ts-check
// Public editorial layer, revised 2026-09-08. Source recollections are retained
// in project-content.js; unresolved evidence is tracked privately in docs/archive/content-claim-ledger.md.
// No minimum word quota: evidence determines the length of each record.
export const PROJECT_SECTION_LABELS = Object.freeze(["Context", "Key decisions", "Outcome"]);
export const ENGAGEMENT_SECTION_LABELS = Object.freeze(["Context", "Outcome"]);
const textSection = (label, text) => Object.freeze({label, paragraphs:Object.freeze([text])});
function narrative([summary, context, work, decisions, outcome]) {
  const sections = [textSection("Context", `${context} ${work}`.trim())];
  if (decisions.length) sections.push(Object.freeze({label:"Key decisions", paragraphs:Object.freeze([]), items:Object.freeze(decisions)}));
  sections.push(textSection("Outcome", outcome));
  return Object.freeze({summary, sections:Object.freeze(sections)});
}
const records = {
  "audible-sleep": [
    "Sleep-session design for Audible, connecting bedtime setup, personalized audio, and low-interaction playback in a mobile prototype.",
    "Audible wanted to explore a dedicated sleep experience using its audio library. Working with I&Co, we needed to make discovery and personalization useful before bed without carrying the interaction demands of a conventional media player into the session itself.",
    "As UX Lead, I translated research into the application architecture, wireframes, and session-player states. I worked with product strategists, visual designers, Audible's internal team, and subject-matter experts. Home, Browse, and Profile supported setup and discovery; interactive prototypes explored how scheduling, content selection, and playback could work together.",
    [
      "Separate bedtime, rise-time, and mood configuration from playback so the player can stay quiet once a session begins.",
      "Organize audio into fall-asleep, stay-asleep, and wake phases rather than ask listeners to manage a conventional queue.",
      "Make essential controls available in-app and on the lock screen, allowing the interface to recede without removing control."
    ],
    "The deliverable was an interactive prototype joining personalized sessions, discovery, scheduling, and playback. Reviews informed navigation and player refinements before handoff. Its central trade-off was giving listeners useful control without asking for more attention at the moment they wanted less."
  ],
  "turner-tv": [
    "Participatory research and rapid prototypes helping Turner explore what viewers wanted from a streaming experience.",
    "Turner was exploring direct-to-consumer streaming and needed to understand viewer priorities alongside its existing content and technology. The assignment was to turn audience input into product concepts concrete enough for the team to evaluate.",
    "I designed and facilitated an ideation workshop with television viewers, using card sorting and participatory exercises to surface and group ideas. I translated selected concepts into interactive prototypes within days. My role connected the research activity with interaction design so the workshop produced more than a set of presentation slides.",
    [
      "Start with how participants organized viewing needs rather than assume the categories of an existing streaming service.",
      "Use participant priorities to narrow the concept set before investing in detailed interfaces.",
      "Prototype behavior so the team could examine how an idea worked, not only whether its description sounded appealing."
    ],
    "The handoff combined workshop findings and interactive concepts for Turner's product team. It provided material for discussing features and next steps. Rapid prototyping kept the audience's input visible as an idea became an interface, giving the team something concrete to examine before committing to a direction."
  ],
  "obagi": [
    "UX direction for Obagi's website redesign, connecting direct skincare purchases with clinician-guided appointment pathways.",
    "Obagi's website needed to support two customer pathways: products available for direct purchase and products requiring professional consultation. The redesign also reconsidered how the skincare brand appeared across the site. Customers needed to understand the appropriate next step without discovering the distinction only at checkout.",
    "I worked directly with Obagi as UX Design Director. I oversaw UX research and the design artifacts defining the site, including information architecture, user flows, appointment booking, and ecommerce checkout. The engagement also covered supporting promotional experiences intended to explain products and encourage return visits.",
    [
      "Distinguish direct purchase from clinician-guided care in the journey, before customers reach an unsuitable checkout path.",
      "Treat appointment booking and ecommerce as related journeys with different requirements, not one interchangeable transaction.",
      "Carry the brand through navigation, product information, and promotional components rather than confine it to the homepage."
    ],
    "The work defined the UX direction and flows for the website redesign, connecting brand application with purchase and appointment experiences. The key design problem was making two routes understandable within one site: helping customers reach the appropriate next step without obscuring the role of professional care."
  ],
  "wework-studio": [
    "A tablet-first sales prototype bringing WeWork location media and membership information into flexible, in-person presentations.",
    "WeWork sales representatives needed to discuss spaces, amenities, and membership benefits during tours and meetings. Their presentations varied with the prospect and the representative. Philosophie was asked to prototype a tool that supported that flexibility rather than replace the conversation with a fixed script.",
    "As Design Director, I led UX and UI direction with designers, a product manager, and an engineer. Research included observing walkthroughs and speaking with sales staff. I oversaw wireframes and a high-fidelity prototype, coordinating with WeWork's internal teams. The content included spaces, floor plans, videos, renders, and virtual tours.",
    [
      "Support multiple presentation paths so representatives can respond to a prospect's questions without restarting a linear pitch.",
      "Keep location media and supporting information retrievable during a live conversation, using familiar search and map patterns.",
      "Put the prototype into recurring sales work through a diary study, complementing feedback from individual review sessions."
    ],
    "The team delivered a high-fidelity sales-application prototype bringing location discovery and presentation media into a single direction for review and refinement. The representative's ability to listen and adapt became a requirement of the interface, rather than something the product expected a salesperson to work around."
  ],
  "android-wear": [
    "Watch-face design with ustwo and Google, exploring expression, glanceability, and hardware constraints on Android Wear.",
    "Google and ustwo were exploring watch-face design for Android Wear. The challenge was not to shrink a phone interface: a watch needed to communicate time at a glance while accommodating personal expression, live data, and a much smaller display.",
    "I contributed as part of a design and engineering team working with Google's developer-relations group. My work spanned research, concepts, wireframes, prototypes, usability testing, and implementation reviews. The team's directions included Rift, Waves, and Versus; these are examples of the wider collection, not a claim of sole authorship.",
    [
      "Evaluate legibility on watch hardware, where scale, light, and motion expose problems an enlarged design canvas can conceal.",
      "Balance expressive color and animation with immediate recognition of the time and other essential information.",
      "Adjust contrast, typography, and customization in response to device constraints rather than apply one visual treatment indiscriminately."
    ],
    "The collaboration produced watch-face designs and supporting guidance for Android Wear. Prototyping and engineering reviews connected visual ideas with performance and display behavior. The enduring design tension was personality without sacrificing a glance: a watch can be expressive, but time recognition still has to work."
  ],
  "live-auctioneers": [
    "A shared Figma and Storybook design system for LiveAuctioneers' web and native auction experiences.",
    "LiveAuctioneers' web and native products had accumulated inconsistent patterns as the business grew. Design files had moved from Sketch to Figma while engineering was developing UI in Storybook. The immediate need was agreement about how components looked, behaved, and should be used.",
    "As consulting Design Lead, I led interface and process audits, set the system roadmap, and guided a small team in partnership with product and engineering. We inventoried duplicated patterns and missing states, then developed foundations and reusable components. Documentation made design intent and component behavior legible across both disciplines.",
    [
      "Audit interaction states and intended use alongside visual differences, so the library addresses more than surface consistency.",
      "Develop Figma and Storybook documentation in parallel to make behavior and edge cases discussable across disciplines.",
      "Establish color, type, spacing, and core controls before expanding into larger interface compositions."
    ],
    "The engagement produced a documented design-system framework spanning Figma and Storybook. The library made component behavior and usage decisions available to both design and engineering. Continued adoption depends on maintenance and ownership beyond that initial delivery, so the documentation was part of the product rather than a separate handoff task."
  ],
  "andrew-eccles": [
    "A photography portfolio developed with Crate for Andrew Eccles, presenting commercial work across music, film, and sports.",
    "In 2016, I worked with Crate and commercial photographer Andrew Eccles on his portfolio website. His work features prominent figures across music, film, and sports. The site needed to present that photography as a body of work prospective clients could browse.",
    "My contribution was website design in collaboration with the studio and Andrew. The focus was how the interface introduced the work, provided orientation, and kept the presentation centered on the photography.",
    [
      "Give the photographs visual priority, keeping interface decoration secondary to the work.",
      "Use the commercial portfolio as the organizing purpose rather than turn the site into a celebrity-focused editorial experience.",
      "Develop the presentation in direct collaboration with the photographer and studio so it reflects the work being shown."
    ],
    "The engagement brought Andrew's commercial photography into a portfolio website developed with Crate. The design contribution was a presentation framework that served the images instead of becoming the main event, keeping the photographer's work central throughout."
  ],
  "proctor-and-gamble": [
    "Experience architecture for the Kew garden journey within P&G's Beauty Sphere, combining spatial exploration and educational content.",
    "P&G's Beauty Sphere was conceived as a browser-based 3D environment for presenting its sourcing and sustainability programs. Within that larger experience, the Royal Botanic Gardens, Kew journey needed to make exploration engaging without losing visitors' orientation or obscuring the information.",
    "As UX Design Lead with AKQA, I focused on the Kew journey's flows and wireframes. I collaborated with UX, visual, 3D, sound, and engineering specialists to connect navigation, content, and interaction. Prototypes explored the garden path, collection progress, crossroads, and expanded media.",
    [
      "Structure the garden as a navigable journey rather than an open-ended 3D space with no clear next step.",
      "Make plant collection and progress understandable so visitors can follow the educational sequence while exploring.",
      "Connect audio and visual content to the spatial journey without requiring visitors to lose their place."
    ],
    "The design direction combined the Kew journey with supporting interaction patterns for the broader Beauty Sphere. Collaboration connected the UX architecture with the spatial implementation. Visitors needed to understand both where they were and why each interaction mattered; that requirement helped keep the educational sequence visible within an expressive environment."
  ],
  "modern-age": [
    "Location discovery, appointment booking, and checkout design connecting Modern Age's website with in-person services.",
    "Modern Age connected a digital service with physical locations providing therapeutic care. Its website needed to help prospective customers find a location, understand the available services, book an appointment, and complete checkout. Supporting offers and messages also had to coexist with those practical tasks.",
    "I joined the startup directly as Design Lead. I worked with the team on website features and enhancements across location discovery, booking, and checkout. My scope also included the chatbot and reusable advertising components carrying rotating promotional information on the website and social channels.",
    [
      "Treat location discovery, appointment booking, and checkout as connected steps rather than independently optimized pages.",
      "Design the chatbot as an additional way to find help without making it a prerequisite for ordinary navigation.",
      "Use reusable promotional components so offers can change without redefining the surrounding page structure."
    ],
    "The engagement produced design work across service discovery and transaction journeys, alongside chatbot and promotional experiences. Those features were designed to support appointment and checkout completion. The responsibility was balancing changing commercial messages with a dependable path from website to appointment."
  ],
  "fi-smart-collar": [
    "Product and growth design for Fi, spanning Lost Dog Mode, subscriptions, checkout, and connected mobile and web experiences.",
    "Fi combines a GPS dog collar with an application for location, activity, and escape alerts. The engagement crossed safety-critical moments and everyday product growth: tracking a missing dog, understanding subscriptions, purchasing a collar, and connecting with other owners.",
    "As Design Lead, I worked across research, stakeholder workshops, flows, prototypes, interface design, and engineering collaboration. Lost Dog Mode was a central focus, alongside subscription and checkout journeys, profiles, referrals, and website work. The scope required a consistent product language without treating every interaction as emotionally equivalent.",
    [
      "Prioritize tracking information and understandable next actions when the owner is using Lost Dog Mode under stress.",
      "Connect subscription requirements with the purchase journey so they are part of the decision rather than a late surprise.",
      "Separate the tone and priorities of safety interactions from community and marketing features, while retaining shared visual patterns."
    ],
    "My contribution covered product interfaces and growth-related design across app and web, developed with the internal team and engineers. The work required making a technically complex service understandable when users had very different needs and levels of attention, from an urgent search to an ordinary purchase."
  ],
  "thompson-reuters": [
    "UI and UX contributions to Reuters TV with Ueno, shaping time-bounded video-news viewing across web and mobile.",
    "Reuters TV organized a newscast around the time a viewer had available. That proposition created a distinct interface problem: duration selection needed to be immediate, while the generated playlist remained understandable and controllable without competing with the news itself.",
    "Working with Ueno, I contributed to UI and UX across web and mobile. The work explored duration selection, playlist presentation, playback controls, and the relationship between a generated sequence and direct viewer input. Television was part of the wider product ecosystem, not an additional platform I claim to have owned.",
    [
      "Make available viewing time a clear input to the experience rather than bury it in configuration.",
      "Keep playlist controls accessible when needed and visually secondary during playback.",
      "Adapt shared product logic to web and mobile interaction patterns rather than assume identical controls work in every context."
    ],
    "The engagement contributed interface work to Reuters TV's time-aware news experience. Its distinctive constraint was human: the system assembled content, but the viewer supplied the time available and retained a way to intervene. That relationship between generated content and direct control shaped the interaction design."
  ],
  "gero-app": [
    "A Pomodoro timer for Apple Watch and iPhone, separating focused work and break signals from session customization.",
    "Gero was an ustwo productivity app for Apple Watch with an iPhone companion. It applied the Pomodoro work-and-break routine to a small wearable screen. The challenge was to make a timer useful on the wrist without turning it into another source of interruption.",
    "I designed the watch and mobile interfaces. The watch focused on the active sprint, break state, and cycle changes; the phone handled settings such as sprint and break duration. Working within early WatchKit constraints meant considering the interaction model and animation alongside the small display.",
    [
      "Keep session customization on the phone so the watch can concentrate on the current work or break state.",
      "Surface cycle changes without requiring the user to keep checking the display throughout a sprint.",
      "Avoid dashboards and gamification that would compete with the simple start, work, break, and repeat routine."
    ],
    "The work produced watch and companion-phone interface designs for the timer. The useful distinction was not merely screen size: the devices had different responsibilities. A constrained platform sharpened the boundary between what needed attention on the wrist and what could remain in the background or on the phone."
  ],
  "foursquare": [
    "Brand-system and asset development with Red Antler for Foursquare's move toward personalized local discovery.",
    "Foursquare's move from check-in-centered interaction toward local discovery required a different brand expression. Red Antler's identity direction had to work inside the product as well as across its marketing touchpoints, retaining recognition through a substantial change in the service.",
    "I worked with the Red Antler team on the assets and applications of the identity. My contribution was production-intensive brand design, not sole authorship of the strategy or monogram. The work translated the direction into product and marketing applications in collaboration with Foursquare's internal team.",
    [
      "Evaluate the identity at mobile app-icon scale, where recognition cannot depend on fine detail.",
      "Carry the blue, pink, and white palette consistently across applications while respecting each format's practical requirements.",
      "Use the distinctive F emblem as a shared anchor rather than create a different visual story for every touchpoint."
    ],
    "The engagement produced identity applications supporting Foursquare's new product direction. Execution across formats required precision at small scales, where silhouette, color, and consistency do more than elaborate presentation. The app remained the practical test of whether the wider visual system held together."
  ],
  "amazon-fire-tv": [
    "Design Lead engagement with Sketch for Amazon Fire TV.",
    "I worked with Sketch on an Amazon Fire TV engagement.",
    "My role was Design Lead.",
    [],
    "Selected interface work is shown above. This entry is a concise engagement record rather than a full process case study."
  ],
  "price-waterhouse-coopers": [
    "Workflow and interface design for PwC audit teams, connecting document verification, assignment ownership, and review.",
    "PwC audit work moved between client documents, spreadsheets, and multiple review roles. A digital application needed to bring those handoffs together without hiding the rigor of the underlying process. The design problem included both detailed financial information and coordination among specialists, checkers, coaches, and managers.",
    "As Design Director with Philosophie, I led research, journey mapping, interaction design, and prototyping. Fieldwork at PwC's Tampa office informed the application structure. I worked with the product owner and engineering team on audit setup, assignment management, document-handling concepts, and review states.",
    [
      "Design document handling around checking extracted values rather than simply reproduce manual transcription in a new interface.",
      "Make assignment ownership and review status visible so each role can understand the next action and handoff.",
      "Use field research to capture workarounds and communication habits that the official process map did not explain."
    ],
    "The work brought audit setup, assignments, document information, and review into a shared application design. Staff feedback informed terminology and hierarchy as the team developed the workflow. Traceability and responsibility were central interaction-design concerns, particularly where one person's work became another person's review."
  ],
  "northwestern-mutual": [
    "Desktop and mobile financial-planning design for LearnVest within Northwestern Mutual's digital ecosystem.",
    "LearnVest's consumer financial-planning experience needed to work across desktop and mobile within Northwestern Mutual's wider offering. Budgeting, goals, accounts, and advisor communication required clear hierarchy without losing the approachable tone of a consumer product.",
    "I worked directly with the Northwestern Mutual and LearnVest team on dashboards, budgeting, goal tracking, and account management. My contribution focused on navigation and the presentation of financial information across devices. The task was to adapt the experience to different contexts rather than resize the same dense screen.",
    [
      "Use desktop space for comparison among spending, trends, and goals, while mobile emphasizes immediate status.",
      "Sequence information so users can orient themselves before inspecting more detailed financial data.",
      "Balance an approachable consumer tone with the credibility expected of an institutional planning service."
    ],
    "The engagement contributed cross-platform interface designs for financial-planning workflows. The design challenge was to help someone understand their current position, then make deeper inspection available without presenting every financial detail at once. That sequence shaped the different priorities of desktop and mobile."
  ],
  "mcdonalds": [
    "Self-order kiosk UX with Method, connecting menu navigation, customization, upsell, and restaurant operations.",
    "McDonald's self-order kiosks needed to serve customers with varied levels of digital confidence while accommodating a large menu, customization, payment, and restaurant operations. Deep navigation and crowded ordering screens made the relationship between choice and clarity especially important.",
    "I led UX for the kiosk redesign as part of Method's wider digital engagement. The work included auditing the existing experience, observing restaurant use, and translating findings into architecture, navigation, customization flows, and interaction patterns. Collaboration connected the customer-facing interface to restaurant systems, kiosk placement, and service flow.",
    [
      "Reduce navigation depth while preserving the menu and customization choices customers need to complete an order.",
      "Place relevant upsell opportunities within the ordering sequence rather than repeatedly interrupt the task.",
      "Review interface choices alongside kiosk placement and order flow, treating the screen as part of restaurant service."
    ],
    "The contribution was UX direction and interaction patterns for the redesigned kiosk experience within a wider digital program. The work reconciled commercial goals with a straightforward ordering path while accommodating different levels of patience and touchscreen familiarity."
  ],
  "avantos": [
    "AI-assisted onboarding design for financial-services teams, pairing client guidance with document verification and operator workflows.",
    "Avantos needed a platform for clients and financial operators exchanging documents, checking information, and coordinating onboarding. The opportunity was not simply to automate entry. The experience had to keep extracted information reviewable while supporting both an unfamiliar client and an operator managing many relationships.",
    "I led end-to-end product design across the client and operator experiences. Research with advisors, relationship associates, and regional leaders informed journey maps, personas, and architecture. I produced interaction design, high-fidelity UI, prototypes, and specifications, working with leadership and engineers to distinguish MVP scope from future AI concepts.",
    [
      "Pair extracted values with source references and confidence indicators so operators can verify information rather than accept it without review.",
      "Give clients guided progress and operators configurable, information-dense workflows over a shared model: journey, phase, action, sub-action group, sub-action, task.",
      "Prioritize document entry and verification in the MVP prototype, while keeping deeper AI concepts visible as future scope."
    ],
    "The engagement delivered an MVP prototype for both audiences and a roadmap for further AI capability. Pilot feedback informed terminology, filtering, and progress presentation. Investor-facing concepts were also part of the work. The prototype made the relationship between automation and human review tangible while separating immediate scope from future possibilities."
  ],
  "pi-app": [
    "Initial identity and application prototyping for Positive Intelligence, connecting its founder's teaching with a digital practice.",
    "Positive Intelligence needed a brand foundation and an early application for studying and using its founder's philosophy. The assignment linked two beginnings: an identifiable visual language and a first product expression of the program.",
    "I worked directly with the founder, creating the initial logo and typography and helping rapidly prototype the first version of the application. The role crossed brand and product design, keeping the identity connected to how the teaching would be presented rather than applying it after the interface had been defined.",
    [
      "Develop the identity and early interface together so typography and presentation can serve the instructional material.",
      "Keep the founder's teaching central to the prototype rather than add unrelated product mechanics to expand the scope.",
      "Use rapid prototyping to make an abstract program concrete enough to discuss as an application."
    ],
    "The work produced the initial brand direction and a first-version application prototype. It established a shared starting point for the identity and digital experience: turning the program into something visible and testable at the beginning of the product."
  ]
};
export const PROJECT_NARRATIVES = Object.freeze(Object.fromEntries(
  Object.entries(records).map(([slug, record]) => [slug, narrative(record)])
));
