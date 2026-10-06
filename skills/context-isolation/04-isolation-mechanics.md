# 04 - How to isolate: mechanics

Scope: the 4 concrete mechanics the context-isolation skill prescribes for building the boundary (minimal self-contained subagent prompts, fresh sessions for separate topics, scoped tool calls, and bringing back conclusions rather than transcripts), with production and research backing for each.

## The source doc's 4 mechanics

The source doc (yubi-OS/yubiOS skills/context-isolation/SKILL.md) prescribes 4 isolation mechanics:

1. Subagents with a minimal, self-contained prompt. A subagent has no memory of this conversation. Give it exactly the inputs it needs (specific IDs, file paths, constraints, the question to answer), not "everything we discussed," which forces it to either ask for clarification it cannot get or guess.
2. Fresh sessions for genuinely separate topics. If a new thread of work shares no state with the current one, starting fresh avoids both context rot and cross-topic confusion.
3. Scoped tool calls over broad ones. Reading 1 targeted file section is a form of isolation too; it keeps unrelated file content out of context entirely.
4. Bring back conclusions, not transcripts. When a subagent or isolated exploration finishes, pull its distilled finding into the main thread, not its full working log.

## Minimal, self-contained subagent prompts

The production reference is the Claude Code subagent documentation (https://code.claude.com/docs/en/sub-agents, weight 0.69), which specifies custom subagents as pre-configured agents with their own context window, their own system prompt, and their own tool access, dispatched for a bounded task. That is exactly the container the source doc's first mechanic describes: the subagent cannot rely on ambient conversation, so the prompt must carry everything it needs. The orchestrator-workers pattern in the Claude docs cookbook (https://platform.claude.com/cookbook/patterns-agents-orchestrator-workers, weight 0.56) shows the same structure at the workflow level: an orchestrator decomposes a task, hands each worker only its own slice of inputs, and synthesizes worker outputs; workers never see each other's intermediate state.

A weak practitioner source states the anti-goal directly: a good agent handoff "is not a transcript dump. It is a compact operating record" that lets the next agent resume without private chat history (https://llmwikis.org/guides/agent-handoff-patterns/, weight 0.14, weak). Another weak source frames sub-task context packaging as "preventing context pollution: a sub-agent should receive exactly the information required to execute its contract" (https://inferensys.com/prompts/multi-agent-coordination-and-handoff/agent-task-delegation-and-decomposition-prompts/sub-task-context-packaging-prompt-for-handoff, weight 0.16, weak). Both echo the source doc's rule, weakly backed but consistent with the strong production docs above.

## Fresh sessions for separate topics

The second mechanic is the zero-shared-state case: if a new thread of work shares no state with the current one, a fresh session avoids both context rot and cross-topic confusion. This follows mechanically from the degradation evidence in doc 01 (https://arxiv.org/abs/2307.03172, weight 0.78): irrelevant material anywhere in the window degrades use of relevant material, so the cheapest isolation for an unrelated topic is a window that never contained the old topic.

## Scoped tool calls

The third mechanic scales the same boundary down to a single call. Reading 1 targeted file section instead of a whole file is isolation: unrelated file content never enters the context. The source doc treats this as first-class isolation rather than an optimization footnote. No external research was needed here; the mechanism is internal to the skill's design and the claim is attributed to the source doc (yubi-OS/yubiOS skills/context-isolation/SKILL.md).

## Bring back conclusions, not transcripts

The fourth mechanic governs the return trip. The Anthropic multi-agent research system writeup (https://www.anthropic.com/engineering/multi-agent-research-system, weight 0.78) is the production example: lead agents synthesize subagent findings, and the paper-style synthesis lands in the orchestrator, not each subagent's raw search log. The empirical cost of violating it shows up in handoff research: LLM-generated emergency-department handoff notes carried higher detail than physician-written ones yet scored slightly lower on usefulness and patient safety (https://psnet.ahrq.gov/issue/developing-and-evaluating-large-language-model-generated-emergency-medicine-handoff-notes, weight 0.66; full study https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2827327, weight 0.77). More detail in the transferred artifact did not serve the receiving decision-maker better. A weakly weighted 2026 vendor post goes further and claims raw-transcript handoffs cost 34% in task completion versus state summaries (https://tryinterlock.com/blog/2026-agent-handoffs-state-summaries-beat-raw-transcripts-34.php, weight 0.10, weak); treat the number as anecdotal, but the direction matches the peer-reviewed finding.

## The prompt shape the boundary implies

Combining the mechanics yields the prompt shape the source doc intends: a self-contained task description with specific IDs, file paths, constraints, and the question to answer; no chat history; a defined output contract (what to bring back); and a bounded tool scope. Every production reference above (https://code.claude.com/docs/en/sub-agents, weight 0.69; https://platform.claude.com/cookbook/patterns-agents-orchestrator-workers, weight 0.56) converged on the same shape independently, which is the strongest available signal that the source doc's mechanics are the settled practice rather than a stylistic preference.
