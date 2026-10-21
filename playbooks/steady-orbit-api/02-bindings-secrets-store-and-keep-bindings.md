# 02: Bindings, Secrets Store, and `keep_bindings`

**Scope:** the 15 worker bindings (AI, D1, KV, Vectorize x2, WAE, Ratelimit, `AE_SQL_TOKEN` `secret_text`, 7 Secrets Store secrets), dual `.get()` vs string resolution, and `keep_bindings: ["secret_text"]`.

**Ground source:** `yubi-OS/yubiOS playbooks/steady-orbit-api.md` (2026-10-21, deploy etag `356cb5c1c2e3e3f8b308ba6e29ab06bf27fd99fc107cc9d7f60b01d0dfb7e6b7`). All steady-orbit specifics below come from that playbook. External framing comes from the Clef-weighted searXNG dig in `dig_context_02.json`: 4 of its 10 results scored at or above 0.5 (authoritative backing); the rest are labeled weak.

## 1. The 15 bindings

| # | Binding | Type | Target |
|---|---|---|---|
| 1 | `AI` | Workers AI | `@cf/cloudflare/clef`, `@cf/cloudflare/clairic` callers |
| 2 | `DB` | D1 | `sos-agent` |
| 3 | `SITE` | KV | `steady-orbit-site` |
| 4 | `VEC` | Vectorize | `sos-embeddings` |
| 5 | `EVEC` | Vectorize | `jev-evolution` |
| 6 | `TS` | Analytics Engine | dataset `jev` |
| 7 | `WEBSITE_RATE_LIMIT` | ratelimit | site rate limiting |
| 8 | `AE_SQL_TOKEN` | `secret_text` | WAE SQL API token |
| 9 to 15 | `DAYTONA_API_KEY`, `ELEVENLABS_API_KEY`, `GITHUB_API_KEY`, `GOOGLE_PLACES_API_KEY`, `JEV_API_KEY`, `NORTHFLANK_API_KEY`, `RESEND_API_KEY` | Secrets Store | account-level secrets |

Cloudflare's bindings reference frames why this shape exists: with bindings you never add secret keys or tokens to the Worker itself, because the permission is embedded in the API ([Bindings (env)](https://developers.cloudflare.com/workers/runtime-apis/bindings/), clef weight: 0.8615).

## 2. Two secret shapes, one resolver

The worker carries **two different secret mechanisms**, and they behave differently at runtime:

