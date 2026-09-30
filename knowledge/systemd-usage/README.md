# systemd-usage knowledge corpus

Minted 2026-09-30 from the request "systemd usage" via the
`knowledge-corpus-mint` skill (Phase 0 endpoint preflight passed). A
practical, operator-focused systemd knowledge space: how to actually
drive units, logs, timers, drop-ins, sandboxing, networking, cgroups,
and boot debugging. Distinct from the 0pointer corpus in this repo,
which covers the design essays behind these mechanisms.

## Docs (8 of 10 outline candidates, 2 dropped by jev outline validation)

1. [01-units-and-systemctl](./01-units-and-systemctl.md) - unit types, lookup order, what enable/disable/mask actually change on disk, WantedBy wiring, lifecycle states
2. [02-journald-logging](./02-journald-logging.md) - journalctl filtering, persistent vs volatile, storage tuning, rate limits, forwarding
3. [03-timers-and-scheduling](./03-timers-and-scheduling.md) - OnCalendar/monotonic timers, Persistent=, AccuracySec/RandomizedDelaySec, debugging a timer that did not fire
4. [04-drop-ins-and-overrides](./04-drop-ins-and-overrides.md) - systemctl edit, merge semantics, the lexicographic-sort trap, systemd-delta verification
5. [05-service-hardening-sandboxing](./05-service-hardening-sandboxing.md) - the 8 directives that matter, the systemd-analyze security loop, failure tells
6. [06-network-and-resolved](./06-network-and-resolved.md) - networkd file matching, common setups, networkctl verbs, resolved config, debugging
7. [07-cgroups-resource-control](./07-cgroups-resource-control.md) - slices, directive table, systemd-run transient units, cgtop/cgls, delegation
8. [08-boot-analysis-targets](./08-boot-analysis-targets.md) - targets vs runlevels, systemd-analyze toolkit, the stuck-boot decision tree, timeout tuning

Dropped: 09-cryptenroll-credentials (0.53) and 10-nspawn-homed-practical (0.45), both already covered in the yubios corpus in this repo.

## Provenance

- Phase 0 preflight: searXNG 161 results / 0 suspended; jev smoke probe OK.
- Outline jev-validated 8/10 (0.89-2.00).
- 16 searXNG queries, 96 results, all jev-weighted (mean 0.36, 21 primary-quality >= 0.8).
- Docs ground in the freedesktop systemd 262 man pages (all fetched directly, no mirror fallback) plus weighted dig results; version-sensitive claims marked.
- research-db/ holds the full collection record.
