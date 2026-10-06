# CI/CD and Automation - Knowledge Corpus

Knowledge corpus explicating the yubiOS skill `yubi-OS/yubiOS skills/ci-cd-and-automation/SKILL.md` (the ground source of record, 16950 bytes fetched 2026-10-06). The corpus covers the skill's own joints: automating CI/CD pipeline setup, configuring quality gates, configuring test runners in CI, and establishing deployment strategies.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | quality-gate-pipeline | The ordered quality gate pipeline, shift-left, faster-is-safer, and the no-skip rule |
| 02 | github-actions-ci-configuration | GitHub Actions workflows: basic Node.js CI, Postgres service containers, Playwright E2E |
| 04 | deployment-strategies | Preview deployments, feature flags, staged rollouts, rollback workflow |
| 05 | environment-and-secrets-management | env-file taxonomy, GitHub Secrets vs vaults, CI never holds production secrets |
| 06 | automation-beyond-ci | Dependabot/Renovate, build cop role, branch protection and auto-merge |
| 07 | ci-optimization | The 10-minute threshold and the ordered optimization strategies |
| 08 | rationalizations-red-flags-verification | Rationalization table, red flags, and the post-setup checklist |

## Research summary

- Results collected: 96 (top 6 per query, 2 queries per subtopic, 8 dug subtopics)
- Weight split: 11 results >= 0.5 (authoritative), 85 results < 0.5 (weak)
- Jev requests: 9 (1 outline validation via score, 8 weighting batches via noul), usage 10733 input / 1995 output tokens
- Endpoint: DefAPI direct (https://api.defapi.org/api/v1/decisions), per the speed optimization; zero 429s, no fallback needed
- Redos: 0
- Skipped docs: 03 ci-failure-feedback-loop, marginal at outline validation (score 0.77) and dig came back weak: max weight 0.42, no result >= 0.5 authority threshold. 09 yubios-primitive-coverage dropped at outline validation (score 0.19)
- Digs for internal-record subtopics: none needed beyond 09, which was dropped before digging

## Outline validation

score metric, criteria: padding: drop / marginal: keep only if the dig comes back strong / load-bearing: core subtopic. Scores: t01 1.94, t02 1.92, t03 0.77, t04 1.95, t05 1.96, t06 1.85, t07 1.91, t08 1.03, t09 0.19. Dropped: t09.

Preflight 2026-10-06: searXNG dig responses healthy (16/16 queries returned result sets); /api/decide weighting healthy via DefAPI direct, 96/96 results weighted, 0 unweighted, 0 redos.
