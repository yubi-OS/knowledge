# skills/debug-with-cli

Knowledge corpus explicating the yubiOS skill `skills/debug-with-cli/SKILL.md`: driving shell commands on remote machines (CI runners, SBCs, dev boxes) from a Sauna agent during debug, over a Tailscale Funnel + Bearer-auth HTTP bridge.

Ground source: yubi-OS/yubiOS `skills/debug-with-cli/SKILL.md` (19745 bytes, fetched 2026-10-06). The corpus explicates and deepens it; it does not replace it.

## Docs

| NN | file | scope |
|---|---|---|
| 01 | [01-philosophy-architecture.md](01-philosophy-architecture.md) | Why the bridge is HTTP-only via the Sauna auth proxy; argv shape as a feature |
| 02 | [02-when-to-use-scope.md](02-when-to-use-scope.md) | Trigger conditions and the 4 do-NOT-use boundaries |
| 03 | [03-funnel-setup-target-box.md](03-funnel-setup-target-box.md) | One-time target-box setup: Tailscale, Funnel, token, bridge, smoke test |
| 04 | [04-sauna-connection-setup.md](04-sauna-connection-setup.md) | The Sauna keys/bearer connection and proxy auto-injection, plus verification |
| 05 | [05-bridge-script-design.md](05-bridge-script-design.md) | Internals of the ~50-LOC Python stdlib bridge |
| 06 | [06-call-shape-argv.md](06-call-shape-argv.md) | POST /run contract; argv vs shell; pipes, sudo -n, env, cwd |
| 07 | [07-tty-audit-pattern.md](07-tty-audit-pattern.md) | The argv-audit-to-tty observability pattern and its 3 rules |
| 08 | [08-security-model.md](08-security-model.md) | 7 security properties: entropy, TLS, bind address, storage, argv-only, HMAC, audit |
| 09 | [09-alternatives-considered.md](09-alternatives-considered.md) | The 6 rejected alternatives and the rejection pattern |
| 10 | [10-antipatterns-loading-guidelines.md](10-antipatterns-loading-guidelines.md) | 8 anti-patterns, 5 loading constraints, 2 guidelines |

## Research summary

- Results collected: 72 entries in the archive (60 active after the subtopic 04 redo; 12 superseded originals retained and marked `redo_of: superseded-by-redo-04`).
- Weight split: 7 high (>= 0.5) / 65 low (< 0.5) across all 72 weighted entries.
- jev: 6 requests (1 outline score, 4 noul batches of 15, 1 noul batch of 12 for the 04 redo), usage 9985 input / 1470 output tokens. Weighted via DefAPI direct (https://api.defapi.org/api/v1/decisions) per the 2026-10-06 speed optimization.
- Redos: 1 (subtopic 04, original queries returned off-topic results; retried with specification-focused queries and landed 4 primary sources including RFC 7235 at 0.69 and RFC 7235 at 0.65, RFC 6750 at 0.55, oauth.net bearer tokens at 0.54).
- Docs kept/skipped: 10 / 0. Internal-record subtopics (01, 02, 05, 07, 10) skipped digs by design and are grounded in the source doc alone; their dig records say so.
- Primary (>= 0.5) per doc: 03: 3 of 12, 04: 4 of 12; docs 01, 02, 05, 07, 10 are source-doc-grounded (no dig); docs 06, 08, 09 carry only weak (< 0.5) dig backing, labeled in text.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide preflight run orchestrator-side, agent-side probe skipped for speed (preflight.json).
