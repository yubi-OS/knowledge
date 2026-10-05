# 09. Deployment receipts: the verification discipline at ship time

**Scope.** What was recorded at deploy time for both PRs, and why byte-identical rebuild checks, pre-upload snapshot comparison, and a pinned live smoke are the deployment half of the honesty boundary.

## Reproducible builds as the standard

The reproducible-builds standard is an independently verifiable path from source to binary: anyone can rebuild byte-for-byte identical output from a given source and so verify that nothing extra was introduced during the build [1][2]. The deployment receipts for this work apply that standard to a Cloudflare Worker. `tools/point-map` is bundled by esbuild [3], and a fresh `build.mjs` run of the source at commit `39d4be0d` reproduced the live `index.js` byte-for-byte except for 22 esbuild source-path comments, 44 diff lines all of which were `//` path comments. Project provenance for this section: the yubi-OS refs corpus document `pfister-keystone-methods-wayfinder-2026-09-17.md` (internal primary source, unweighted).

That check is what licenses the deployment claim "the live worker is exactly this commit": it is a rebuild-and-compare receipt, not an assertion.

## PR #235: calibration and outcomes ship

- Squash-merged as `a426ed47ef0eea36fed383f13bd87e06b2d7f6cf`, branch `point-map-control-outcomes-2026-09-17`, head `8c2b2661`.
- Worker `steady-orbit` PUT at 2026-09-17T10:13:41Z: 13 modules re-uploaded byte-identical except `index.js`, rebuilt from this commit at 201,844 bytes, sha256 `cbd2f7ccdccf...`, with `keep_bindings` for all binding types.
- Pre-upload check: all 13 live modules matched the 01:03Z index snapshot, so no concurrent change was overwritten.
- SITE KV `AGENT.md` replaced with sha256 `6ef4d0e5e9a0...` verified equal to `tools/point-map/AGENT.md`, and `llms.txt` refreshed.
- Live verification: `/api/health` reported `diagnostics {math: wayfinder-math/1, radius: radius/1, control: calibration/1, outcomes: outcomes/1}`; `/` returned 200 at 42,397 bytes; `/map/` returned 200; `DELETE /api/outcomes/1` returned 405.
- Smoke on 12 refs/ docs pinned at `a426ed47`, baseline map 77, frame `6b13364cd8ac5b57`, isolated 12 of 12, occupied 10: `POST /api/map/control` with n=3 seed 20260917 completed in 4.2 seconds with the readings recorded in doc 05; `splice_fraction` returned 422; `POST /api/outcomes` registered pending row 1 with 201 and `preregistered:true`; verifier `geometry` returned 422; GET returned contingency n_rows 1, n_effective 0.

## PR #236: the reframed trials ship

- Worker PUT at 2026-09-17T10:34:43Z, only `index.js` changed (222,242 bytes, sha256 `06cb157b673a...`), the other 12 modules byte-identical to the 10:13Z deploy.
- SITE KV `AGENT.md` (sha256 `26847b117579...`) and `llms.txt` refreshed; `/api/health.diagnostics` now lists `axis_trial` and `consistency`.
- Tests: `test-axis-consistency.mjs` 15 of 15, full suite green.
- Live smokes recorded in doc 08.

## Why receipts rather than assertions

The receipts are a verification chain: commit hash, module sizes, sha256 prefixes, timestamps, endpoint statuses, and a smoke pinned to a named frame hash. A reader can recheck each link independently, which is the deployable form of the reproducible-builds claim that verification must be possible without trusting the builder [1]. The pre-upload snapshot comparison is the progressive-delivery instinct in miniature: confirm the thing you are about to change is the thing you think it is, before changing it [4]. And the smoke results are recorded with their frame hash so they can never be quoted as general benchmarks; they are readings of a specific instrument state.

The drift check the next day (2026-09-18, wayfinder round 8, cycle 51) confirmed the shipped surface stayed consistent with its methods doc, with the deferred items still deferred and an additive note only (project provenance, internal primary source, unweighted).

## Sources

1. https://reproducible-builds.org/ (noul 0.9350)
2. https://reproducible-builds.org/docs/plans/ (noul 0.6081)
3. https://esbuild.github.io/ (noul 0.8817)
4. https://k8s.info/docs/advanced/progressive-delivery (noul 0.7060)
