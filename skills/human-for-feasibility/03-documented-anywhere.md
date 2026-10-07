# 03 - Documented anywhere: the evidence ladder

Scope: Step 1 of the discipline. The ordered checks that make a choice "documented anywhere", and why implicit answers count.

## The ladder, in order

The source doc (Step 1, "Is it documented in working context?") fixes an ordered checklist. Stop at the first hit; cite the source; proceed. The rungs:

1. The user's most recent message. Did they answer this already?
2. This conversation's prior turns. Did they answer this earlier?
3. Loaded memory. Does memory/ contain a relevant rule, preference, or constraint?
4. Loaded skills. Does any active skill's SKILL.md or cache contain a default for this?
5. Workspace artifacts. Does the workspace contain a CONVENTIONS.md, STYLE.md, RULES.md, ADR, or similar that covers this?
6. Prior sessions. Did the user answer this in another session? Use session search tools to check.

If any rung hits, the verdict is: infer, citing the source, and proceed (source doc). The ordering is deliberate: cheapest and most specific evidence first. The user's latest message outranks a prior turn, which outranks a memory file, which outranks a workspace artifact. Session retrieval is last because it is the most expensive to run and the least certain to hit.

## Why workspace artifacts are a first-class evidence source

The ladder's rung 5 has become an ecosystem convention in its own right. Cross-agent context files checked into a repository root (CLAUDE.md, AGENTS.md and kin) tell AI coding agents how the codebase is shaped: build and test commands, coding conventions, project structure (https://repowise.dev/blog/guides/claude-md-agents-md-guide, weight 0.15, weak backing, sub-0.5; similar coverage at https://www.deployhq.com/blog/ai-coding-config-files-guide, weight 0.12, weak backing, sub-0.5). A community index describes AGENTS.md as "a plain-Markdown README for agents: build/test commands, conventions, and gotchas an agent needs before touching the code" and calls it the most widely adopted cross-tool instruction file (https://github.com/ItamarZand88/awesome-agent-conventions, weight 0.11, weak backing, sub-0.5). All weak-backed, but the direction is consistent: the industry is converging on exactly the artifact class the ladder names.

On the memory side, VS Code's agent-memory documentation instructs putting "reviewed architecture decisions, commands, conventions, and workflows that contributors depend on" where agents can reach them (https://code.visualstudio.com/docs/agents/run/memory, weight 0.60, high backing). Cognition's Agent Memory Repo spec goes further: memory as a git repo with a MEMORY.md entry point, one-line entries with sources, and cross-links between files (https://cognition.com/agent-memory-repo, weight 0.19, weak backing, sub-0.5). The high-backed VS Code source is the strongest external confirmation of rung 5: conventions documented for agents are expected to be read by agents before they ask.

## Implicit answers count (Step 5)

Step 5 of the discipline extends "documented" to implicit evidence (source doc). Even without an explicit answer, the user has answered if:

- They named a tool, library, or pattern.
- They praised or rejected a similar approach in prior conversation.
- They demonstrated a preference through their writing style, choice of words, or examples.
- They corrected an earlier inference in this session.

The verdict is the same: infer, citing the implicit evidence. This is the rung that most agents skip, and skipping it produces the "lazy asking" anti-pattern: asking a question whose answer was on record in a different form.

## Agent memory systems operationalize the ladder

External systems increasingly exist to serve rungs 3 through 6. A practitioner guide describes agent memory as more complicated than storing conversation history, needing to answer 4 questions: what should the agent remember, how should that information be represented and stored, when should it be retrieved, and how should it expire (https://www.codemancers.com/blog/agentic-memory, weight 0.13, weak backing, sub-0.5). Another survey notes that without memory an LLM-based agent is stateless, processing each request with no knowledge of prior interactions (https://agentskillshub.dev/skills/agent-memory/, weight 0.14, weak backing, sub-0.5). Weak-backed, but both align with the source doc's premise: the check must actually run against stored state, not just the visible context window.

## Failure modes on the ladder

Two failure modes are specific to this step (source doc, Anti-patterns):

- Lazy asking: asking a question whose answer is documented in working context, in a convention, or in a prior turn. Every such ask wastes the user's attention. The red-flag form: "Asking a question whose answer is in the user's most recent message."
- Infinite inference: inferring the same decision twice when the first inference was corrected. The Inference Audit catches this if you re-read it before re-deciding.

## Takeaway

Before any ask, run the 6-rung ladder in order and then check implicit answers. Cite the rung you used. If the ladder is silent, you have not yet earned the ask; continue to Steps 2 through 4.
