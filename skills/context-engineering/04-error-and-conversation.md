# 04 - Error Output and Conversation Management

Scope: level 4 (feeding specific errors back per iteration) and level 5 (managing long-running conversations with fresh sessions, progress summaries, and deliberate compaction).

## Level 4: feed the error, not the log

The source doc draws a sharp contrast. Effective: "The test failed with: TypeError: Cannot read property 'id' of undefined at UserService.ts:42". Wasteful: pasting the entire 500-line test output when only one test failed.

The discipline is specificity. The agent needs the failing assertion, the stack frame, and the file and line, not the full runner output. Everything else in a test log is level 5 material: it accumulates and pushes the useful parts deeper into the window.

Claude Code's docs describe the general loop the source doc assumes: the agent reads files, runs commands, and works autonomously, so the iteration cycle is run, observe, correct, and the quality of the observation you feed back determines the quality of the correction (weight 0.76, https://code.claude.com/docs/en/best-practices). Anthropic's own cookbook for managed agents operationalizes exactly this: a notebook dedicated to iterating on and fixing failing tests, where each cycle feeds the current failure back as the working signal (weight 0.59, https://github.com/anthropics/claude-cookbooks/blob/main/managed_agents/CMA_iterate_fix_failing_tests.ipynb).

## Level 5: conversation management

The source doc names the problem: long conversations accumulate stale context. Three moves:

1. Start fresh sessions when switching between major features. Stale context is its own anti-pattern in the source doc: the agent references outdated patterns or deleted code, and the fix is a fresh session when context drifts.
2. Summarize progress when context is getting long: "So far we've completed X, Y, Z. Now working on W."
3. Compact deliberately if the tool supports it, and do it before critical work, not after.

Claude Academy's context-management lesson teaches the tool-level equivalents: /compact summarizes a long session and /clear starts fresh, and effective context use means being specific with instructions and keeping only what the task needs (weight 0.78, https://academy.claude.com/courses/claude-code-101/context-management). Anthropic's session-management guide adds the decision layer: session management matters even more as the context window grows to 1M tokens, because a bigger window makes it easier to let deadweight accumulate instead of curating it (weight 0.70, https://claude.com/blog/using-claude-code-session-management-and-1m-context).

The source doc closes level 5 by pointing forward: these moves are last resorts, and the proactive discipline that makes them unnecessary is Context Budget Management, covered in doc 06.

## How the two levels interlock

Level 4 output is the most common source of level 5 debt. A failed build produces a log; the log gets pasted; the next iteration pastes another; the conversation fills with output you have already understood and fixed. The escape is the same compression rule the budget section teaches: keep the conclusion, not the journey. Once an error is understood and fixed, its full output is deadweight and should be reduced to the one-line conclusion, or dropped entirely on a fresh session.

A practical checklist the skill implies:

- Paste the failing test name, the error line, and the stack frame. Nothing else from the log unless the agent asks.
- After a fix lands, replace the error block in context with one sentence stating the fix.
- When switching features, start a new session rather than carrying the previous feature's history.
- Summarize progress in the first message of the new session so the handoff is not a cold start.

## What makes an error block effective

The source doc's effective example carries 4 pieces of information: the failure type (TypeError), the message (Cannot read property 'id' of undefined), the file, and the line number. That is the minimum the agent needs to jump straight to the defect. A paste that includes the full runner banner, the passing tests, and the teardown output adds tokens without adding signal, and per the budget discipline in doc 06, verbose tool output is the second thing to cut.

## Compaction as a scheduled act

The source doc's third move, compact deliberately, is scheduled rather than reactive: compact before critical work, so the agent enters the hard part of the task with a summarized history rather than a raw transcript. Claude Academy teaches the same ordering: use /compact to summarize long sessions and /clear to start fresh, applied before the next phase rather than after degradation is visible (weight 0.78, https://academy.claude.com/courses/claude-code-101/context-management).

## Signs the session should end

The source doc's red flags give the observable signals for level 5 intervention: output drifting from project conventions, invented APIs, re-implemented existing utilities, and mid-task quality degradation as the conversation grows. Each is a symptom of stale or deadweight context, and each is cheaper to fix with a fresh session plus a progress summary than to repair incrementally.
