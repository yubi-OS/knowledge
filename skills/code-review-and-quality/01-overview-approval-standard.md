# 01 Overview and Approval Standard

Scope: the skill's core posture, why every change is reviewed before merge, and the approval standard the reviewer applies.

The ground source for this corpus is the skill file at `yubi-OS/yubiOS skills/code-review-and-quality/SKILL.md`. Everything below attributes claims to that source doc unless a dig source is cited with its weight.

## The core posture: no merge without review

The source doc states the rule plainly: multi-dimensional code review with quality gates, and every change gets reviewed before merge, with no exceptions (source doc). The skill exists because working code that is unreadable, insecure, or architecturally wrong creates debt that compounds. It lists this as the first rationalization it rejects: "It works, that's good enough" is a failure mode, not a pass (source doc).

The skill positions itself as a gate, not a formality. Its red flags include PRs merged without any review and reviews that only check whether tests pass while ignoring the other axes (source doc).

## The approval standard

The approval standard is deliberately generous: approve a change when it definitely improves overall code health, even if it is not perfect (source doc). Perfect code does not exist. A reviewer should not block a change because it is not exactly how they would have written it. If it improves the codebase and follows project conventions, approve it (source doc).

Google's public engineering practices doc states the same standard almost verbatim: a change can be approved once it definitely improves the overall code health of the system, even if it is not complete, and the standard has no notion of "perfect" code (noul 0.88, https://google.github.io/eng-practices/review/reviewer/standard.html). The skill is aligned with industry practice here rather than inventing a stricter bar. Google frames the reviewer's job as continuous improvement over blocking perfection, which is the framing the skill adopts (noul 0.88, https://google.github.io/eng-practices/).

## When the skill fires

The source doc lists 5 trigger moments (source doc):

1. Before merging any PR or change.
2. After completing a feature implementation.
3. When another agent or model produced code that needs evaluating.
4. When refactoring existing code.
5. After any bug fix, where both the fix and the regression test get reviewed.

The agent-code trigger matters in a workspace where models write much of the code. The skill's own rationalization table calls out "AI-generated code is probably fine" as a lie reviewers tell themselves: AI code needs more scrutiny, not less, because it is confident and plausible even when wrong (source doc). Independent research on LLM-assisted code review found early-stage results that models can support review workflows, but the same literature notes the review task remains the hard part (noul 0.61, https://arxiv.org/html/2404.18496v2).

## What the review covers

Every review evaluates 5 axes: correctness, readability, architecture, security, and performance (source doc). Each axis gets its own document in this corpus (docs 02 through 06). The axes are not ranked; a change can pass correctness and still fail architecture because it relocated complexity instead of reducing it.

The skill's verification gate closes the loop. After review is complete the reviewer confirms all Critical issues are resolved, all Required changes are resolved or explicitly deferred with justification, tests pass, the build succeeds, and the verification story is documented: what changed and how it was verified (source doc).

## The skill's honest limits

The source doc is explicit about what the review is not. Tests passing is necessary but not sufficient: tests do not catch architecture problems, security issues, or readability concerns (source doc). The skill also rejects the "we will clean it up later" pattern, holding that later never comes and the review is the quality gate (source doc).

Two primitive-coverage notes were added by the curve-guided corpus audit and preserved in the source doc: the skill contributes to the audit and evidence primitive (review findings feed changelogs and refs) and its outputs feed the immutability layer of the yubiOS pipeline (source doc). These are bookkeeping statements about corpus placement, not extra review criteria.
