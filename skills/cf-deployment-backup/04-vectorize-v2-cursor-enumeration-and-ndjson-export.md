# 04: Vectorize v2 Cursor Enumeration and NDJSON Export

**Scope:** Enumerating Vectorize v2 indexes via `GET /vectorize/v2/indexes/{name}/list?count=1000` + `nextCursor` (since list-vectors 404s) and fetching vectors via `POST /get_by_ids` in batches of 20.

**Ground source:** `yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md` ("Procedure" step 5, RESTORE.md checklist, "Examples", "Guidelines"). External claims below cite Clef-weighted searXNG dig results from `dig_context_04.json`. Outline score: 1.7085 (load-bearing probability 0.7722, confidence 0.4410; the lowest-scored doc in the outline, but kept as load-bearing).

## The problem: no obvious list-vectors route

The ground source records a negative finding first: there is NO list-vectors REST route under the names an operator would guess. Both `list-vectors` and `list_vectors` probe 404. The working enumeration path is `GET /vectorize/v2/indexes/{name}/list?count=1000`.

Cloudflare's API reference groups Vectorize under v2 index routes, starting at `GET /accounts/{account_id}/vectorize/v2/indexes` (https://developers.cloudflare.com/api/resources/vectorize/, clef weight: 0.8603), the strongest-weighted source in this entire corpus. The official Go SDK's Vectorize API listing is also authoritative for the method surface (https://github.com/cloudflare/cloudflare-go/blob/main/vectorize/api.md, clef weight: 0.6079). A third-party connector catalog has a page titled "List Vectors Using Vectorize v2 Indexes" (https://www.withone.ai/knowledge/cloudflare/conn_mod_def%3A%3AGLv3HY9_abs%3A%3AIBelnYubTgKvVeC_SyKi0A, clef weight: 0.2469) (weak backing, clef weight < 0.5), which suggests the capability exists under a different path than the guessed slugs. The precise path and parameters in this doc come from the ground source's validated 2026-10-10 run.

## Phase A: Cursor enumeration of ids

Per the ground source:

1. `GET /vectorize/v2/indexes/{name}/list?count=1000`.
2. Follow `nextCursor` on each response.
3. Stop only when `isTruncated` is false.

The stop condition is `isTruncated`, not "fewer than 1000 rows returned". A short page with `isTruncated: true` is still a continuation.

## Phase B: Full-vector fetch via get_by_ids

The list route returns ids, not vectors. Full vectors (values plus metadata) come from `POST /vectorize/v2/indexes/{name}/get_by_ids` in batches of 20 ids (ground source, step 5). The Workers binding reference documents the same family of operations (insert, upsert, query, manage) for the in-Worker client (https://developers.cloudflare.com/vectorize/reference/client-api/, clef weight: 0.5910).

### Two response shapes

The ground source warns that the result may arrive as a bare list OR as `{"result": {"vectors": [...]}}`. The parser must accept both. A parser that only handles one shape will either crash or, worse, record zero vectors per batch and pass a loose completeness check.

## Phase C: NDJSON output and count cross-check

Write one NDJSON line per vector with four fields:

| Field | Content |
|---|---|
| `id` | Vector id from the list pass |
| `values` | Float array (dimension per index config) |
| `metadata` | Stored metadata object |
| `namespace` | Vectorize namespace, if set |

Then cross-check the line count against the index info's `vectorCount`. A mismatch fails the zero-error gate and aborts the zip (doc 05). NDJSON is a natural restore format: a third-party RAG guide describes storing embeddings "in Cloudflare Vectorize using NDJSON format" (https://docs.neosantara.xyz/en/guides/rag-cloudflare-vectorize-example, clef weight: 0.2457) (weak backing, clef weight < 0.5).

## Phase D: Restore implications

The RESTORE.md checklist (ground source) says: recreate each index from `info.json` config (dimensions 768, metric cosine), then upsert the NDJSON in batches; verify the upsert path against current Cloudflare docs first and allow settle time, since Vectorize is eventually consistent.

Cloudflare's index guide covers configuring dimensions and choosing distance metrics (https://developers.cloudflare.com/vectorize/best-practices/create-indexes/, clef weight: 0.4268) (weak backing, clef weight < 0.5), and its insert guide covers insert and upsert "including supported formats and namespaces" (https://developers.cloudflare.com/vectorize/best-practices/insert-vectors/, clef weight: 0.1959) (weak backing, clef weight < 0.5). Both are official Cloudflare pages but scored below 0.5 in this dig, so the restore path stays flagged. The ground source's "Guidelines" section names this as the one open caveat in the report format: Vectorize upsert path unverified.

Dimension and metric are immutable index config, so they must be read from `info.json`, never assumed. The 768/cosine values are what the steady-orbit indexes used.

## Validated scale

The 2026-10-10 run produced the first full Vectorize export: 2,100 + 6 vectors (recorded as two counts in the ground source), inside the 38.7 MB, 2,016-entry zip (ground source, "Examples"). Earlier runs (2026-09-26, 2026-10-06) predate full vector export.

## Failure checklist

- Guessed `list-vectors` path returns 404: use `/list?count=1000`.
- Loop stops early: stop only on `isTruncated == false`.
- Zero vectors per batch: handle both response shapes.
- Silent partial export: compare NDJSON lines to `vectorCount`.
- Wrong index on restore: recreate from `info.json` dimensions and metric.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Vectorize API, Cloudflare Vectorize docs | https://developers.cloudflare.com/vectorize/reference/client-api/ | 0.5910 | authoritative |
| 2 | Vectorize, Cloudflare API | https://developers.cloudflare.com/api/resources/vectorize/ | 0.8603 | authoritative |
| 3 | cloudflare-go vectorize/api.md | https://github.com/cloudflare/cloudflare-go/blob/main/vectorize/api.md | 0.6079 | authoritative |
| 4 | Cloudflare homepage | https://www.cloudflare.com/ | 0.0246 | weak backing, clef weight < 0.5 (marketing; not cited) |
| 5 | List Vectors Using Vectorize v2 Indexes, withone.ai | https://www.withone.ai/knowledge/cloudflare/conn_mod_def%3A%3AGLv3HY9_abs%3A%3AIBelnYubTgKvVeC_SyKi0A | 0.2469 | weak backing, clef weight < 0.5 |
| 6 | Create indexes, Cloudflare Vectorize docs | https://developers.cloudflare.com/vectorize/best-practices/create-indexes/ | 0.4268 | weak backing, clef weight < 0.5 |
| 7 | Insert vectors, Cloudflare Vectorize docs | https://developers.cloudflare.com/vectorize/best-practices/insert-vectors/ | 0.1959 | weak backing, clef weight < 0.5 |
| 8 | RAG with Neosantara and Cloudflare Vectorize | https://docs.neosantara.xyz/en/guides/rag-cloudflare-vectorize-example | 0.2457 | weak backing, clef weight < 0.5 |
| 9 | Vectorize, cloudflare-typescript, DeepWiki | https://deepwiki.com/cloudflare/cloudflare-typescript/6.4-vectorize | 0.2195 | weak backing, clef weight < 0.5 (aggregator; not cited) |
| 10 | Cloudflare homepage | https://www.cloudflare.com/ | 0.0384 | weak backing, clef weight < 0.5 (marketing; not cited) |
