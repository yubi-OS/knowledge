# 04 - Prompt intake console: prompts become gated tasks

Scope: the dashboard prompt console in the Jev Automations framing log: a typed prompt becomes a task, Understand and Decide run from the prompt, Llama proposes actions as JSON, and the deterministic gate validates them.

## The design

The framing log's prompt intake design: the /jev/ dashboard gets a prompt console where typing a prompt creates a task, Understand and Decide run from the prompt text, Llama proposes actions as JSON, and the gate validates those proposals exactly as it validates caller-supplied actions today, preserving untrusted-input separation (framing log, 2026-09-30).

## Why a prompt alone is not enough

Research on task-oriented dialog systems reports that while LLMs understand natural language well, engineering them to reliably execute complex business workflows from prompts alone is the hard part; the Conversation Routines framework addresses this by structuring prompts into routable task workflows (https://arxiv.org/pdf/2501.11613, jev weight 0.8749). The prompt console's answer is the same shape: the prompt enters a structure (a task with stages, gate profile, and tool allow-list) before anything executes.

## The propose-then-validate split

The Plan-then-Execute pattern separates strategic planning from execution in LLM agents, and a dedicated security guide treats the pattern as the backbone of resilient agent architecture (https://arxiv.org/pdf/2509.08646, jev weight 0.8407). A summary of that work states the security goal plainly: ensure the sequence of tool calls cannot be altered by untrusted input, with the Plan-then-Execute pattern enforcing a strict two-phase workflow (https://medium.com/@abivarma/architectural-blueprints-for-securing-llm-agents-96591c5d7db9, jev weight 0.1768, weak backing). The framing log's untrusted-input separation is this principle: the prompt (untrusted) may propose, the gate (trusted, deterministic) disposes.

The OWASP AI Agent Security cheat sheet states that expanded agent capabilities introduce security risks beyond traditional LLM prompt injection and provides best practices to secure agent architectures and minimize attack surfaces (https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html, jev weight 0.9332). Approval-gated execution appears in production agent tooling: one desktop agent system ships typed workflow planning, approval-gated execution, persistent sessions, and task handoff (https://github.com/Drlinglong/Remis, jev weight 0.3547, weak backing).

## Prompt semantics decoupled from execution

The prompts.chat architecture decouples raw prompt semantics from execution runtimes, using a git-native single source of truth rather than locking prompt logic inside framework-specific objects (https://singularitymoments.com/content/inside-promptschat-the-architecture-of-natural-language-system-instruct, jev weight 0.252, weak backing). That is the same separation the framing log draws between the prompt console (where intent is captured) and the registry plus gate (where intent is bounded). The large-language-model background for this split is standard: an LLM is a text-generation model, not an executor (https://en.wikipedia.org/wiki/Large_language_model, jev weight 0.823).

## Verdict

The console is the part of the finalist design most exposed to injection, and the sourced pattern literature says the defense is structural, not textual: force the prompt through a task object with an explicit plan phase, keep generation and execution separate, and validate every proposed action against a specification the prompt cannot change. The framing log already specifies that shape, and the 0.87 to 0.93 weighted sources (Conversation Routines, plan-then-execute, OWASP) back it independently.
