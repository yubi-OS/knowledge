# 07 - Parallel author fan-out and the authoring contract

Scope: Phase 4 parallel authoring: the self-contained subagent prompt, the authoring contract, the redo rule, and orchestrator-owned commits.

Grounding spine: yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc), plus the dig results below.

## The fan-out shape (source doc)

Phase 4 dispatches one task subagent per doc, of type general with the smart model preset, ALL dispatched in one turn. Because subagents see nothing from the orchestrating session, each prompt is fully self-contained: the doc's scope statement, its dig queries, the endpoint URLs, the rate-limit warning, the authoring contract, and the report format. The source doc ships a fill-in template for exactly this prompt.

## The authoring contract (source doc)

1. Write a NEW doc (<NN>-<slug>.md) grounded ONLY in the jev-weighted dig results.
2. REDO rule, hard: if a subtopic's dig is too thin to author honestly, REDO the dig with DIFFERENT queries (up to 2 redos), logging each redo in the dig record. NEVER fall back to fetching primary sources directly to fill a thin dig. If still thin after redos, SKIP the doc and record it as a gap. Never pad.
3. Every factual claim carries its source URL and the jev weight that backed it. A claim with no source is deleted, not softened. Weight >= 0.5 is authoritative backing; below 0.5 is weak backing and is labeled as such in the text.
4. A "cannot author" verdict after redos is a success signal, not a failure. The anti-patterns section sharpens this: padding thin docs is itself the anti-pattern, and "a cannot author verdict is worth more than a confident mush of aggregator paraphrases."
5. Writing style: sharp, specific, no em dashes, numbers as digits, headings for wayfinding.

## Who writes to the repo (source doc)

The orchestrator (not the subagents) assembles the repo tree: subagents return doc markdown in their final report, and the orchestrator commits everything in one chain. The stated reason: this keeps the tree atomic and avoids 14 agents racing one branch. The anti-patterns list makes it a rule: "subagents pushing to the repo themselves" is named, with the racing-branches failure as the rationale.

## External grounding for the fan-out pattern

The orchestrator-subagent pattern is a recognized multi-agent architecture: a coordinating agent decomposes work, dispatches worker agents, and aggregates results (https://learn.microsoft.com/en-us/agents/architecture/multi-agent-orchestrator-sub-agent, weight 0.89). Multi-agent conversation frameworks formalize the same division into orchestrator and worker roles (https://www.microsoft.com/en-us/research/wp-content/uploads/2023/08/LLM_agent.pdf, weight 0.78), and vendor orchestration platforms expose an orchestrator as the coordinating control plane (https://www.uipath.com/product/orchestrator, weight 0.60). Dedicated fan-out docs describe parallel subagent dispatch with aggregation (https://dev.meta.ai/docs/cookbook/subagent-fanout, weight 0.73), and research on optimizing multi-step task pipelines with parallel LLM agents covers when parallel dispatch beats sequential execution (https://arxiv.org/html/2507.08944v1, weight 0.63). Stability of multi-agent systems under parallel load is an active research concern (https://arxiv.org/pdf/2602.08847, weight 0.56). Weaker hits in this cluster cover adjacent agent coordination ideas (https://arxiv.org/html/2606.15931, weight 0.38, weak; https://github.com/marketagents-ai/MultiInference, weight 0.35, weak; https://github.com/maystroh/ai-agents-wiki/blob/main/outputs/sources/philschmid/subagent-patterns-2026.md, weight 0.20, weak; https://explainx.ai/blog/multi-agent-orchestration-patterns-guide-2026, weight 0.18, weak; https://www.claudepluginhub.com/skills/alexanderguy-alexanderguy-skills/dispatch, weight 0.15, weak; https://getmulti.ai/, weight 0.11, weak).

The mint's specifics go beyond the generic pattern in two ways: the authoring contract makes honesty a deliverable (a skip is acceptable, padding is not), and the commit ownership is one-sided by design, since the atomic-tree requirement is what post-push verification audits against.

## The report format (source doc template)

Each subagent returns: the complete doc markdown between ===DOC-START=== and ===DOC-END=== markers, then sources used count, claims carried by primary sources versus weighted-0.5-plus, jev call count and cost, and failures. The orchestrator uses these reports to assemble the tree; per the anti-patterns section, it never trusts a subagent's reported PR number or push (see doc 09 for the wave-27 incident that motivated this).

## Sources considered

| url | weight |
| --- | --- |
| https://learn.microsoft.com/en-us/agents/architecture/multi-agent-orchestrator-sub-agent | 0.89 |
| https://www.microsoft.com/en-us/research/wp-content/uploads/2023/08/LLM_agent.pdf | 0.78 |
| https://dev.meta.ai/docs/cookbook/subagent-fanout | 0.73 |
| https://arxiv.org/html/2507.08944v1 | 0.63 |
| https://www.uipath.com/product/orchestrator | 0.60 |
| https://arxiv.org/pdf/2602.08847 | 0.56 |
| https://arxiv.org/html/2606.15931 | 0.38 (weak) |
| https://github.com/marketagents-ai/MultiInference | 0.35 (weak) |
| https://github.com/maystroh/ai-agents-wiki/blob/main/outputs/sources/philschmid/subagent-patterns-2026.md | 0.20 (weak) |
| https://explainx.ai/blog/multi-agent-orchestration-patterns-guide-2026 | 0.18 (weak) |
| https://www.claudepluginhub.com/skills/alexanderguy-alexanderguy-skills/dispatch | 0.15 (weak) |
| https://getmulti.ai/ | 0.11 (weak) |
