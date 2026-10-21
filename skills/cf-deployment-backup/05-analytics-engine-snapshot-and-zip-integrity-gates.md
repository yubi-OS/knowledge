# 05: Analytics Engine Snapshot and Zip Integrity Gates

**Scope:** Analytics Engine SQL snapshot (`SELECT * FROM dataset`), `SHA256SUMS.txt`, `zipfile.ZIP_DEFLATED` level 9 `testzip()` verification, zero-error gate, and the single-pass run_script sandbox lesson.

**Ground source:** `yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md` ("Procedure" steps 6 to 8, "Sandbox lesson", "Examples", "Guidelines").

> Internal-record subtopic grounded in yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md, no external web dig.

Outline score: 1.8383 (load-bearing probability 0.8783, confidence 0.6695).

## Part 1: Analytics Engine snapshot

### The request

Per the ground source, step 6:

- `POST /accounts/{acc}/analytics_engine/sql`
- Header `Content-Type: text/plain` (the body is raw SQL, not JSON)
- Body `SELECT * FROM <dataset>`
- Plus the explicit `User-Agent` header required on every call in the run (doc 02).

### No new token needed

The managed Cloudflare connection's analytics read permission suffices. This matters because the worker's own `AE_SQL_TOKEN` is a `secret_text` binding that can never be read back (doc 01), so the backup cannot reuse it and does not need to.

### What gets archived

The response is archived as JSON together with its row count. The 2026-10-10 run captured 287 rows (ground source, "Examples").

### Snapshot semantics

The ground source is explicit on three limits:

| Property | Value |
|---|---|
| Nature | Point-in-time snapshot |
| Retention upstream | Roughly 3 months |
| Restore path | None; archive only |

RESTORE.md repeats this so no operator attempts to re-ingest the file (doc 06).

## Part 2: Building the archive

Step 7 of the ground source builds four control files before the zip:

1. **`MANIFEST.json`**: counts, sizes, exclusions, and zone/REST notes. This is where doc 01's exclusions become machine-readable.
2. **`RESTORE.md`**: the restore checklist (doc 06).
3. **`SHA256SUMS.txt`**: one sha256 line over every staged file.
4. **The zip itself**: `zipfile.ZIP_DEFLATED, compresslevel=9`.

Order matters: `SHA256SUMS.txt` is computed over the staged files before zipping, so the checksums describe the content, not the container.

## Part 3: Verification gates

### Gate A: Reopen and testzip

Reopen the written zip and call `testzip()`. It must be clean (returns no bad member). This catches CRC errors in any member.

### Gate B: Per-file checksum match

Every file inside the reopened archive must match its `SHA256SUMS.txt` line before the run reports done. `testzip()` only proves each member matches its own CRC; the sha256 match proves each member matches what was fetched.

### Gate C: Zero-error gate

Step 8: abort the zip entirely if any KV or vector fetch failed. The ground source states the reason directly: a partial backup is worse than none. A partial archive with a clean `testzip()` looks healthy and invites a restore that silently drops data. The denominators come from earlier phases:

- KV: census key count from doc 03 versus fetched values.
- Vectorize: index `vectorCount` versus NDJSON lines from doc 04.

### Gate summary

| Gate | Catches | Action on failure |
|---|---|---|
| Zero-error | Any failed KV or vector fetch | Abort, no zip |
| testzip() | Corrupt member CRC | Rebuild |
| SHA256SUMS match | Content drift between fetch and archive | Rebuild |

## Part 4: The sandbox lesson (single-pass pattern)

The ground source records a platform-level hazard from the 2026-10-10 run: a `run_script` that logs `Failed to commit changes` can silently revert its loose-file writes between calls. In that run, 1,919 kv `.value` files vanished while files written by earlier runs survived.

The prescribed pattern:

1. Fetch everything into memory.
2. Write the final zip in a SINGLE `run_script`.
3. Verify on disk in a separate `bash` call.

Why this works: the zip is one file written once, so there is no window in which hundreds of loose files can be partially reverted. The separate bash verification proves the artifact survived the commit boundary, which an in-script check cannot prove.

## Part 5: Output location and report

Per "Guidelines":

- Location: the space's documents folder alongside prior backups (`documents/github-yubios-KS9n5GAT/`).
- Naming: `cloudflare-deployment-backup-YYYY-MM-DD.zip` when the account holds multiple workers; the older `steady-orbit-cf-backup-YYYY-MM-DD.zip` for single-worker runs.
- Report: zip path, size, sha256, entry count, contents, deliberate exclusions, and the one open caveat (Vectorize upsert path unverified). Terse, no preamble.

The 2026-10-10 reference report: 38.7 MB, sha256 `f54e4a50...` (truncated in the ground source), 2,016 entries, checksums verified inside the archive.

## Sources Considered

| Source | Type | Note |
|---|---|---|
| `yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md` | Internal record (ground source) | Internal-record subtopic grounded in yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md, no external web dig |
