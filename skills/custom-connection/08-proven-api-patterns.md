# 08 - Proven API patterns

Scope: the request patterns the custom-connection skill has actually verified against the Cloudflare account, and the ones that failed, so a session starts from routes known to work. Grounding spine: yubi-OS/yubiOS skills/custom-connection/SKILL.md (source doc).

## Live check (no auth needed)

`curl -o /tmp/body.html -w "%{http_code} %{time_total}s %{size_download}B" https://steady-orbit.systems-a.workers.dev/` returns 200 when the Worker is healthy (source doc). The same check against the old `old-queen-53c8` URL returned 530 with `error code: 1016` on 2026-09-21, where it had returned 200 on 2026-09-04 (source doc). Error 1016 is a DNS-resolution failure against a stale host (https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1016/, jev 0.89; see doc 05). The pattern: an unauthenticated curl with status, timing, and size output is the fastest live signal for a Worker's public surface.

## Account-scoped read routes

The patterns below all ran against the working connection row (source doc):

- Deploy history: `GET /accounts/{id}/workers/scripts/{name}/deployments` shows author email and timestamps. The record shows 2 dashboard uploads on 2026-09-03 by shant@steadyorbitsystems.com (source doc).
- Worker settings: `GET /accounts/{id}/workers/scripts/{name}/settings` returns bindings, compatibility flags, and the usage model (source doc).
- Account-scoped lists: `/zones`, `/accounts/{id}/pages/projects`, and `/accounts/{id}/workers/scripts` (source doc). The scripts list is the account-level method the API documents for enumerating Worker scripts (https://developers.cloudflare.com/api/resources/workers/subresources/scripts/methods/list/, jev 0.96).
- The Cloudflare API reference is the canonical surface for the full route set (https://developers.cloudflare.com/api/, jev 0.94), and the Workers documentation platform overview covers the deploy-and-serve model these routes operate on (https://developers.cloudflare.com/workers/, jev 0.92).

## Routes that do not work

- Script content: `GET /accounts/{id}/workers/scripts/{name}` with `Accept: application/javascript` returned empty for this asset-serving Worker; module and static content is not served without the right content type. Read the site HTML through the public URL instead (source doc).
- `GET /accounts/{id}/domains` is not a valid route and returns error 7003 (source doc). A third-party troubleshooting page describes 7003 as a routing error tied to invalid identifiers or incorrect endpoints (https://bobcares.com/blog/cloudflare-api-error-7003/, jev 0.15, weak backing well below the 0.5 bar; the source-doc record is the authoritative statement here).

## When a platform failure is real

Before treating an API failure as account-specific, check the platform: Cloudflare's system status page carries real-time incident and maintenance history for all Cloudflare services (https://www.cloudflarestatus.com/, jev 0.88). If the status page is green and a workers.dev URL still 530s with error 1016, the failure is local to the hostname, not the platform (doc 05).

## Pattern summary

| Pattern | Route | Status |
|---|---|---|
| Live check | `GET https://<subdomain>.workers.dev/` (unauthenticated) | verified, 200 when healthy |
| Deploy history | `GET /accounts/{id}/workers/scripts/{name}/deployments` | verified |
| Worker settings | `GET /accounts/{id}/workers/scripts/{name}/settings` | verified |
| Scripts list | `GET /accounts/{id}/workers/scripts` | verified |
| Zones list | `GET /zones` | verified |
| Pages projects | `GET /accounts/{id}/pages/projects` | verified |
| Script content | `GET /accounts/{id}/workers/scripts/{name}` | returns empty for asset Workers |
| Domains route | `GET /accounts/{id}/domains` | invalid, 7003 |

Every request still needs the two-part call pattern from doc 02: the `connections` parameter and the pinned `X-Sauna-Connection-Id` header.
