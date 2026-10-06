# 09 - CI Runner Infrastructure (B-VGPU-VM-UNZIP and B-ROCK1-OFFLINE)

Scope: the self-hosted runner dependency gap that broke the vgpu lane, the runner outage that blocks every bcvk VM leg, and the queued-run recovery path.

Grounding spine: source doc `yubi-OS/yubiOS docs/BLOCKERS.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/BLOCKERS.md), rows B-VGPU-VM-UNZIP and B-ROCK1-OFFLINE. This is an internal-record subtopic, no dig.

## B-VGPU-VM-UNZIP: one missing apt package

The register's account is precise about how small the gap was (source doc). The rock1 self-hosted runner had no `unzip` binary in its apt install list. Step 24 of `.github/workflows/ci_test-vgpu-vm.yml` ("Lay down signed UKI from sealed-UKI VM artifact") downloaded `sealed-uki-artifacts-arm64` from sealed-UKI source run 30652859000 cleanly, then failed at line 25 of the step script with `unzip: command not found` and exit 127. Every prior step was green: step 11 image pull, steps 13 and 14 preconditions, step 15 hardware leg PASS, step 16 VM guest PASS, step 17 enrollment surface PASS, steps 20 through 22 disk prep, and step 23 digest sanity. The single missing apt package cascaded to skip steps 25 through 32 (the entire sealed-UKI BLSConfig leg) and fail step 31 (teardown) on the way out.

The fix is FIXED IN CODE as of the 2026-08-24 review: `unzip` is in the workflow's "Install extra deps" apt block, which runs before the sealed-UKI extract step (source doc). A verification run was dispatched with allow_real_u2f=true (run 32732596620) but queued behind B-ROCK1-OFFLINE. The retirement condition is written into the row: once rock1 is back, confirm steps 21, 33, 37 and the Negative 2 refusal, then retire the row (source doc).

The 2026-08-24 review adds that lint errors which were skipping the whole vgpu e2e leg were also fixed (SC2034, SC2024, SC2046, commit ebf9223a), with verification still pending rock1 (source doc).

## B-ROCK1-OFFLINE: the runner that gates all VM legs

The register states that both self-hosted runners (rock1: self-hosted/Linux/ARM64/KVM; GPU: self-hosted/Linux/ARM64/GPU) showed offline in the repo runner registry as of 2026-08-24 around 13:35Z, offline rather than busy (source doc). The consequence is structural: every bcvk VM boot leg is hardware-blocked, because amd64 hosted runners cannot run bcvk ephemeral VMs (virtiofsd rc=2, documented in open diagnoses yubiOS#9, #20, and #25, and gated per ADR-023), and rock1 is the only host where the VM legs actually run (source doc). The OMN-151 verification run 32732596620 was queued against rock1.

The unblock path is human action: power and network-check the rock1 board (and the GPU runner if wanted). When rock1 re-registers, the queued vgpu run starts automatically, or expires after 24 hours, in which case re-dispatch ci_test-vgpu-vm.yml with allow_real_u2f=true; ci_test-bootc-lifecycle and ci_test-sysext-portable can then be dispatched with run_vm_legs=true for their full VM legs (source doc).

The 2026-08-24 review records the recovery work done around this constraint: all 7 failing infra workflows on main were green again (root causes included version-tag action references rejected by the full-SHA pin policy, a parser requiring quoted filenames in ci.yml bash arrays, and unescaped quotes in detect-fork-drift.py); the bcvk fork release v0.18.0-yubios.1 exists at the pinned source commit 34fb0b6b so lifecycle and sysext lanes download and checksum-verify the binary instead of 404ing; and the lifecycle/sysext lanes are green in gated mode, mirroring ci_test-vm.yml's ADR-023 loud-skip, with default runs verifying bcvk release download plus image and fixture pullability, and run_vm_legs=true routing to rock1 (source doc). Test fixture images were published as docker.io/0mniteck/yubios-sysext-test:v1 and yubios-portable-svc-test:v1, FROM scratch, built from tests/fixtures via ci_build-test-fixtures.yml (source doc). OMN-139 (the quay.io stream truncation incident) closed Done with the canary lane green since 2026-07-29 (source doc).

## The dependency shape

These 2 rows form a dependency pair the register makes explicit: B-VGPU-VM-UNZIP's verification (run 32732596620) is queued behind B-ROCK1-OFFLINE. A code-level fix (apt package) cannot become evidence until a hardware-level condition (board power) is restored. The blocker that looks like a software bug is actually gated on infrastructure, and the register keeps both visible in one place.

The drift checks from 2026-09-18 flag that B-ROCK1-OFFLINE names a retired GPU runner, recorded in-register as a review-request note rather than a row edit (source doc; see doc 10).

## The dependency-management lesson

The pair teaches 3 things about hardware-coupled CI dependency management:

1. Runner dependencies are real dependencies: an apt package missing from a runner image is as blocking as a missing kernel feature, and the only place to fix it is the workflow's install list.
2. Single-host dependencies create queue-shaped blockage: with rock1 as the only host that can run VM legs, every VM-verification dependency serializes behind its availability, and runs expire after 24 hours if it stays offline.
3. Fixes and evidence are separate steps: the unzip fix being "in code" is recorded distinctly from its verification run, which cannot start until the board is back. The register does not let the fix's existence shorten the evidence requirement.
