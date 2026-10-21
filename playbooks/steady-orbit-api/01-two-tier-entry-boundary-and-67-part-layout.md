# 01: Two-Tier Entry Boundary and the 67-Part Module Layout

**Scope:** the `solar-rbs-entry.mjs` vs `index.js` vs `jev-main.js` boundary, the 67 ES module parts, the 4 path-qualified `fixtures/*.mjs` modules, and exact byte-preserving multipart extraction.

**Ground source:** `yubi-OS/yubiOS playbooks/steady-orbit-api.md` (playbook dated 2026-10-21, deploy etag `356cb5c1c2e3e3f8b308ba6e29ab06bf27fd99fc107cc9d7f60b01d0dfb7e6b7`, policy v24). Every claim about the steady-orbit worker in this doc comes from that playbook. External context comes from the Clef-weighted searXNG dig in `dig_context_01.json`; all 10 results there scored below 0.5, so every external citation below is labeled as weak backing.

## 1. What the worker is made of

Per the ground source, the `steady-orbit` Cloudflare Worker (`https://steady-orbit.systems-a.workers.dev`) ships as **67 ES module parts**:

| Group | Count | Members |
|---|---|---|
| Entrypoint | 1 | `solar-rbs-entry.mjs` (the `main_module`) |
| Core API | 1 | `index.js` (core API, point-map, public relays) |
| Feature modules | 61 | `jev-*.js` and `routes-*.js` |
| Fixtures | 4 | `fixtures/corpus-math-fixtures.mjs`, `fixtures/taste-fixtures.mjs`, `fixtures/spectral-fixtures.mjs`, `fixtures/lens-fixtures.mjs` |

1 + 1 + 61 + 4 = 67. The deploy metadata names `"main_module": "solar-rbs-entry.mjs"`. Cloudflare's own docs describe this JSON metadata block as the place where Workers configuration is defined for multipart form-data script uploads ([multipart upload metadata](https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/), clef weight: 0.2261, weak backing, clef weight < 0.5). Background on the ES modules format the parts use is in Cloudflare's migration guide ([migrate to module workers](https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/), clef weight: 0.1936, weak backing, clef weight < 0.5).

## 2. The two-tier entry boundary

The playbook's Decision 1 fixes a chain: `solar-rbs-entry.mjs` -> `index.js` -> `jev-main.js`.

- **Tier 1, `solar-rbs-entry.mjs`:** serves `website-v19/*` and `/radiant/` from KV namespace `SITE` (`steady-orbit-site`).
- **Delegation set `LEGACY_TERRITORY`:** `/api`, `/jev`, `/map`, `/sos`, `/audio`, `/AGENT.md`, `/llms.txt` are handed to `index.js`.
- **Tier 2, `index.js` -> `jev-main.js`:** core API, point-map, relays (`/api/decide`, `/api/chat`, `/api/tts`, `/api/stt`, `/api/contact`, `/api/searxng`), and the `/api/jev/*` family.

**Rule:** keep `solar-rbs-entry.mjs` byte-identical unless a new top-level site page route is being added to `PAGES`. The failure this prevents is concrete: on 2026-09-21 the entry was replaced with an API bundle and the marketing site broke.

