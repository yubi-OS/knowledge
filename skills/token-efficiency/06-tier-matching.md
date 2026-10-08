# 06 - Match Tool and Model Tier to Task Size

Scope: reserve expensive tools and model tiers for tasks that need them, and the routing vocabulary (routing versus cascading) that formalizes the habit.

## The practice

The source doc (yubi-OS/yubiOS `skills/token-efficiency/SKILL.md`, Core practices 8) states: a one-line fact lookup does not need deep research effort; a menial, well-defined subagent task does not need the smartest available model tier; reserve the expensive tools and tiers for tasks that actually need the extra capability (source doc). The verification checklist makes it auditable: a fact lookup did not trigger a deep-research pass, and a menial subagent task did not take the smartest tier (source doc, Verification).

This is the only core practice whose waste is a wrong tool choice rather than a wrong token flow. The other practices optimize what happens inside a call; this one optimizes which call is made at all.

## The formal vocabulary: routing and cascading

The dig surfaced the production-systems framing for the same idea (https://shuji-bonji.github.io/ai-agent-architecture/strategy/routing-vs-cascading, jev weight 0.52): two strategies for spending the least money or compute per query across a fleet of models. Routing decides the model before generation; cascading tries cheap first and escalates on low quality; both sit in the FrugalGPT and RouteLLM lineage, and the strategy maps onto local plus cloud tiers (jev weight 0.52). The source doc's single-sentence habit is the agent-session special case of this fleet-level design space: the agent is its own router, and the "cheap model" tier is whatever the platform offers as the fast or small option.

A cost-focused engineering post (https://interviewnode.com/post/how-ai-engineers-are-designing-systems-for-billions-of-inferences-per-day, jev weight 0.50) observes that once a model enters production, training becomes only a small part of its lifecycle while inference becomes continuous: every interaction processes new inputs (jev weight 0.50). The relevance is the denominator: because inference is continuous, a per-call tier mismatch compounds across every call in a session rather than being a one-time loss.

A multi-model routing article (https://deploycue.com/blog/multi-model-routing-inference/, jev weight 0.42, weak backing) describes sending easy prompts to cheap models and hard prompts to capable ones, lowering average inference cost while protecting answer quality (jev weight 0.42, weak). Weak per the weighting pass; consistent with the above.

## Why the cheapest tier is not always the answer

The source doc's rule is matched tier, not minimum tier. Two failure directions exist:

1. **Over-tiering.** A deep-research pass on a question with a single, already-known answer is a named anti-pattern in the source doc (source doc, Anti-patterns). The cost is direct tokens and latency.
2. **Under-tiering, the mirror red flag.** The source doc's Red Flags warn that "minimize tokens" must not become a license to lose correctness; aggressive summarization or a too-small model that drops fields needed downstream is over-efficiency, caught by verification skills later at a higher total cost (source doc, Red Flags).

The cascading strategy formalizes the escape hatch: start cheap, escalate on a quality signal. In agent-session terms, draft with the fast tier, then re-run the step on the stronger tier only when verification flags a failure. That keeps the average cost low without hard-coding any step to the expensive tier.

## Operational rules

1. Classify the task before choosing the tier: fact lookup, well-defined menial subtask, or genuinely hard reasoning (source doc, Core practices 8).
2. Fact lookups take the fast path; deep research passes are reserved for questions whose answer is not already known or retrievable in one hop (source doc, Anti-patterns).
3. Subagent work that is well-defined takes a smaller model; the smartest tier is reserved for tasks needing it (source doc, Core practices 8).
4. When unsure, prefer cascade over default-up: try the cheap tier, check the result against the source doc's verification discipline, escalate on failure (adapted from https://shuji-bonji.github.io/ai-agent-architecture/strategy/routing-vs-cascading, jev weight 0.52).
5. Remember the compounding: every mis-tiered call repeats across the session's call volume (adapted from https://interviewnode.com/post/how-ai-engineers-are-designing-systems-for-billions-of-inferences-per-day, jev weight 0.50).

## Sources

- Source doc: yubi-OS/yubiOS `skills/token-efficiency/SKILL.md` (Core practices 8, Anti-patterns, Red Flags, Verification).
- https://shuji-bonji.github.io/ai-agent-architecture/strategy/routing-vs-cascading (jev weight 0.52).
- https://interviewnode.com/post/how-ai-engineers-are-designing-systems-for-billions-of-inferences-per-day (jev weight 0.50).
- https://deploycue.com/blog/multi-model-routing-inference/ (jev weight 0.42, weak).
