# docker-bake-action knowledge corpus

Minted from the ground source `yubi-OS/yubiOS skills/docker-bake-action/SKILL.md` (11574 B fetched 2026-10-06). The corpus explicates the skill: building multiple Docker/OCI images or multi-platform variants defined in a `docker-bake.hcl` file using `docker/bake-action` in GitHub Actions, and when bake beats `build-push-action`.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-when-to-use-bake.md](01-when-to-use-bake.md) | When bake beats build-push-action: 2+ targets, one declarative matrix, yubiOS variant builds |
| 02 | [02-action-reference-inputs.md](02-action-reference-inputs.md) | bake-action v5 step surface: files, targets, push, load, set, provenance, sbom, source; default group |
| 03 | [03-bake-file-authoring.md](03-bake-file-authoring.md) | docker-bake.hcl structure: variable, group, target fields, inherits, yubiOS labels |
| 04 | [04-metadata-action-integration.md](04-metadata-action-integration.md) | metadata-action bake-file output into files; github-builder meta-images/meta-tags alternative |
| 05 | [05-set-overrides-cache.md](05-set-overrides-cache.md) | set overrides: wildcard vs per-target, cache-from/cache-to type=gha mode=max |
| 06 | [06-github-builder-workflow.md](06-github-builder-workflow.md) | docker/github-builder reusable bake workflow: inputs, outputs, registry-auths, four advantages |
| 07 | [07-native-multiplatform.md](07-native-multiplatform.md) | native arm64 runner mapping, distribute=true per-platform runners, no QEMU |
| 08 | [08-provenance-sbom.md](08-provenance-sbom.md) | SLSA provenance and SBOM attestations: inputs, sign=auto OIDC binding, cosign verification |

## Research summary

- Results collected: 120 (top 6 per query, deduped by URL, across 16 first-pass queries plus 4 redo queries)
- Weight split: 31 high (>= 0.5) / 89 low (< 0.5); every result carries a non-null jev weight
- jev requests: 11 (1 outline score validation with 9 questions, 10 noul weighting batches of 12), usage 13556 input / 2579 output tokens, via DefAPI direct (api.defapi.org); the steady-orbit /api/decide relay was kept as fallback and never needed
- Redos: 2 (doc 01 when-to-use-bake and doc 04 metadata-action-integration re-dug with different queries after their first-pass digs came back generic)
- Docs kept/skipped: 8 / 0 skipped after dig; 1 subtopic (09 primitive-coverage-placement) dropped at outline validation with score 0.01
- Per-doc results kept / primary (>= 0.5): 01: 24/6, 02: 12/3, 03: 12/4, 04: 24/3, 05: 12/4, 06: 12/5, 07: 12/3, 08: 12/3

## Skipped docs and why

- 09 primitive-coverage-placement: dropped at outline validation (jev score 0.01, 99% probability on "padding: drop"). The SKILL.md's primitive-coverage and changelog sections are corpus-audit bookkeeping rather than load-bearing bake content; their coverage facts are quoted inside docs 01, 03, 05, and 08 where relevant.

## Research db

Under [research-db/](research-db/): `preflight.json`, `outline.json`, `archive.json` (120 weighted entries), `jev-log.json` (11 requests), `db.ts` (schema), and `digs/` (one record per doc).

## Preflight

2026-10-06: searXNG campaign preflight healthy (orchestrator-side, 8/8 and 8/8 dig queries returned results); decide via DefAPI direct (typesafe/jev-1.13), agent-side probe skipped for speed per mint optimization 3.
