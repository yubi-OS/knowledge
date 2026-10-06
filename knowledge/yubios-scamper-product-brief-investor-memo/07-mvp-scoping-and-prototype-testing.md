# 07. MVP scoping and fast prototype testing

Scope: Scoping the MVP from ideation output and testing it fast: prototype MVPs for value-proposition validation, the solution-hypothesis step that follows, and small-N prototype tests that answer one question each.

## The MVP definition that matters

A minimum viable product is a version of a product with just enough features to be usable by early customers, who can then provide feedback for future product development (https://en.wikipedia.org/wiki/Minimum_viable_product, jev weight 0.25, weak backing). The more operationally useful version comes from NN/g: once a team has validated the product's value proposition, possibly through a prototype MVP, the next step is to test the solution hypothesis, which determines whether the product can attract, retain, and grow a profitable user base in the market (https://www.nngroup.com/articles/mvp-definition/, jev weight 0.76, authoritative).

That two-stage structure is the key scoping insight. Stage 1 (value-proposition validation) is cheap and can be a prototype; stage 2 (solution-hypothesis validation) needs real usage. Scoping an MVP from an ideation thread means choosing the smallest artifact that answers the stage-1 question, not the smallest shippable version of the eventual product.

A prototype is an early sample, model, or release of a product built to test a concept or process, a term used across semantics, design, electronics, and software programming (https://en.wikipedia.org/wiki/Prototype, jev weight 0.22, weak backing). Practitioner guides distinguish MVPs and prototypes as different instruments in product development, with different costs and different evidentiary value (https://xcubelabs.com/blog/minimum-viable-products-mvps-and-prototypes-in-product-development, jev weight 0.07, weak backing; https://www.boldare.com/services/mvp-development/, jev weight 0.07, weak backing).

## Scoping rules when the input is ideation output

When the MVP candidate comes from an ideation thread rather than from customer research, three rules keep it honest:

1. One workflow, end to end. The prototype should exercise one complete workflow (for example: an app requests access, the user sees why, grants limited access, the access expires, the audit trail remains visible) rather than a survey of features. An MVP built as a minimal set of features delivering value to early users is the standard framing (https://www.geeksforgeeks.org/product-management/minimum-viable-product-mvp/, jev weight 0.22, weak backing), but the testable version is narrower: one workflow a user can complete and react to.
2. Name the question the test answers. The lean-startup loop (build, measure, learn, with validated learning as the output) exists to answer a specific hypothesis (https://www.digitalocean.com/resources/articles/lean-startup-methodology, jev weight 0.17, weak backing; https://www.koji.so/docs/lean-startup-methodology, jev weight 0.14, weak backing). If the test's question cannot be stated in one sentence, the prototype is not scoped yet.
3. Keep it throwaway-tolerant. A 24-hour prototype is disposable by design; its value is the user reactions it produces, not the code.

## Small-N testing discipline

The fast-testing pattern for a single-screen prototype: show what data exists, who can access it, when access expires, and provide one-click appeal and export. Then test with 3 users and ask 3 questions: "Do you understand who has power here?", "Would you trust this more than a normal OS?", and "What feels coercive or unclear?".

The N is small by design and the questions are comprehension questions, not satisfaction questions. Comprehension questions about power and visibility are the right instrument for a governance-first product because the product's core claim is that users understand who holds authority over their data; a satisfaction score cannot test that claim, but a "who can act as you?" recall question can. The evidence hierarchy in doc 02 applies: comprehension findings from 3 users are directional evidence, enough to justify or kill the next prototype iteration, not enough to support a market claim.

## Caveats for corpus readers

The NN/g source (authoritative, 0.76) carries the two-stage MVP definition. Everything about small-N testing in this doc traces to the source artifact's own 24-hour test design and is craft convention, weakly backed by the lean-startup blog sources (all under 0.5). The quizlet and content-farm sources surfaced in the dig were discarded as off-topic or promotional. The honest statement: fast small-N comprehension testing is widely practiced and cheap, but there is no strong published validation of it in this dig's sources.
