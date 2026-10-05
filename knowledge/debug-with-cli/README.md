# debug-with-cli: a knowledge corpus

Driving shell commands on remote machines from an agent during debugging: Tailscale Funnel ingress, a bearer-auth HTTP bridge, argv-array remote execution, and replacing slow CI round trips with live shell access. Minted from yubi-OS/yubiOS `refs/debug-with-cli-2026-08-01.md` on 2026-10-05.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-ci-roundtrip-latency.md](01-ci-roundtrip-latency.md) | Why the dispatch-wait-log-fix-re-dispatch CI cycle costs 15 to 45 minutes per iteration, and what live shell access replaces |
| 02 | [02-tailscale-funnel-ingress.md](02-tailscale-funnel-ingress.md) | Using Tailscale Funnel to give a private machine a public TLS-terminated HTTPS URL without opening ports |
| 03 | [03-bearer-auth-bridge-design.md](03-bearer-auth-bridge-design.md) | The minimal stdlib Python bridge: BaseHTTPRequestHandler, hmac.compare_digest bearer check, subprocess.run, about 50 LOC, zero dependencies |
| 04 | [04-argv-execution-safety.md](04-argv-execution-safety.md) | Argv-array remote execution with shell=False, why no shell strings cross the wire, injection surface analysis, and the bash -c escape hatch |
| 05 | [05-agent-connection-proxy.md](05-agent-connection-proxy.md) | Registering the bridge as an agent-side connection with bearer auth and a proxy that injects Authorization so calls stay plain curl POST /run |
| 06 | [06-alternatives-considered.md](06-alternatives-considered.md) | Rejected options and why: mcp-proxy with no inbound auth, npm mcp-proxy X-API-Key, Cloudflare Tunnel plus Access, mTLS, joining the tailnet, Funnel ACLs |
| 07 | [07-ops-hardening-rotation.md](07-ops-hardening-rotation.md) | Operational posture: token stored mode 600 on target, localhost-only listen, nohup logging, non-ephemeral Tailscale auth keys, rotation triggers |
| 08 | [08-limitations-workarounds.md](08-limitations-workarounds.md) | No PTY, no per-call env vars, no pipes or && or glob expansion at the bridge, one bearer per machine; bash -c workarounds and ttyd for interactive shells |
| 09 | [09-live-probe-debug-workflow.md](09-live-probe-debug-workflow.md) | The debug pattern itself: seconds-scale probes, interface state like virbr0/docker0 DOWN as debug signal, versus 15 to 45 minute CI round trips |

## Research summary

- Results collected: 120 (18 first-pass searXNG queries keeping top 6 each, plus a 2-query redo for doc 06 keeping top 6 each).
- Weight split (jev noul): 43 results at weight >= 0.5 (primary/authoritative), 77 results below 0.5 (kept in the archive, labeled weak where cited).
- Jev requests: 27 (1 outline validation with 9 score questions, 1 preflight probe, 25 noul weighting batches of up to 5). Usage: 20449 input tokens, 0 output tokens.
- Redos: 1. Doc 06 (alternatives-considered) was scored marginal (0.84) at outline validation and its first dig returned only 1 result of 12 at weight >= 0.5, so the dig was redone with 2 different queries; the redo returned 5 of 12 at weight >= 0.5 and the doc was authored.
- Skipped docs: none. All 9 outline subtopics were authored.
- Every doc cites source URLs with their jev weight; claims backed only by weight < 0.5 sources are labeled weak in the text. Deployment-specific facts (hostnames, timings, connection ids) come from the source record refs/debug-with-cli (2026-08-01) and are marked "source record, unweighted".

## Research database

Under [research-db/](research-db/): `preflight.json` (tool health), `outline.json` (decomposition + score validation), `archive.json` (all 120 results with full decision records), `digs/` (9 per-doc dig records with redo log), `jev-log.json` (one entry per jev HTTP request), `db.ts` (TypeScript interfaces for every shape).

## Provenance

- Source doc: yubi-OS/yubiOS refs/debug-with-cli-2026-08-01.md.
- searXNG dig via the n8n searxng-proxy webhook; weighting via the steady-orbit /api/decide endpoint (clef model).
- Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
