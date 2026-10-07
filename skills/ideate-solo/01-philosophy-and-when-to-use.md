# 01 Philosophy and When to Use

Grounding spine: yubi-OS/yubiOS `skills/ideate-solo/SKILL.md` (source doc). All source-doc claims below are attributed to it; external claims carry their dig URL and jev weight.

## Scope

Why solo ideation exists: it is the autonomous variant of idea-refine, run when no live human is available. This doc covers the philosophy and the use / do-not-use boundaries.

## The philosophy: same process, no human anchor

The source doc states the core premise plainly: idea-refine requires a live, articulate human, and most agent runs (scheduled jobs, autonomous loops, ideation for someone else) do not have one. Ideate-solo is the same divergent-then-convergent process driven by the agent itself: the agent generates variations against internal lenses, scores them against built-in heuristics, picks the strongest, and produces the same one-pager shape as idea-refine, so downstream skills compose unchanged.

"Autonomous" in this context means self-governing: having the right or power of self-government, independent decision making without external direction (Merriam-Webster, https://www.merriam-webster.com/dictionary/autonomous, jev weight 0.58, strong backing; Cambridge Dictionary, https://dictionary.cambridge.org/dictionary/english/autonomous, weight 0.41, weak backing).

The divergent-then-convergent shape is not invented here. Design thinking places techniques like SCAMPER in the divergent stage of creativity, before the final converging part of ideation (Designorate, https://www.designorate.com/scamper-technique-examples-and-applications/, weight 0.21, weak backing). SCAMPER's stated benefit of delaying convergence, exploring multiple possibilities before evaluation begins, is exactly the shape ideate-solo encodes as generate-then-score (IMD, https://www.imd.org/blog/innovation/scamper-method-design-thinking/, weight 0.34, weak backing; SixSigma.us, https://www.6sigma.us/lean-tools/scamper-technique/, weight 0.23, weak backing).

## When to use

The source doc lists five trigger conditions. Use ideate-solo when:

1. The agent runs in a non-interactive context: a scheduled task, an autonomous loop, CI, or a subagent.
2. The idea is being ideated for someone not in the room: a customer, a team, a user.
3. The agent wants a second angle after a human dialogue has already produced one.
4. The user explicitly asks for solo ideation ("ideate alone", "ideate without me", "ideate by yourself").
5. The user wants a different lens than their own, a generator not anchored to their assumptions.

## When NOT to use

Three exclusions, per the source doc:

- A real human is available and engaged. Use idea-refine instead; the dialogue is higher quality because the human catches blind spots. The source doc is explicit that solo ideation must never be treated as equivalent to dialogue ideation.
- The intent is unclear. Run interview-me first. Ideation on unclear intent produces variations of noise.
- The idea is trivial enough that 5 to 8 variations would be theatre. Use prior-art-search plus idea-kill as the cheaper combo.

## The honest-position framing

The philosophy accepts a trade rather than claiming parity: solo ideation is faster and works when no human is available, but it is lower quality than dialogue because there is no human to catch blind spots. That is why the output is required to carry a generation log (for later review by a human) and why the downstream verdict step is delegated to idea-kill rather than claimed by the skill itself. The skill produces a hypothesis; it does not claim to produce a validated idea.

## Related reading

- 02-process-pipeline.md: the 7 steps this philosophy drives.
- 08-skill-composition-and-constraints.md: the boundaries with idea-refine, interview-me, and idea-kill.
