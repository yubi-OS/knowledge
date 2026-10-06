# 05 - Context Packing Strategies

Scope: the three named packing patterns: the brain dump at session start, the selective include per task, and the hierarchical summary project map for large codebases.

## The brain dump

At session start, provide everything the agent needs in one structured block. The source doc's template has 6 slots: the project and tech stack, the relevant spec section as an excerpt, key constraints, files involved with brief descriptions, a pointer to a related pattern example, and known gotchas.

The structure matters more than the volume. Claude's platform prompt-engineering guide teaches the same anatomy at general scale: put tasks, documents, examples, and instructions into clearly separated sections so the model can attribute each piece correctly (weight 0.82, https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices). The brain dump is that guidance compressed into a session-opening block.

## The selective include

Per task, include only what is relevant. The source doc's example for adding email validation names the task, lists 3 relevant files (the endpoint to modify, the existing validation utilities, the tests to extend), points to the exact lines of the pattern to follow, and states the single binding constraint: use the existing ValidationError class, not raw errors.

Four things make this pattern work:

- The file list is closed. The agent is not invited to explore; it is told what matters.
- The pattern pointer includes line numbers, so the example is findable without a search.
- The constraint is a do-not, the cheapest instruction to follow.
- Everything in the block is level 3 material: files, pattern, constraint. No history, no spec padding.

Anthropic's prompting best-practices article frames the same shift for current models: prompting is converging with context engineering, which means less scaffolding and more curation of what enters the window (weight 0.71, https://claude.com/resources/articles/best-practices-for-prompt-engineering).

## The hierarchical summary

For large projects, the source doc prescribes maintaining a project map: one block per area (Authentication, Tasks, Shared), each with a one-line description of responsibility, key files, and the pattern used. Load only the relevant section when working in that area.

This is the packing pattern with the most external corroboration. A third-party codebase-map tool states the principle directly: unlike tools that dump every file into context, a map generates a structured index, the 20% of context that gives 80% of understanding (weakly backed, weight 0.28, https://github.com/kriskimmerle/codemap). A practitioner article on context window management lists the same operations as the discipline of the pattern: selecting relevant files, pruning stale content, and keeping the most important code and instructions present when the agent needs them (weakly backed, weight 0.28, https://vexp.dev/blog/context-window-management-ai-coding).

The map also encodes the source doc's missing-examples anti-pattern fix at project scale: each area's "Pattern:" line is one sentence that tells the agent how that area already does things, so the agent follows the local convention instead of inventing one.

## Choosing between the three

The three patterns compose rather than compete: the project map is persistent (level 2), the brain dump runs once per session against the relevant map sections, and the selective include is the per-task payload. If a task cannot be expressed as a selective include, that is a signal the map section is missing or stale, not a signal to paste the whole codebase.

## The constraint slot does the most work

Of the brain dump's 6 slots, the constraint list is the one that prevents the most rework, because constraints are the only slot that survives disagreement about implementation. Claude's prompting best-practices guidance puts explicit constraints ahead of lengthy scaffolding for current models, which is the packing-level version of the same priority (weight 0.71, https://claude.com/resources/articles/best-practices-for-prompt-engineering). A selective include without a constraint line invites the agent to pick its own approach; with one, the approach is pinned before any code exists.

## Pattern pointers beat descriptions

Both the brain dump and the selective include use pointers into the codebase (a file, or file and line range) rather than prose descriptions of the pattern. The pointer is self-updating: it always shows the code as it actually is, while a description drifts the moment the code changes. This is the doc-level implementation of the source doc's missing-examples fix: one example of the pattern to follow, found in the code, referenced by location.

## Anti-pattern check for packed context

The source doc's flooding anti-pattern draws the line the packing patterns must respect: more than 5000 lines of non-task-specific context loses focus, and the target is under 2000 lines of focused context per task. The brain dump is the pattern most at risk of crossing it, because it is written once and never revisited; the fix is to keep the brain dump as a pointer set (files, sections, gotchas) rather than inline content, so its size stays constant as the project grows.
