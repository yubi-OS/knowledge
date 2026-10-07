# github-actions knowledge corpus

A knowledge corpus explicating the `github-actions` skill from `yubi-OS/yubiOS skills/github-actions/SKILL.md`: GitHub Actions for the yubi-OS org, covering workflow file structure, event triggers, GITHUB_TOKEN permissions, pinned action SHAs, the dhi.io container pattern, the Actions REST API, and the workflow-triggering discipline the skill teaches. The source doc is the primary source of record; the docs below deepen and contextualize it.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-yubios-hard-rules-and-approved-actions.md](01-yubios-hard-rules-and-approved-actions.md) | The four AGENTS.md hard rules, the approved action SHA allowlist, and org-level enforcement of pinning and allowlisting |
| 02 | [02-workflow-file-structure-and-triggers.md](02-workflow-file-structure-and-triggers.md) | Workflow file anatomy and the `on:` block: push, pull_request, schedule, workflow_dispatch, plus the mandatory `.github/workflows/` location |
| 03 | [03-github-token-permissions.md](03-github-token-permissions.md) | The ephemeral GITHUB_TOKEN, its permission vocabulary, job-level scoping, and org-level default workflow permissions |
| 04 | [04-workflow-scope-blocker-001.md](04-workflow-scope-blocker-001.md) | BLOCKER-001: why `.github/workflows/` writes need workflow scope, the GITHUB_TOKEN self-modification block, and the five solutions with the closed status |
| 05 | [05-actions-rest-api.md](05-actions-rest-api.md) | The Actions REST API surface: list workflows, dispatch runs, poll status, download logs, rerun, cancel, list jobs |
| 06 | [06-yubios-ci-yml-template.md](06-yubios-ci-yml-template.md) | The canonical yubiOS CI workflow template: dhi.io container, shellcheck gate, policy-gated buildx build, artifact upload (internal-record subtopic, no dig) |
| 07 | [07-common-workflow-patterns.md](07-common-workflow-patterns.md) | Conditional steps, matrix builds, secrets usage, and job dependencies as the SKILL.md teaches them |

## Research summary

- Results collected: 66 deduped searXNG results across 6 web-shaped subtopics (2 queries each, top 6 per query)
- Weight split: 23 high (>= 0.5) / 43 low (< 0.5)
- Jev requests: 7 total (1 outline validation with 9 questions, 6 noul weighting batches of up to 12 questions), usage 8077 input / 1351 output tokens
- Redo counts: 0 (no dig needed a redo, no decision-model request needed a retry)
- Skipped docs: none. 2 subtopics dropped at outline validation: t02 (approved dhi.io container pattern, score 0.38: padding; its content is covered inside docs 01 and 06) and t09 (RSI primitive-coverage audit trail, score 0.01: padding)

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide via DefAPI direct (typesafe/jev-1.13), agent-side probe skipped for speed.

## Method

- Ground source: `yubi-OS/yubiOS skills/github-actions/SKILL.md` (23,684 bytes), fetched from raw.githubusercontent.com with User-Agent omni-agent/1.0. Decomposed by the skill's own sections.
- Outline validation: jev score metric (criteria: padding / marginal / load-bearing), one batched request, score-0 subtopics dropped.
- Digs: searXNG via the n8n webhook, 2 queries per web-shaped subtopic, top 6 per query, deduped globally by URL. Doc 06 is an internal-record subtopic (the template is dictated entirely by the source doc) and skipped digs by design.
- Weighting: jev noul metric per result, batched 12 per request via DefAPI direct. Weight >= 0.5 counts as authoritative backing; < 0.5 is labeled weak in the doc text.
- Every dig-backed claim in the docs carries its source URL and jev weight; claims from the source doc are attributed to the source doc. The research-db directory records the full audit trail: preflight, outline with validation answers, archive with per-result decision records, per-doc dig records, and the jev request log.
