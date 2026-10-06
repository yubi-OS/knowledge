# 06 - Context Budget Management

Scope: proactive budgeting of the context window: the 75 percent trim threshold, what to cut first, what to protect until the end, compress before dropping, and ordering for recency.

## The working desk model

The source doc's framing: the context window is not a filing cabinet, it is a working desk. Conversation history, tool output, and exploration accumulate as a session runs, and most of it becomes deadweight. Waiting until the window is full causes abrupt quality drops; regular management keeps the agent coherent through long tasks.

The threshold is explicit: start trimming at 75 percent capacity, not 100. By the time the window is genuinely full, the model's attention is already fragmented across too many signals. The 75 percent mark leaves room to compress gracefully instead of cutting desperately mid-task. The source doc's anti-pattern table names the failure as the context cliff: attention fragments and output quality drops abruptly at the limit.

## What to cut first

The source doc's cut table, in priority order:

| Content | When to cut |
|---|---|
| Past failed attempts and their error output | Once you have moved past them. Keep the conclusion, not the journey. |
| Verbose tool output (long find results, full file listings) | After you have extracted what you needed. |
| Conversational back-and-forth | As soon as the decision is reached. |
| Earlier drafts of code that were replaced | Immediately on replacement. The current file is the record. |

## What to protect until the end

4 categories survive all trimming:

1. The original task definition and key constraints.
2. The current error message or failing test output being actively debugged.
3. The file currently being edited, or its most recent version.
4. Hard constraints the agent must enforce (auth rules, naming conventions, and similar).

The first and last categories are level 1 and level 2 content that never belonged in the transient layer at all; the middle two are the live working state. A budget rule that protects these is automatically compatible with the hierarchy in doc 01.

## Compress before dropping

Summarizing beats deleting. Before removing a long stretch of exploration, reduce it to one sentence that captures the conclusion. The source doc's example: 8 messages of debugging a failing import become "Import issue traced to a circular dependency in src/lib/db.ts, resolved by moving the shared type to src/types/index.ts". The detail is gone; the decision is preserved. If the detail turns out to matter, the summary is a breadcrumb for re-investigation.

## Order for recency

Put the most task-critical content last in the window. The source doc grounds this in the lost-in-the-middle effect, citing Liu et al., 2023. The research backing is direct: the TACL paper Lost in the Middle: How Language Models Use Long Contexts finds that performance is significantly higher when relevant information occurs at the beginning or end of the input context, and degrades when models must access relevant information in the middle of long contexts (weight 0.85, https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00638/119630/Lost-in-the-Middle-How-Language-Models-Use-Long; preprint weight 0.79, https://arxiv.org/abs/2307.03172; ACL Anthology record weight 0.78, https://aclanthology.org/2024.tacl-1.9/). The paper also reports that models often struggle to fully use long contexts, so a bigger window does not by itself fix retrieval, which is the same warning the source doc's rationalizations table makes about window size not equalling attention budget.

The layout rule follows: keep stable rules, specs, and architecture at the start of the window; put the active task material, current file, and current error last, closest to the generation point.

## The 75 percent threshold in practice

The threshold is an act-now signal, not a target state. At 75 percent the trim is cheap: the failed attempts and verbose outputs are recent and easy to identify. At 100 percent the trim is a triage under pressure, with the current task already degraded. The source doc's framing of the tradeoff: compress gracefully rather than cut desperately mid-task.

A session that tracks its own growth can schedule the trim at natural pauses: after a test run lands, after a build succeeds, after a feature slice merges. Those are the points where failed attempts have already produced their conclusions and are therefore safe to compress.

## The trim in one pass

A practical single-pass trim walks the five content types in the cut table and asks one question of each: is this needed for the next step? If not, it becomes either a one-line conclusion or nothing. The protect list is the set of correct answers to that question, which is why the two tables belong together: cut first is a priority order, protect is a floor.

## Recency and the hierarchy together

The recency layout composes with the persistence hierarchy: background material (rules, specs, architecture) sits at the session start because it is stable, while the working material (current file, current error, active constraint) sits last because it changes and because end-position recall is stronger. The lost-in-the-middle research explains both placements: information at the beginning and end of the window is used reliably, information in the middle is not (weight 0.85, https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00638/119630/Lost-in-the-Middle-How-Language-Models-Use-Long).

## Verification hooks

The source doc's verification checklist carries 2 budget items directly: during long sessions, context is actively managed (failed attempts and replaced drafts removed, live error and task definition protected), and task-critical content is positioned last in the window. A session that fails either check is in the context cliff regime, and the cheapest recovery is the summarize-and-trim pass before the next task step.
