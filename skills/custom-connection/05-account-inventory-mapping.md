# 05 - Account inventory mapping

Scope: what the Cloudflare account behind the working connection holds, how the workers.dev subdomain rename reads as a false outage, and how the Worker consolidation is verified. Grounding spine: yubi-OS/yubiOS skills/custom-connection/SKILL.md (source doc).

## The account

The credential addresses account `b57ee20cd90ebc4e4db28728e450a4b8`, named "Shant@steadyorbitsystems.com's Account", created 2026-09-03. It is the Stable Orbit client infrastructure account. As of the source doc's record, the account holds 0 zones, 0 Pages projects, and 0 custom worker domains (source doc).

## The workers.dev subdomain rename

The account's workers.dev subdomain is `systems-a`, renamed from the earlier `shant-b57` (source doc). Cloudflare documents that a workers.dev subdomain takes the format `<YOUR_ACCOUNT_SUBDOMAIN>.workers.dev` (https://developers.cloudflare.com/workers/configuration/routing/workers-dev/, jev 0.93), so renaming the subdomain changes every Worker's public hostname at once.

The trap the source doc records: after the rename, old `*.shant-b57.workers.dev` URLs returned 530 with `error code: 1016` as of 2026-09-21 (source doc). Error 1016 is documented by Cloudflare as an origin DNS error, where a DNS record points to an unresolvable host (https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1016/, jev 0.89). The stale hostname is exactly that: the old subdomain no longer resolves. The correct reading is "stale hostname, not an outage" (source doc). The failure mode to avoid is diagnosing a working Worker as down because its old URL 530s; re-derive the current hostname from the subdomain before concluding anything.

## The Worker

One Worker exists: `steady-orbit`, modified 2026-09-20 (source doc). It serves the Steady Orbit Systems marketing site at `https://steady-orbit.systems-a.workers.dev/` (returns 200) plus the SOS Agent API, where `/api/fits` returns 200 JSON and `/api/tts` returns 404 "no route" (source doc). A Workers deployment with static assets and API routes on one script is the normal Workers shape; the platform overview documents both front-end asset serving and back-end API building on Workers (https://developers.cloudflare.com/workers/, jev 0.91).

## The consolidation, and how to verify it

`steady-orbit` consolidated two former workers, `old-queen-53c8` and `steady-orbit-sos`. The source doc records that both no longer exist as scripts, verified on 2026-09-21 via `GET /accounts/{id}/workers/scripts` (source doc). The account-scoped scripts list is the authoritative way to confirm a script no longer exists: the API documents list-Worker-Scripts as an account-level resource method (https://developers.cloudflare.com/api/resources/workers/subresources/scripts/methods/list/, jev 0.96). A local reference copy of the old sos worker is kept at `documents/consultancy-bZPqW0gK/steady-orbit-sos/` (source doc).

## Inventory-check pattern

The doc's implied routine when a Cloudflare fact is in question:

1. Confirm the credential still works with the health check (doc 03).
2. List what exists: `/accounts/{id}/workers/scripts` for Workers, plus the account-scoped lists `/zones` and `/accounts/{id}/pages/projects` (source doc; see doc 08 for the route table).
3. Distinguish stale-hostname failures (530 with error 1016 on an old subdomain) from real outages, by checking whether the current subdomain's URL is healthy (source doc; Cloudflare's status page is the third-party signal for platform-wide incidents, https://www.cloudflarestatus.com/, jev 0.88).
4. Never conclude from an old URL alone that a Worker is gone; verify through the scripts list.
