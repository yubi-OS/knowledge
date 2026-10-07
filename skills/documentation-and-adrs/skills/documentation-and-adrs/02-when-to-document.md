# When to Document (and When Not To)

Scope: the trigger list and anti-trigger list from the source doc: when the documentation-and-adrs skill fires (significant architectural decision, competing approaches, public API change, user-facing feature, onboarding, repeated explanations) and when it explicitly does not (obvious code, restating comments, throwaway prototypes).

## The trigger list (source doc)

The source doc's When to Use section names 6 triggers:

1. Making a significant architectural decision
2. Choosing between competing approaches
3. Adding or changing a public API
4. Shipping a feature that changes user-facing behavior
5. Onboarding new team members (or agents) to the project
6. When you find yourself explaining the same thing repeatedly

Each trigger is a moment where the why is live in someone's head and decays fast. The ADR-focused triggers (doc 03) are a subset: the source doc's When to Write an ADR section lists choosing a framework, library, or major dependency; designing a data model or database schema; selecting an authentication strategy; deciding on an API architecture (REST vs GraphQL vs tRPC); choosing between build tools, hosting platforms, or infrastructure; and "any decision that would be expensive to reverse" (all source-doc claims). The last trigger is the general principle: reversal cost, not novelty, is the deciding factor.

## The anti-trigger list (source doc)

The When NOT to use section is short and absolute: "Don't document obvious code. Don't add comments that restate what the code already says. Don't write docs for throwaway prototypes." Three anti-patterns, all about cost-benefit: documentation that carries no information beyond the code itself is negative value (it drifts), and prototypes are designed to be discarded so documenting them wastes the same effort the prototype skips.

The source doc's When NOT to Comment section reinforces this at the line level with 3 concrete exclusions: do not comment self-explanatory code (its example is a one-line `calculateTotal` reduce), do not leave TODO comments for things you should just do now ("TODO: add error handling" means just add it), and do not leave commented-out code (delete it; git has history). All source-doc claims.

## External alignment on the triggers

The dig for this subtopic came back weak. The strongest result was a dictionary-grade definition of documentation (jev weight 0.59, weak backing for any substantive claim), and the ADR-when-to-write blog pages scored 0.17 to 0.21 (weak backing): standin.co's "when to write one" framing (https://www.standin.co/blog/architecture-decision-record-adr), docsio.co's template-plus-examples guide (https://docsio.co/blog/architecture-decision-record), catio.tech's 2026 guide (https://www.catio.tech/blog/architecture-decision-record), and withstoa.com's "stop debating, document better" pitch (https://withstoa.com/blog/architecture-decision-record). These consistently repeat the industry-standard trigger set (irreversible decisions, cross-team impact, multiple viable options), which corroborates the source doc's list but adds nothing beyond it. They are cited here as weakly-backed corroboration only.

One weak result is directly on the anti-trigger side: a Craft Better Software essay arguing against comments as a default (https://craftbettersoftware.com/p/dont-write-comments, jev weight 0.13, weak backing), which lines up with the source doc's anti-trigger list even though its argument (prefer self-describing code) is stronger than the source doc's (prefer why-comments where they exist).

## The onboarding trigger and agents

Trigger 5 and 6 deserve emphasis because they are the ones agents hit. "Onboarding new team members (or agents)" makes the human and machine reader symmetric: whoever lacks context is the audience. "When you find yourself explaining the same thing repeatedly" is the operational test that something is undocumented: the explanation is happening in conversation because it does not exist in the repo. The docs-for-agents doc (08) develops the agent side.

## The expensive-to-reverse test

The ADR trigger list's final item, "any decision that would be expensive to reverse", is the test that unifies the whole list. Framework choices, schema design, auth strategy, API architecture, and infrastructure are all expensive to reverse, which is exactly why their why must be written at decision time rather than reconstructed later from archaeology. The lifecycle doc (04) is the downstream consequence: an expensive-to-reverse decision whose rationale is lost invites a relitigation loop, which the source doc prices at "a 2-hour debate about the same decision six months later" versus the "10-minute ADR" that prevents it (source doc, Common Rationalizations table).

## Practical reading of the two lists together

The two lists define a narrow band. Document when a decision is (a) significant, (b) contested or alternative-laden, (c) interface-visible, (d) user-visible, (e) onboarding-relevant, or (f) repeatedly explained. Do not document when the artifact is obvious, self-explanatory, or disposable. Everything outside both bands is judgment. The skill's verification checklist ("ADRs exist for all significant architectural decisions", "No commented-out code remains", source doc) is the pass/fail audit of whether the band was respected.
