# 04 Scoring Heuristics

Grounding spine: yubi-OS/yubiOS `skills/ideate-solo/SKILL.md` (source doc).

## Scope

The four scoring heuristics: painkiller vs vitamin, switching cost, defensibility, and testability. Score 1 to 5 on each, sum to a 4 to 20 total, rank all variations, drop anything below 8.

## The four heuristics as the source doc defines them

1. **Painkiller vs vitamin.** Does it solve a real, frequent pain (5), or is it a nice-to-have (1)? Hard pain scores high.
2. **Switching cost from current solution.** Can users adopt easily (5), or does adoption require ripping out an entrenched alternative (1)? Low switching cost scores high.
3. **Defensibility.** Is this easily copied (1), or does it have a moat: network effects, data, brand, integration depth (5)? High defensibility scores high.
4. **Testability.** Can the core bet be tested cheaply (5), or does it require massive upfront investment (1)? High testability scores high.

Scores are summed to a 4 to 20 range, variations are ranked, and any variation below 8 is dropped. Per the source doc's anti-patterns, a score is a hypothesis, not a fact: any score above 4 or below 2 on a single heuristic requires a one-sentence justification.

## External grounding for each heuristic

**Painkiller vs vitamin** is an established startup framing: the vitamin versus painkiller framework tests whether a product solves an urgent customer problem or offers a nice-to-have with weak demand (1752 VC, https://www.1752.vc/blog-vitamin-vs-painkiller, jev weight 0.14, weak backing). Practitioners note the dichotomy is a strategic litmus test for roadmapping, not a verdict on product worth: vitamins and painkillers need different market-entry strategies, product architectures, and success metrics (Rationality, https://www.rationality.in/p/painkillers-vs-vitamins-choosing, weight 0.20, weak backing; a dissenting view argues the analogy can mislead when habit formation substitutes for urgency, Rahul Rumalla, https://rahulrumalla.substack.com/p/the-fallacy-of-vitamins-vs-painkillers, weight 0.19, weak backing). Ideate-solo uses it exactly as a scoring axis, which is the framework's intended use.

**Switching cost** appears in the dig set as one of the recognized moat archetypes. A moat-analysis framing asks "what stops a competitor from shipping this in three months?" and enumerates seven archetypes: scale, network effects, switching costs, brand, regulatory, embeddedness, and more (SuperPM, https://www.superpm.app/en/prompt/128, weight 0.09, weak backing). Note the drift: in the source doc switching cost is scored from the adopter's side (cost to the user of leaving the incumbent), while the moat literature treats switching costs as the incumbent's defense. Both readings point the same direction for an early-stage idea: high adoption friction is a negative signal.

**Defensibility** is the moat lens: the moat or defensibility lens asks one question about a position or product: what stops a competent competitor from copying you and competing the advantage away (Thinking Framework Skills, https://thinking-framework-skills.productonpurpose.com/library/moat-defensibility-lens/, weight 0.21, weak backing). The source doc's examples (network effects, data, brand, integration depth) match the standard archetype list above.

**Testability** is the lean-MVP principle applied at scoring time: the smallest product that tests your riskiest assumption with real users is the canonical MVP definition (Nextolive, https://nextolive.com/free-tools/mvp-requirements-template/, weight 0.14, weak backing). A variation whose core bet can be probed cheaply scores 5; one that requires massive upfront investment scores 1. Testability is also the tiebreaker at convergence (05-stress-test-and-convergence.md).

## The composite score and threshold

Multi-criteria scoring models are standard practice in idea evaluation: published frameworks score ideas across market, audience, competition, cost, revenue, scalability, defensibility, risk, execution, and trend axes (Brainstormed, https://brainstormed.com/idea-validation-framework, weight 0.19, weak backing), and data-driven multi-dimension scoring models are marketed as reducing validation failure rates (UnbuiltLab, https://unbuiltlab.com/blog/startup-idea-validation-framework-data-driven-scoring-model.html, weight 0.35, weak backing). Ideate-solo deliberately uses 4 axes instead of 10 and a fixed sum threshold of 8 rather than a weighted model: the point is to force ranking, not to pretend at precision.

## Why scoring is mandatory

The source doc lists "skipping scoring" as an anti-pattern: without it, you are picking whichever variation you wrote last. Scoring converts the generation log into a ranked, auditable artifact, which is what lets a later human review (or an idea-kill run) reconstruct why the winner won.

## Related reading

- 03-five-lenses.md: the variations being scored.
- 05-stress-test-and-convergence.md: what happens to the survivors.
- 07-anti-patterns-and-red-flags.md: the confident-scoring failure mode.
