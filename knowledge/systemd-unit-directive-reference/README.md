# systemd-unit-directive-reference — knowledge corpus

Minted 2026-10-05 from yubi-OS/yubiOS `refs/systemd-unit-directive-reference-2026-07-23.md` (systemd exec/unit/service directive map, sandboxing directives, and routing hardening questions to the right man page). Source doc refreshed 2026-07-23 against man7.org systemd v260 with v261 additions appended.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | 01-man-page-map.md | How systemd's man pages divide unit configuration and how to route a hardening or service-design question to the right page |
| 02 | 02-service-types.md | Type= semantics for all eight values and selection criteria |
| 03 | 03-exec-commands.md | The ExecStart family: ordering, prefixes, failure and skip semantics |
| 04 | 04-dependencies-ordering.md | Dependency vs ordering directives, [Install], search path precedence, drop-ins |
| 05 | 05-sandboxing-directives.md | The systemd.exec sandboxing surface grouped by mechanism, audit tooling, hardened baseline |
| 06 | 06-resource-control-restart.md | cgroups v2 limits and restart/watchdog policy |
| 07 | 07-credentials-directories.md | Per-service credentials, managed directories, image-rooted roots |
| 08 | 08-v261-directives.md | v259 to v261 additions including the RestrictFileSystemAccess= manager-level correction |

## Research summary

- Results collected: 108 searXNG results across 18 queries (16 seed + 2 redo for doc 05), top 6 kept per query.
- Weight split: 40 results weighted >= 0.5 (authoritative backing), 68 weighted < 0.5 (weak backing, labeled in doc text). 0 unweighted.
- jev requests: 28 HTTP calls to /api/decide (1 outline validation with 8 score questions, 24 noul weighting batches, 1 single-question shape probe, 3 unparseable-batch retries from the first weighting pass, all logged in jev-log.json with a note field). Usage: 18,145 input tokens, 0 output tokens. One 429 was retried after a 30s sleep per the redo rule.
- Redo counts: doc 05 had 1 dig redo (12 results kept but 0 authoritative sources, best ArchWiki 0.4459); the redo with man-page-targeted queries returned 12 results including 5 primary sources (freedesktop systemd.exec pages 0.89 to 0.96). All other docs: 0 redos.
- Skipped docs: none. Doc 08 (t08) scored marginal (0.99) at outline validation and was kept under the "keep only if the dig comes back strong" rule; its dig returned primary release records (github releases 0.95, NEWS 0.94, PRESSURE.md 0.89).

Per-doc source table:

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-man-page-map | 12 | 8 |
| 02-service-types | 12 | 4 |
| 03-exec-commands | 12 | 4 |
| 04-dependencies-ordering | 12 | 2 |
| 05-sandboxing-directives | 24 | 5 |
| 06-resource-control-restart | 12 | 2 |
| 07-credentials-directories | 12 | 9 |
| 08-v261-directives | 12 | 6 |

Claims sourced only from the yubiOS source document (internal provenance, e.g. the hardened baseline combo and the v261 correction note) are attributed inline to `session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md` rather than to a web source.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
