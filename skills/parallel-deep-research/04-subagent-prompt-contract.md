# 04. Subagent Prompt Contract

Scope: step 3 of the workflow, the five mandatory properties of every subagent prompt the source doc requires.

## The five requirements

The source doc states what each subagent prompt MUST contain (source doc, workflow step 3):

1. Start with a skill-load directive: "Read these skills first, in this order: 1) using-agent-skills 2) token-efficiency 3) context-isolation 4) <domain skill>". The domain slot is filled with the skill chosen in step 1.
2. Be self-contained: subagents have no chat memory, so provide IDs, paths, constraints, and the question itself.
3. Specify what to return: a structured markdown report with citations, at a length budget of about 1500 to 2500 words.
4. Use `type: "general"` and `model_preset: "fast"`, per token-efficiency: bounded research does not need the smartest model.
5. Pass connection IDs explicitly when the subagent needs API access, for example `conn_3h7rj41VF6hs` for GitHub.

## Why self-containment is the load-bearing property

A subagent runs outside the parent's context: it cannot see the conversation history, the parent's assumptions, or anything not explicitly passed. The practitioner literature is blunt on this: a subagent prompt foundry project states that "a subagent runs outside the parent agent's context window" and that this fact enforces a structure on prompts (https://github.com/srinitude/subagent-prompt-foundry, weight 0.23, weak). A skills directory cataloguing Claude subagents lists independent context windows as the defining property: every subagent operates in its own isolated context space, preventing cross-contamination and keeping the primary thread clear (https://github.com/VoltAgent/awesome-claude-code-subagents, weight 0.12, weak). Official Claude Code documentation advises designing focused subagents, each excellent at one specific task, with detailed descriptions used for delegation decisions (https://code.claude.com/docs/en/sub-agents, weight 0.90). That source is authoritative and matches the source doc's contract point for point: one task per subagent, an explicit return format, and context supplied rather than assumed.

A dedicated skill for writing self-contained subagent briefs exists for the same reason (https://skills.rest/skill/forge-agent-prompt, weight 0.20, weak). The pattern is common enough to have tooling built around it.

## The model-preset rule

The contract's `model_preset: "fast"` choice is an economics decision, not a quality compromise. Cost-routing guides report that model prices vary 10 to 30 times across comparable capability tiers, which makes routing bounded tasks to cheaper models the first-order cost lever (https://weaveos.com/blog/llm-cost-optimization-model-routing-guide, weight 0.21, weak). Leaderboard data confirms the tier landscape is dense: over 250 models compared on intelligence, price, and speed (https://artificialanalysis.ai/leaderboards/models, weight 0.20, weak). The source doc's reasoning is stated inline: per token-efficiency, bounded research does not need the smartest model (source doc). With 3 to 5 subagents each producing 1500 to 2500 words, running premium models would multiply cost by the stream count for little gain, because each stream's job is bounded retrieval and structured reporting, not open-ended reasoning.

## The skill-load directive as prompt prelude

Repeating the skill-load directive inside every subagent prompt does two things. It gives each subagent the same methodological grounding the orchestrator has, so streams are comparable. And it makes the contract auditable: a returned report that ignores the domain skill's method is evidence the directive was not honored, which the synthesis step can weigh (source doc, step 4: resolve conflicts by inspecting ground truth).

## Connection IDs as explicit capability grants

The final contract point is operational: subagents that need API access get the connection ID in the prompt text, never assumed (source doc). The example given is `conn_3h7rj41VF6hs` for GitHub. This prevents a stream from silently failing its repo-inspection duties because it lacked credentials, and it keeps the blast radius of a stream bounded to the connections it was granted.

Sources: source doc (yubi-OS/yubiOS skills/parallel-deep-research/SKILL.md, workflow step 3); https://code.claude.com/docs/en/sub-agents (0.90); https://github.com/srinitude/subagent-prompt-foundry (0.23, weak); https://weaveos.com/blog/llm-cost-optimization-model-routing-guide (0.21, weak); https://artificialanalysis.ai/leaderboards/models (0.20, weak); https://skills.rest/skill/forge-agent-prompt (0.20, weak); https://github.com/VoltAgent/awesome-claude-code-subagents (0.12, weak).
