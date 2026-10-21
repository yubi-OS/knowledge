# 05: WAE SQL and Worker Deploy Lessons

**Scope.** 5 production deploy lessons from the 2026-10-08 jev-timeseries rollout: the `secret_text` plain-string shape vs `.get()`, `timestamp` in SELECT for `ORDER BY`, curl `-F` metadata framing, WAE SQL read lag, and `X-Sauna-Connection-Id: none` for no-auth tests.

**Ground source:** `yubi-OS/yubiOS skills/jev-timeseries/SKILL.md` (section "Deploy lessons (2026-10-08, etag chain 7f8fa641 -> dda2f487 -> f0c6d7c7 -> f2313fa6)"). External platform claims are backed by the Clef-weighted searXNG dig in `dig_context_05.json`; each citation carries its clef weight inline.

## Context: 4 deploys to get it right

The etag chain `7f8fa641 -> dda2f487 -> f0c6d7c7 -> f2313fa6` records 4 successive worker bundles on 2026-10-08. Each lesson below cost at least one of those redeploys. They are recorded so the next series or route addition does not repeat them.

## Lesson 1: `secret_text` bindings are plain strings

**Symptom class:** calling `.get()` on the SQL token throws, so every forecast read fails closed with `503 MISSING_READ_TOKEN` or a runtime error.

**Rule (ground source):** a `secret_text` binding surfaces as a plain string; `env.AE_SQL_TOKEN` is a string, **not** an object with `.get()`. The `.get()` shape belongs to `secrets_store_secret` bindings. The jev module tolerates both:

```js
const tok = typeof t === "string" ? t : await t.get();
```

**Why it bites:** both binding types are declared in the same multipart `metadata` part (Lesson 3), and the code that reads them looks similar. Cloudflare documents that multipart uploads "require you to specify a metadata part" which "defines the Worker's configuration in JSON format, analogue to the wrangler.toml file" (https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/ (clef weight: 0.6580)). The binding `type` chosen there decides the runtime shape; code must match it or handle both.

## Lesson 2: `ORDER BY timestamp` needs `timestamp` in the SELECT

**Symptom:** `422 "unable to find type of column"` from the WAE SQL API.

**Rule (ground source):** the WAE time column is `timestamp`, settled empirically by the `SELECT *` schema probe. But `ORDER BY` on a column that is **not** in the SELECT list fails 422. Always project it:

```sql
SELECT timestamp, double1 FROM jev
WHERE index1 = 'task_terminal'
ORDER BY timestamp DESC
LIMIT 1000
```

