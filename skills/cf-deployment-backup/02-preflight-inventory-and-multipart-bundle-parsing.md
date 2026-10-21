# 02: Preflight, Inventory Pass, and Multipart Bundle Parsing

**Scope:** Live account inventory pass across Workers, Domains, KV, Vectorize, R2 (10042), D1, Hyperdrive, Durable Objects, and parsing multipart Worker bundles by Content-Type boundary.

**Ground source:** `yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md` ("Procedure" steps 1 to 3, "Guidelines").

> Internal-record subtopic grounded in yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md, no external web dig.

Outline score: 1.8572 (load-bearing probability 0.8951, confidence 0.7108).

## Step 1: Preflight rules

The ground source lists four preflight requirements before any account call:

1. **Pass the Cloudflare connection** in the tool's `connections` parameter. The proxy only injects credentials when the connection is passed explicitly.
2. **Always send an explicit `User-Agent` header.** Header-less fetches fail with HTTP 400 or Cloudflare error 1010. This applies to every call in the run, not only the first.
3. **Stage under `session/<dir>` using absolute paths.** Relative paths drift between tool calls.
4. **Read the worker list live** via `GET /accounts/{acc}/workers/scripts`. It drifts between backups: the `antimony` worker appeared after the 2026-10-06 backup, so a hard-coded list from a prior run would have silently omitted it.

The "Guidelines" section adds known account facts to sanity-check (never to substitute for a live read): account `b57ee20cd90ebc4e4db28728e450a4b8`, KV namespace `b9de35ecd3ca44999b38cfd107c0d44a`, Secrets Store `e3ace10c85d24a1ca886be3773d6d963`, workers.dev subdomain `systems-a`.

## Step 2: The inventory pass (one run_script)

All inventory reads run inside ONE `run_script` and each response is saved as JSON. The account-level endpoints are:

| Endpoint | Purpose | Note |
|---|---|---|
| `GET /workers/scripts` | Worker list | Drives the per-worker loop |
| `GET /workers/domains` | Custom domains | Feeds `workers-custom-domains.json` |
| `GET /storage/kv/namespaces` | KV namespaces | Feeds doc 03 |
| `GET /vectorize/v2/indexes` | Vectorize indexes | Feeds doc 04 |
| `GET /queues` | Queues | Inventory only |
| `GET /r2/buckets` | R2 buckets | 403 code 10042 = R2 not enabled |
| `GET /d1/database` | D1 databases | Names only by default |
| `GET /hyperdrive/configs` | Hyperdrive | Inventory only |
| `GET /workers/durable_objects/namespaces` | Durable Objects | Inventory only |
| `GET /workers/dispatch/namespaces` | Dispatch namespaces | Inventory only |

Then, for each worker returned by the live list: `/settings`, `/schedules`, `/subdomain`, and `/versions`. The versions endpoint is metadata-only, which is why old version bundles are a default exclusion (see doc 01).

### Reading "not enabled" responses correctly

The R2 case is the template: a 403 with code 10042 is a product-state answer, not an auth failure. The inventory records it as "not enabled" and the run continues. The ground source excludes R2 and queues "when not enabled on the account", so the manifest must carry the reason rather than an empty array that looks like a successful zero-count read.

## Step 3: Worker bundles and multipart parsing

`GET /accounts/{acc}/workers/scripts/{name}` returns a multipart body, not JSON. The ground source procedure is:

1. **Parse the boundary from the `Content-Type` response header.** Do not guess a boundary or split on a fixed string.
2. **Save the raw bundle** unchanged (for forensic comparison).
3. **Save each named part** into `workers/{name}/modules/`. Parts carry `name=` only, with no `filename=`, so the part name is the module path. Names can include a `fixtures/` prefix, which the restore step depends on (doc 06).
4. **Assert the main module file exists** in `modules/` before building `upload-metadata.json`.

### What goes into upload-metadata.json

The ground source lists the fields: `main_module`, `compatibility_date`, compatibility flags, `usage_model`, and `bindings`. Three binding rules apply:

- Do NOT send `keep_bindings`.
- `secret_text` bindings carry no value (Secrets Store and per-worker secrets are write-only).
- `secrets_store_secret` bindings re-attach by `secret_name` + `store_id`.

The main-module assertion is a cheap gate against the most damaging failure: a metadata file pointing at a module that was never written produces a backup that looks complete but cannot be uploaded.

## Failure modes this step prevents

| Failure | Guard |
|---|---|
| 400 / 1010 on every call | Explicit `User-Agent` header |
| Missing new worker | Live `GET /workers/scripts`, never a cached list |
| R2 403 read as auth failure | Interpret code 10042 as "not enabled" |
| Corrupt module split | Boundary parsed from `Content-Type` |
| Unuploadable bundle | Main-module existence assert before metadata |
| Stale or leaked secrets | No values captured; restore re-entry (doc 06) |

## Where the outputs go next

The inventory JSON feeds `MANIFEST.json` (doc 05), the KV namespace list feeds the dump (doc 03), the Vectorize index list feeds the export (doc 04), and the per-worker modules plus metadata feed the `RESTORE.md` multipart PUT (doc 06). The complementary `steady-orbit-deploy` skill owns the deploy-side bundle recipes; this skill owns the full-account backup shape (ground source, "Guidelines").

## Sources Considered

| Source | Type | Note |
|---|---|---|
| `yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md` | Internal record (ground source) | Internal-record subtopic grounded in yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md, no external web dig |
