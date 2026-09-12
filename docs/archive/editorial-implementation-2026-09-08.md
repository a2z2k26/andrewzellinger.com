# Editorial implementation — 2026-09-08

Scope: continue the approved pilot across the site. Local feature worktree only. Existing unrelated worktree edits preserved. Original pre-pass articles are preserved in `docs/editorial/article-source-before-2026-09-08-pass.js`; original project extraction remains in `src/project-content.js`.

## Implemented

- 18 documented case studies now use Context → Work → Key decisions → Outcome, with three semantic decision bullets each.
- Amazon Fire TV is intentionally a short three-section engagement record. Its source does not support three decision claims.
- Rewrote all 19 public summaries/narratives around responsibility, concrete choices, and documented deliverables. Removed the minimum word quota and unsupported numeric/company-outcome claims.
- Preserved project titles, media, order, routes, date tags, canonical collection/detail descriptions, and existing layout/motion.
- Restored missing article openings in the earlier pass; this pass substantially tightened Company of One, A Free Surf Lesson, Intention Deficit Disorder, and Two-Dollar Bill.
- Edited the other commercial/AI essays for prototype status, scope, causality, persona-versus-observation, and consistent six-level workflow terminology.
- Preserved Showing My Teeth verbatim pending an explicit publication decision; it remains available.
- Removed count-driven paragraph consolidation. Paragraph boundaries are authored; compact bullet and numbered blocks remain semantic lists; Markdown quotations have unindented blockquote semantics.
- Added hypothetical before/after and scoring examples, bounded orchestration explanation, and explicit cost/stop limitations.
- Added six contextual links from articles to related case studies.
- Ordered the article collection to lead with commercial constraints, AI experience quality, and technical practice.
- Unified author, review-date label, and recomputed read times across all articles and their static index snapshot.
- Updated History to lead with hands-on product design, frame functioning AI applications as self-directed work, distinguish independent practice from continuous paid employment, qualify direct/studio client relationships, and describe tool use without implying equal expertise.
- Unified Home/History/Articles descriptions around the hiring objective. Detail metadata follows active content and returns to collection metadata on close.
- Case-study section labels are semantic H3 headings with zero default margins. Decorative article stand-ins are hidden from assistive technology.

## Verification

- All 91 automated tests, production build, and all 7 Sites packaging checks pass. `git diff --check` is clean.
- Live desktop: all 19 project units present; 18 decision lists each with three disc items; semantic section headings; Turner four-section screenshot reviewed.
- Long project scroll from Turner into Modern Age, then Close: Projects collection visibly restored.
- Article index shows revised order, review date and read time. Company of One entry opens. All 11 article units and six related-work links present; no article-body horizontal overflow at 1440px.
- Browser inspection caught compact-list flattening; parser and regression test corrected before completion.
- Reloaded Company of One: four-step and five-check lists render as semantic bullets in the live screenshot.
- Long article scroll from Company of One into You Always Let Yourself Win, then Close: Articles collection visibly restored with images, titles, metadata, descriptions, and links.
- At 390px, Company of One and History have no document horizontal overflow; article metadata wraps and the updated History lead is visible. Screenshots reviewed. Browser viewport override reset afterward.
- These checks are local-preview evidence, not proof of deployment, every possible transition, or factual verification of the described projects.

## Not represented as complete

The remaining gates are factual or publication decisions, not unfinished bulk editing: Amazon's contribution details; conflicting project/History dates; real article publication dates; Showing My Teeth publication context; shareable AI artifacts; testimonial permission. See `docs/content-claim-ledger.md`. No evidence, dates, quotes, test results, or qualifications were invented to satisfy these gates.

The résumé was not revised again in this website-content pass.
