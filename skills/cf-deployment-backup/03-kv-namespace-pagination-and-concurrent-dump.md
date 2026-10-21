# 03: KV Namespace Pagination and Concurrent Dump

**Scope:** Paginating KV keys (limit=1000 + cursor), concurrent value downloads with URL-encoding and retry backoff, md5 value filenames, and kv-keymap.json sha256 manifest.

**Ground source:** `yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md` ("Procedure" step 4, "Sandbox lesson", RESTORE.md checklist, "Examples"). External claims below cite Clef-weighted searXNG dig results from `dig_context_03.json`. Outline score: 1.8870 (load-bearing probability 0.9116).

This is the best-backed subtopic in the corpus: 3 of 10 dig results cleared the 0.5 authoritative bar.

## Phase A: Key census via cursor pagination

The ground source specifies: paginate keys with `limit=1000` plus `cursor`, collecting a census of every key with its `name`, `expiration`, and `metadata`.

Cloudflare documents key enumeration as a paginated operation: the KV "List keys" page describes enumerating "all keys in a Workers KV namespace using the list() method, with support for pagination and filtering by prefix" (https://developers.cloudflare.com/kv/api/list-keys/, clef weight: 0.7505). The broader KV binding API page covers read, write, delete, and list of key-value pairs (https://developers.cloudflare.com/kv/api/, clef weight: 0.7435). Those pages document the Worker binding; the skill applies the same cursor contract against the account REST route, which is the route the 2026-10-10 run validated.

Census rules drawn from the ground source:

- Loop until the response stops returning a cursor. Never assume one page is complete.
- Keep `expiration` and `metadata` per key, because restore must re-apply them.
- The census is the denominator for the zero-error gate (doc 05): fetched values must equal census rows.

## Phase B: Concurrent value fetch

Per the ground source, values are fetched with:

| Parameter | Value | Reason |
|---|---|---|
| Concurrency | 12 threads | Throughput without hammering the API |
| Retries | 4 with backoff | Absorb transient 429/5xx |
| Key encoding | `quote(k, safe='')` | Keys may contain `/`, spaces, or reserved characters |

The `safe=''` detail matters: Python's default `quote` leaves `/` unescaped, which turns a key like `a/b` into a different URL path and silently fetches the wrong object or 404s.

## Phase C: File naming and the keymap

Raw keys are unsafe as filenames (length, slashes, unicode), so each value is written to `kv/<md5(key)>.value`. md5 here is a naming hash, not an integrity check. Integrity lives in `kv-keymap.json`, which maps each key to:

- its value file,
- `sha256` of the value bytes,
- `bytes` (length),
- `expiration`,
- `metadata`.

Restore reads the keymap, not the directory listing, so a missing file is detectable as a keymap entry with no file.

## Phase D: Consistency caveats on restore

KV is eventually consistent, which shapes the restore verification step. Cloudflare's KV overview describes it as "a global, low-latency, key-value data store" (https://developers.cloudflare.com/kv/, clef weight: 0.6828), and the KV FAQ states that "Workers KV is eventually consistent" and replicates "through a hybrid push/pull replication approach" (https://developers.cloudflare.com/kv/reference/faq/, clef weight: 0.4323) (weak backing, clef weight < 0.5). A third-party post reports a write can take up to 60 seconds to propagate (https://askagent.dev/post/cloudflare-kv-eventual-consistency, clef weight: 0.0881) (weak backing, clef weight < 0.5); treat that number as unverified.

The ground source's own operational figure is a roughly 15-second propagation lag, so the RESTORE.md checklist requires: PUT raw bytes (never JSON-encoded text) per key from the keymap, then a delayed re-GET plus byte compare. JSON-encoding a binary or already-serialized value is the classic restore corruption: the bytes come back quoted and escaped.

## Phase E: The sandbox write-loss lesson

The 2026-10-10 run surfaced a platform hazard directly in this phase: a `run_script` that logged `Failed to commit changes` silently reverted its loose-file writes, and 1,919 kv `.value` files vanished while files from earlier runs survived (ground source, "Sandbox lesson"). The fix is structural: fetch everything into memory and write the final zip in a SINGLE `run_script`, then verify on disk in a separate bash call (doc 05).

## Validated scale

The 2026-10-10 run dumped all 1,919 KV values (48.2 MB) with zero errors, inside a 38.7 MB zip of 2,016 entries (ground source, "Examples"). The namespace in scope was `steady-orbit-site` (`b9de35ecd3ca44999b38cfd107c0d44a`).

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | List keys, Cloudflare Workers KV docs | https://developers.cloudflare.com/kv/api/list-keys/ | 0.7505 | authoritative |
| 2 | Workers Binding API, Cloudflare Workers KV docs | https://developers.cloudflare.com/kv/api/ | 0.7435 | authoritative |
| 3 | Cloudflare Workers KV docs (landing) | https://developers.cloudflare.com/kv/ | 0.1510 | weak backing, clef weight < 0.5 (same URL also scored 0.6828 under query 2) |
| 4 | Cloudflare homepage | https://www.cloudflare.com/ | 0.0221 | weak backing, clef weight < 0.5 (marketing; not cited) |
| 5 | JSON in Cloudflare Workers KV, jsonic.io | https://jsonic.io/guides/json-in-cloudflare-kv | 0.2555 | weak backing, clef weight < 0.5 (not cited) |
| 6 | Cloudflare Workers KV (overview) | https://developers.cloudflare.com/kv/ | 0.6828 | authoritative |
| 7 | Cloudflare KV returned stale data after a write, askagent.dev | https://askagent.dev/post/cloudflare-kv-eventual-consistency | 0.0881 | weak backing, clef weight < 0.5 |
| 8 | Workers KV Consistency, urhoba.net | https://www.urhoba.net/en/post/cloudflare-guide-kv-consistency-and-suitable-use-cases | 0.0585 | weak backing, clef weight < 0.5 (not cited) |
| 9 | FAQ, Cloudflare Workers KV docs | https://developers.cloudflare.com/kv/reference/faq/ | 0.4323 | weak backing, clef weight < 0.5 |
| 10 | Cloudflare homepage | https://www.cloudflare.com/ | 0.0251 | weak backing, clef weight < 0.5 (marketing; not cited) |
