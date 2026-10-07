# 07 Anti-Patterns and Red Flags

Grounding spine: yubi-OS/yubiOS `skills/ideate-solo/SKILL.md` (source doc).

## Scope

The seven anti-patterns, the red-flag list, and the post-run verification checklist, with the external research that explains each failure mode.

## The anti-patterns

Per the source doc:

1. **Yes-machining the first variation.** The first lens applied often produces a familiar result. Force at least 2 lenses you would not normally reach for.
2. **Generating 20+ variations.** Quality over quantity: 5 to 8 well-considered variations beat 20 shallow ones. Drop below-threshold scores.
3. **Skipping scoring.** Without scoring, you are picking whichever variation you wrote last.
4. **Confident scoring without evidence.** A score is a hypothesis, not a fact. Any score above 4 or below 2 needs one sentence of justification.
5. **Skipping the stress-test.** The finalist's un-testable bet is the most important finding; skipping it produces a one-pager that looks strong but is not.
6. **Producing a one-pager without assumptions.** No assumptions means no idea.
7. **Treating solo ideation as equivalent to dialogue ideation.** Dialogue catches blind spots a solo run cannot; do not pretend they are the same.

## The named biases behind them

**Yes-machining and anchoring.** Brainstorming-failure research names the mechanisms: anchoring (the first idea constrains everything after it), production blocking, evaluation apprehension, and social loafing (Brainstormer, https://brainstormer.ai/blog/why-group-brainstorming-fails, jev weight 0.19, weak backing). Facilitation literature adds groupthink and premature closure as the classic killers of option quality (Edge of Possible, https://edgeofpossible.com/group-brainstorming-failure-problem-solving/, weight 0.21, weak backing; Navigator Collective, https://navigatorcollective.com/blog/dont-let-bias-hijack-your-brainstorms, weight 0.18, weak backing). Solo ideation has no group dynamics, but it keeps the anchoring risk: the agent's first variation is its most conventional one, which is exactly why the source doc forces at least 2 uncomfortable lenses.

One drift note: the research picture on group vs individual brainstorming is not one-sided. One review reports that when group brainstorming occurs online, outcomes beat individual brainstorming, with larger groups doing increasingly better (Psychology Today, https://www.psychologytoday.com/us/blog/progress-notes/202211/why-brainstorming-is-worthless-and-groupthink-is-dangerous, weight 0.34, weak backing). The source doc's position (dialogue is higher quality than solo) is a practical stance for agentic workflows, not a settled empirical claim.

**Confident scoring and confirmation bias.** Confirmation bias is the tendency to search for, interpret, favor, and recall information in a way that confirms prior beliefs (Wikipedia, https://en.wikipedia.org/wiki/Confirmation_bias, weight 0.48, weak-to-moderate backing). In idea evaluation it manifests as overemphasis on positive feedback for an idea that has gained a champion, and downplaying of negatives (Innovation-Creativity, https://innovation-creativity.com/confirmation-bias-in-idea-generation/, weight 0.17, weak backing). Academic work ties confirmation bias directly to innovation decision-making failures (ResearchGate, https://www.researchgate.net/publication/362299170_Confirmation_Bias_in_Innovation_Decision-Making, weight 0.39, weak backing). Requiring a justification sentence for outlier scores is the countermeasure: it forces the scorer to externalize evidence instead of feeling confidence.

**Over-generation.** Generating 20+ variations looks like diligence but produces shallow options that overwhelm the scoring stage, and the funnel's threshold rule then does the real selection arbitrarily. The 5 to 8 bound keeps each variation genuinely considered.

## The red flags

Per the source doc: over-generation (20+), picking the first variation without scoring, a one-pager without the generation log, confident scores above 4 or below 2 without justification, a one-pager with no Key Assumptions section, skipping the finalist stress-test, skipping the scope-class check (using 5 to 8 variations on a trivial idea), and a one-pager that looks identical to idea-refine's output with no `[SOLO]` marker.

## The verification checklist

After applying the skill, the source doc requires confirming: the raw idea was restated as a one-sentence problem statement; the scope class was checked; 5 to 8 variations were generated across the 5 lenses (or scaled to scope class); each variation was scored on the 4 heuristics with justification for outliers; below-threshold variations were dropped; the top 2 to 3 finalists were stress-tested; the strongest direction was converged on; the one-pager contains all seven sections; and the filename carries the `-solo` suffix.

## Related reading

- 04-scoring-heuristics.md: the scoring that must not be skipped.
- 05-stress-test-and-convergence.md: the stress-test that must not be skipped.
- 06-one-pager-output.md: the artifact these rules protect.
