# The FUTURE.md Coverage Map

Scope: the "FUTURE.md Coverage Map" section of yubi-OS/yubiOS docs/TODO.md, the tie-breaking rules it encodes between roadmap and active ledger, and the promotion criteria it points at.

## Why a coverage map exists

The section states its purpose in one sentence: "Use this map to keep FUTURE.md roadmap entries tied to active TODO work instead of letting roadmap-only sections drift." (source doc). The risk it addresses is a familiar documentation failure mode: a roadmap file accrues sections that no active task references, so nobody can tell whether a roadmap line is in progress, abandoned, or merely unwritten. The map makes the linkage explicit per section, and it names a follow-up rule for each row, so the relationship between the roadmap and the ledger is a table rather than a guess.

The map's rows (all from the source doc):

- Near-Term Planning Cycle: covered by Current Documentation Tasks; follow-up is to keep dated refs/ planning-cycle notes scoped to each research pass.
- Milestone F: ARM64 Owner-Owned Root Of Trust: covered by Current ARM64 Tasks and refs/arm64-rk-board-status-2026-07-17.md; follow-up is to continue the ROCK 5B/RK3588 Path A proof and the ROCKPro64/RK3399 secondary evidence.
- Milestone SecTime: Secure-World Time Evidence: covered by refs/sectime-rk-secure-time-2026-07-17.md; follow-up is that hardware TA/smoke-test evidence remains open.
- Milestone Frost: Firmware-Assisted GPU Resource Lockout: covered by refs/frost-panfrost-lockout-2026-07-17.md; follow-up is that the kernel prototype and RK hardware recovery proof remain open.
- Milestone CI: Keep The Test Lanes Honest: covered by Current CI Tasks and refs/firmware-rk-workflow-2026-07-17.md; follow-up is to keep PQ TLS, QEMU zstd EFI zboot, VM e2e, firmware callback, and dev/prod isolation checks visible.
- Milestone Docs: Prevent Snapshot Drift: covered by Current Documentation Tasks; follow-up is to keep refs, PINNED, CITATION, CI_MAP, and hardening terminology aligned.
- Milestone Net: OpenWrt WireGuard Deception LAN: covered by refs/openwrt-deception-proof-plan-2026-07-17.md; follow-up is to build the VM/spare-router proof and packet evidence.
- Post-Launch Hardware Work: covered by promotion gates and ARM64 board-status refs; follow-up is to promote individual items only when they have a board target, evidence target, and recovery plan.
- Deferred Ideas: watch-list only; follow-up is to keep systemd-sysinstall, LUO/KHO, U-Boot FIDO2/U2F, and ORAS media types out of active scope until promoted.
- Exit Criteria For Moving Work Out Of FUTURE: covered by refs/roadmap-promotion-gates-2026-07-17.md; follow-up is to require trust boundary, recovery, evidence, pins, notification/retention policy, and prod/test separation before promotion (source doc).

## What the columns teach

The three columns, roadmap section, current coverage, and follow-up, encode three different states of work: fully represented in the active ledger, represented by a dated research ref, or deliberately quarantined. A reader scanning the follow-up column can immediately distinguish "this lane has open hardware proof work" (SecTime, Frost, Net) from "this lane is documentation maintenance" (Docs) from "this lane must not start" (Deferred Ideas).

## The quarantine rules

Two rows carry the strongest governance load. Post-Launch Hardware Work sets a per-item promotion test: a board target, an evidence target, and a recovery plan must all exist before a FUTURE item becomes active TODO work (source doc). Deferred Ideas goes further and names the actual ideas on the shelf: systemd-sysinstall for guided install UX, LUO/KHO for appliance-style live updates, U-Boot FIDO2/U2F console authentication, and ORAS artifact media types as carrier images. All 4 are watch-list-only until promoted (source doc).

The exit-criteria row generalizes the promotion test: trust boundary, recovery behavior, evidence target, required pins and upstream sources, notification and evidence-retention policy when relevant, and production/test artifact separation, grounded in refs/roadmap-promotion-gates-2026-07-17.md (source doc).

## The maintenance pattern

The map is a one-table reconciliation of two documents that would otherwise drift independently. Its maintenance cost is low because each row names a concrete TODO lane or ref rather than a narrative claim. When a milestone's research pass lands, the row's coverage cell moves from "missing or partial" to a dated ref, which is exactly what the 2026-07-17 research pass did for SecTime, Frost, Net, and the promotion gates (source doc).

The lesson for hardware-coupled projects: a roadmap is only trustworthy when every section has a visible answer to "what active work or dated evidence represents this right now," and when the answer "nothing, on purpose" is explicit rather than implicit.

Source doc: yubi-OS/yubiOS docs/TODO.md, fetched 2026-10-06 from https://github.com/yubi-OS/yubiOS/blob/main/docs/TODO.md (29130 bytes). This is an internal-record subtopic: all claims above are attributed to the source doc; no searXNG dig was run.
