# 06. The ideation and decision record

Scope: how ADR-033's recommendation was produced, autonomous variation generation through structured lenses, scored and stress-tested, and what mainstream ideation practice says about that method.

## The method shape

The source record was produced by ideate-solo, described as "no dialogue, autonomous variation generation," generating 6 variations and selecting a finalist through a scored comparison (source one-pager, adr-033-misbehavior-cutoff-policy-2026-07-28). The method has the classic divergent-then-convergent structure: generate widely first, evaluate later. Digital.gov's human-centered design guidance describes exactly this cycle: "The design phase is made up of successive cycles of convergent and divergent thinking" [1] (jev weight 0.857). The ADR's generation log makes the two phases explicit: 6 variations first (divergence), then scoring, finalist selection, and stress-testing (convergence).

## The lenses

Each recorded variation carries a lens name: simplification, inversion, combination, audience-shift, and constraint-removal (source one-pager). This matches the practice of structured ideation prompts, where a fixed set of transformation lenses is applied deliberately rather than waiting for inspiration. The SCAMPER literature documents the same approach: a "structured set of ideation prompts used to explore alternative ways to change an existing product, service, process or idea. It gives people several lenses for asking" different questions (weak backing, learnleansigma [2], jev weight 0.448; similar taxonomies at imd.org [3], weight 0.379, and methodfield [4], weight 0.398, which lists seven named lenses including Substitute and Reversing). Practitioner guidance notes such prompts are for when "free generation stalls, to break out of the cluster you're stuck in" (weak backing, ixcoach [5], weight 0.348). The ADR's lens names are not SCAMPER's names, but the mechanism, a fixed lens taxonomy producing systematic variations, is the same.

## The scoring rubric

Each variation was scored on 4 additive criteria, painkiller (does it cure a real, frequent pain), switching cost (how much it disrupts what exists), defensibility (is the result hard to copy), and testability (can it be validated cheaply), with a drop threshold. V3 scored painkiller=5, switching cost=4, defensibility=4, testability=4, sum 17; V6 scored 14; the rest scored 6 to 13 (source one-pager).

Scoring alternatives against a shared criterion set is the standard evaluation-matrix pattern: "a decision-support tool used to evaluate several ideas against the same set of criteria" (weak backing, emerge-creatives [6], weight 0.208; also qmarkets [7], weight 0.173, and Ducalis [8], weight 0.178). Engineering texts make the same point about explicit trade-off tables: "Trade-offs are the core of design. You rarely improve everything simultaneously" (weak backing, LibreTexts engineering [9], weight 0.277). Product-management scoring rubrics such as RICE formalize the additive-criterion pattern, computing a score from Reach, Impact, Confidence, and Effort factors (weak backing, ProductPlan [10], weight 0.447; geeksforgeeks [11], weight 0.260). ADR-033's rubric is a domain-specific instance of the same family: 4 fixed criteria, additive sum, explicit threshold.

## Stress-testing the finalist

Before selection, the finalist went through a structured critique with named categories (source one-pager):

- Strongest critique: the ladder assumes misbehavior is detectable, but subtle failures (slow exfiltration, policy-compliant harmful outputs) "don't trigger any of the obvious signals. A severity ladder built on a faulty detector is theater."
- Second-order effects, good: a separate evaluation surface the model cannot game, plus a natural audit log of what the system was doing when it misbehaved.
- Second-order effects, bad: operator numbness to frequent WARN alerts, requiring rate-limiting and summarization.
- Un-testable bet: detection at the device boundary without observing model internals.

A stress-test-then-select step before commitment is the convergent half of the cycle [1] (weight 0.857); the adversarial pass is what distinguishes a decision record from a preference list.

## Why V3 won

The record's stated reason is scope fit: "the user's question explicitly says misbehaving model, runtime, not deploy-time" (source one-pager). V6 (pre-deployment fingerprint check) scored competitively at 14 but addresses deploy-time compromise, not runtime misbehavior; the record parks it as "a worthwhile downstream issue (model supply chain provenance)" rather than the answer to the runtime question (source one-pager; see doc 07).

## What the record preserves for later readers

The generation log structure (variation, lens, per-criterion scores, verdict, critique) is the part future maintainers inherit: it records not just what was chosen but what was rejected and why, which is what lets a later team re-open the decision without re-running the ideation. The record itself notes the conversion path: the one-pager becomes the ideation preamble, and the refs/ ADR (OMN-109) carries the Context, Decision, Alternatives, Consequences structure (source one-pager; see doc 08).

## Sources

1. Digital.gov, divergent and convergent thinking: https://digital.gov/guides/hcd/design-operations/thinking/ (weight 0.857)
2. LearnLeanSigma, SCAMPER prompts (weak backing): https://www.learnleansigma.com/guides/scamper-creative-thinking/ (weight 0.448)
3. IMD, SCAMPER design thinking technique (weak backing): https://www.imd.org/blog/innovation/scamper-method-design-thinking/ (weight 0.379)
4. Methodfield, SCAMPER practical guide (weak backing): https://methodfield.com/en/tools/scamper (weight 0.398)
5. IXCoach, SCAMPER prompts for divergent thinking (weak backing): https://www.ixcoach.com/practices/divergent-thinking/scamper-prompts (weight 0.348)
6. Emerge Creatives, idea scoring matrix (weak backing): https://www.emerge-creatives.com/post/idea-scoring-matrix-the-ultimate-guide-to-evaluating-and-prioritising-ideas (weight 0.208)
7. Qmarkets, idea matrix (weak backing): https://qmarkets.net/resources/article/idea-matrix/ (weight 0.173)
8. Ducalis, prioritization frameworks (weak backing): https://hello.ducalis.io/prioritization-frameworks/all-prioritization-templates (weight 0.178)
9. LibreTexts Engineering, evaluate trade-offs (weak backing): https://eng.libretexts.org/Bookshelves/Introductory_Engineering (weight 0.277)
10. ProductPlan, RICE scoring model (weak backing): https://www.productplan.com/glossary/rice-scoring-model (weight 0.447)
11. GeeksforGeeks, RICE scoring model (weak backing): https://www.geeksforgeeks.org/product-management/rice-scoring-model/ (weight 0.260)
