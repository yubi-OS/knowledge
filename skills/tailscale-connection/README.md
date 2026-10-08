# Knowledge corpus: tailscale-connection

Explicates the yubiOS skill `tailscale-connection` (ground source: `yubi-OS/yubiOS skills/tailscale-connection/SKILL.md`, 2700 B fetched 2026-10-08). The skill covers working with the Sauna Tailscale API connection: device listing, DNS preferences, scope-limited endpoints, and API key expiry handling. This corpus deepens each of the skill's sections with web-researched Tailscale documentation, every claim carrying its source URL and jev weight.

## Corpus index

| NN | doc | scope |
| --- | --- | --- |
| 01 | [01-connection-credential-injection.md](01-connection-credential-injection.md) | How the connection stores its `tskey-api-` credential and how the proxy injects it as Bearer. |
| 02 | [02-device-listing-endpoint.md](02-device-listing-endpoint.md) | `GET /tailnet/-/devices`, the device object fields, and the 2025 `lastSeen` drift incident. |
| 03 | [03-dns-magicdns-preferences.md](03-dns-magicdns-preferences.md) | The two DNS reads and MagicDNS behavior when enabled. |
| 04 | [04-users-and-roles.md](04-users-and-roles.md) | The users read and Tailscale's role model on a single-owner tailnet. |
| 05 | [05-scope-limited-endpoints.md](05-scope-limited-endpoints.md) | Verified dead ends (405 on unscoped tailnet, 404 on acls/routes/keyexpiry/tags/invites) and why API keys hit them. |
| 06 | [06-credential-traps-token-types.md](06-credential-traps-token-types.md) | `tskey-api-` vs `tskey-client-`, the OAuth token exchange, and the 401 diagnostic sequence. |
| 07 | [07-api-key-expiry-rotation.md](07-api-key-expiry-rotation.md) | The 90-day API key ceiling, the 2026-12-23 expiry on this connection, and the three expiry clocks. |
| 08 | [08-tailnet-state-node-key-expiry.md](08-tailnet-state-node-key-expiry.md) | Standing tailnet inventory, node-key expiry as a failure mode, and the Funnel link to the shell bridge. |

## Research summary

- Results collected: 96 (2 searXNG queries per subtopic, top 6 kept per query; all 8 subtopics were web-shaped; doc 08's inventory facts are internal-record and skipped the dig for those specifics only).
- Weight split: 66 results at jev weight >= 0.5 (primary/official), 30 results below 0.5 (weak, recorded and labeled, not used as evidence).
- jev requests: 9 total (1 outline score validation over 8 subtopics, 8 noul weighting batches of 12). Usage: 9557 input tokens, 1980 output tokens. Endpoint: DefAPI direct (`https://api.defapi.org/api/v1/decisions`, model `typesafe/jev-1.13`); no fallback to the worker relay was needed and no request failed.
- Redos: 0 dig redos, 0 decision redos. No decision-model failures occurred.
- Skipped docs: none. All 8 outline subtopics scored above 0 (1.01 to 1.46) and were authored.

## Preflight

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide healthy (orchestrator-side probe). Agent-side probe skipped for speed per the mint brief; agent-side decisions ran 2026-10-08 against DefAPI direct with 200s on all 9 requests.

## Research database

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (all 96 weighted results with full decision records), `jev-log.json` (one entry per jev HTTP request), `db.ts` (TypeScript interfaces for every shape), and `digs/` (one record per subtopic).
