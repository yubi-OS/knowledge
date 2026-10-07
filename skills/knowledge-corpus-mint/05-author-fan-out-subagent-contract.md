# Author fan-out and the subagent contract: Phase 4

Scope: how the mint fans out one parallel subagent per doc with fully self-contained prompts, the authoring contract each subagent carries, and why the orchestrator owns all repo writes.

## The fan-out shape

Phase 4 of the source doc (yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md) dispatches one subagent per doc, type general, model preset smart, ALL in one turn. Each prompt must be fully self-contained because subagents see nothing from the orchestrating session: the prompt carries the doc's scope statement, its dig queries, the endpoint URLs, the rate-limit warning, the authoring contract, and the report format (source doc).

The authoring contract per subagent has 6 parts (source doc):

1. Write a NEW doc named NN-slug.md grounded ONLY in the jev-weighted dig results.
2. The REDO rule is hard: if the dig is too thin to author honestly, redo with different queries, up to 2 redos, logged in the dig record; never fall back to fetching primary sources directly to fill a thin dig; if still thin, skip the doc and record the gap in the README; never pad.
3. Every factual claim carries its source URL and the jev weight that backed it; a claim with no source is deleted, not softened; weight at 0.5 or above is authoritative backing, below 0.5 is labeled weak.
4. A "cannot author" verdict after redos is a success signal, not a failure.
5. Writing style: sharp, specific, no em dashes, numbers as digits, headings for wayfinding.
6. The final report returns the complete doc markdown between markers, then sources-used counts, claim provenance counts, jev call count and cost, and failures.

The source doc ships a full subagent prompt template with braces to fill, ending in the ===DOC-START=== / ===DOC-END=== report markers (source doc).

## Why the orchestrator owns the writes

The orchestrator, not the subagents, assembles the repo tree: subagents return doc markdown in their final report and the orchestrator commits everything in one Git Data API chain (source doc). This keeps the tree atomic and avoids N agents racing one branch. The anti-patterns list names the failure directly: subagents pushing to the repo themselves is how trees get clobbered (source doc).

External guidance on multi-agent systems describes the same pattern as the standard orchestrator-subagent architecture: a coordinator decomposes the task, dispatches worker agents, and aggregates their results, with workers isolated from each other's state (https://learn.microsoft.com/en-us/agents/architecture/multi-agent-orchestration-patterns, weight 0.51 and 0.47; https://learn.microsoft.com/en-us/agents/architecture/multi-agent-orchestrator-sub-agent, weight 0.51). The same source recommends that write access to shared stores concentrate in the orchestrator rather than fan out across workers, which is the discipline the source doc enforces (https://learn.microsoft.com/en-us/agents/architecture/multi-agent-orchestrator-sub-agent, weight 0.51; https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns, weight 0.45, weak backing).

## The self-contained prompt rule

The requirement that subagent prompts be fully self-contained is not boilerplate. Because the worker agents run in fresh contexts, any detail left in the orchestrator's head is lost; the source doc's template therefore re-states the scope, queries, endpoints, rate limits, and contract in every prompt (source doc). Skill-authoring guidance makes the same point for instruction-following agents: instructions must be explicit and complete within the artifact itself, since the reader cannot fall back on conversation memory (https://bmad-builder-docs.bmad-method.org/explanation/skill-authoring-best-practices/, weight 0.42, weak backing).

## The red flags this phase watches

Two red flags live at the boundary between Phase 4 and the push: subagent-reported PR numbers must never be trusted, because a 2026-10-05 wave returned confident VERIFIED reports citing PRs #137 to #141 that turned out to be the previous wave's numbers, with no branches or corpus dirs actually existing; the orchestrator resolves every PR number by head-branch lookup and verifies against the PR files list and blob re-fetch (source doc). And a doc whose digs record shows zero results either carries the direct-verification story or does not ship (source doc).

Note on this mint: the skills-variant run authors docs in the orchestrating session directly rather than spawning subagents, but the contract above, ground only in weighted results, cite every claim, honest gaps, is applied unchanged.

## Sources

- yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc, fetched 2026-10-07)
- https://learn.microsoft.com/en-us/agents/architecture/multi-agent-orchestrator-sub-agent (weight 0.51)
- https://learn.microsoft.com/en-us/agents/architecture/multi-agent-orchestration-patterns (weight 0.47)
- https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns (weight 0.45, weak backing)
- https://bmad-builder-docs.bmad-method.org/explanation/skill-authoring-best-practices/ (weight 0.42, weak backing)
