# 01 - The bounded RSI loop

Scope: the loop discipline that curve-guided-rsi drives at the corpus level: hypothesis per cycle, the fixpoint stopping rule, the 3-cycle default cap, and the fresh-context subagent requirement that keeps the loop honest.

The curve-guided-rsi skill is, at its core, a bounded recursive self-improvement loop run against a corpus of skill files. Its frontmatter states the contract in one line: recursive self-improvement driven by negative-skill-space gap-mapping and hypersphere curve-fitting on the SKILL.md corpus, with a hypothesis per cycle, a fixpoint rule, a 3-cycle default cap, and a fresh-context subagent per cycle to avoid author bias (source doc: yubi-OS/yubiOS skills/curve-guided-rsi/SKILL.md).

## Why bound the loop

Recursive self-improvement, in the general sense of a system improving itself using its own outputs, is a recognized category of AI research; the term carries well-documented concerns about unbounded or uncontrolled self-modification (https://en.wikipedia.org/wiki/Recursive_self-improvement, jev weight 0.59). Anthropic's own institute material on recursive self-improvement frames the risk in similar terms: capability gains that compound faster than the ability to verify them (https://www.anthropic.com/institute/recursive-self-improvement, jev weight 0.53). The source doc internalizes that concern by construction: every stage of its loop has a hard stop condition, and every cycle must leave behind an auditable record. Nothing in the loop is open-ended.

## The fixpoint rule

The stopping rule comes from the `recursive-self-improvement` skill and is restated verbatim in the source doc: stop when no new substantive gaps exist, all old gaps are closed, and no new anti-patterns have appeared (source doc). All three conditions must hold at once. A run that merely closed old gaps but introduced a new anti-pattern keeps going; a run that found no new gaps but left old ones open also keeps going. The fixpoint is the state where one more cycle would change nothing material.

In practice the skill reached this state on its own corpus: the 2026-08-06 changelog entry records that after cycle 9 the corpus was enriched from 70 to 73 skills via PR #179, closing the 17 residual sparse cells, and fixpoint was declared post-cycle-9 (source doc, Changelog).

## The 3-cycle cap

The default cap is 3 cycles per skill per curve-guided-rsi run (source doc). This matches the soft cap in `recursive-self-improvement`, and the user-override protocol is preserved: a user can raise the cap, but the default stays at 3 (source doc, Architectural Choices). The cap is not decoration. The source doc's Red Flags section says that if the cycle count exceeds 3 per gap, the gap is too deep for this skill and the correct move is to surface it to the user for a manual decision rather than keep iterating (source doc, Red Flags).

## Hypothesis per cycle

Each cycle is one edit driven by one hypothesis, not a batch of speculative changes. The changelog format makes this visible: the cycle-1 entry of the skill itself records a single hypothesis (combine the curve fitter, the gap mapper, and the edit protocol into one closed-loop pipeline with a verifiable metric), a single edit (drafting the v1 SKILL.md body), and an explicit "Single intent: ship v1" (source doc, Changelog). One hypothesis per cycle is what makes the per-cycle audit trail readable after the fact: you can always point at one change and ask whether the metric moved.

## Fresh-context subagents

Stage 3 dispatch of the gap work happens through fresh-context subagents, following the operational pattern defined by `negative-skill-space` (source doc, Interaction with Other Skills). The stated reason is to avoid author bias: the agent that maps the gaps must not be the same context that authored the file being audited, or the audit reads its own blind spots as fine. The broader pattern of isolating subagent contexts is recognized practice, though public writing on it is thin; one practitioner article describes subagents running in separate contexts precisely so their work does not pollute the parent's reasoning (https://stikastudio.com/blog/subagent-isolation, jev weight 0.13, weak backing: cite as anecdotal practice only).

## The audit trail

Every cycle appends a changelog entry to the gap candidate's SKILL.md, and that entry records the t coordinate the file occupied when the cycle ran (source doc, Architectural Choices). The t coordinate is the curve's primary key: because it persists in the changelog, a downstream consumer can verify the claim "the curve moved" by reading the t history instead of trusting the run's self-report (source doc). This is the property that makes the bounded loop verifiable rather than merely well-intentioned.
