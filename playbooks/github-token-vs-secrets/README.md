# github-token-vs-secrets - Knowledge Corpus

Explicates the yubiOS playbook `yubi-OS/yubiOS playbooks/github-token-vs-secrets.md` (2026-08-01): the distinction between `github.token` and named repository secrets, the workflow scope constraint, the solutions attempted (PR #147, PR #148), and the credential-hygiene discipline the playbook records.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-decision-matrix.md](01-decision-matrix.md) | The core decision rule mapping credential needs to github.token versus named secrets, and the fleet secret inventory |
| 02 | [02-github-token-mechanics.md](02-github-token-mechanics.md) | How github.token works: ephemeral per-run credential, permissions bound, cascade suppression |
| 03 | [03-workflow-permissions-block.md](03-workflow-permissions-block.md) | Declaring permissions:, the read-only default posture, elevations, and how org defaults interact with explicit blocks |
| 04 | [04-pat-hazards.md](04-pat-hazards.md) | Why PATs are unbounded, the cascade and lifetime hazards, and why the GH_TK same-repo PAT lost |
| 05 | [05-cross-repo-dispatch-and-registry.md](05-cross-repo-dispatch-and-registry.md) | The two legitimate named secrets: secrets.WORKFLOW for cross-repo dispatch and secrets.DOCKER for registry login |
| 06 | [06-pr148-gh-tk-removal.md](06-pr148-gh-tk-removal.md) | PR #148 (a49e95db, 2026-07-29): 6 GH_TK references replaced across 3 files, hygiene not bug fix, secret deletable |
| 08 | [08-failure-modes-and-hygiene-audit.md](08-failure-modes-and-hygiene-audit.md) | The 3 failure modes, the rg audit one-liners, the secrets inventory as audit boundary, and Gap 11 |

## Research summary

- Results collected: 72 (12 searXNG queries, top 6 kept per query, deduplicated across queries)
- Weight split: 22 high (>= 0.5) / 50 low (< 0.5)
- jev requests: 6 total (1 score outline validation + 5 noul weighting batches) via DefAPI direct (https://api.defapi.org/api/v1/decisions); usage 8112 input / 1440 output tokens
- Redos: 0 (no thin digs; no redo needed)
- Skipped docs: none. One subtopic (NN 7, checkout-pin-and-scope-of-claim) was dropped at outline validation (score 0.22, 0.82 padding probability), not skipped after a thin dig; its content remains covered by doc 06.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (typesafe/jev-1.13) via DefAPI direct 200.

## Notes

- Subtopic 6 (PR #148 removal) is an internal-record subtopic: no searXNG dig, grounded entirely in the source doc.
- Claims from the source doc are attributed as "source doc" (yubi-OS/yubiOS playbooks/github-token-vs-secrets.md); all other claims carry their source URL and jev weight. Weak-backing claims (< 0.5) are labeled in text.
