# docker-bake-consolidation

Knowledge corpus minted from `yubi-OS/yubiOS` `refs/docker-bake-consolidation-2026-07-17.md` on consolidating Docker image builds into a single docker-bake HCL file: multi-target bake definitions as the single source of truth for image variants and their CI wiring.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-bake-hcl-source-of-truth.md](01-bake-hcl-source-of-truth.md) | The Bake HCL file model (targets, groups, inheritance, variables, functions) as the committed single source of truth for image variants |
| 02 | [02-target-contexts.md](02-target-contexts.md) | `target.contexts` and `target:<name>` named contexts: builds consuming builds, replacing tag/push workarounds |
| 03 | [03-build-policy.md](03-build-policy.md) | The `target.policy` attribute, `reset`/`strict` flags, automatic `Dockerfile.rego` loading, one fail-closed policy for all targets |
| 04 | [04-exporters.md](04-exporters.md) | Registry versus docker exporters as per-target output properties; one target serving CI and publication |
| 05 | [05-builder-selection.md](05-builder-selection.md) | `buildx create --use` versus bake `--builder`; user-scoped named builders in containerized CI |
| 06 | [06-entitlements-devices.md](06-entitlements-devices.md) | Privileged entitlements, bake filesystem grants, `RUN --device` labs/CDI requirements, and why `/dev/kvm` stays host-side |
| 07 | [07-ci-boundary.md](07-ci-boundary.md) | The bake/GitHub Actions responsibility split and the per-workflow lane-to-target map |
| 08 | [08-static-validation.md](08-static-validation.md) | Static validation with `bake --print`, build checks, tag invariants, and workflow YAML reconciliation |

yubiOS-specific mappings in the docs are attributed to the source doc (`yubi-OS/yubiOS refs/docker-bake-consolidation-2026-07-17.md`); all external claims carry a dig-sourced URL and its jev weight.

## Research summary

- Results collected: 108 raw (top 6 per query), 62 unique URLs weighted and archived.
- Weight split: 30 high (weight >= 0.5), 32 low (< 0.5). Low-weight sources are labeled as weak backing wherever cited.
- Jev requests: 14 total (1 preflight probe, 1 outline score validation with 8 questions, 12 result-weighting batches of 5). Usage: 12030 input tokens, 0 output tokens.
- Redos: 1 (build-policy subtopic, initial dig kept only 1 high-weight primary source; redone with different queries, adding a high-weight buildx bake reference).
- Skipped docs: none. All 8 outline subtopics scored above 0 and were authored.
- Preflight 2026-10-05: searXNG 53 results healthy on probe; /api/decide (clef) 200.

## Research database

`research-db/` contains `preflight.json`, `outline.json`, `archive.json` (62 weighted entries), per-doc `digs/<NN>-<slug>.json`, `jev-log.json` (14 request records), and `db.ts` (TypeScript interfaces for every shape above).
