# 01 - Worker anatomy and the modules API

Scope: what the steady-orbit worker is as a multipart ES module bundle, how the Cloudflare REST modules API models it, and why this deploy path exists instead of wrangler.

Grounding spine: yubi-OS/yubiOS skills/steady-orbit-deploy/SKILL.md (source doc).

## The bundle is a set of parts, not one file

The steady-orbit worker is a multi-part ES module bundle. Per the source doc it decomposes into three families: `solar-rbs-entry.mjs` (the entry module, which serves site pages from KV), `index.js` (the legacy API relay), and the jev module family (gate, execute, decide, verify, corpus, router and their peers). Every deploy treats these as one multipart upload against the Cloudflare REST modules API.

This mirrors the platform contract: Cloudflare defines Workers configuration in JSON metadata attached to multipart form-data script uploads [0.5](https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/). On the same endpoint shape, the upload handler reads each uploaded file part as a module of the worker and uses `metadata.main_module` to identify the module-syntax entry file [0.08](https://www.withone.ai/knowledge/cloudflare/conn_mod_def%3A%3AGLv3LbppeOk%3A%3Am4wgZ9GVT9iGXr0_zO-cJA) (weak backing, but it matches the source doc's `main_module: solar-rbs-entry.mjs` practice exactly).

The ES module format is the current Workers execution model. Cloudflare's own migration guidance lists the reasons module syntax superseded service-worker syntax, including faster execution and bindings exposed as `env` properties instead of globals [0.59](https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/). steady-orbit is a module-syntax worker throughout, which is why its entry is named in metadata rather than implied.

## Why the REST API and not wrangler

The source doc is explicit: deploys go through the Cloudflare REST modules API with the managed Cloudflare connection, with no wrangler in the path. The mechanics are a single `PUT /accounts/{account}/workers/scripts/steady-orbit` carrying one form field per module plus a `metadata` field. Wrangler bundles and uploads in one step by default; Cloudflare notes that version upload and deployment are coupled under the default flow and can be decoupled [0.74](https://developers.cloudflare.com/workers/versions-and-deployments/). The REST path chosen here keeps every step explicit: pull, overlay, metadata rebuild, upload, verify.

## Part identity rules

Two rules from the source doc govern part identity and they are both hard rules:

1. Part name equals the `Content-Disposition` name of the part in the bundle response. Extraction must produce exactly one file per part name.
2. The current part count in the live bundle is the source of truth. Never guess it. The source doc records 37 parts as of 2026-10-02 (when `jev-visco-math.js` joined) and 43 parts as of 2026-10-06 (when `jev-router.js` and 6 patched parts landed).

The count history is a lesson in itself: parts are added by real deploys, and any script that hardcodes a count will silently drop the newest parts on the next overlay. Pull the bundle every time.

## The entry module is load-bearing

The source doc's first deploy-safety rule says the entry module `solar-rbs-entry.mjs` ships byte-identical unless a new page route requires editing it, because its legacy-territory exclusion list shadows new page routes. This traces back to a concrete incident: the Sep 21 site-break lesson, where the entry module was replaced. The rule is structural, not cosmetic: the entry module is the module named in `metadata.main_module`, and the platform resolves the upload's entry through it [0.08](https://www.withone.ai/knowledge/cloudflare/conn_mod_def%3A%3AGLv3LbppeOk%3A%3Am4wgZ9GVT9iGXr0_zO-cJA) (weak backing on the mechanism, high confidence from the source doc on the consequence).

## Anatomy summary for the deployer

A deployer touching steady-orbit should hold this picture before any HTTP call:

- One script name (`steady-orbit`), many module parts, one entry (`solar-rbs-entry.mjs`).
- Parts travel as `application/javascript+module` form fields; the fixture part travels with its path-qualified name (see doc 04).
- Metadata is rebuilt from live settings every deploy, never from memory (see doc 03).
- The bundle pulled before any change is simultaneously the part source of record and the rollback artifact (see docs 02 and 07).

Everything beyond this anatomy, such as KV content updates and router policy promotion, is handled as its own step after the worker upload, as the source doc's sequence prescribes.
