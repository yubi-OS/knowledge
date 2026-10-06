# 09 - Anti-Patterns, Rationalizations, Red Flags, and Verification

Internal-record subtopic, no dig: this doc explicates the source doc's own failure taxonomy and verification checklist (yubi-OS/yubiOS skills/context-engineering/SKILL.md). Claims are attributed to the source doc.

## The 7 anti-patterns

| Anti-pattern | Symptom | Fix |
|---|---|---|
| Context starvation | The agent invents APIs, ignores conventions | Load the rules file and relevant source files before each task |
| Context flooding | The agent loses focus under more than 5000 lines of non-task-specific context | Include only what is relevant; aim for under 2000 lines of focused context per task |
| Stale context | The agent references outdated patterns or deleted code | Start fresh sessions when context drifts |
| Missing examples | The agent invents a new style instead of following yours | Include one example of the pattern to follow |
| Implicit knowledge | The agent does not know project-specific rules | Write it down in rules files; if it is not written, it does not exist |
| Silent confusion | The agent guesses when it should ask | Surface ambiguity explicitly with the confusion management patterns |
| Context cliff | Waiting until the window is full; attention fragments and quality drops abruptly | Start trimming at 75 percent capacity; compress rather than cut |

Two of the seven carry hard numbers from the source doc: the flooding threshold is more than 5000 lines of non-task-specific context with a target of under 2000 lines of focused context per task, and the cliff fix is the 75 percent trim start from doc 06.

The 4 rationalizations and their rebuttals, from the source doc's table:

- "The agent should figure out the conventions": it cannot read your mind; writing a rules file is 10 minutes that saves hours.
- "I'll just correct it when it goes wrong": prevention is cheaper than correction; upfront context prevents drift.
- "More context is always better": research shows performance degrades with too many instructions; be selective.
- "The context window is huge, I'll use it all": window size is not attention budget; focused context outperforms large context.

The rationalizations pair with the degradation research: the lost-in-the-middle effect is the measured version of the fourth rebuttal, where a bigger window does not improve how reliably the model uses its content (weight 0.85, https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00638/119630/Lost-in-the-Middle-How-Language-Models-Use-Long).

## The 6 red flags

From the source doc:

1. Agent output does not match project conventions.
2. The agent invents APIs or imports that do not exist.
3. The agent re-implements utilities that already exist in the codebase.
4. Agent quality degrades mid-task as the conversation grows: failed attempts, replaced drafts, and verbose tool output are not being trimmed.
5. No rules file exists in the project.
6. External data files or config treated as trusted instructions without verification.

Red flags 1 to 3 map to starvation and missing examples; 4 is the context cliff mid-task; 5 is implicit knowledge; 6 is the trust-level violation from doc 03.

## The verification checklist

After setting up context, the source doc requires 6 confirmations:

- The rules file exists and covers tech stack, commands, conventions, and boundaries.
- Agent output follows the patterns shown in the rules file.
- The agent references actual project files and APIs, not hallucinated ones.
- Context is refreshed when switching between major tasks.
- During long sessions, context is actively managed: failed attempts and replaced drafts removed, live error and task definition protected.
- Task-critical content such as the current error and active constraints is positioned last in the window, not buried under background material.

The checklist is the pass or fail gate for the whole skill: items 1 to 3 verify the load discipline, item 4 the session discipline, item 5 the budget discipline, and item 6 the recency ordering from doc 06. A project that cannot check all 6 has located the failure in one of the docs above, and the fix is always a context edit, not a model change.
