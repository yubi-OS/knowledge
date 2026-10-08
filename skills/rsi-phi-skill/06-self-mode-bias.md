# 06 Self-mode and author bias

Scope: running the loop on the skill itself, why self-author bias is the dominant failure mode, and the three mandatory mitigations.

## What self-mode is

The source doc (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/rsi-phi-skill/SKILL.md) defines two modes. Improvement mode (default) takes a Fibonacci-sphere coverage of any external corpus: skill files, refs/*.md, or a deep-research output set; cycle 1 closes gaps and later cycles catch edit-induced gaps. Self-mode takes the skill itself as input: cycle 1 gap-maps rsi-phi-skill with negative-skill-space, and cycle 2 onward closes gaps on the self-references the gap-map surfaces (source doc).

## The bias problem

Self-mode is more prone to self-author bias because the entity that wrote the skill is the entity reviewing it (source doc). The source doc states three mitigations, all mandatory in self-mode:

1. Pass each edit hypothesis through doubt-driven-development before editing (source doc).
2. Use a fresh-context subagent (context-isolation) for EVERY cycle in self-mode, not just the gap-map step; cycle 2+ in main-thread context re-introduces the author bias that cycle 1 mitigated (source doc).
3. If the re-map keeps disagreeing with the author's intuition, that is the signal the author is wrong, not the map (source doc).

## External grounding on self-review bias

The external literature on self-correction is relevant but weakly weighted in this corpus's digs. An arXiv survey on bias in large language models covers origin, evaluation, and mitigation of model bias (https://arxiv.org/html/2411.10915v1, weak, w=0.17), which grounds the general claim that a model's self-assessments inherit its biases. A practitioner glossary describes bias self-scan as a self-correction instruction directing a model to audit its own generated text for implicit biases (https://inferensys.com/glossary/context-engineering-and-prompt-architecture/self-correction-patterns, weak, w=0.10). A research-note post titled Our AI Critic Was Going Easy on Us reports that an LLM critic softened its judgments of work it had a stake in (https://dev.to/theskillsteam/our-ai-critic-was-going-easy-on-us-research-told-us, weak, w=0.05), an anecdotal version of the author-bias problem. On the structural fix, a guide to subagents and context isolation describes subagents as a standard feature of coding and research agents with growing support for per-subagent tools (https://aiunderstanding.org/learn/subagents-and-context-isolation, weak, w=0.12), and a developer post argues for saving main-thread context to raise quality and cut cost (https://dev.to/uehara/save-your-main-context-to-raise-quality-and-cut-cost-building-context-isolated-agents, weak, w=0.06).

Every one of these is below the 0.5 weight bar, and the dig for this subtopic was thin enough to need a redo (logged in the dig record). The three mitigations therefore stand on the source doc alone; the external sources corroborate the general direction only.

## Why fresh context per cycle is mandatory

The source doc draws the line precisely: a fresh-context subagent for the gap-map step is not enough. Cycle 2 onward in main-thread context re-introduces author bias because the main thread carries the author's own reasoning from earlier cycles (source doc). This is the strongest claim in the doc about loop hygiene, and it is the one the sibling skill recursive-self-improvement only applies at the gap-map step; rsi-phi-skill tightens it to every cycle in self-mode (source doc).

## Interaction with sibling skills

The source doc names the interaction set: negative-skill-space starts cycle 1, parallel-deep-research runs the per-cycle hypothesis step, doubt-driven-development is the per-hypothesis supplement in self-mode, and context-isolation supplies the fresh-context subagent requirement (source doc). Single-action-curve-rsi can supply the atomic per-cycle edit when the corpus is a single file (source doc).
