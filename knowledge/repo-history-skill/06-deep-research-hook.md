# The deep-research hook: injecting research into the archive

Scope: injecting deep-research topics into the archive via parallel subagents (deep-dive, prior-art, comparative), appending results as new corpus items and re-fitting the curve.

## Orchestrator and subagent as the base pattern

The hook is an instance of the orchestrator-subagent pattern. Platform guidance describes the hierarchy plainly: an orchestrating agent decomposes a problem and delegates subtasks to specialized subagents with scoped tools and prompts, which keeps each subagent's context small and each responsibility testable (https://learn.microsoft.com/en-us/agents/architecture/multi-agent-orchestrator-sub-agent, noul 0.8486). Research on orchestrated problem solving formalizes the decomposition step: an orchestrating LLM interacts with users to understand the problem and then decomposes it into tangible sub-problems for delegated solving (https://arxiv.org/html/2402.16713v1, noul 0.8456). Commercial systems expose the same shape as an API: an orchestrator LLM calls a research function tool, and each tool call returns a finished, synthesized, grounded research answer rather than raw search results (https://docs.parallel.ai/responses-api/examples/research-subagent, noul 0.789). GitHub's agent platform adds the dispatch dimension: specialized agents can be defined with scoped tools and prompts and orchestrated as subagents within one session, with a fleet mode for dispatching multiple subagents in parallel (https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-sdk/features/custom-agents, noul 0.939).

## The 3-angle decomposition

A deep-research dispatch for an archive refresh uses 3 parallel subagent lanes:

1. Deep-dive: exhaust one named subtopic, gathering primary sources and concrete numbers.
2. Prior-art: find what has been tried before, including failed attempts, so the archive records dead ends and not just successes.
3. Comparative: place the topic against alternatives, recording what neighboring approaches do differently and why.

Each lane writes its findings as corpus items in the same primitive-coverage format as the git and tracker items, under a corpus_as_deep_research section. This is the crucial move: research output enters the archive as data with the same schema as events, not as prose in a separate file, so the curve can fit over it and gaps can be measured against it.

## Workflow structure: iterate until converged

Production deep-research systems share a loop structure: decompose the query, execute searches, synthesize, reflect, and update the plan, repeating until the report is adequate. The Enterprise Deep Research workflow documents exactly these sequential phases repeating until convergence (https://deepwiki.com/SalesforceAIResearch/enterprise-deep-research/3.2-multi-agent-workflow, noul 0.5478), and tutorial-grade systems describe the same: break complex queries into manageable tasks, deploy specialized research agents, and synthesize findings into detailed reports (https://docs.flowiseai.com/tutorials/deep-research, noul 0.7434).

The failure modes of this loop are operational, not intellectual: dozens of searches and hundreds of documents mean partial failures are routine. Durable execution addresses this by treating the research run as a resumable workflow, so a crashed search or a rate-limited fetch retries without losing completed work (https://www.braintrust.dev/docs/cookbook/recipes/TemporalDeepResearch, noul 0.7225). Reference implementations make the synthesis step explicit with a dedicated report synthesis agent that directs the final write-up of all findings into a well-cited report (https://github.com/temporal-sa/openai-deep-research-py, noul 0.6265).

## Archive integration mechanics

The hook's contract with the archive has 4 steps:

1. Accept a topic string and a depth parameter (how many subagent lanes to dispatch, 3 by default).
2. Dispatch the lanes in parallel, each writing its findings to its own output file with source URLs and a per-claim confidence note.
3. Convert each lane's output into corpus items: assign primitive coverage exactly as for git and tracker items, and record provenance (which lane, which query, which sources).
4. Re-fit the curve with the new items included and append the delta to the cycle audit trail, recording fit metrics before and after.

Step 3 is where research quality becomes measurable. A research item that cites no primary source scores low on the evidence primitive and lands far from the fitted curve, which makes weak research structurally visible instead of buried in prose.

## When the hook is the wrong tool

The hook is for topics that need cross-corpus context or external grounding. It is the wrong tool for single-item questions (read the pull request directly) and for audits that only need the archive's internal structure (run the gap-map). Choosing between them is a scope decision the skill should encode: dispatch deep research only when the topic's answer would change how the archive is read, not merely what one item says.

## Design summary

1. Dispatch 3 parallel lanes (deep-dive, prior-art, comparative) under an orchestrator (https://learn.microsoft.com/en-us/agents/architecture/multi-agent-orchestrator-sub-agent, noul 0.8486).
2. Land research output as corpus items with the same primitive coverage and provenance as event items (https://arxiv.org/html/2402.16713v1, noul 0.8456).
3. Iterate decompose, search, synthesize, reflect, update until converged (https://deepwiki.com/SalesforceAIResearch/enterprise-deep-research/3.2-multi-agent-workflow, noul 0.5478).
4. Re-fit the curve after injection and record the delta in the audit trail (https://docs.parallel.ai/responses-api/examples/research-subagent, noul 0.789).
