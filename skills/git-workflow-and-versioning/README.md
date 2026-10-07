# git-workflow-and-versioning — Knowledge Corpus

Explication corpus for the yubiOS skill `git-workflow-and-versioning` (ground source: `yubi-OS/yubiOS skills/git-workflow-and-versioning/SKILL.md`, 17236 bytes). The corpus explicates the skill's own sections: structuring git workflow practices, committing, branching, resolving conflicts by workflow design, PR review hygiene, push discipline, and the versioning and changelog conventions the skill teaches.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-trunk-based-development.md](01-trunk-based-development.md) | main always deployable, 1 to 3 day branches, dev branches as costs, release branches acceptable, feature flags over long branches, DORA correlation |
| 02 | [02-atomic-commit-discipline.md](02-atomic-commit-discipline.md) | commit early and often, commits as save points, atomic one-logical-thing commits, implement-test-verify-commit loop |
| 03 | [03-commit-message-conventions.md](03-commit-message-conventions.md) | `<type>: <short description>` format, six commit types, why-not-what bodies, Conventional Commits mapping |
| 04 | [04-change-sizing-and-concern-separation.md](04-change-sizing-and-concern-separation.md) | ~100 line target, ~1000 line split, formatting separate from behavior, refactors separate from features |
| 05 | [05-branching-and-naming.md](05-branching-and-naming.md) | one feature per branch from main, short-lived then delete, feature/fix/chore/refactor naming |
| 06 | [06-worktrees-and-save-points.md](06-worktrees-and-save-points.md) | git worktrees for parallel agents, save point pattern, reset --hard recovery, bisect/blame/log debugging |
| 07 | [07-pre-commit-hygiene-and-generated-files.md](07-pre-commit-hygiene-and-generated-files.md) | 5-step pre-commit checklist, husky + lint-staged, .gitignore coverage, commit-vs-ignore generated files |
| 08 | [08-change-summaries-and-scope-discipline.md](08-change-summaries-and-scope-discipline.md) | CHANGES MADE / DIDN'T TOUCH / POTENTIAL CONCERNS summary format and scope discipline |
| 09 | [09-versioning-and-changelog-conventions.md](09-versioning-and-changelog-conventions.md) | SemVer 2.0.0 bump choice, Keep a Changelog format, the skill's own changelog discipline as a model |

## Research summary

- Results collected: 108 (searXNG, 18 queries across 9 subtopics, top 6 per query)
- Weight split: 18 high (>= 0.5), 90 low (< 0.5)
- Jev requests: 9 (1 outline validation, 8 weighting batches), usage 14076 input / 2238 output tokens
- Redos: 0
- Skipped docs: 1 (subtopic 10 `corpus-audit-primitive-coverage`, dropped at outline validation with score 0.04, legend verdict "padding: drop"; it is an internal-record subtopic with no dig, and the source doc's RSI coverage notes remain cited inline where relevant)

## Source handling

Claims from the ground source are attributed to "source doc" (`yubi-OS/yubiOS skills/git-workflow-and-versioning/SKILL.md`). Claims from digs carry their URL and jev weight; weights below 0.5 are labeled weak backing in the text. No dig contradicts the source doc; sizing thresholds from external research (200 to 400 line ranges) are recorded as context, not as corrections.

## Outline validation

Score metric via typesafe/jev-1.13 on https://api.defapi.org/api/v1/decisions. Scores: 01 = 1.63, 02 = 1.96, 03 = 1.79, 04 = 1.25, 05 = 1.99, 06 = 0.9 (kept: dig returned 5 high-weight results from git-scm.com and github.com/git-guides), 07 = 1.58, 08 = 1.65, 09 = 1.94, 10 = 0.04 (dropped). Details in [research-db/outline.json](research-db/outline.json).

## Verification

Post-push verification is recorded in the PR body and final report: PR files list check plus per-file Git blobs API re-fetch with JSON parse and non-null weight check.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator-run); decide endpoint https://api.defapi.org/api/v1/decisions (typesafe/jev-1.13) used directly per the SKILLS-variant speed optimization, agent-side probe skipped.
