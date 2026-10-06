# workflow token-scope auditing - a re-runnable script that codifies auditing GitHub Actions token usage and scopes after a cleanup, catching over-privileged token references

Minted knowledge corpus (REF: workflow-token-scope-audit-script), derived from yubi-OS/yubiOS refs/workflow-token-scope-audit-script-2026-08-04.md.

## Docs

- `01-github-actions-token-permissions.md` - The GitHub Actions GITHUB_TOKEN permission model: how permissions are declared at workflow and job level, defaults, inheritance, and the semantics that define whether a token is over-scoped.
- `02-retiring-over-scoped-secrets.md` - Why long-lived custom PAT secrets like GH_TK get retired in favor of the auto-injected github.token: the risk profile of over-scoped PATs, secret hygiene, and the cleanup pattern.
- `03-static-analysis-of-workflow-yaml.md` - Parsing and statically analyzing workflow YAML in Python: safe loading, the YAML 1.1 on-key-as-boolean quirk, walking jobs and steps, and scanning for secrets references.
- `04-findings-taxonomy-and-output.md` - Designing an audit finding model: severity levels (ERROR WARN INFO), exit-code thresholds for CI, and machine-readable output formats (JSON, SARIF).
- `05-secret-existence-validation.md` - Verifying that referenced secrets actually exist: the GitHub REST endpoint to list repo secrets, best-effort online mode, and the offline allowlist fallback.
- `06-ci-gate-integration.md` - Wiring the audit as a CI gate: pull_request path filters, scheduled drift scans, workflow_dispatch inputs, artifact upload of the audit report.
- `07-least-privilege-tightening.md` - The phased migration from audit to enforcement: detecting over-permissioned workflows, tightening WARN findings, and promoting the gate from fail-on-ERROR to fail-on-WARN.
- `08-prior-art-and-ecosystem-tooling.md` - Existing tooling for auditing GitHub Actions security and token scope: zizmor, actionlint, GHAS secret scanning, and how a purpose-built audit script complements them.


## Research summary

- Results collected: 96 (searXNG, 2 queries per subtopic, top 6 per query)
- Weight split: 54 high (weight >= 0.5) / 42 low (weight < 0.5) of 96
- Jev requests: 22 (1 searx probe is not a jev request; outline validation 1 request with 8 score questions; weighting 20 requests with 5 noul questions each)
- Jev usage tokens: input 16281 / output 0
- Redo counts: 0 (no thin digs; every subtopic kept 12 results)
- Skipped docs: none

## Sources

Per-doc result counts and weight split:

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-github-actions-token-permissions.md | 12 | 5 |
| 02-retiring-over-scoped-secrets.md | 12 | 8 |
| 03-static-analysis-of-workflow-yaml.md | 12 | 6 |
| 04-findings-taxonomy-and-output.md | 12 | 8 |
| 05-secret-existence-validation.md | 12 | 4 |
| 06-ci-gate-integration.md | 12 | 7 |
| 07-least-privilege-tightening.md | 12 | 8 |
| 08-prior-art-and-ecosystem-tooling.md | 12 | 8 |

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
