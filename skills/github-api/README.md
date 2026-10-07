# skills/github-api knowledge corpus

Knowledge corpus explicating the yubiOS skill `github-api` (ground source: `yubi-OS/yubiOS skills/github-api/SKILL.md`, fetched 2026-10-07, 15145 bytes). Topic: GitHub REST API patterns for the yubi-OS org. Minted 2026-10-06 under the skills-variant mint spec.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-auth-and-token-scopes.md | PAT Bearer auth, header set, fine-grained PAT permissions, single-credential discipline |
| 02 | 02-git-data-api-commit-chain.md | blob, tree, commit, ref chain for committing files without cloning |
| 03 | 03-contents-api-single-file-ops.md | single-file read/write via base64, blob SHA requirement, branch-scoped reads |
| 04 | 04-contents-vs-git-data-decision.md | choosing Contents API vs Git Data API by file count and atomicity |
| 05 | 05-issues-and-labels.md | creating issues with labels, commenting, listing, label 422 convention |
| 06 | 06-pull-requests-draft-workflow.md | creating draft PRs, listing open PRs, head-branch lookup |
| 07 | 07-forks-and-org-repos.md | forking upstream repos into the org, listing org repos with fork provenance |
| 08 | 08-history-and-branch-inspection.md | commit history for a specific file via commits?path= |
| 09 | 09-rate-limits-and-error-semantics.md | rate_limit endpoint, 5000 req/hr PAT budget, 404/409/422 error table |

Every doc opens with its scope line, grounds its spine in the source doc, and carries a source URL plus jev weight for each external claim. Claims backed at weight >= 0.5 are cited plainly; claims backed below 0.5 are labeled weak in the text.

## Research summary

- Results collected: 162 across 9 subtopics (18 initial queries + 10 redo queries, top 6 kept per query)
- Weight split: 23 high (>= 0.5) / 139 low (< 0.5)
- jev requests: 24 total (15 live; 9 superseded by a re-run after a client-side crash), usage 16068 input / 3504 output tokens on the live requests
- Redo counts: 3 redo query rounds (04: 2, 07: 1, 09: 1); all digs succeeded, no dig failures
- Skipped docs: none. Dropped at outline validation: t10 primitive-coverage-notes (score 0.27, padding)
- Decision model: typesafe/jev-1.13 via DefAPI direct (https://api.defapi.org/api/v1/decisions); outline validation used the score metric, result weighting used the noul metric
- Ground-source rule: no primary-source fallback was used to fill thin digs; doc 04 records its grounding limits explicitly

## Research-db

`research-db/` holds the schema-v2 record: `preflight.json`, `outline.json`, `archive.json` (all 162 results with per-result decision records), `digs/<NN>-<slug>.json` (per-subtopic query, redo, and outcome records), `jev-log.json` (one entry per jev HTTP request), and `db.ts` (TypeScript interfaces for every shape above).

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side, agent probe skipped for speed); /api/decide via DefAPI direct (typesafe/jev-1.13) 200.

## Gaps

- No dedicated external source states the Contents-vs-Git-Data comparison directly; doc 04 grounds the two endpoint families officially and attributes the decision rule to the source doc.
- The 409 and 422 error semantics outside docs.github.com are covered only by weak sources (0.10 to 0.12); doc 09 leans on the source doc's table and labels the weak references.
