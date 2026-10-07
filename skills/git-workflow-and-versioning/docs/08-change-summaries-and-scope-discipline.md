# 08 Change Summaries and Scope Discipline

Scope: the skill's structured change summary format (CHANGES MADE / THINGS I DIDN'T TOUCH / POTENTIAL CONCERNS), why the untouched section matters, and how summaries serve review.

## The summary format

The ground source (yubi-OS/yubiOS skills/git-workflow-and-versioning/SKILL.md) requires a structured summary after any modification, with three sections. Its worked example:

- CHANGES MADE: `src/routes/tasks.ts: Added validation middleware to POST endpoint`; `src/lib/validation.ts: Added TaskCreateSchema using Zod`.
- THINGS I DIDN'T TOUCH (intentionally): `src/routes/auth.ts: Has similar validation gap but out of scope`; `src/middleware/error.ts: Error format could be improved (separate task)`.
- POTENTIAL CONCERNS: `The Zod schema is strict, rejects extra fields. Confirm this is desired.`; `Added zod as a dependency (72KB gzipped), already in package.json`.

The stated purposes: the summary makes review easier, documents scope discipline, and surfaces unintended changes. It "catches wrong assumptions early and gives reviewers a clear map of the change" (source doc).

## Why the DIDN'T TOUCH section is the important one

The skill is explicit: "The 'DIDN'T TOUCH' section is especially important, it shows you exercised scope discipline and didn't go on an unsolicited renovation" (source doc). For agents this is the anti-drift guard. The example entries show what belongs there: adjacent problems noticed but deliberately left (a similar validation gap in auth.ts) and improvement candidates parked as separate tasks (an error-format cleanup). Recording them converts an unspoken temptation into a documented decision.

Agentic review guidance reaches the same rule from the reviewer side: if you discover issues outside the stated scope, broken imports, outdated comments, missing error handling, note them but do not fix them (https://github.com/agentic-cookbook/agenticcookbook/blob/main/cookbook/guidelines/reviewing/code-quality/scope, weight 0.12, weak backing). The summary's DIDN'T TOUCH section is the producer-side counterpart of that discipline.

## How summaries serve review

The format maps naturally onto pull request description practice. PR templates exist to standardize what every change description should carry, including testing notes and documentation updates (https://learn.microsoft.com/en-us/azure/devops/repos/git/pull-request-templates?view=azure-devops, weight 0.88). GitHub PR template guides describe the same mechanism: a markdown file that populates the description field on every new PR instead of a blank text area (https://gitmore.io/blog/github-pull-request-template, weight 0.13, weak backing), with template structure and examples catalogued elsewhere (https://gitrolysis.com/posts/2026/01/how-to-write-better-pull-request-descriptions-templates-and-examples/, weight 0.13, weak backing). Reviewer-side checklists give the consuming end: a structured list reviewers follow before approving a change (https://gainhq.com/blog/code-review-checklist/, weight 0.09, weak backing; https://dev.to/everettbutler/code-review-checklist-a-comprehensive-guide-cfh, weight 0.09, weak backing).

The skill's summary slots into that pipeline as the body of the PR description (or the handoff note when no PR is open): CHANGES MADE answers "what", DIDN'T TOUCH answers "what about the rest", POTENTIAL CONCERNS answers "where should the reviewer push back".

## Agent workflow

1. After any modification, write the three-section summary before pushing (source doc).
2. Every file touched goes in CHANGES MADE with a one-line what (source doc).
3. Adjacent issues noticed but not fixed go in DIDN'T TOUCH, each with a reason (out of scope, separate task) (source doc).
4. Judgment calls a reviewer should ratify (strict schemas, new dependencies and their size) go in POTENTIAL CONCERNS as explicit questions (source doc).
5. Keep the summary consistent with the typed commit history and branch name; contradictions between the three are themselves a finding (docs 03 and 05).
