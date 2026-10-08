# 02. Skill-Load Prelude

Scope: step 1 of the workflow, reading supporting skills in a fixed order before any dispatch, and why the order is fixed.

## The order

The source doc's workflow step 1 is explicit (source doc): read skills first, in order: using-agent-skills, token-efficiency, context-isolation, then the domain skill that fits the topic (prior-art-search, github-api, mkosi-image-builder, and so on). The order is not decoration. The first three are load-bearing infrastructure and the fourth is topic-specific; each subagent prompt repeats this exact ordering (see doc 04), so the orchestrator must have the sequence right before writing prompts.

Each prelude skill carries a distinct obligation:

- using-agent-skills: discover the right domain skill for the topic instead of guessing one. The source doc's examples (prior-art-search, github-api, mkosi-image-builder) show the domain slot is filled per-topic (source doc).
- token-efficiency: budget the run. The dispatch is bounded research, and the model-preset choice in step 3 cites token-efficiency directly (source doc).
- context-isolation: decide what shares the orchestrator's context and what gets its own; parallel streams exist precisely to keep each angle's working set separate.

## External backing for the pattern

Multi-vendor guidance converges on the same shape the source doc encodes. Microsoft's Azure Architecture Center documents orchestration patterns for agent architectures, including sequential and concurrent patterns, with concurrent fan-out as a first-class option (https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns, weight 0.89). Microsoft Copilot Studio guidance adds that multi-agent setups need authoring best practices for each agent's instructions and explicit handoff management (https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns, weight 0.87). Both support the source doc's core move: the orchestrator is a coordinator with a defined protocol, not a monolith doing everything itself.

On the token-efficiency leg, the GitHub blog documents a production practice of auditing agentic workflow token usage and flagging workflows whose usage grows significantly (https://github.blog/ai-and-ml/github-copilot/improving-token-efficiency-in-github-agentic-workflows/, weight 0.82). That is the same discipline the prelude imports: measure tokens before spending them on N parallel agents.

A peer-reviewed survey paper on token optimization and context-window management in multi-agent AI workflows frames the general problem: multi-agent workflows are limited by token cost and context-window quality, not only model quality, and practitioners lack evidence on reducing token usage across a full workflow without damaging output quality (https://arxiv.org/abs/2608.17188, weight 0.42; https://arxiv.org/pdf/2608.17188v1, weight 0.46). These are weakly backed per the weighting, but they align with the source doc's choice to make budget discipline (word counts, model presets) explicit rather than implicit.

## Why read before dispatch, not after

Two reasons fall out of the skill's own design (source doc, step 3). First, the subagent prompt contract begins with a skill-load directive, which the orchestrator can only write correctly if it has itself loaded the same skills and knows the order. Second, the domain skill determines stream 3's method: stream 3 (relevance to yubiOS / comparative analysis) "uses the domain skill + repo inspection", so picking the wrong domain skill corrupts one of the three canonical streams. Loading late means discovering mid-run that a stream was built on the wrong method.

## Failure mode the prelude prevents

The most common shortcut is to skip the prelude and dispatch immediately with a hand-rolled prompt. The source doc's own guard against this is structural: the prompt contract makes the skill-load directive mandatory in every subagent prompt (source doc, step 3). The prelude is therefore auditable: if a subagent's returned report does not reflect the domain skill's method, the orchestrator can trace the miss to a skipped or mis-ordered load.

Sources: source doc (yubi-OS/yubiOS skills/parallel-deep-research/SKILL.md, workflow step 1 and step 3); https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns (0.89); https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns (0.87); https://github.blog/ai-and-ml/github-copilot/improving-token-efficiency-in-github-agentic-workflows/ (0.82); https://arxiv.org/pdf/2608.17188v1 (0.46, weak); https://arxiv.org/abs/2608.17188 (0.42, weak).
