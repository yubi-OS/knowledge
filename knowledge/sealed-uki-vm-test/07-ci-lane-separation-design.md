# Why the sealed lane is its own CI workflow

Scope: the design rationale for a separate `ci_test_sealed-uki-vm.yml` workflow rather than extending the unsealed bootc-filesystem lane, the failure-class argument, and the staged evidence plan.

## The contract carved out by the existing workflow

The existing `TEST - bootc install to-filesystem install e2e` workflow states its own contract in its header: it proves a strict fs-verity composefs repository and an unsealed traditional BLS deployment, and a separate Secure Boot VM lane is required to prove sealing (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md, quoting the workflow's own lines 6 to 7). The sealed lane proposal is the direct answer to that carve-out: a companion workflow named `ci_test_sealed-uki-vm.yml`, dispatched manually or callable from other workflows, running on GitHub-hosted runners in a pinned container (source doc: same).

GitHub Actions provides the underlying CI substrate the lane builds on: workflows that build and test code on hosted runners, with live logs and a built-in secret store (weight 0.923, https://docs.github.com/en/actions/tutorials/build-and-test-code; corroborated at weight 0.838 by https://github.com/features/actions).

## Failure-class isolation

The source doc gives two reasons not to fold sealing into the existing workflow (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md):

1. Folding would force the unsealed workflow to depend on the entire sealed toolchain: mkosi ukify plus SoftHSM plus QEMU OVMF plus measured boot plus the signed UKI build chain, none of which it needs today.
2. Folding would silently mask whether the unsealed lane still works. The failure mode once sealing lands is "we tried to seal and the install broke", which is a different class of failure from "the unsealed install broke".

The second argument is the general CI-design point that triage literature also makes independently: separating failure classes (product regressions versus environment drift versus flaky automation) is what keeps pipeline failures diagnosable (weight 0.31, weak backing, http://test-automation-experts.com/how-to-build-a-test-result-triage-workflow-that-separates-product-regressions-environment-drift-and-flaky-automation/; a second article makes the same argument at weight 0.112, weak backing, http://softwaretestingreviews.com/how-to-build-a-ci-failure-triage-workflow-that-separates-product-bugs-from-test-noise/). Both are weakly backed commercial blogs; the load-bearing statement of the rationale is the source doc.

Keeping the lanes as siblings also has a scheduling property: the sealed lane can land in parallel with the bootc 1.16.4+ dependency work on OMN-150 without blocking the unsealed lane from shipping first (source doc: same).

## QEMU as a CI execution environment

Running the sealed lane on GitHub-hosted runners means booting the full OS in QEMU per run. QEMU's own testing infrastructure covers everything from unit testing and exercising specific subsystems all the way to full blown functional tests (weight 0.615, https://www.qemu.org/docs/master/devel/testing/main.html), which is the precedent that treating a QEMU boot as a CI test stage is normal practice. The sealed lane's runtime assertions then read guest state (Secure Boot status from systemd-stub, PCR values via tpm2_pcrread) through the booted system, as covered in the OVMF and measured-boot docs.

## Negative-test discipline in the evidence plan

The lane's evidence requirement before the parent issue (OMN-53) moves to Done is staged (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md):

1. One amd64 green run with the unsigned-UKI lane, so the primitive is known to work before the seal is added.
2. One full green run with the seal active.
3. One green run on the same image at the same SHA with the negative-tamper assertions enforced.

The assertion inventory is 6 positive assertions (UKI built and verified, dm-verity cmdline, Secure Boot boot, PCR0/4/7/11 measured, LUKS2 sealed, FIDO2 unlock on real key) and 3 negative assertions (tampered UKI rejected, tampered composefs rejected, unsigned UKI rejected) (source doc: same).

Independent projects treat negative-test suites as their own deliverable for the same reason. SB-11 of the riscv-fpga-secure-boot project is titled "Create cryptographic negative-test and tampering suite" and frames it as building toward an auditable secure-boot chain that starts in QEMU (weight 0.678, https://github.com/AnaZec/riscv-fpga-secure-boot/blob/main/planning/issues/SB-11-create-cryptographic-negative-test-and-tampering-suite.md). A Yocto BSP reference repo advertises its evidence in matching terms: signed FIT verification and tamper rejection, a real signature check, a real boot to a login prompt, and a real tamper-rejection negative case, runnable in QEMU with no hardware required (weight 0.587, https://github.com/justembed-labs/meta-je-example-bsp). These are precedents, not dependencies; the yubiOS lane's own assertion list is what it must satisfy.

## Out-of-scope boundaries of the lane

Three exclusions keep the lane honest about what it proves (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md):

1. yubiOS-side BLSConfig wiring (OMN-150 Phase 2): the bootc 1.16.6 sealed-build capability IS present (verified by capability probes in `ci_test_bootc-filesystem.yml` run #11 at commit 7eba4856e7, which reported `sealed-build split capability: present` and `sealed-build ukify capability: present`), but the BLS entry on the built image still points at the composefs-blessed kernel path. The lane proves the primitive, not the install-time wiring. The two land separately.
2. Real YubiKey PIV 9c in CI: out of scope; SoftHSM is the CI primitive.
3. ARM64 Secure Boot on RK3588: out of scope; the VM lane is amd64-only initially, with ARM64 hardware validation tracked as OMN-141 / B-REAL-FIDO2.

## Gaps

The dig for this subtopic returned mostly generic CI documentation and weakly backed triage blogs; it did not surface prior art for "separate workflow per failure class" in boot testing specifically. The lane-separation rationale therefore rests on the source doc plus the two weakly backed articles, which is adequate for a design record but thin as external validation.