The documentation backdrop: "Every event written from the runtime is automatically populated with a timestamp field" (https://developers.cloudflare.com/analytics/analytics-engine/get-started/ (clef weight: 0.5710)). The SQL reference is the canonical grammar page (https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/ (clef weight: 0.7411)), and the SQL API runs over HTTP with its own dialect (https://developers.cloudflare.com/analytics/analytics-engine/sql-api/ (clef weight: 0.6323)).

The ground source is explicit that `_timestamp` variants seen in some docs **do not exist** on this dataset. The empirical arbiter is `SELECT * FROM jev LIMIT 1` plus the selftest's `wae_schema_probe`; a live column list beats any page. Community posts about expanded SQL date and time functions exist (https://community.cloudflare.com/t/workers-analytics-engine-workers-more-sql-aggregate-date-and-time-functions-available-in-workers-analytics-engine/896842 (weak backing, clef weight < 0.5) (clef weight: 0.1834)) but say nothing about this ORDER BY constraint.

## Lesson 3: curl `-F=x` mangles the metadata part

**Symptom:** Cloudflare error `10021 "Could not read content for part 'metadata'"` on script upload.

**Rule (ground source):** the `-F=x` arg form mangles the multipart `metadata` field. Pass `-F` and its value as **separate** argv entries:

```bash
curl -X PUT ".../workers/scripts/steady-orbit" \
  -F "metadata=@metadata.json;type=application/json" \
  -F "worker.js=@worker.js;type=application/javascript+module"
```

When driving curl from an argv array (for example through a shell bridge), that means `["-F", "metadata=@metadata.json;type=application/json"]`, not `["-F=metadata=..."]`.

The metadata part is mandatory for direct API uploads (https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/ (clef weight: 0.6580)); the same content mirrored in the docs repo (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/workers/configuration/multipart-upload-metadata.mdx (weak backing, clef weight < 0.5) (clef weight: 0.3247)) adds no authority beyond the rendered page.

## Lesson 4: WAE reads lag writes by seconds

**Symptom:** the selftest writes a probe datapoint and an immediate SQL read returns 0 rows.

**Rule (ground source):** WAE SQL reads lag writes by a few seconds. The selftest reports `wae_read_back ok=true` with an honest "0 rows read back; propagation lag" note instead of failing. A deploy check that demands immediate read-after-write would fail every time and train operators to ignore it.

Related platform behavior: "At very high volumes of data, Analytics Engine will downsample data in order to be able to maintain performance. Sampling can occur on write and on read," keyed on the index (https://developers.cloudflare.com/analytics/analytics-engine/sql-api/ (clef weight: 0.6323)). Lag and sampling are distinct; at jev volume only lag is expected.

## Lesson 5: test no-auth paths with `X-Sauna-Connection-Id: none`

**Symptom:** a check that the forecast route returns 401 without a bearer instead gets 200.

**Rule (ground source):** when calling through the Sauna proxy, passing the operator connection injects the bearer on **every** fetch, which contaminates the 401 check. Send the unauthenticated probe with `X-Sauna-Connection-Id: none` so no credential is injected.

## Deploy checklist distilled

| # | check | pass condition |
|---|---|---|
| 1 | token read handles both binding shapes | `typeof t === "string"` branch present |
| 2 | every `ORDER BY` column is projected | no 422 from `/forecast` |
| 3 | multipart args are split | no CF 10021 on upload |
| 4 | selftest read-back tolerates lag | `wae_read_back ok=true` with lag note |
| 5 | 401 probe sent with connection `none` | unauthenticated call returns 401 |
| 6 | selftest top-level `ok:false` only from G2 and NEG_G2 | `cascade_selftest.ok: true` |

Row 6 is from the ground source's Forecast v4 rules: `ok:false` is not a deploy failure.

## Sources Considered

| # | URL | clef weight | backing | used |
|---|---|---|---|---|
| 1 | https://developers.cloudflare.com/analytics/analytics-engine/sql-api/ | 0.6323 | authoritative | yes (L2, L4) |
| 2 | https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/ | 0.7411 | authoritative | yes (L2) |
| 3 | https://developers.cloudflare.com/analytics/analytics-engine/get-started/ | 0.5710 | authoritative | yes (L2) |
| 4 | https://community.cloudflare.com/t/workers-analytics-engine-workers-more-sql-aggregate-date-and-time-functions-available-in-workers-analytics-engine/896842 | 0.1834 | weak backing, clef weight < 0.5 | yes, labeled (L2) |
| 5 | https://community.cloudflare.com/t/workers-analytics-engine-workers-more-sql-aggregate-date-and-time-functions-available-in-workers-analytics-engine/855971 | 0.2288 | weak backing, clef weight < 0.5 | no |
| 6 | https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/ | 0.6580 | authoritative | yes (L1, L3) |
| 7 | https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/workers/configuration/multipart-upload-metadata.mdx | 0.3247 | weak backing, clef weight < 0.5 | yes, labeled (L3) |
| 8 | https://www.cloudflare.com/ | 0.0295 | weak backing, clef weight < 0.5 | no (marketing) |
| 9 | https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/r2/api/workers/workers-multipart-usage.mdx | 0.2952 | weak backing, clef weight < 0.5 | no (R2, off-scope) |
| 10 | https://notjoemartinez.com/blog/cloudflare_r2_multipart_upload_s3sdk/ | 0.2043 | weak backing, clef weight < 0.5 | no (R2, off-scope) |

4 of 10 results at weight >= 0.5.