Serving a static site out of KV from a Worker is an older, widely documented pattern ([How-To Geek KV static site walkthrough](https://www.howtogeek.com/devops/how-to-use-cloudflare-workers-and-kv-to-serve-a-static-site/), clef weight: 0.0407, weak backing, clef weight < 0.5). Cloudflare now also documents Workers static assets with asset-only and Worker-first routing modes ([static assets routing](https://developers.cloudflare.com/workers/static-assets/routing/), clef weight: 0.0264, weak backing, clef weight < 0.5). steady-orbit does not use static assets; its entry reads KV `SITE` directly, so the routing table lives in code (`PAGES` plus `LEGACY_TERRITORY`), not in asset config.

## 3. Fixture parts must keep their path

Decision 4: the 4 fixture modules are uploaded with their directory prefix intact, for example:

```
-F "fixtures/x.mjs=@.../fixtures/x.mjs;filename=fixtures/x.mjs;type=application/javascript+module"
```

Flattening `fixtures/corpus-math-fixtures.mjs` to `corpus-math-fixtures.mjs` during bundle extraction breaks the import graph and the upload fails with `10021 No such module`. The form field name, the `filename=`, and the on-disk relative path must all be the same path-qualified string. The playbook's upload loop derives `rel` with `os.path.relpath(fp, "session/worker_bundle/parts")`, which preserves the `fixtures/` prefix automatically, and uses `type=application/javascript+module` for every part.

## 4. Byte-preserving multipart extraction

Mechanism step 1 in the ground source pulls 3 artifacts with the Cloudflare connection (`X-Sauna-Connection-Id: conn_pd_apn_1KhdoD7`): the raw script bundle (with response headers saved to `bundle.headers`), `/settings`, and `/schedules`. It then splits the bundle with Python:

1. Read the `boundary=` value from `bundle.headers`.
2. Split `bundle.raw` on `--<boundary>`; stop at the closing `--` chunk.
3. Strip **exactly one** leading line break (`\r\n` or `\n`) and **exactly one** trailing line break per chunk.
4. Split part headers from body on the first `\r\n\r\n` (or `\n\n`).
5. Take `name="..."` from the part header and write the body bytes to `parts/<name>`, creating subdirectories (this is how `fixtures/` survives).

The critical constraint: never `rstrip()` trailing newlines. A module whose last byte is a newline loses it, its sha256 changes, and the per-part rollback hashes no longer match the live bundle. The ground source lists this as a recurring failure.

## 5. Pre-upload syntax gate

Mechanism step 2 runs `node --input-type=module --check` on every extracted part before upload and asserts return code 0, then sorts parts and uploads them with `curl -X PUT` to `.../workers/scripts/steady-orbit`, asserting `success is True` and printing the new etag and part count. A count other than 67 on a no-change redeploy is a signal that extraction dropped or flattened a part.

Note on R2: one dig hit discusses multipart uploads, but in the R2 object-storage sense and the stateless Worker usage model, not script upload ([cloudflare-docs R2 workers multipart usage](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/r2/api/workers/workers-multipart-usage.mdx), clef weight: 0.4143, weak backing, clef weight < 0.5). It is off-topic for script deploys and is listed only for completeness.

## 6. Operator checklist

- [ ] Entry diff is empty unless `PAGES` changed.
- [ ] 67 parts extracted; `fixtures/` directory has 4 `.mjs` files.
- [ ] No part hash changed for untouched modules.
- [ ] Every part passes `node --check`.
- [ ] Wait 15 to 20 seconds after the PUT before live probes.

## Sources Considered

| # | URL | Clef weight | Backing | Used |
|---|---|---|---|---|
| 1 | https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/ | 0.2261 | weak backing, clef weight < 0.5 | yes, section 1 |
| 2 | https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/ | 0.1936 | weak backing, clef weight < 0.5 | yes, section 1 |
| 3 | https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/r2/api/workers/workers-multipart-usage.mdx | 0.4143 | weak backing, clef weight < 0.5 | noted off-topic, section 5 |
| 4 | https://www.cloudflare.com/ | 0.0379 | weak backing, clef weight < 0.5 | no (marketing) |
| 5 | https://dash.cloudflare.com/ | 0.0343 | weak backing, clef weight < 0.5 | no (dashboard login) |
| 6 | https://developers.cloudflare.com/workers/static-assets/routing/ | 0.0264 | weak backing, clef weight < 0.5 | yes, section 2 |
| 7 | https://www.howtogeek.com/devops/how-to-use-cloudflare-workers-and-kv-to-serve-a-static-site/ | 0.0407 | weak backing, clef weight < 0.5 | yes, section 2 |
| 8 | https://www.cloudflare.com/ | 0.0214 | weak backing, clef weight < 0.5 | no (duplicate marketing) |
| 9 | https://cheatsheets.davidveksler.com/cloudflare-workers-static-hosting.html | 0.0800 | weak backing, clef weight < 0.5 | no (aggregator) |
| 10 | https://developers.cloudflare.com/workers/ | 0.0883 | weak backing, clef weight < 0.5 | no (overview only) |

Primary authority for every steady-orbit fact here: `yubi-OS/yubiOS playbooks/steady-orbit-api.md`.
