# 09 - Remediation Roadmap

Scope: The 5 concrete fixes distilled from the three-angle audit of the 24 yubiOS workflow files, their priority order, and the verification reasoning behind the ordering.

## The fixes

- A. Update the `github-actions` skill to match `main`: bump the documented `actions/checkout` SHA to `3d3c42e5aac5...` (v7.0.1) and the container digest to `sha256:9d293dad...` (multi-arch index), and add `actions/download-artifact@37930b1c2aba...` and `docker/setup-buildx-action@d7f5e7f5...` to the allowlist body.
- B. Roll the 8 stale `actions/checkout@de0fac2e4500...` (v6.0.2) references to the v7.0.1 SHA across `ci_fork_bcvk.yml`, `ci_fork_edk2.yml`, `ci_fork_mkosi.yml`, `ci_fork_optee-os.yml`, and `ci_test_sealed-uki-vm.yml`.
- C. Restore the canonical `container:` block in `ci_test_sealed-uki-vm.yml` on all 3 jobs (the v4 fix in flight on branch `sealed-uki-vm-lane-v2`).
- D. Adopt the canonical SoftHSM + `provider:pkcs11` + `systemd-sbsign` signing pattern in `ci_test_sealed-uki-vm.yml`.
- E. Provision OVMF_CODE.fd / OVMF_VARS.fd from the `ci_fork_edk2.yml` artifact and enroll the yubiOS ROTPK via `virt-fw-vars`.

## Why this order

The order is not arbitrary; each fix either unblocks a later one or prevents re-introduction of an earlier one.

C and D come first because the sealed-UKI-VM workflow is the active work item (PR #155, branch `sealed-uki-vm-lane-v2`). The deep dive confirms the restore direction: 14 of 21 container jobs use the exact canonical block shape, all proven working, so the fix is adoption of a known-good pattern rather than invention. Beyond the container block, the stub needs the canonical SoftHSM bootstrap or its bootstrap step fails the same way the earlier failed run did, plus the sbverify gate between signing and QEMU boot so a sign-time failure surfaces as a signing error rather than an OVMF rejection.

A comes before B in effect even though B is mechanical: the skill is the reference agents copy from, so shipping B while the skill still documents v6.0.2 guarantees the next new workflow re-introduces the stale SHA. The deep dive's fix list puts the skill update at priority 2 for exactly this reason. General CI hardening guidance supports the same shape: embed automated security checks into the pipeline so controls hold without manual vigilance (source: https://www.securebydesignhandbook.com/docs/implementation/operate-phase/cicd-hardening, weight 0.68), and checklists treat pipeline hardening as a set of concrete controls applied at specific stages rather than a one-time cleanup (weak backing: https://www.paloaltonetworks.com/resources/datasheets/cicd-security-checklist.viewer.html, weight 0.63).

E comes last because it depends on D: a VM boot test only has something verifiable to boot once the signing lane produces a signed UKI, and the enrollment step only makes sense once the lane signs against a known ROTPK. CI/CD literature for firmware pipelines describes the same dependency: artifact build, then signing, then firmware-level verification, each stage consuming the previous stage's outputs (weak backing: https://deepwiki.com/OneKeyHQ/firmware-pro/3.4-cicd-pipeline, weight 0.52). Firmware CI write-ups that wire measured-boot and Handoff tests into CI show the pattern of copying artifacts between pipeline stages before the test stage runs (weak backing: https://raymo200915.github.io/2025/11/11/CI-Measured-Boot-Firmware-Handoff.html, weight 0.51).

## Verification gates

Each fix carries its own completion check:

- A: the skill body matches PINNED.md entry for entry, including the 2 missing allowlist actions.
- B: a re-scan of `uses:` lines shows 0 mismatches against PINNED.md (currently 8, all checkout).
- C: all 3 sealed-UKI-VM jobs carry the canonical 4-key block, and the dind pattern is rootless-socket, not inner-dind flags.
- D: the workflow passes the sbverify gate before the QEMU step, and the signing invocation uses `provider:pkcs11` with `systemd-sbsign`.
- E: the boot job provisions both firmware files and completes a vars-store enrollment before boot; a passing Secure Boot boot is the only proof the enrollment worked.

CI/CD hardening frameworks frame this as continuous compliance rather than a checklist sprint: pipeline security controls should be re-verifiable from artifacts the pipeline itself produces (weak backing: https://eastbaycyber.com/content/glossary-cicd-security-hardening-checklist/, weight 0.30).

## Takeaway

The audit's value is not the 5 fixes individually but their dependency shape: documentation first (A), mechanical drift second (B), the active regression third (C, D), and the capability gap last (E). Fixing E first would test Secure Boot against a stub that still cannot sign; fixing B first would leave the skill re-poisoning the fleet. The order maximizes the chance that each fix stays fixed.
