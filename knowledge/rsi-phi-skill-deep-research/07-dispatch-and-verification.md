# 07 - Dispatch and verification: subagents for hypotheses, skeptics for results

Scope: how each RSI cycle dispatches hypothesis work to fresh-context subagents and gates the result through adversarial verification before a human-approved edit lands.

## The dispatch pattern in the skill

Each rsi-phi-skill cycle proposes its hypothesis with a parallel-deep-research subagent, dispatched with the gap-map and the parameter value t = i / N; the hypothesis is then applied to the corpus only after human approval; and doubt-driven-development acts as a per-hypothesis supplement throughout [1], weight 0.4717 (weak backing; the pipeline is the skill's own SKILL.md).

## Deep research pipelines

The pattern of a structured research pipeline with distinct phases is now standard in the agent ecosystem. Jan's write-up of its Deep Research replication describes the workflow as planning, searching, analysis, and synthesis phases [2], weight 0.5352. A survey of deep research agent architectures describes how the major systems (OpenAI Deep Research, Claude Research, Perplexity Labs, Gemini Deep Research) build agents that autonomously research for hours, with planning, parallelism, and memory as the core levers [3], weight 0.4142 (weak backing).

The specific trick rsi-phi-skill uses, fan-out to parallel subagents that each return an independent angle, appears in open implementations: a hybrid deep research pipeline combines iterative deepening with parallel subagents under a director/investigator pattern, with quality filtering before synthesis [4], weight 0.5777. An end-to-end scientific research pipeline plugin sequences problem_discovery, deep_research, hypothesis_generation, and experiment_design, with evolutionary hypothesis generation [5], weight 0.5270. A dedicated hypothesis-generation workflow built on large language models treats the generated hypothesis as the first step of research, subject to downstream validation [6], weight 0.4421 (weak backing).

## Adversarial verification

The verification half of the cycle has its own literature in the agent ecosystem. A multi-stage review system on PyPI describes adversarial verification with independent review stages that prevent phantom work, AI claiming to implement but not delivering [7], weight 0.5109. A fresh-context, diff-only adversarial review gate for GitHub pull requests runs skeptical review lenses in parallel, each a fresh agent session that sees only the diff, and a fail-closed merge gate blocks the merge until findings are addressed [8], weight 0.5151. The augmentcode guide frames the roles: a primary reviewer proposes findings, a challenger tries to disprove them, and an arbiter decides what blocks the merge [9], weight 0.2893 (weak backing).

Two weak-weight sources sharpen the rationale. Dotzlaw's pattern catalog describes the core shape: a worker produces a result and a separate subagent, with its own window and no stake in the answer, checks it against a rubric, and the output survives only if it passes; this is the direct cure for self-preferential bias [10], weight 0.3720. A practitioner essay argues single-pass LLM analysis is confirmation-biased and prescribes an adversarial layer: independent skeptics per finding, default to refuted, require majority survival [11], weight 0.2122 (weak backing).

## Mapping the patterns onto the cycle

Read together, the dig supports the structure the skill encodes [1]:

1. The gap-map fixes what needs improving, playing the planning phase of the pipeline literature [2], [3].
2. The parallel-deep-research subagent plays the hypothesis-generation stage, fanning out from a narrow brief (the gap-map plus t = i / N) rather than a broad topic [5], [6].
3. Doubt-driven-development plays the adversarial layer: each hypothesis is treated as a finding that a skeptic must fail to refute before it ships [7], [8].
4. The human-approved edit is the fail-closed gate; unapproved hypotheses never touch the corpus, the same default the fresh-context review gate encodes at the merge boundary [8].

One honest gap: the dig surfaced these patterns from code-review and research-agent domains, not from corpus-audit specifically. No source in the dig validates adversarial verification for document-edition loops directly; the skill's use of it is its own engineering judgment, recorded at weak weight [1].

## Sources

1. rsi-phi-skill SKILL.md, yubi-OS/yubiOS. https://github.com/yubi-OS/yubiOS/blob/main/skills/rsi-phi-skill/SKILL.md (weight 0.4717, weak)
2. Replicating Deep Research in Jan. https://www.jan.ai/post/deepresearch (weight 0.5352)
3. Deep Research Agent Architectures, zylos.ai. https://zylos.ai/research/2026-04-21-deep-research-agent-architectures/ (weight 0.4142, weak)
4. hybrid-deep-research, GitHub. https://github.com/Ddibirov/hybrid-deep-research (weight 0.5777)
5. ScienceSkill, GitHub. https://github.com/danielxmed/ScienceSkill (weight 0.5270)
6. DN-Hypo-Pipeline, arXiv. https://arxiv.org/pdf/2606.08532 (weight 0.4421, weak)
7. adversarial-workflow, PyPI. https://pypi.org/project/adversarial-workflow/ (weight 0.5109)
8. adversarial-review, GitHub. https://github.com/jamescrowley321/adversarial-review (weight 0.5151)
9. Adversarial Code Review, augmentcode. https://www.augmentcode.com/guides/adversarial-code-review (weight 0.2893, weak)
10. Dynamic Workflows: Six Patterns, Dotzlaw Consulting. https://dotzlaw.com/insights/claude-code-16-dynamic-workflows/ (weight 0.3720, weak)
11. Adversarial Verification: Why AI Findings Need a Skeptic. https://www.software-moling.com/en/blog/adversarial-verification-ai-findings (weight 0.2122, weak)
