# The Ledger Evidence Header

Scope: the dated evidence header at the top of yubi-OS/yubiOS docs/TODO.md, the canonical run references it pins, and the latest-pointer discipline that keeps every "what is true right now" question answerable from one place.

## Structure of the header

The header opens with three lines: "Last reviewed: 2026-08-24", "Status: active task list", and then the "Latest CI-infra evidence (2026-08-24)" paragraph (source doc). That paragraph is a dense one-paragraph summary of the most recent verified state: all 7 failing infra workflows on main are green again (SHA pins 5a50b96c, reachability parser + drift script + ci.yml groups 66f47bf7), the bcvk fork release v0.18.0-yubios.1 was cut at pinned source 34fb0b6b with amd64 and arm64 binaries plus SHA256SUMS (OMN-105/106 marked Done), the lifecycle/sysext lanes are green in ADR-023 gated mode with fixture images yubios-sysext-test:v1 and yubios-portable-svc-test:v1 (commit e587593f), the vgpu lint gate was fixed (commit ebf9223a), and BLOCKERS.md gains a new row B-ROCK1-OFFLINE noting both self-hosted runners offline with all VM-boot verification queued (source doc).

Every claim in that paragraph carries a machine-verifiable anchor: a short commit SHA, a release tag URL, a Linear issue id, or a workflow run id. This is the ledger's first teaching: a status line is only trustworthy if each clause resolves to an artifact.

## The latest-pointer chain

Below the CI-infra paragraph, the header stacks a chain of "Latest X" pointers, each naming one dated file or run as the current source of record for a topic (source doc):

- Latest requested-run evidence review: refs/ci-evidence-2026-07-21.md, covering the complete logs of runs 29869480442, 29869503301, 29869527608, 29872130447, 29872433355, 29872832727, 29876111887, and 29876466349.
- Latest upstream progress review: refs/systemd-upstream-progress-2026-07-21.md.
- Latest targeted audit: refs/systemd-v262-audit-2026-07-14.md.
- Latest broad research note: refs/research-refresh-2026-07-11.md.
- Latest VM e2e evidence: run 30697269619 (canonical), with the superseded run 29872832727 kept below it.
- Latest sealed-UKI source for the Negative 2 leg: run 30652859000 on branch sealed-uki-vm-lane-v2, SHA 1d0666d7, producing sealed-uki-artifacts-arm64 consumed by ci_test-vgpu-vm.yml step 24.
- Latest bootc install evidence: run 29884493346.
- Latest composefs audit: refs/bootc-composefs-sealed-flow-2026-07-22.md.
- Latest roadmap research pass: four dated refs (sectime-rk-secure-time, frost-panfrost-lockout, openwrt-deception-proof-plan, roadmap-promotion-gates, all 2026-07-17).
- Latest firmware workflow split: refs/firmware-rk-workflow-2026-07-17.md (source doc).

The word "latest" is doing real work: when a new run supersedes an old one, the pointer moves and the old pointer is demoted but kept. Run 29872832727 remains in the header after run 30697269619 became canonical, so the history of how the current belief was formed stays readable (source doc).

## The canonical run paragraph

The canonical VM e2e entry for run 30697269619 states the full evidentiary shape in one sentence: the run is on rock1 (self-hosted ARM64 KVM) at commit b7f9d467 on main, both tests/vm/test-luks-fido2-ci.sh and tests/vm/test-fido2-enrollment.sh PASS in the ARM64 bcvk guest, with swtpm plus swu2f CTAP2 enumeration, LUKS2 FIDO2 enroll/unlock, homed FIDO2 home create, 5 yubiOS-enroll-* commands, and ed25519-sk SSH keygen all executing with no skips. The hardware leg against /dev/sda also passes ("New FIDO2 token enrolled as key slot 2"). The remaining failure is scoped precisely: the sealed-UKI negative-tamper-boot leg is blocked by a new rock1 host-deps gap (B-VGPU-VM-UNZIP), not by docker-storage, per the OMN-151 disambiguation (source doc).

Note what the header refuses to say: it does not claim the sealed-UKI leg works, and it does not blame the wrong subsystem. The negative-tamper boot gap and the docker-storage gap are explicitly disambiguated.

## Install and integrity evidence

The bootc install entry for run 29884493346 records that native amd64 and arm64 fresh-runner legs installed digest sha256:22140ef11deebac5643544434af1263368b72fa791fe53e98add677bbcadc08e onto externally prepared DPS partitions, retained /mnt under --skip-finalize, and emitted no root= in the generated BLS entries (source doc). The composefs audit pointer (refs/bootc-composefs-sealed-flow-2026-07-22.md) then states the gap between current and target: the current install evidence is strict fs-verity through an unsealed BLS entry, while the sealed target requires a signed UKI that authenticates the composefs digest (source doc). The header thus keeps "what was proven" and "what is still missing" in adjacent lines.

## The use doctrine

The header closes with the rule that governs the whole file: "Use this file for current work. Completed historical context belongs in merged PRs, ADRs, or dated refs." (source doc). This is an eviction policy for a ledger. The file stays short enough to scan by pushing finished history outward to places built for it, while the header concentrates the only things a new session needs: the last reviewed date, the current status, and the pointer chain to the evidence.

The pattern generalizes to any hardware-coupled project: one dated status line, one pointer per topic that always names the newest source of record, demoted-but-kept superseded pointers, and an explicit statement of what the evidence does not yet cover.

Source doc: yubi-OS/yubiOS docs/TODO.md, fetched 2026-10-06 from https://github.com/yubi-OS/yubiOS/blob/main/docs/TODO.md (29130 bytes). This is an internal-record subtopic: all claims above are attributed to the source doc; no searXNG dig was run.
