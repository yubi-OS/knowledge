# Format-compliance sweeps from the corpus's own spec

**Scope:** Driving a whole-corpus format-compliance sweep from the corpus's own format specification as the frozen check: round 12 took the skills corpus from 9 of 112 SKILL.md-compliant to 112 of 112, content-additive, with zero template boilerplate.

## The result

Round 12 targeted the skills corpus, 112 SKILL.md files. Per the rounds 7 to 12 audit (wayfinder-rounds-7-12-audit-2026-09-18), 9 of 112 files were format-compliant at the start and 112 of 112 were compliant at the end. The compliance bar was the corpus's own format specification, spec 2.2, which requires:

1. a kebab-case name,
2. a description of 1024 characters or fewer without angle brackets,
3. an H1 heading immediately after the frontmatter,
4. `## Examples` and `## Guidelines` sections.

## The transferable lesson: the spec is the check

The audit singles out one property as the transferable lesson: the round used the corpus's own format specification as the frozen check. Every pass and fail verdict was an instance of a rule the corpus itself already declared, not a rubric the round invented. This has three consequences worth keeping:

1. The check needs no justification argument. The spec exists; compliance is measurable against it; a sweep is just measuring.
2. The check is frozen. Because the rules were written before the sweep began and did not change mid-round, before and after counts are comparable (contrast the round 7 checker amendment, covered in doc 03).
3. The check is re-runnable by anyone. A third party can verify 112 of 112 with the spec alone, without reading the round record.

## Authoring from the skill's own body

The most expensive failure mode in a compliance sweep is fixing format by pasting boilerplate. Round 12 avoided it: every Examples and Guidelines section was authored from that skill's own body, meaning its own workflow steps and its own MUST and NEVER rules, not from a template. The audit records the round as content-additive, with nothing removed.

This distinction is measurable. A sweep that adds template sections leaves every file with the same generic paragraphs, which passes a structural check and fails a usefulness check. A sweep that derives the sections from each file's own content preserves and surfaces what was already specific to that file. Documentation-linting tooling takes the same stance structurally: lint the prose against declared rules and catch broken links, style drift, and missing structure, but do not rewrite the substance (weight 0.74, https://www.mintlify.com/library/documentation-linting).

## Tooling precedent

The prose-linting ecosystem validates the approach at scale. Vale is a markup-aware linter for prose built around configurable style rules, with tens of thousands of users enforcing project-specific writing standards (weight 0.96, https://github.com/vale-cli/vale). Grafana's Writers' Toolkit documents how a large documentation team wires Vale into review so every document is linted against the house style rather than an editor's memory of it (weight 0.93, https://grafana.com/docs/writers-toolkit/review/lint-prose/). Vale's own positioning states the principle: your style, applied mechanically (weight 0.82, https://vale.sh/).

Round 12's check is the same pattern with the roles inverted: instead of linting prose for style, it lints structure for spec compliance. The shared idea is that a written standard plus a mechanical check beats memory plus good intentions, because the check runs over the whole corpus every time (weight 0.74, https://www.mintlify.com/library/documentation-linting).

## What to keep doing

1. Find the corpus's own format specification first. If one exists, it is the frozen check; do not invent a parallel rubric.
2. Make every fix content-additive and derived from the file's own body. If a section you are adding could be pasted into any other file unchanged, it is boilerplate.
3. Freeze the check before the sweep and do not amend mid-round. If a defect is found, version and disclose it (doc 03, lesson 26).
4. Report only counts against the spec, so the result is verifiable without trusting the recorder.

## Source quality notes

Four results scored at or above 0.5 (the Vale repository, Vale's site, Grafana's Writers' Toolkit, and the documentation-linting guide) and back the tooling claims. Twenty results scored below 0.5 (aggregator posts on linters and code style, plus off-topic hits) and were not used to back any claim.
