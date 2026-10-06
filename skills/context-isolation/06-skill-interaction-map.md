# 06 - Interaction with other skills

Scope: how the context-isolation skill positions itself against the 6 skills it names in its Interaction with Other Skills section. Internal-record subtopic: grounded entirely in the source doc, no external dig performed.

## Why this is an internal-record subtopic

This doc explicates the source doc's own Interaction with Other Skills section (source doc: yubi-OS/yubiOS skills/context-isolation/SKILL.md). Every pairing below is recorded in that section verbatim in substance; no searXNG dig was run because the claims are about yubiOS skill composition, which is an internal record, and the source doc is the primary and only authority on its own boundaries. Per the mint variant rule, internal-record subtopics cite the source doc and skip the dig.

## The 6 pairings

- token-efficiency: adjacent, always-on pair. token-efficiency minimizes cost (tokens per signal); context-isolation minimizes contamination (irrelevant reasoning leaking into relevant decisions). Compose: apply token-efficiency to keep the unit of work small, then context-isolation to decide where that unit lives. The subagent prompt load-order already pairs them (source doc). The distinction matters for this corpus: doc 01's failure modes are contamination failures, not cost failures, which is why trimming tokens alone does not fix context rot.
- negative-skill-space: primary pair. NSS maps an artifact's gaps; context-isolation runs that mapping in a fresh-context subagent so the mapper does not carry the artifact author's blind spots. When NSS produces actionable Extend gaps for a skill, isolate the editing cycle before closing them, and add negative-skill-space to the subagent load-order (source doc). This is doc 05's fresh-context rule applied to gap mapping.
- doubt-driven-development: orthogonal. DDD doubts a specific decision with a fresh-context reviewer; context-isolation is the boundary that makes DDD's fresh context possible. The source doc notes the self-mode of recursive-self-improvement requires both (source doc).
- recursive-self-improvement: downstream consumer. RSI's self-mode cycles (improving a skill the agent itself authored) require context-isolation for every cycle, not just cycle 1, to avoid re-introducing author bias; apply this skill at the start of every RSI self-mode cycle (source doc). The changelog in the source doc shows this discipline in action: each cycle's edits were validated against re-mapping, not author memory.
- using-agent-skills: upstream. If context-isolation is consistently not applied where it should be, that is a workflow-position problem (the skill is not surfaced in using-agent-skills discovery), not a body-edit problem; hand off to a using-agent-skills review rather than another RSI cycle (source doc). This is a routing rule for where fixes go, and it guards against the anti-pattern of editing skill bodies to solve discovery failures.
- code-review-and-quality: downstream. After a subagent has done isolated verification, the result still flows through normal review before merge; context-isolation is upstream of review, and review is downstream (source doc). Isolated verification produces the input to review; it does not replace it.

## Reading the map as a pipeline

Arranged by position, the map reads as a pipeline: using-agent-skills (discovery, upstream) feeds context-isolation (boundary), which composes with token-efficiency (cost) and enables doubt-driven-development and negative-skill-space (fresh-context verification and gap mapping, both consuming the boundary), whose outputs feed code-review-and-quality (downstream review), with recursive-self-improvement cycling back over the whole corpus using the same boundary each cycle. Every arrow in that pipeline is stated in the source doc; nothing here is inferred beyond it.

## Changelog context from the source doc

The source doc's own changelog records the origin of this section: the 2026-07-29 cycle 1 RSI edit added Interaction with Other Skills because the skill lacked it while downstream skills (negative-skill-space, doubt-driven-development, recursive-self-improvement, code-review-and-quality) already pointed at it, creating an asymmetry. The cycle's re-map found no new substantive gaps and fixpoint was reached (source doc, changelog entry dated 2026-07-29). A later entry notes cycle 5 (2026-08-06) closed a trust-chain primitive gap corpus-wide (source doc). These are internal-record facts about the skill's maintenance history, cited here without weighting because their source is the skill itself.
