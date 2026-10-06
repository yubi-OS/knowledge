# 09 - ADR governance, version tracking, and supersession (ADR-016, ADR-024, ADR-025, ADR-028, process mechanics)

Scope: how the ADR set governs itself: status lifecycle, amendment and supersession discipline, PINNED.md as the single digest source of truth, the 2026-07-11 planning cycle consistency rules, ADR-016's systemd v261 adoption record including the RestrictFileSystemAccess correction, and the first boot validation and post quantum TLS posture records.

## Status lifecycle and amendment discipline

The source doc (yubi-OS/yubiOS docs/ADR.md, last reviewed 2026-07-21) uses 3 status tiers: Accepted (the decision stands), Proposed (ADR-018, ADR-019, ADR-027, ADR-033, several explicitly parked "post-launch, see FUTURE.md"), and Accepted with scope qualifiers ("Accepted - design + unit shipped; hardware validation post-launch" for ADR-024, "Accepted - firmware and installer tags both implemented" for ADR-022, "Accepted - satisfied by pinned dependencies; CI verification required" for ADR-025). Supersession is explicit and directional: ADR-017's platform priority is superseded by ADR-023 while its multi arch build decision stands, and ADR-032 names ADR-006, ADR-013, and ADR-022 as the implicit sources it makes explicit. Amendments are dated inline rather than rewriting history: ADR-002 (2026-07-28), ADR-003 (2026-07-28), ADR-015 (2026-07-07 and 2026-07-11), ADR-017 (2026-07-11), ADR-019 (2026-07-11). Several ADRs close with `<last-reviewed-against-blockers>` date tags recording that the decision was re-checked against docs/BLOCKERS.md on that day. (source doc)

## The 2026-07-11 planning cycle and its consistency rules (ADR-028)

ADR-028 (source doc, status Accepted) records a documentation planning cycle that reviewed repo markdown, merged PRs, and upstream sources for systemd v261, OpenSSL 3.5, Go 1.24, bootc installation, and QEMU zstd EFI zboot, and found repeated stale statements across docs. The decision: use refs/planning-cycle-2026-07-11.md as the evidence log and update docs around 4 consistency rules: PINNED.md is the live source for current image and tool digests; ARM64 is primary and x86-64 supported secondary; `RestrictFileSystems=` and `RestrictFileSystemAccess=` are separate systemd controls; and TEST-only swu2f and dev artifacts must stay isolated from production artifacts. The recorded consequence: future planning cycles add dated refs and then update the source of truth docs repeating the affected claims, and resolved blockers must not linger in BLOCKERS.md or active tasks in TODO.md merely for historical context. (source doc)

## The v261 adoption record (ADR-016)

ADR-016 (source doc, status Accepted) is the version tracking exemplar: systemd v261 shipped in June 2026 and the ADR adopts 5 features where they match the threat model, with a minimum version table (systemd-tpm2-swtpm.service, ConditionSecurity=measured-os, RestrictFileSystemAccess=, systemd-sysinstall, FileDescriptorStorePreserve=yes all at 261; RestrictFileSystems= recorded as an existing systemd.exec(5) control requiring BPF LSM). The ADR carries a dated correction (2026-07-11): earlier text in this ADR and related docs described `RestrictFileSystems=` as a new v261 feature, which was inaccurate; v261 introduced `RestrictFileSystemAccess=`, a separate filesystem access primitive. The yubiOS actions recorded: keep PINNED.md as the package floor source, add `ConditionSecurity=measured-os` to services that must refuse to run on an unmeasured boot (especially enrollment and first boot validation), and schedule a unit hardening audit treating the two filesystem controls separately. The CI relevant action for swtpm: exercise measured boot paths in CI without physical hardware, noting that bcvk DirectBoot cannot rely on an in-guest service for `/dev/tpm0` and the shipped route is host side QEMU vTPM attachment through swtpm, `-tpmdev emulator`, and architecture aware tpm-tis or tpm-crb devices. (source doc; cited at https://github.com/systemd/systemd/releases/tag/v261)

The dig corroborates the v261 feature set weakly: the kernel command line man page records `systemd.restrict_filesystem_access=` controlling the RestrictFileSystemAccess= enforcement policy, "Added in version 261" (https://man7.org/linux/man-pages/man7/kernel-command-line.7.html, weight 0.38, weak), and systemd-system.conf(5) documents the same control (https://man7.org/linux/man-pages/man5/systemd-system.conf.5.html, weight 0.37, weak). Press coverage of the release describing the software TPM service and the measured-os condition exists at weights 0.07 to 0.10 (for example https://linuxiac.com/systemd-261-lands-with-cloud-imds-tpm-and-network-updates/, weak; https://www.helpnetsecurity.com/2026/06/22/systemd-261-released/, weak), consistent with the ADR's own claims but not load bearing.

## First boot firmware validation (ADR-024) and post quantum TLS (ADR-025)

ADR-024 (source doc, dated 2026-07-08, status Accepted, design plus unit shipped with hardware validation post-launch) ships `yubiOS-chipsec-firstboot.service` as a one-shot first boot firmware validation service running a yubiOS relevant CHIPSEC subset plus best effort WPBT/Computrace surface checks, writing structured results to `/run/yubiOS/chipsec-result` and the journal. The honesty note: CHIPSEC does not provide a reliable automated Absolute/Computrace verdict; scanning is informational, not a pass or fail guarantee. The security exception: CHIPSEC needs raw hardware access, scoped to the one-shot service, and must not become a persistent base system privilege. (source doc)

ADR-025 (source doc, dated 2026-07-08, status Accepted) records that no application level TLS code is required today: OpenSSL 3.5 and later and Go 1.24 and later already negotiate X25519MLKEM768 by default on the relevant paths when defaults are not overridden, so yubiOS should verify this in CI and avoid local curve pinning away from upstream defaults. The 2026-07-11 research confirmation states the active risk is regression through future base image or toolchain changes, not missing implementation, and a future first party attestation server must inherit this verification requirement. (source doc)

## The 2026-09-18 drift check

The doc closes with a dated drift check note (wayfinder round 11, cycle 5): the ADR corpus is unchanged that round, and the round 8 upstream note (bootc v1.16.13) keeps the ADR-032 and OMN-150 option (b) viable, marked additive. This is the maintenance loop in action: the ADR spine is re-checked on a cadence, and drift is recorded as dated additive notes rather than silent edits. (source doc)

## Sources considered

| Source | Weight | Role |
|---|---|---|
| https://man7.org/linux/man-pages/man7/kernel-command-line.7.html | 0.38 (weak) | RestrictFileSystemAccess version 261 floor |
| https://man7.org/linux/man-pages/man5/systemd-system.conf.5.html | 0.37 (weak) | same control in system.conf |
| https://www.helpnetsecurity.com/2026/06/22/systemd-261-released/ | 0.10 (weak) | v261 release press |
| https://linuxiac.com/systemd-261-lands-with-cloud-imds-tpm-and-network-updates/ | 0.09 (weak) | v261 release press |
| https://portal.vyprsec.ai/stories/systemd-261-introduces-software-tpm-cloud-metadata-daemon-and-os-installer | 0.10 (weak) | aggregator press |
| https://oneuptime.com/blog/post/2026-03-02-use-systemd-protectsystem-protecthome-directives-ubuntu/view | 0.09 (weak, unused) | unrelated hardening guide |
| yubi-OS/yubiOS docs/ADR.md (source doc) | n/a | ADR-016, ADR-024, ADR-025, ADR-028, process text |
