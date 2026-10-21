# Steady Orbit 67-Part Cloudflare Worker & /jev/ API Operational Playbook (knowledge corpus)

Corpus: `playbooks/steady-orbit-api/` (playbooks variant)

**Ground source:** `yubi-OS/yubiOS playbooks/steady-orbit-api.md` (dated 2026-10-21; deploy etag `356cb5c1c2e3e3f8b308ba6e29ab06bf27fd99fc107cc9d7f60b01d0dfb7e6b7`, policy v24, 67 module parts, 15 bindings, 2 crons, `cpu_ms: 300000`).

This corpus splits the operational playbook for the `steady-orbit` worker (`https://steady-orbit.systems-a.workers.dev`) into 6 subtopic docs. Docs `01` and `02` add Clef-weighted searXNG dig context; docs `03` to `06` are internal-record subtopics grounded directly in the ground source.

## Docs

Outline validated with clef `score` (criteria lowest-first: padding: drop / marginal: keep only if the dig comes back strong / load-bearing: core subtopic). All 6 kept, 0 dropped.

| NN | Doc | Scope | Outline score |
|---|---|---|---|
| 01 | [01-two-tier-entry-boundary-and-67-part-layout.md](01-two-tier-entry-boundary-and-67-part-layout.md) | `solar-rbs-entry.mjs` -> `index.js` -> `jev-main.js` boundary, 67 ES module parts, 4 path-qualified `fixtures/*.mjs`, byte-preserving multipart extraction | 1.9233 |
| 02 | [02-bindings-secrets-store-and-keep-bindings.md](02-bindings-secrets-store-and-keep-bindings.md) | 15 bindings, dual string vs `await .get()` secret resolution, `keep_bindings: ["secret_text"]` | 1.9385 |
| 03 | [03-central-bearer-auth-and-credential-host-scoping.md](03-central-bearer-auth-and-credential-host-scoping.md) | `timingSafeEqual` bearer auth on `/api/jev/*` and `/api/jev/map/*`, `CREDENTIAL_HOSTS` scoping, reconcile before repeat | 1.9555 |
| 04 | [04-policy-promotion-approvals-and-outcomes-ledger.md](04-policy-promotion-approvals-and-outcomes-ledger.md) | approvals bound to `policy_version`, `/api/jev/learnings/:id/promote`, `jev_policy_changelog`, append-only outcomes ledger | 1.8758 |
| 05 | [05-corpus-instruments-and-3-stage-forecast-cascade.md](05-corpus-instruments-and-3-stage-forecast-cascade.md) | `level_dbc` gating at `nulls >= 400`, hysteresis, instruments, Clairic + TimesFM 2.5 -> 3.0 + Clef cascade | 1.6541 |
| 06 | [06-cas-cron-loops-kv-raw-byte-discipline-and-selftests.md](06-cas-cron-loops-kv-raw-byte-discipline-and-selftests.md) | CAS crons, fail-closed switches, `--data-binary` KV writes with `HTMLParser` + `sha256` checks, 9-route selftest suite | 1.8682 |

## Research summary

- **Results collected:** 20 (10 per dig subtopic, docs `01` and `02`).
- **Clef quality weights:** 4 high (`>= 0.5`), 16 low (`< 0.5`). All 4 high-weight results back doc `02`; every doc `01` source is weak backing and labeled as such.
- **jev requests:** 5.
- **Redos:** 0.
- **Skips:** 0.
- **Internal-record docs (no web dig):** `03`, `04`, `05`, `06`.

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200

## Research DB

See `research-db/` (`outline.json` holds the full clef `score` answers: probabilities, legend, confidence, usage `input_tokens: 1264`).
