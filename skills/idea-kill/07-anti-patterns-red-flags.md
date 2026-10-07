# 07 - Anti-patterns and red flags

Scope: the failure modes of a bad kill review, the psychological mechanisms behind them, and the red-flag checklist the source doc ships for self-detection.

## The anti-patterns (source doc)

The source doc names six anti-patterns. Hedging: "it's interesting but I'm not sure" is not a verdict; pick one of the four. Polite-yes verdict: producing SHIP because the user wants to proceed; the verdict must reflect the evidence, not the user's preference. Reason counts: listing reasons to keep the idea alongside reasons to kill it; the reasons section justifies the verdict, and if reasons point both ways the verdict is REVISE with specific revisions named. Vibes in reasons: "I just feel like it won't work" is not a reason; the structural reason behind the feeling is the reason. Skipping resurrection triggers: even KILL verdicts benefit from triggers; without them the verdict is throwaway. Un-named revision: REVISE without a specific revision is PAUSE with extra steps (source doc).

## Motivated reasoning: the mechanism behind the polite-yes and sunk-cost verdicts

The psychological root of most of these anti-patterns is motivated reasoning: the well-documented tendency to reason toward a preferred conclusion rather than from the evidence, recruiting reasoning ability in the service of a desired outcome (https://en.wikipedia.org/wiki/Motivated_reasoning, weight 0.76). Reference treatments describe the same mechanism and its everyday operation in evaluation contexts: people assess evidence more favorably when it supports what they already want to believe (https://www.psychologytoday.com/us/basics/motivated-reasoning, weight 0.51; https://www.sciencedirect.com/topics/psychology/motivated-reasoning, weight 0.53).

In a kill review, motivated reasoning produces exactly the source doc's polite-yes verdict and its vibe-based reasons: the reviewer holds the conclusion (I want this idea to live) and works backward, discounting structural objections and inflating encouraging ones. The skill's defenses are procedural, not attitudinal: reasons must cite observations from the steelman and cascade steps, and the verdict must be consistent with the reasons it lists.

## Groupthink: the mechanism at the team scale

Where the review is a team activity, the polite-yes failure scales into groupthink: the mode of thinking where group cohesion overrides realistic evaluation, with classic symptoms including illusions of unanimity, self-censorship of doubts, and pressure on dissenters (https://en.wikipedia.org/wiki/Groupthink, weight 0.71). Recent experimental work on groupthink's mechanisms finds that closed-mindedness and insulation from outside criticism are central drivers of the effect (https://link.springer.com/article/10.1007/s42001-020-00083-8, weight 0.66). Work on conversational agents and critical thinking adds a modern wrinkle: agreeable AI assistants can suppress the critical challenge that produces better group decisions, which is the same polite-yes dynamic with a new actor (https://dl.acm.org/doi/10.1145/3706599.3719792, weight 0.64).

The source doc's design answers groupthink structurally: the steelman step assigns the strongest opposition to the reviewer by requirement, the way a premortem assigns doubt to every participant, so disagreement does not depend on anyone's willingness to volunteer it.

## The red flags (source doc)

The source doc ships a red-flag list for detecting a degraded verdict after the fact:

1. The verdict is "maybe" or "interesting but" rather than one of the four.
2. The reasons section has fewer than 3 entries.
3. Reasons cite vibes instead of observations.
4. A KILL verdict without resurrection triggers.
5. A REVISE verdict without a named revision.
6. A SHIP verdict on an un-testable bet.
7. The verdict contradicts the reasons, for example a KILL whose reasons all favor continuing.
8. Re-running the skill on the same idea with the same evidence to get a different verdict, which the source doc calls shopping for the answer you want rather than iteration (source doc).

The last red flag deserves note because it defines the skill's relation to iteration: the verdict is one pass over a given evidence set. New evidence legitimately changes verdicts; the same evidence run again hoping for a different answer does not (source doc, Loading Constraints).

## Self-detection checklist

The verification section of the source doc turns the anti-patterns into a pre-flight checklist applied to every produced verdict: idea loaded fully, bet named in one sentence, strongest (not easiest) critique produced, both directions of second-order effects surfaced, un-testable bet identified or explicitly noted as testable, verdict in the four-word vocabulary, 3 to 5 concrete reasons, triggers named, output saved with the verdict clearly visible (source doc). A verdict that passes the checklist is structurally incapable of the six anti-patterns above, which is the point of shipping a checklist rather than a caution.
