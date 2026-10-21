# 06: Restore Checklist and Validated Backup Runs

**Scope:** RESTORE.md checklist (multipart Worker PUT, schedules, raw-byte KV PUT, Vectorize recreate+upsert, Secrets Store re-entry) and the 3 validated runs (2026-09-26, 2026-10-06, 2026-10-10).

**Ground source:** `yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md` (intro, "RESTORE.md checklist to ship inside the zip", "Examples", "Guidelines").

> Internal-record subtopic grounded in yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md, no external web dig.

Outline score: 1.8992 (load-bearing probability 0.9250, confidence 0.7881; the highest-scored doc in the outline).

## Part 1: The RESTORE.md checklist

`RESTORE.md` ships inside every zip (doc 05). The ground source defines six sections. The recommended execution order below follows dependencies: secrets before workers, storage before traffic.

### 1. Secrets (do first)

Re-enter every named secret into the Secrets Store before uploading workers that bind them. The zip holds names and metadata only; values were never readable (doc 01). For a `secret_text` binding such as `AE_SQL_TOKEN`, mint a fresh token rather than searching for the old one. `secrets_store_secret` bindings re-attach by `secret_name` + `store_id`.

### 2. Workers

- Multipart `PUT /workers/scripts/{name}` with a metadata part plus one part per module.
- Each module part's filename is the module name including any `fixtures/` prefix; Content-Type `application/javascript+module`.
- **Never re-send the raw downloaded bundle.** The raw bundle is kept for forensics; the upload is rebuilt from `modules/` plus `upload-metadata.json` (doc 02).
- Then `PUT /schedules` with the cron list.
- Then `POST /subdomain {"enabled": true}` for new scripts.

### 3. Custom domains

One `POST /workers/domains` per entry from `workers-custom-domains.json`. The managed token has returned 405 on zone-route PATCH and on custom-domain writes, so the documented fallback is the dashboard.

### 4. KV

- PUT raw bytes per key from `kv-keymap.json`. Never JSON-encoded text.
- Re-apply expiration and metadata from the keymap.
- Verify with a delayed re-GET plus byte compare; allow roughly 15 seconds of propagation lag (doc 03).

### 5. Vectorize

- Recreate each index from `info.json` config (dimensions 768, metric cosine for the steady-orbit indexes).
- Upsert the NDJSON in batches.
- Verify the upsert path against current Cloudflare docs first and allow settle time; Vectorize is eventually consistent.

This is the open caveat the skill carries in every report: the Vectorize upsert path is unverified (doc 04).

### 6. Analytics Engine

No restore path. The file is an archive snapshot only (doc 05).

### Checklist at a glance

| Component | Restore action | Verify by | Caveat |
|---|---|---|---|
| Secrets | Re-enter by name | Worker binds cleanly | Values never in zip |
| Workers | Rebuilt multipart PUT | Script lists, schedules present | Never re-send raw bundle |
| Domains | POST per entry | Domain resolves | 405 on managed token; dashboard |
| KV | Raw-byte PUT | Delayed re-GET + byte compare | ~15s lag |
| Vectorize | Recreate + batched upsert | Count vs NDJSON | Upsert path unverified |
| Analytics Engine | None | n/a | Archive only |
| D1 | Out of default scope | n/a | Dumps only on request |

## Part 2: The three validated runs

The ground source records three validated runs. Each one added or changed something.

### Run 1: 2026-09-26

- File: `steady-orbit-cf-backup-2026-09-26.zip`, 84 MB.
- Included D1 table dumps: fits 10 rows, maps 540 rows (chunked), outcomes 1,283 rows.
- Lesson: D1 dumps need `LIMIT/OFFSET` chunks; the export-API poll route 404s and full-table `SELECT` 503s past roughly 540 rows. After this run, D1 became inventory-only by default.

### Run 2: 2026-10-06

- File: `steady-orbit-cf-backup-2026-10-06.zip`.
- The ground source records no size or counts for this run.
- Lesson recorded later: the `antimony` worker appeared after this backup, which is why the worker list must be read live (doc 02).

### Run 3: 2026-10-10

- Request: "full backup of the cloudflare deployment, except D1, in a a zip" (quoted as recorded).
- File: `documents/github-yubios-KS9n5GAT/cloudflare-deployment-backup-2026-10-10.zip`, 38.7 MB, sha256 `f54e4a50...` (truncated in the ground source), 2,016 entries, checksums verified inside the archive.
- Contents: all 1,919 KV values (48.2 MB, zero errors), the first full Vectorize export (2,100 + 6 vectors), an Analytics Engine snapshot (287 rows), D1 inventory-only.
- Lesson: the sandbox write-loss incident (1,919 loose `.value` files reverted after `Failed to commit changes`) produced the single-pass zip pattern (doc 05).

### Run comparison

| Run | Size | D1 | Vectorize | KV values | AE rows |
|---|---|---|---|---|---|
| 2026-09-26 | 84 MB | Dumps (10 / 540 / 1,283) | Not recorded | Not recorded | Not recorded |
| 2026-10-06 | Not recorded | Not recorded | Not recorded | Not recorded | Not recorded |
| 2026-10-10 | 38.7 MB | Inventory only | 2,100 + 6 (first full) | 1,919 (48.2 MB) | 287 |

The 84 MB to 38.7 MB drop coincides with dropping D1 dumps; the ground source does not attribute the size difference explicitly, so treat that as an observation, not a measured cause.

## Part 3: Naming convention evolution

Runs 1 and 2 used `steady-orbit-cf-backup-YYYY-MM-DD.zip`; run 3 used `cloudflare-deployment-backup-YYYY-MM-DD.zip`. The "Guidelines" rule: use the newer name when the account holds multiple workers, the older name for single-worker runs.

## Sources Considered

| Source | Type | Note |
|---|---|---|
| `yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md` | Internal record (ground source) | Internal-record subtopic grounded in yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md, no external web dig |
