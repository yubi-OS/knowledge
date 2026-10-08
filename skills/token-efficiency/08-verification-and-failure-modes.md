# 08 - Verification Checklist and Failure Modes

Scope: the 8-item self-check that closes the efficiency loop, the 6 red flags that mark its failure modes, and the skill's own RSI changelog as evidence the checklist works.

## The checklist

The source doc (yubi-OS/yubiOS `skills/token-efficiency/SKILL.md`, Verification) prescribes confirming each item before declaring a session efficient:

1. Reads were preceded by grep or glob with a specific pattern, not a full-file read.
2. Each read on a file over roughly 200 lines used offset or limit to target a range, not the whole file.
3. Independent read, glob, and grep calls were issued in a single block, not serially.
4. No tool result already visible in the thread was re-fetched from its source.
5. Bulk transforms (filter, sort, aggregate over roughly 100 rows) went through run_script or bash, not streamed through the model.
6. Large API responses were summarized; only the specific lines or fields needing verbatim quote were pasted.
7. File references use `[label](file://./path)` rather than re-pasting the file body.
8. The tool tier or model tier matched the task size; a fact lookup did not trigger a deep-research pass, a menial subagent task did not take the smartest tier.

The source doc's own closure rule: if any item is unchecked, the loop has not closed; apply the missed practice before responding (source doc, Verification).

## The red flags (failure modes)

The source doc names 6 (Red Flags section):

1. **Optimizing a response the user explicitly requested verbatim.** Summarize-don't-paste applies when the user wants signal, not when they asked for the full log or raw dump for debugging. Detecting the override requires reading the prompt; defaulting to optimize-then-ask burns a turn (source doc).
2. **Spending more tokens finding a savings than the savings buy.** A grep returning 200 lines beats a full read only when the pattern is well-scoped (source doc).
3. **Batch-calling dependent tools.** The second read whose arguments come from the first is sequential; "independent" is a data property, not a plan position (source doc).
4. **"Minimize tokens" as a license to lose correctness.** Summarization that drops fields the downstream task needs is over-efficiency, caught downstream by verification skills (source doc).
5. **Re-fetching a value already in context.** Easy to violate, silent when violated (source doc).
6. **Duplicating a sibling skill's body.** A structural endpoint describing context-isolation territory should defer to that skill (source doc).

## External grounding on evaluation

The dig's results on agent evaluation are moderate: an agent-evaluation guide (https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide, jev weight 0.40, weak backing) covers end-to-end agent evaluation with tool calling, task completion, reasoning, trace-based evaluation, and human review (jev weight 0.40, weak). A conference talk on tool calling (https://www.youtube.com/watch?v=zuMw0pkPXpU, jev weight 0.52) argues tool calling is how AI agents get things done (jev weight 0.52). Neither measures checklist-style self-verification specifically; the checklist's authority rests on the source doc and its own improvement history.

## The RSI history as internal evidence

The source doc's Changelog records two improvement cycles dated 2026-07-29 that produced this exact structure (source doc, Changelog):

- Cycle 1 added the 8-item Verification section to close a calibration gap (agents had no signal they had applied the skill well) and begin closing a structural-parity gap with sibling skills. The re-map after cycle 1 showed the calibration gap closed and structural parity reduced, with no new substantive gaps introduced.
- Cycle 2 added the Red Flags section (6 bullets covering override cases, over-searching, misapplied batching, over-efficiency, re-fetch, and duplication) and reached fixpoint: all three sibling endpoints present, override-case gap reduced, no new anti-patterns.

Later dated sections (cycles 5 through 7, 2026-08-06) are corpus-audit artifacts that attach the skill to the 10-primitive yubiOS framework (trust chain, cryptographic identity, declarative policy, least privilege, continuous/adaptive coverage); they do not change the operating guidance and are recorded here for completeness (source doc, primitive-closure sections).

## Operational rules

1. Run the 8-item check before declaring a session efficient; treat an unchecked item as an unfinished loop (source doc, Verification).
2. Read the user's prompt before optimizing anything; verbatim requests override the summarization practice (source doc, Red Flags).
3. Log efficiency as a checked property, not an intention: the checklist exists because agents otherwise have no signal they applied the practice (source doc, Changelog cycle 1).
4. Re-verify after any aggressive optimization: correctness lost to over-efficiency is caught downstream at higher cost (source doc, Red Flags; evaluation taxonomy per https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide, jev weight 0.40, weak).

## Sources

- Source doc: yubi-OS/yubiOS `skills/token-efficiency/SKILL.md` (Verification, Red Flags, Changelog).
- https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide (jev weight 0.40, weak).
- https://www.youtube.com/watch?v=zuMw0pkPXpU (jev weight 0.52).
- https://github.com/Erf-az/LLM-Security-Quality-Checklist (jev weight 0.17, weak).
