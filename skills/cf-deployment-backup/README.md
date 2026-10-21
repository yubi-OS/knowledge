# Knowledge Corpus: skills/cf-deployment-backup

**Topic:** yubiOS cf-deployment-backup Skill: Full Cloudflare Account Deployment Backup and Restore Zip Workflow

**Ground source:** `yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md`

This corpus decomposes the `cf-deployment-backup` skill into 6 subtopic docs: what a backup covers, how the account is inventoried, how KV and Vectorize are dumped, how the zip is gated, and how a restore runs. Docs `01`, `03`, and `04` cite Clef-weighted searXNG dig results; docs `02`, `05`, and `06` are internal-record subtopics grounded directly in the ground source with no external web dig.

## Docs

| NN | Doc | Scope | Outline score |
|---|---|---|---|
| 01 | [01-backup-scope-inclusions-and-exclusions.md](01-backup-scope-inclusions-and-exclusions.md) | Default backup scope (worker bundles, settings, schedules, subdomains, KV, Vectorize, AE snapshot, Secrets Store names) and default exclusions (D1 data, write-only secret values). | 1.8979 |
| 02 | [02-preflight-inventory-and-multipart-bundle-parsing.md](02-preflight-inventory-and-multipart-bundle-parsing.md) | Live account inventory pass (Workers, Domains, KV, Vectorize, R2 10042, D1, Hyperdrive, Durable Objects) and multipart Worker bundle parsing by Content-Type boundary. Internal record. | 1.8572 |
| 03 | [03-kv-namespace-pagination-and-concurrent-dump.md](03-kv-namespace-pagination-and-concurrent-dump.md) | KV key pagination (limit=1000 + cursor), concurrent value downloads with URL-encoding and retry backoff, md5 value filenames, kv-keymap.json sha256 manifest. | 1.8870 |
| 04 | [04-vectorize-v2-cursor-enumeration-and-ndjson-export.md](04-vectorize-v2-cursor-enumeration-and-ndjson-export.md) | Vectorize v2 enumeration via `/list?count=1000` + `nextCursor` (list-vectors 404s) and `POST /get_by_ids` batches of 20 into NDJSON. | 1.7085 |
| 05 | [05-analytics-engine-snapshot-and-zip-integrity-gates.md](05-analytics-engine-snapshot-and-zip-integrity-gates.md) | Analytics Engine SQL snapshot, SHA256SUMS.txt, ZIP_DEFLATED level 9 testzip() verification, zero-error gate, single-pass run_script sandbox lesson. Internal record. | 1.8383 |
| 06 | [06-restore-checklist-and-validated-backup-runs.md](06-restore-checklist-and-validated-backup-runs.md) | RESTORE.md checklist (multipart Worker PUT, schedules, raw-byte KV PUT, Vectorize recreate+upsert, Secrets Store re-entry) and the 3 validated runs (2026-09-26, 2026-10-06, 2026-10-10). Internal record. | 1.8992 |

Outline validation: Clef `score` metric, criteria lowest-first `padding: drop` / `marginal: keep only if the dig comes back strong` / `load-bearing: core subtopic`. All 6 subtopics kept, 0 dropped.

## Research Summary

| Metric | Value |
|---|---|
| Results collected | 30 (3 dig subtopics x 2 queries x 5 results) |
| High weight (`>= 0.5`) | 7 |
| Low weight (`< 0.5`) | 23 |
| jev requests | 7 |
| Redos | 0 |
| Skips | 0 |

High-weight results by doc: `01` has 1 (Workers secrets page, 0.5489); `03` has 3 (KV list keys 0.7505, KV binding API 0.7435, KV overview 0.6828); `04` has 3 (Vectorize Cloudflare API 0.8603, cloudflare-go Vectorize api.md 0.6079, Vectorize client API 0.5910). Every cited source below 0.5 is labeled `(weak backing, clef weight < 0.5)` in its doc.

**Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200**

## Open Caveats Carried From the Ground Source

- Vectorize upsert restore path is unverified (docs 04, 06).
- Secret values are never in the zip; restore requires re-entry (docs 01, 06).
- Analytics Engine data has no restore path (docs 05, 06).
- D1 data is inventory-only unless explicitly requested (docs 01, 06).

## Research DB

See `research-db/` alongside this README: `preflight.json`, `outline.json`, `archive.json`, `digs/`, `jev-log.json`, `db.ts`.
