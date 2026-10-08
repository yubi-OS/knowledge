# 04 - Failure Modes to Avoid

Scope: the 10 failure modes the source doc lists as "subtle errors that look like productivity but create problems", and how the core operating behaviors counter each.

## Grounding spine

Source doc: `yubi-OS/yubiOS skills/using-agent-skills/SKILL.md`, sections "Failure Modes to Avoid" and "Core Operating Behaviors".

## The list, verbatim in substance

The source doc numbers 10 failure modes (Failure Modes to Avoid):

1. Making wrong assumptions without checking.
2. Not managing your own confusion, plowing ahead when lost.
3. Not surfacing inconsistencies you notice.
4. Not presenting tradeoffs on non-obvious decisions.
5. Being sycophantic ("Of course!") to approaches with clear problems.
6. Overcomplicating code and APIs.
7. Modifying code or comments orthogonal to the task.
8. Removing things you don't fully understand.
9. Building without a spec because "it's obvious".
10. Skipping verification because "it looks right".

The doc's framing matters: these are failures that "look like productivity". Each one produces visible output (code, commits, confident statements), which is exactly why they survive casual review.

## Mapping failures to behaviors

Each failure mode is the violation of a specific core behavior (doc 03). The mapping, reading both sections together:

| Failure | Violated behavior | Counter-move |
|---|---|---|
| 1, 9 | Behavior 1 (surface assumptions) | State assumptions, get corrected before implementing; route to spec-driven-development when no spec exists |
| 2, 3 | Behavior 2 (manage confusion) | Stop protocol: stop, name the confusion, present tradeoff, wait for resolution |
| 4 | Behavior 3 (push back) | Present tradeoffs with quantified downside ("this adds ~200ms latency") |
| 5 | Behavior 3 (push back) | Direct objection plus alternative, accepting override only with full information |
| 6 | Behavior 4 (enforce simplicity) | Fewer-lines check, abstractions earn their complexity, 1000-vs-100 bar |
| 7, 8 | Behavior 5 (scope discipline) | Touch only what is asked; no deletion without explicit approval |
| 10 | Behavior 6 (verify, don't assume) | Evidence required: tests, build output, runtime data |

Failure 4 (not presenting tradeoffs) is the only one whose counter lives in review conversation rather than in code: the agent owes the human a comparison before a non-obvious decision is locked in.

## Why they cluster

The 10 modes cluster into 3 families. Family 1 is epistemic (failures 1 to 4, 9): the agent acted on a wrong or unverified model of the requirements. Family 2 is judgment (failures 5 and 6): the agent optimized for approval or for cleverness instead of for correctness. Family 3 is discipline (failures 7, 8, 10): the agent exceeded its mandate or skipped the proof step. The families explain the doc's ordering: epistemic failures come first because every later failure is downstream of a wrong model.

## External corroboration

The dig for this subtopic returned mostly general LLM failure-mode taxonomies, and the sources that touch agentic coding directly carry low jev weights. A practitioner list of "22 LLM Agent Failure Modes (and the Prompts That Guard Against Them)" ranks the same family of risks, including unverified assumptions and missing verification gates (https://robertrevans.com/specs/failure-modes/, jev weight 0.26, weak backing). A writeup on why "AI Coding Agents Fail at Long Tasks" attributes long-task failures to context management rather than capability, which supports failure 2 (plowing ahead when lost) from the context side (https://piyushmehta.com/blog/context-management-agents, jev weight 0.24, weak backing). A guardrails playbook for LLM coding similarly centers on verification and scope constraints (https://www.claudecodehq.com/playbooks/llm-coding-guardrails, jev weight 0.26, weak backing).

These low-weight sources are recorded as collected evidence, not as authoritative backing. No claim in this doc depends on them; the list and the counters are fully grounded in the source doc.

## What the list does not cover

The source doc's list is behavioral, not technical. It does not cover runtime bugs, performance regressions, or security defects; those are owned by the phase skills `debugging-and-error-recovery`, `performance-optimization`, and `security-and-hardening` (source doc, Quick Reference). The failure modes are instead the process errors that let technical defects through review: an unverified assumption ships a wrong feature, a skipped verification ships a broken one.

## Detection guidance

Because the modes "look like productivity", detection needs a checklist reading of the agent's transcript rather than of the diff. The 4 observable tells, each derived from one family:

1. Epistemic: the agent never asked a clarifying question on a task that later turned out ambiguous.
2. Judgment: the agent agreed to an approach without stating a downside, or built an abstraction with a single caller.
3. Discipline: the diff touches files the task did not name, or the completion claim cites "it looks right".
4. Verification: the final report has no test output, build output, or runtime evidence attached.

The source doc's own emphasis is on the last one: "A task is not complete until verification passes" (source doc, behavior 6). That sentence is the enforcement point the other 9 modes funnel into, because even a perfectly routed, perfectly scoped task is incomplete until verified.
