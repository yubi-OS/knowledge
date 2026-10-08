# 06 The Deep-Research Hook: Parallel Subagents as Cycle Intake

Scope: the per-cycle deep-research intake: the 3 parallel subagent streams, the skill-load directive, coverage computation on subagent outputs, the write-through push to refs/, and what external practice says about parallel research agents. Source doc: yubi-OS/yubiOS skills/repo-refs-skill/SKILL.md.

## The protocol

Per cycle the skill accepts a topic string and dispatches 3 to N parallel subagents per parallel-deep-research (source doc, "The Deep-Research Hook"):

1. Stream 1: subject deep-dive, the topic's mechanism in the repo context.
2. Stream 2: prior art, how others handle the same topic.
3. Stream 3: comparative survey, what the repo's neighbor repos do.

Each subagent prompt begins with the standard skill-load directive: read these skills first, in this order, 1) using-agent-skills, 2) token-efficiency, 3) context-isolation, 4) repo-refs-skill. Subagents return to session/subagent-<id>/<topic>-YYYY-MM-DD.md. The skill then reads each output, computes its 9-D primitive coverage, and adds it to corpus_as_deep_research, a 5th sub-corpus representing fresh additions. It re-fits the curve with the new items in place; sparse-cell detection finds deep-research items whose coverage is structurally unique; the synthesized output is pushed to yubi-OS/yubiOS refs/<topic>-YYYY-MM-DD.md, the canonical landing zone per parallel-deep-research.

## Write-through, not session-only

Key assumption 8 in the source doc: subagent outputs are write-through to refs/. Per parallel-deep-research and PROJECT_RULES.md line 38, session/ outputs do not survive the session, so subagent prompts must end with "your final synthesized output will be pushed to the repo, write it as if it's the final artifact". Pushing deep-research output to session/ only is an explicit anti-pattern.

## External grounding (weak, per jev noul)

The dig targeted parallel LLM subagent research practice. All results weighted below 0.5 and are reported as weak backing:

- Anthropic's engineering write-up on its multi-agent research system describes the same shape: subagents operate in parallel with their own context windows, exploring different aspects of the question simultaneously before condensing the most important tokens for the lead agent (weight 0.06, weak, anthropic.com/engineering/multi-agent-research-system).
- DataSTORM frames deep research with LLM agents as a paradigm for multi-step information discovery and synthesis (weight 0.05, weak, arxiv.org/abs/2604.06474).
- A latent-space synthesis paper reports parallel-branch synthesis matching or outperforming text-based synthesis on 7 of 9 downstream datasets (weight 0.05, weak, arxiv.org/abs/2606.14672); treat as weak.
- Dynamic subagent patterns (triage / batch / high-confidence / generate-and-filter) with subagent output returned to the parent through code rather than tokens (weight 0.04, weak, sparsenotes.com/posts/2026/07/dynamic-subagents-deep-agents/).
- Surveys of LLM-based multi-agent systems cover architecture, coordination, and workflow structure (weights 0.05 and 0.06, weak, researchgate.net/publication/395128299 and researchgate.net/publication/384732283).

These corroborate that the 3-stream shape (mechanism, prior art, comparative survey) is a recognized decomposition, but no dig result carries authoritative weight; the protocol itself is grounded in the source doc.

## Why the hook fits the corpus

The observed refs/ corpus is wide but shallow (129 files, median about 8 KB, per the source doc). Sparse cells are the cycle's priority queue: a cell is either a missing topic (the doc should exist but does not; dispatch a fill) or a structurally novel doc (genuinely new ground; flag for user review). The deep-research hook is the mechanism that turns a sparse cell into a new refs/ doc. The doc's worked use case: a "deep research: misbehavior-cutoff PCI-mediation" cycle fires (the OMN-144 to OMN-147 cluster per PROJECT_RULES.md line 95); the skill refreshes the archive, dispatches 3 parallel streams, fits the curve on the augmented corpus, and reports which deep-research findings sit in sparse cells as priority items for follow-up cycles.

## Guardrails on the dispatch

Three source-doc rules constrain the hook. First, naming: subagent-proposed doc names must follow lowercase-hyphenated-topic-name-YYYY-MM-DD.md and be renamed before push if not. Second, redundancy: a red flag fires when a deep-research topic produces no new sparse cell, meaning the synthesized output was redundant with existing refs/ docs; either drop the dispatch or dispatch under a more specific sub-topic. Third, verification: a deep-research cycle checklist requires 3 to N parallel subagents actually dispatched with outputs landed in session/subagent-<id>/, and the synthesized output pushed to refs/<topic>-YYYY-MM-DD.md.

## Relationship to refresh

Mode C runs the refresh first (Mode A or B), because the augmented fit is only meaningful against a current archive. The augmented corpus adds corpus_as_deep_research items alongside corpus_as_ref; the re-fit then reports whether the new items cluster or isolate, which is what makes the next cycle's prioritization lens honest.
