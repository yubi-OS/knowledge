# The Milestone Research Lanes

Scope: the "Current Roadmap Research Tasks" section of yubi-OS/yubiOS docs/TODO.md: the SecTime, Frost, Net, and FUTURE promotion-gate lanes, what each completed item produced, and what remains open.

## Structure of the section

The section opens by stating its own origin: these items map FUTURE.md sections that were missing or only partially represented in the active TODO list (source doc). It then splits into 4 milestone subsections plus a promotion-gates subsection. Each item either carries a checkbox and points at a dated ref under refs/, or is left open with its precondition named.

## Milestone SecTime: secure-world time

4 items, all done, all pointing at refs/sectime-rk-secure-time-2026-07-17.md (source doc):

- A source-backed refs/ note identifying the active OP-TEE secure time configuration for RK3399 and RK3588, including CFG_SECURE_TIME_SOURCE_CNTPCT, AArch64 timer handling, and TF-A SPD=opteed integration.
- A definition of what yubiOS may safely claim from secure-world time: monotonic within a boot, suspend/resume behavior, normal-world tamper resistance, and power-loss/reboot limits.
- An OP-TEE TA/smoke test that records monotonic secure-world reads and expected failure behavior on ROCK 5B/RK3588 and ROCKPro64/RK3399.
- ADR coverage for which decisions may rely on secure-world time and which require stronger counters, sealed state, or remote-attestation freshness.

The dig backing this section is weak. A searXNG dig on 2026-10-06 for OP-TEE secure time configuration (queries "OP-TEE CFG_SECURE_TIME_SOURCE_CNTPCT Rockchip RK3588 secure time TF-A opteed" and "OP-TEE secure time source CNTPCT ARM trusted firmware opteed") returned mostly low-weight results; the strongest were the OP-TEE project pages on trustedfirmware.org (noul 0.40, weak backing) and optee.readthedocs.io porting guidelines (noul 0.24, weak backing). The source doc itself remains the authoritative spine here; the mechanism names (CFG_SECURE_TIME_SOURCE_CNTPCT, SPD=opteed) are recorded from the source doc.

## Milestone Frost: firmware-assisted GPU lockout

5 items, 4 done, 1 open (source doc):

- Done: a source-backed refs/ map of current Panfrost/Rockchip kernel patch points for probe/init, BO create/free, PRIME import, and submit guarding (refs/frost-panfrost-lockout-2026-07-17.md).
- Done: determination of whether the target kernel can use DRM device-memory cgroup accounting for Panfrost, or whether a minimal cgroup-aware BO accounting prototype is required first.
- Done: a sketch of the U-Boot device-tree/reserved-memory handoff plus secure-monitor SMC or mailbox interface for context quarantine, IOMMU revocation, GPU reset, or power gating.
- Open: prove whether RK3399/RK3588 lockout can target an offending cgroup/context or must fall back to full-GPU reset behavior. The precondition is explicit: a kernel prototype plus RK hardware recovery evidence.
- Done: tests defined for false positives, graphics stack recovery, telemetry, logs, owner notification, and owner recovery after a Frost event; and ADR coverage for the trust boundary between Linux policy, the OP-TEE/TF-A hard cutoff, and user recovery.

The dig for this lane surfaced 2 moderately relevant results, both weighted below the 0.5 authority line: an LWN article on cgroup memory accounting (noul 0.35, weak backing) and a Phoronix report on the DRM device-memory cgroup controller effort (noul 0.15, weak backing). The 1 high-weight result in the whole corpus belongs to this lane: the repo's own frost-panfrost-lockout ref at https://github.com/yubi-OS/yubiOS/blob/main/refs/frost-panfrost-lockout-2026-07-17.md (noul 0.51, authoritative), which corroborates that the patch-point map the lane produced is a real, maintained artifact. The open item's dichotomy, per-cgroup lockout versus full-GPU reset fallback, is the lane's core unresolved engineering question, and the source doc deliberately keeps it open until hardware evidence exists.

## Milestone Net: OpenWrt WireGuard deception LAN

5 items, 3 done, 2 open (source doc):

- Done: refs/endlessh-openwrt-fit-2026-07-17.md turned into an OpenWrt package proof plan with feed/package layout, UCI config, procd service behavior, firewall/nftables integration, and WireGuard-zone defaults (refs/openwrt-deception-proof-plan-2026-07-17.md).
- Open: build an OpenWrt VM or spare-router proof with a WireGuard-only decoy address pool and an owner-selected notification path.
- Open: capture packet-level evidence that scans hit decoys before the real SSH endpoint is discoverable.
- Done: logging defaults defined that avoid storing attempted passwords, private keys, or sensitive payloads, while still preserving useful owner notification evidence.
- Done: ADR coverage drafted for the deception trust boundary, notification model, evidence retention, lab-mode exposure, and failure behavior.

The 2 open items form a natural proof chain: the decoy LAN must exist before packet-level evidence of scan behavior can be captured. The lane's no searXNG results survived weighting for this subsection; its claims are carried by the source doc and the proof-plan ref it names.

## FUTURE promotion gates

2 items, both done, both pointing at refs/roadmap-promotion-gates-2026-07-17.md (source doc):

- Before moving any FUTURE item into ADR, SPEC, or implementation, record its trust boundary, recovery behavior, evidence target, required pins and upstream sources, notification and evidence-retention policy when relevant, and production/test artifact separation.
- Keep post-launch hardware and deferred ideas watch-listed until a specific owner, board or deployment target, evidence target, and recovery plan exist.

This subsection is the enforcement arm of the FUTURE.md coverage map (see doc 02): it converts "watch-list only" from a convention into a checklist with named required fields.

## What the lanes teach

The research lanes show a repeatable pattern: a milestone's first pass produces a dated source-backed ref, the ref generates concrete test and ADR work items, and the items that require hardware stay open with their precondition written into the checkbox line itself. Nothing is marked done because a design doc exists; the Frost open item stays open until a kernel prototype and recovery evidence on RK hardware exist (source doc).

Source doc: yubi-OS/yubiOS docs/TODO.md, fetched 2026-10-06 from https://github.com/yubi-OS/yubiOS/blob/main/docs/TODO.md (29130 bytes). Dig results for this doc carry the weights shown inline; the searXNG dig for the OP-TEE and DRM-cgroup mechanisms returned predominantly low-weight results, recorded as weak backing rather than silently promoted.
