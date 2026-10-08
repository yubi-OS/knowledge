# sandbox-stable — knowledge corpus

Explication of the yubiOS skill `sandbox-stable` (ground source: `yubi-OS/yubiOS skills/sandbox-stable/SKILL.md`): building or changing Cloudflare Sandbox apps on the current stable `@cloudflare/sandbox` package — the package-line gate, the command contract, sessions, files and storage, ports and tunnels, terminals and interpreter, secrets and egress, 2026 deprecated-API cleanup, and the production ship checklist.

## Index

| doc | one-line scope |
| --- | --- |
| [01-gate-package-line.md](docs/01-gate-package-line.md) | Confirm the app is on the default stable package with the matching stable image; route to sandbox-next or sandbox-migrate-to-next; never mix lines. |
| [02-command-contract.md](docs/02-command-contract.md) | exec takes a command string and buffers stdout/stderr/exitCode; streaming and background work use stable execStream and startProcess, never @next handles. |
| [03-sessions-state.md](docs/03-sessions-state.md) | Sessions preserve cwd and env across commands: default session, enableDefaultSession, and explicit createSession; state resets on container restart. |
| [04-files-storage-backups.md](docs/04-files-storage-backups.md) | Files API read/write contracts (string default, ReadableStream via encoding none), S3-compatible bucket mounts with Worker-issued short-lived credentials, backups pointer. |
| [05-ports-tunnels-proxy.md](docs/05-ports-tunnels-proxy.md) | Ports and preview URLs, Worker-fronted exposure, quick vs named tunnels, and the RPC-transport preference for tunnel work. |
| [06-terminals-interpreter.md](docs/06-terminals-interpreter.md) | sandbox.terminal(request) browser terminals with SandboxAddon/xterm.js, the code Interpreter API, and pointer-only git and Docker-in-Docker coverage. |
| [07-secrets-egress-config.md](docs/07-secrets-egress-config.md) | Non-secret config in sandbox env, live credentials in the Worker, and outbound handlers as the egress control plane. |
| [08-deprecated-api-cleanup.md](docs/08-deprecated-api-cleanup.md) | 2026 deprecation cleanup while staying on stable: RPC transport move, default-session change, stream-helper consolidation, package-plus-image first. |
| [09-production-ship-checklist.md](docs/09-production-ship-checklist.md) | Same-line ship checks, lifecycle states and options, wildcard DNS on a dedicated preview domain, self-deployed bridge pointer. |

## Research summary

- results collected: 90 (all 90 weighted, 0 null)
- weight split: high (>= 0.5) 65, low (< 0.5) 25
- jev requests: 9 HTTP calls total (8 successful; the first outline call failed 400 for a missing model wrapper and was resent successfully), usage 11257 input / 1877 output tokens, via DefAPI direct (api.defapi.org/api/v1/decisions), model typesafe/jev-1.13
- redos: 0
- skipped docs: none (9 of 9 authored; outline validation kept all subtopics, none scored 0)
- per-doc results kept and primary (>= 0.5): 01: 9/7, 02: 11/7, 03: 10/7, 04: 9/8, 05: 11/7, 06: 11/10, 07: 11/8, 08: 7/3, 09: 11/8
- sub-subtopic dig gaps: doc 04 (backups) and doc 09 (bridge) had no dig hits for those specific mechanisms, so both docs carry source-doc pointers only, with no dig-backed claims; doc 06 keeps git workflows and Docker-in-Docker pointer-only for the same reason
- research-db: schema v2 (preflight.json, outline.json, archive.json, digs/ x9, jev-log.json, db.ts)

## Preflight

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side); DefAPI typesafe/jev-1.13 used direct for all decisions (agent-side probe skipped for speed). All 18 dig calls returned HTTP 200 with 39 to 45 raw results each.
