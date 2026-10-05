# endlessh-openwrt-fit

Knowledge corpus on endlessh (SSH tarpit) and its fit for OpenWrt routers: what the tarpit does, its resource profile, integration constraints, and evaluation criteria for edge devices. Minted 2026-10-05 from yubi-OS/yubiOS refs/endlessh-openwrt-fit-2026-07-17.md.

## Docs

| NN | Doc | One-line scope |
| --- | --- | --- |
| 01 | [01-tarpit-mechanism.md](01-tarpit-mechanism.md) | How endlessh works: endless pre-authentication SSH banner, single-threaded poll loop, what it logs and never touches |
| 02 | [02-resource-profile.md](02-resource-profile.md) | Runtime resource profile: memory, CPU, connection model, MaxClients ceiling, SO_RCVBUF guard, embedded suitability |
| 03 | [03-config-and-controls.md](03-config-and-controls.md) | Configuration knobs, CLI flags, runtime signals, syslog logging, and their mapping onto a wrapper package |
| 04 | [04-openwrt-packaging-status.md](04-openwrt-packaging-status.md) | No official OpenWrt package exists; realistic packaging paths and supply-chain caution for router firmware |
| 05 | [05-procd-uci-integration.md](05-procd-uci-integration.md) | procd init scripts, UCI config packaging, respawn and reload patterns for a third-party daemon |
| 06 | [06-nftables-attribution.md](06-nftables-attribution.md) | nftables/firewall4 redirect and DNAT with log-before-redirect for per-decoy attribution |
| 07 | [07-edge-device-constraints.md](07-edge-device-constraints.md) | Router-class RAM/flash constraints, OOM behavior, no-swap operation, and memory lessons from banIP-class services |
| 08 | [08-tarpit-vs-honeypot-evaluation.md](08-tarpit-vs-honeypot-evaluation.md) | Tarpit versus low/medium/high-interaction honeypots and the evaluation criteria for edge deception |

## Research summary

- Results collected: 96 (top 6 per query, 2 queries per subtopic, 8 subtopics).
- Weight split (jev noul via clef on /api/decide): 49 results at weight >= 0.5 (primary-grade), 47 below 0.5. Every result is weighted; every doc cites source URL plus weight, and claims below 0.5 are labeled weak in the text.
- Jev requests: 22 total (1 preflight probe, 1 outline validation over 8 score questions, 20 weighting batches over 96 noul questions). Usage: 16806 input tokens, 0 output tokens.
- Redo counts: 1 jev batch redo (batch of 5 hit HTTP 429 twice, succeeded on attempt 3 after the 30s backoff). No dig redos; all 16 queries returned results on attempt 1.
- Skipped docs: none. All 8 outline subtopics survived validation (scores 1.53 to 1.88 on a 0/1/2 load-bearing scale, none dropped) and all digs came back strong enough to author.

## Provenance

All docs were authored from the searXNG dig results weighted by the jev decision model (typesafe/jev-1.13, model clef) on the steady-orbit /api/decide endpoint. The full record of every collected result, decision, and request is in research-db/: archive.json (per-result weights and raw decision objects), digs/ (per-subtopic query records), jev-log.json (per-request usage), outline.json (subtopic scopes and validation answers), preflight.json (endpoint probes), db.ts (type map).

Preflight 2026-10-05: searXNG 72 results healthy; /api/decide (clef) 200.
