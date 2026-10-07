# 02 Process Pipeline

Grounding spine: yubi-OS/yubiOS `skills/ideate-solo/SKILL.md` (source doc).

## Scope

The 7-step process: load the raw idea, check the scope class, generate variations, score, stress-test finalists, converge, and produce the one-pager.

## The pipeline, step by step

Per the source doc, the process is a fixed sequence:

1. **Load the raw idea.** Restate it as a one-sentence problem statement. If that sentence cannot be written, the intent is unclear and the run escalates: use interview-me or surface to the user.
2. **Check the scope class.** A systemic idea (policy, platform, architecture) gets 5 to 8 variations across all five lenses. An atomic idea (one-line feature, bug fix) gets 2 to 3 variations from the Simplification lens only. The default 5 to 8 is calibrated for product-shaped ideas of medium scope.
3. **Generate 5 to 8 variations** across five autonomous lenses, applying each lens independently and never blending lenses inside a single variation. Each variation gets a name, a one-sentence description, and the lens it came from.
4. **Score each variation** on four heuristics, 1 to 5 each, summed to a 4 to 20 score, ranked, with anything below 8 dropped.
5. **Stress-test the top 2 to 3 finalists**: strongest steelmanned critique, second-order effects, and the un-testable bet. A finalist whose un-testable bet is large enough to kill the idea becomes an idea-kill candidate.
6. **Converge on one winning direction.** On a tie, prefer the more testable variation because it is cheaper to fail.
7. **Produce the one-pager** in the idea-refine format, saved to `docs/ideas/[idea-name]-solo-YYYY-MM-DD.md`.

## The divergent-convergent lineage

The pipeline is a single divergence-convergence cycle. The Double Diamond design process model, popularized by the British Design Council in 2005, was adapted from the divergence-convergence model proposed in 1996 by Bela H. Banathy (Wikipedia, https://en.wikipedia.org/wiki/Double_Diamond_(design_process_model), jev weight 0.42, weak backing). The model deliberately alternates between divergent work (making the space of options) and convergent work (choosing) (Umbrex, https://umbrex.com/resources/frameworks/strategy-frameworks/design-thinking-double-diamond/, weight 0.23, weak backing; Design Thinker Labs, https://designthinkerlabs.com/guides/double-diamond-framework, weight 0.18, weak backing). Ideate-solo compresses this into one diamond: steps 3 is the divergent half, steps 4 to 6 are the convergent half.

## The scoring funnel

Step 4's drop-below-8 rule makes the pipeline a gated funnel. Structured idea funnels work the same way at organizational scale: defined stages, phase-gate decision points, and evaluation criteria that filter many ideas down to a few (ITONICS, https://www.itonics-innovation.com/blog/idea-funnel, weight 0.24, weak backing; InnovationCast, https://innovationcast.com/blog/innovation-funnel, weight 0.14, weak backing). The idea evaluation process is a systematic approach to analyzing and prioritizing ideas on feasibility, potential impact, and alignment (Qmarkets, https://qmarkets.net/resources/article/idea-evaluation-process/, weight 0.18, weak backing). In ideate-solo the four heuristics (04-scoring-heuristics.md) are those criteria, and the threshold is fixed at 8 of 20 rather than adjusted per run.

## Why the escalation gate comes first

Step 1 is the only step that can abort the run. This matches the source doc's rule that ideation on unclear intent produces variations of noise: the pipeline refuses to spend generation effort on an unstated problem. The one-sentence problem statement also becomes the "Problem Statement" field of the final one-pager, so the gate output is reused rather than discarded.

## Scope-class scaling

The scope-class check is what keeps the pipeline honest on small ideas. Generating 20 or more variations is listed as an anti-pattern and a red flag in the source doc (over-generation; quality over quantity). An atomic idea gets 2 to 3 Simplification-lens variations precisely so the funnel is not larger than the idea.

## Related reading

- 03-five-lenses.md: the generation half of the pipeline.
- 04-scoring-heuristics.md: the scoring half.
- 05-stress-test-and-convergence.md: steps 5 and 6.
