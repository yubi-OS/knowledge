# skills/jev-orchestrator knowledge corpus

Minted 2026-10-07 from the yubiOS ground source yubi-OS/yubiOS skills/jev-orchestrator/SKILL.md. Topic: gated, verifiable, human-approvable automations through the Jev orchestration API on the steady-orbit worker: the fail-closed policy gate, approval bindings, independent verification, 6 terminal states, and the append-only audit log, with jev-1.13 (DefAPI) as the advisory Understand/Decide layer.

## Docs

1. [01-what-and-when](./01-what-and-when.md) - What Jev is (operations controller, not chat model), the 4 use triggers, the 2 negative cases, and the task pipeline map
2. [02-policy-gate](./02-policy-gate.md) - Deterministic fail-closed gate, 3 outcomes, block reasons, approval bindings (actor/target/payload/limits/expiry/policy version), policy-version invalidation
3. [03-task-lifecycle](./03-task-lifecycle.md) - Caller flow: create with idempotency key, read back, approvals queue, dispatch with pause re-check, verify, continue, pause/resume
4. [04-verification-reconcile](./04-verification-reconcile.md) - Expected predicates, verify verdicts (verified_success/confirmed_failure/unknown), retry within limits, reconcile-before-repeat on unknown
5. [05-terminal-states-audit](./05-terminal-states-audit.md) - 6 distinct terminal states, append-only events log as system of record, cost_usd accounting, polling discipline
6. [06-llm-integration](./06-llm-integration.md) - jev-1.13 advisory layer, LLMs hold no credentials, header allowlist, model routes classify/draft/guard, below-floor gating, degrade behavior
7. [07-automations](./07-automations.md) - Versioned D1 automation templates, stage pipelines, interval scheduler with CAS fires, def shape validation, stage budgets, lead machine suite
8. [08-hierarchy-router](./08-hierarchy-router.md) - Measurement-gated routing, edge-standard-v1 D, policy routing bands, route.dispatch builtin, router verify semantics, calibration, caller caveats
9. [09-production-patterns](./09-production-patterns.md) - Proven contracts: Contents PUT, fresh blob sha, approve auto-dispatch, sweep fire uniqueness, resend.send validator, below-floor gating, guidelines

## Research summary

- Results collected: 117 (after global URL dedupe across 22 searXNG queries)
- Weight split: 0 results at weight >= 0.5, 117 at weight < 0.5. The decision model (typesafe/jev-1.13, noul metric) scored every collected result below 0.5 in this run, so all dig-backed claims in the docs carry the weak-backing label. Claims grounded in the source doc are attributed to it explicitly and are not weight-limited.
- jev requests: 10 (14697 input tokens, 2398 output tokens). Endpoint: DefAPI direct (https://api.defapi.org/api/v1/decisions), model typesafe/jev-1.13.
- Redos: 3 (docs 01, 08, 09 re-dug with different queries after attempt 1 returned mostly off-topic noise).
- Skipped docs: none. All 9 outline subtopics validated at score >= 1.43 (no score-0 drops) and were authored.

## Preflight

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side); decide (typesafe/jev-1.13 via DefAPI direct) 200. Agent-side probe skipped per the skills-variant speed optimizations.

## Skips and gaps

None. Doc 07 (automations) is an internal-record subtopic: its mechanisms are worker-internal (D1 templates, worker cron, the console), so no web dig was run for it and every claim is grounded in the source doc.
