# Ledger Discipline: Watch List, Retirement, and Blockers

Scope: the Watch List, the "Retired From Active TODO" section, the 2026-08-01 BLOCKERS.md review diff, and the drift-check annotations in yubi-OS/yubiOS docs/TODO.md, read as the ledger's lifecycle rules: what the structure teaches about tracking work in a hardware-coupled OS project.

## The Watch List

The Watch List is the ledger's memory of half-closed questions. Each entry names a run, states exactly what it proved, and states the narrower residual gap (source doc):

- Run 29525332901 proved the ARM64 lane can boot the dev image to Fedora login with the pinned QEMU workaround; the watch item is to keep watching for runner QEMU refreshes before removing that workaround.
- Run 29872832727 retired the old root-SSH and DirectBoot bootloader-update blockers; its remaining VM gap was narrower: passless starts but no CTAP2 token enumerates, so token-dependent assertions skip.
- Run 30697269619 (commit b7f9d467 on main) retires that residual CTAP2-skip leg on rock1: both test scripts reach their final PASS assertions against the in-guest passless authenticator, not the dev image only. Its remaining gap is the sealed-UKI negative-tamper-boot leg (step 24 and beyond), blocked by B-VGPU-VM-UNZIP rather than by harness or guest bugs. The doc instructs: use this run as the canonical VM e2e evidence reference until the next green redline.
- Run 29869527608 proves the QEMU fTPM/StandaloneMM integration and board-specific compilation, but not physical-board behavior; ROCK 5B additionally lacks the required real DDR/TPL input and combined boot image.
- ci_firmware-rk.yml is the orchestrated firmware lane, and the removed ci_test-int.yml is historical context only; its yubiOS firmware state must not be restored into the top-level ci.yml chain.
- Three upstream-watch entries cover systemd v262: the removal of /run/boot-loader-entries/ support and the experimental systemd-sysupdated D-Bus API (the 2026-07-14 audit found no repo dependency, but future update UX should stay on UAPI.1/BLS and Varlink/systemd-sysupdate); the rename of systemd-sysupdate.service/.timer to systemd-sysupdate-update.service/.timer (verify compatibility symlinks before adding units against the old names); and v262 as active upstream work rather than the pinned baseline, with credential-sealing compatibility, the sysupdate unit rename, cryptenroll first-boot/Varlink work, and the FIDO2 zero-length-HMAC rejection tracked in refs/systemd-upstream-progress-2026-07-21.md.
- Go 1.26 expands default hybrid PQ TLS key exchanges beyond X25519MLKEM768; tests should assert acceptable policy rather than a single hard-coded group.
- bootc install to-filesystem --root-mount-spec="" is the documented install baseline for DPS auto-discovery; keep watching for installer UX that can prepare and mount target filesystems safely.
- 4 deferred ideas stay quarantined: systemd-sysinstall, LUO/KHO, U-Boot FIDO2/U2F console authentication (idea-stage until USB HID, crypto, and recovery risks are audited), and ORAS artifact media types (source doc).

The GitHub-hosted-runner concept behind the B-VGPU-VM-UNZIP entry is externally grounded: GitHub's own documentation on self-hosted runners (https://docs.github.com/en/actions/concepts/runners/self-hosted-runners, noul 0.76, authoritative) defines runner machines as customer-controlled compute that the workflow depends on, which is the class of dependency the ledger's host-deps gap pattern addresses.

## Retired From Active TODO

4 items are explicitly retired, each with the reason it is no longer arguable (source doc):

- Treating OpenSSL PQ hybrid support as future-only: current OpenSSL 3.5+ defaults already include X25519MLKEM768.
- Treating swu2f Layer 2 as merely planned: the TEST-only dev image path exists and must stay isolated.
- Repeating old digest examples from workflow logs as current pins: use PINNED.md.
- Describing ARM64 as secondary: ADR-023 makes ARM64 primary and x86-64 supported secondary.

Retirement is different from completion: these are beliefs the project wants agents and humans to stop repeating, not tasks to finish.

## The BLOCKERS.md review diff

The 2026-08-01 review section records what that review added, invoking the planning-cycle doctrine's BLOCKERS.md review-gate rule (source doc):

- New active blocker row B-VGPU-VM-UNZIP: the rock1 self-hosted runner has no unzip binary installed; the sealed-UKI BLSConfig verification path (OMN-150 Phase 2 / B-BOOTC-SEAL) and the negative-tamper-boot proof cannot complete on rock1. Run 30697269619 hit the gap at step 24 ("unzip: command not found", exit 127). Tracked in Linear OMN-150, comment d2e627de.
- A new "Self-hosted runner host-deps gap" entry in "Permanent CI-Evidence Patterns": workflow steps that shell out to binaries not in the apt install list fail with 127 (command not found) even when every other layer is correct. The yubiOS verification recipe: list every CLI tool in the workflow's apt install block, or use python3 -m zipfile / python3 -m tarfile as a zero-dependency fallback.
- B-VM-CTAP2 second-pass arm64 proof logged under "Not Current Blockers": run 30697269619 is the first arm64-only end-to-end VM e2e pass with the in-guest passless CTAP2 authenticator actually enumerated. Linear OMN-48 / yubiOS#25 stays closed; OMN-89 carries the hardware-leg proof point.
- No previously active blockers were retired in this review. OMN-150 stays in Backlog until B-VGPU-VM-UNZIP is closed and the negative-tamper-boot proof lands (source doc).

The diff demonstrates 3 ledger mechanics in one review: a new blocker is admitted with its run id and Linear anchor, a generalized pattern is promoted into a permanent section so it outlives the specific binary, and a solved blocker is demoted to "Not Current Blockers" with the proof point recorded rather than deleted.

## Drift checks and continuous coverage

The file ends with machine-facing annotations: a "Continuous / adaptive coverage" paragraph stating that the document supports the yubiOS continuous-monitoring layer (runtime detection via falco, tracee, tetragon, kubeArmor; adaptive policy; real-time monitoring), is observable from the runtime-detect surface, and feeds alerts and metrics into the audit-evidence rollup (source doc). Two dated drift-check entries from 2026-09-18 (wayfinder round 10, cycle 13, and round 11, cycle 19) record that the TODO surface is the register's companion, that no agent edits were made, and that the rounds were part of the docs/ sweep for inventory completeness (source doc).

## What the structure teaches

Read together, the 4 sections describe a ledger lifecycle: items enter as open checkboxes with preconditions written inline; solved items move to the Watch List as evidence with residual gaps named; beliefs that stop being true are retired explicitly with their replacement fact; failures that reveal structural gaps are promoted into permanent patterns through review-gate diffs; and periodic drift-check sweeps confirm the file is still being observed rather than silently edited. The one externally authoritative anchor in this doc's dig (GitHub self-hosted-runner docs, 0.76) sits exactly where the ledger crosses from internal practice into a documented external platform dependency.

Source doc: yubi-OS/yubiOS docs/TODO.md, fetched 2026-10-06 from https://github.com/yubi-OS/yubiOS/blob/main/docs/TODO.md (29130 bytes). Dig-backed claims carry URLs and noul weights inline; results below 0.5 are labeled weak backing and are not load-bearing here.
