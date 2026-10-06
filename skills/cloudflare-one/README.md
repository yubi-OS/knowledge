# cloudflare-one knowledge corpus

Knowledge corpus minted from the ground source `yubi-OS/yubiOS skills/cloudflare-one/SKILL.md` (the Cloudflare One Zero Trust and SASE skill: Access, Gateway, WARP, Tunnel, Cloudflare WAN, DLP, CASB, device posture, and the Zero Trust deployment patterns the skill teaches). The ground source is the primary source of record; this corpus explicates it. Minted 2026-10-06.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-workflow-and-api-safety.md](01-workflow-and-api-safety.md) | The 5-step workflow (classify, gather, retrieve, inspect, propose) and the retrieval-first API safety rules. |
| 02 | [02-assessment-prompts.md](02-assessment-prompts.md) | The pre-configuration assessment checklist across architecture, access, tunnels, gateway, CASB and posture, and WAN. |
| 03 | [03-access-and-saas-federation.md](03-access-and-saas-federation.md) | Access application types, access models, policy mechanics, SaaS SSO federation, and identity guardrails. |
| 04 | [04-tunnel-and-private-networking.md](04-tunnel-and-private-networking.md) | cloudflared connectors and HA, remotely managed tunnels, virtual networks, private DNS, and off-ramp vs on-ramp. |
| 05 | [05-device-client-deployment.md](05-device-client-deployment.md) | Device client enrollment rules, device profiles, split tunnel mode selection, MDM overrides, and coexistence. |
| 06 | [06-gateway-tls-dlp.md](06-gateway-tls-dlp.md) | Gateway policy types and order of enforcement, TLS inspection and root CA, Do Not Inspect exceptions, and DLP activation. |
| 07 | [07-casb-device-posture-risk.md](07-casb-device-posture-risk.md) | CASB out-of-band scanning and remediation, device posture integrations, and user risk scoring. |
| 08 | [08-infrastructure-access.md](08-infrastructure-access.md) | ZTIA for SSH, short-lived certificates, Browser Rendering clientless access, and Audit SSH. |
| 09 | [09-logs-analytics-dex.md](09-logs-analytics-dex.md) | Gateway and Access logs, shadow IT discovery, Logpush export, and DEX diagnostics. |
| 10 | [10-cloudflare-wan-and-validation.md](10-cloudflare-wan-and-validation.md) | Cloudflare WAN connectivity, Network Firewall, expression syntax boundary, and validation prompts and output defaults. |

## Research summary

- Results collected: 120 across 20 searXNG queries (2 per subtopic), top 6 kept per query.
- Weight split (jev noul, typesafe/jev-1.13 via DefAPI direct): 69 high (>= 0.5), 51 low (< 0.5).
- jev requests: 18 (23604 input tokens, 4818 output tokens). Endpoint: https://api.defapi.org/api/v1/decisions (DefAPI direct; the steady-orbit relay was not needed).
- Redos: 0 dig redos. 1 weighting pass was re-run because the noul answer key was read as `answer` before a shape probe showed the key is `noul` (logged in jev-log.json; no results shipped unweighted).
- Skipped docs: none. All 10 subtopics authored.
- Outline note: t01 (workflow and API safety) scored 0.51, marginal; kept because its dig returned 8 high-weight primary sources.

## Gaps

None recorded. Weak-backing sources (weight < 0.5) are labeled in the docs where they appear; no load-bearing claim rests solely on a weak source.

## Preflight

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator); /api/decide (typesafe/jev-1.13) 200 via DefAPI direct.