- **`secret_text` (Workers secret):** `env.AE_SQL_TOKEN` is a plain string. Calling `.get()` on it is a bug. Workers secrets are documented on their own page, including the `secrets` configuration property used to declare required secret names ([Secrets](https://developers.cloudflare.com/workers/configuration/secrets/), clef weight: 0.8438; same page from the second query, clef weight: 0.7675).
- **Secrets Store secret:** `env.GITHUB_API_KEY` and the other 6 are binding objects that must be awaited: `await env.X.get()`. Cloudflare documents Secrets Store values in Workers as distinct from Workers Variables and Secrets ([Secrets Store Workers integration](https://developers.cloudflare.com/secrets-store/integrations/workers/), clef weight: 0.8279). The Secrets Store launch post says the Worker retrieves the value at call time and Cloudflare verifies the Worker holds an appropriate binding ([Secrets Store beta blog](https://blog.cloudflare.com/secrets-store-beta/), clef weight: 0.4649, weak backing, clef weight < 0.5).

The ground-source failure modes: calling `.get()` on `AE_SQL_TOKEN`, or forgetting `await binding.get()` on a Secrets Store binding, which stringifies the object and sends `[object Object]` as the credential (auth failure).

Decision 3's resolver handles both shapes in one line:

```js
const val = typeof raw === "string"
  ? raw
  : (raw && typeof raw.get === "function" ? await raw.get() : null);
```

A `null` result should be treated as "credential unavailable" and fail closed, not as an empty string to send upstream.

## 3. `keep_bindings: ["secret_text"]` on deploy

The deploy path (Mechanism step 2) rebuilds `meta.json` from `GET .../workers/scripts/steady-orbit/settings`. The trap: `GET /settings` lists the `secret_text` binding but **omits its value**. Re-uploading it verbatim either fails or blanks the secret. Passing an invalid type in `keep_bindings` yields upload rejection `10021`.

The ground-source recipe:

```python
explicit = [b for b in st["bindings"] if b.get("type") != "secret_text"]
meta = {
  "main_module": "solar-rbs-entry.mjs",
  "compatibility_date": st.get("compatibility_date", "2026-09-01"),
  "bindings": explicit,
  "keep_bindings": ["secret_text"],
  "limits": st.get("limits", {"cpu_ms": 300000}),
}
```

So: drop every `secret_text` entry from `bindings`, ask the platform to keep existing `secret_text` bindings by type, and carry `limits: {"cpu_ms": 300000}` forward. All other 14 bindings (including the 7 Secrets Store bindings, which hold references, not values) are re-declared explicitly.

The wider ecosystem shows the same hazard. A Terraform provider issue reports that if an existing `secret_text_binding` is not included on deploy, Terraform removes it from the Worker ([terraform-provider-cloudflare #2393](https://github.com/cloudflare/terraform-provider-cloudflare/issues/2393), clef weight: 0.1932, weak backing, clef weight < 0.5). A Cloudflare community thread asks how updated code can preserve `secret_text` bindings when stored and deployed Worker versions differ ([community thread 963348](https://community.cloudflare.com/t/preserving-secret-text-bindings-when-stored-and-deployed-worker-versions-differ/963348), clef weight: 0.1276, weak backing, clef weight < 0.5). Both are forum or issue-tracker sources and are cited only as corroborating symptoms, not as authority.

## 4. Verifying after a deploy

The ground source's live verification (2026-10-21) confirmed 15 bindings including `AE_SQL_TOKEN` after the deploy. Practical checks:

1. Re-fetch `/settings`; count bindings == 15 and `AE_SQL_TOKEN` is present with type `secret_text`.
2. Wait 15 to 20 seconds, then hit `GET /api/jev/timeseries/selftest` (exercises `AE_SQL_TOKEN` through the WAE SQL read path).
3. Hit a route that uses a Secrets Store key behind `jev-execute.js` host scoping (see doc 03) to confirm `await .get()` resolution.

Related WAE pitfall from the ground source: `ORDER BY timestamp` without `timestamp` in the `SELECT` list returns `422 unable to find type of column`.

## 5. Rules of thumb

- Never copy `GET /settings` bindings straight into an upload.
- Never hardcode a secret value into `meta.json`.
- Resolve every credential through the dual-shape resolver.
- A basic third-party guide covers worker-level vs other secret options, but it is a gist, not authority ([AndreiDrang gist](https://gist.github.com/AndreiDrang/75e278fc1b4c51a173721339230ef811), clef weight: 0.1264, weak backing, clef weight < 0.5).

## Sources Considered

| # | URL | Clef weight | Backing | Used |
|---|---|---|---|---|
| 1 | https://developers.cloudflare.com/secrets-store/integrations/workers/ | 0.8279 | authoritative | yes, section 2 |
| 2 | https://developers.cloudflare.com/workers/configuration/secrets/ | 0.8438 | authoritative | yes, section 2 |
| 3 | https://blog.cloudflare.com/secrets-store-beta/ | 0.4649 | weak backing, clef weight < 0.5 | yes, section 2 |
| 4 | https://gist.github.com/AndreiDrang/75e278fc1b4c51a173721339230ef811 | 0.1264 | weak backing, clef weight < 0.5 | yes, section 5 |
| 5 | https://www.cloudflare.com/ | 0.0229 | weak backing, clef weight < 0.5 | no (marketing) |
| 6 | https://developers.cloudflare.com/workers/configuration/secrets/ | 0.7675 | authoritative | yes, section 2 (duplicate hit) |
| 7 | https://github.com/cloudflare/terraform-provider-cloudflare/issues/2393 | 0.1932 | weak backing, clef weight < 0.5 | yes, section 3 |
| 8 | https://developers.cloudflare.com/workers/runtime-apis/bindings/ | 0.8615 | authoritative | yes, section 1 |
| 9 | https://community.cloudflare.com/t/preserving-secret-text-bindings-when-stored-and-deployed-worker-versions-differ/963348 | 0.1276 | weak backing, clef weight < 0.5 | yes, section 3 |
| 10 | https://www.cloudflare.com/ | 0.0217 | weak backing, clef weight < 0.5 | no (duplicate marketing) |

Primary authority for every steady-orbit fact here: `yubi-OS/yubiOS playbooks/steady-orbit-api.md`.
