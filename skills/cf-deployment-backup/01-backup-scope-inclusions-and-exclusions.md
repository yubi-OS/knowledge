# 01: Backup Scope, Inclusions and Exclusions

**Scope:** Default backup scope (worker bundles, settings, schedules, subdomains, KV, Vectorize, Analytics Engine snapshot, Secrets Store names) and default exclusions (D1 data, write-only secret values).

**Ground source:** `yubi-OS/yubiOS skills/cf-deployment-backup/SKILL.md` (sections "Scope", "Procedure", "Guidelines"). External claims below cite Clef-weighted searXNG dig results from `dig_context_01.json`. Outline score: 1.8979 (load-bearing probability 0.9277).

## Why scope is decided up front

The skill's contract is "one verified zip" for an entire Cloudflare account deployment. The scope line determines what the zip can and cannot restore, so it is written into the archive itself: step 7 of the procedure requires a `MANIFEST.json` that records counts, sizes, and exclusions, plus a `RESTORE.md` that names every gap (ground source, "Procedure" step 7). A backup whose exclusions are implicit cannot be audited later.

## Included by default

Per the ground source "Scope" section, a default run captures:

| Artifact | What is stored |
|---|---|
| Worker bundles | Raw multipart bundle plus parsed `modules/` per worker |
| Per-worker config | `/settings`, `/schedules`, `/subdomain`, `/versions` lists |
| Custom domains | `workers-custom-domains.json` from `/workers/domains` |
| KV | Every key and every value in the namespace |
| Vectorize | Full index export: ids, values, metadata |
| Analytics Engine | SQL snapshot (point in time) |
| Secrets Store | Secret NAMES and metadata only |
| Service inventory | R2, queues, Hyperdrive, Durable Objects, dispatch namespaces, D1 names |

The Workers settings surface is documented by Cloudflare as a dedicated API method, "Get Worker Script and Version Settings" (https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/script_and_version_settings/methods/get/, clef weight: 0.3717) (weak backing, clef weight < 0.5). The Workers docs overview also lists "Multipart upload metadata" as a configuration topic (https://developers.cloudflare.com/workers/, clef weight: 0.2466) (weak backing, clef weight < 0.5), which is consistent with the skill treating the worker bundle as multipart and rebuilding an `upload-metadata.json` for restore. A third-party summary of the TypeScript SDK describes the Workers Scripts resource as covering "script upload, versioning, configuration management, bindings" (https://deepwiki.com/cloudflare/cloudflare-typescript/5.1-workers-scripts, clef weight: 0.1330) (weak backing, clef weight < 0.5). None of these dig hits cleared the 0.5 bar for the Workers half of the scope, so the per-endpoint list rests on the ground source's validated runs rather than on external citation.

## Excluded by default

The ground source names four default exclusions:

1. **D1 data.** Inventory only. Dumps are included only when the user asks, and then via `LIMIT/OFFSET` chunks, because the export-API poll route returns 404 and a full-table `SELECT` returns 503 past roughly 540 rows. The 2026-09-26 run is the reference for a D1-inclusive variant (fits 10, maps 540 chunked, outcomes 1,283 rows).
2. **Secret values.** Secrets Store is write-only. A `secret_text` binding such as `AE_SQL_TOKEN` can never be read back, so `RESTORE.md` instructs the operator to mint a fresh token.
3. **Old version bundles.** The versions endpoint is metadata-only, so prior code is not recoverable from the account.
4. **R2 and queues when not enabled.** An R2 call that returns 403 with code 10042 means the product is not enabled on the account.

### External backing for the secrets exclusion

The secrets exclusion is the one scope decision with authoritative external support. Cloudflare's Workers secrets page states that secret values "are not visible within Wrangler or Cloudflare dashboard after you define them" and points to Secrets Store (beta) as the account-level counterpart (https://developers.cloudflare.com/workers/configuration/secrets/, clef weight: 0.5489). The Secrets Store API reference exposes a list route, `GET /accounts/{account_id}/secrets_store/stores/{store_id}/secrets` (https://developers.cloudflare.com/api/resources/secrets_store/, clef weight: 0.3208) (weak backing, clef weight < 0.5), which matches the skill's choice to archive names and metadata. The Secrets Store overview describes it as "a secure, centralized location in which account-level secrets are stored and managed" (https://developers.cloudflare.com/secrets-store/, clef weight: 0.3237) (weak backing, clef weight < 0.5).

## Restore implications of the scope

Every exclusion maps to a restore action:

- Secrets: re-enter each named secret into the Secrets Store before uploading workers that bind them; `secrets_store_secret` bindings re-attach by `secret_name` + `store_id` (ground source, "Procedure" step 3 and RESTORE checklist).
- Analytics Engine: archive only, roughly 3-month retention, no restore path.
- D1: recreate from source or from an explicitly requested dump.

## Known account facts (sanity-check, never hard-code)

The ground source lists account `b57ee20cd90ebc4e4db28728e450a4b8`, KV namespace `steady-orbit-site` (`b9de35ecd3ca44999b38cfd107c0d44a`), Secrets Store `default_secrets_store` (`e3ace10c85d24a1ca886be3773d6d963`), and workers.dev subdomain `systems-a`. These are to be read live and cross-checked against the manifest, because the worker list drifts: `antimony` appeared after the 2026-10-06 backup.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Get Worker Script and Version Settings, Cloudflare API | https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/script_and_version_settings/methods/get/ | 0.3717 | weak backing, clef weight < 0.5 |
| 2 | cloudflare-docs workers-multipart-usage (R2) | https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/r2/api/workers/workers-multipart-usage.mdx | 0.0685 | weak backing, clef weight < 0.5 (off-topic: R2 uploads; not cited) |
| 3 | Workers Scripts, cloudflare-typescript, DeepWiki | https://deepwiki.com/cloudflare/cloudflare-typescript/5.1-workers-scripts | 0.1330 | weak backing, clef weight < 0.5 |
| 4 | Cloudflare homepage | https://www.cloudflare.com/ | 0.0445 | weak backing, clef weight < 0.5 (marketing; not cited) |
| 5 | Overview, Cloudflare Workers docs | https://developers.cloudflare.com/workers/ | 0.2466 | weak backing, clef weight < 0.5 |
| 6 | Secrets, Cloudflare Workers docs | https://developers.cloudflare.com/workers/configuration/secrets/ | 0.5489 | authoritative |
| 7 | Secrets Store, Cloudflare API | https://developers.cloudflare.com/api/resources/secrets_store/ | 0.3208 | weak backing, clef weight < 0.5 |
| 8 | Overview, Cloudflare Secrets Store docs | https://developers.cloudflare.com/secrets-store/ | 0.3237 | weak backing, clef weight < 0.5 |
| 9 | Secrets Store, cloudflare/api-schemas, DeepWiki | https://deepwiki.com/cloudflare/api-schemas/3.5.3-secrets-store | 0.1055 | weak backing, clef weight < 0.5 (aggregator; not cited) |
| 10 | Cloudflare homepage | https://www.cloudflare.com/ | 0.0522 | weak backing, clef weight < 0.5 (marketing; not cited) |
