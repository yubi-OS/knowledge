# jev-automations knowledge corpus

Minted from yubi-OS/yubiOS `refs/jev-automations-2026-10-01.md`: worker-hosted LLM automations replacing an n8n pipeline on the steady-orbit Cloudflare Worker.

## Documents

| NN | file | scope |
|---|---|---|
| 01 | [01-automation-registry.md](docs/01-automation-registry.md) | Versioned automation templates in D1 with single-active-per-name activation and revalidation |
| 02 | [02-stage-engine.md](docs/02-stage-engine.md) | Five stage types (tool, llm, builtin, guard, propose_actions) with two-layer GET-only enforcement |
| 03 | [03-llm-routing.md](docs/03-llm-routing.md) | Three-tier Workers AI routing: classify, draft, guard, plus raw pins and neuron accounting |
| 04 | [04-prompt-intake.md](04-prompt-intake.md) | Untrusted prompt intake: propose over the policy tool list, same validation, same gate |
| 05 | [05-cron-scheduler.md](05-cron-scheduler.md) | 5 minute cron tick, compare-and-set on last_fired_at, per-interval idempotency keys |
| 06 | [06-gate-and-policy.md](06-gate-and-policy.md) | Deterministic gate, policy v4 additions, and the any-host read-only tool risk class |
| 07 | [07-lead-machine-port.md](07-lead-machine-port.md) | Verbatim lead machine port with refuse-to-claim guards, 40 behavioral tests, gated sends |
| 08 | [08-console-v2.md](08-console-v2.md) | Operator console: prompt console, automations tab, models pill, fail-soft sessionStorage |
| 09 | [09-build-method-lessons.md](09-build-method-lessons.md) | Five parallel lanes plus advisor integration; four live operational lessons |

## Research summary

- Results collected: 156 (108 from the initial dig, 48 from redos for docs 02, 07, 08, 09).
- Weight split (jev noul; weight >= 0.5 counts as primary backing): high 60, low 96.
- Jev requests: 33 (1 outline validation score request, 32 noul weighting batches of 5), usage 122531 input tokens, 0 output tokens.
- Redo counts: docs 02, 07, 08, 09 each redug once with different queries after the initial dig came back thin; all other docs 0 redos.
- Skipped docs: none. All 9 outlined docs were authored; thin digs were redug rather than skipped, and claims backed only by weak sources (weight < 0.5) are labeled as weak in the text.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.
