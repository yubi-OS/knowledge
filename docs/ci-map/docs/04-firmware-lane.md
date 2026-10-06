# 04 Firmware lane: ci_firmware-rk.yml

**Scope:** the largest workflow in the repo, the orchestrated ARM64/RK firmware integration from StandaloneMM through QEMU fTPM e2e to board-scoped publication. Grounding spine: source doc (yubi-OS/yubiOS docs/CI_MAP.md, https://github.com/yubi-OS/yubiOS/blob/main/docs/CI_MAP.md).

## Shape

`ci_firmware-rk.yml` is 69,375 B with 6 jobs, the largest workflow in the repo (source doc, census). The jobs, from the source doc's per-file job tree (source doc):

1. `stmm` (11 steps): StandaloneMM RPMB build, amd64 plus primary/rebuild arm64, with deterministic EDK2 stack cookies, producing `BL32_AP_MM-amd64`, `BL32_AP_MM-arm64`, and `BL32_AP_MM-arm64-repro` artifacts.
2. `optee_fip` (17 steps): OP-TEE/fTPM/TF-A/U-Boot board builds for QEMU, RK3399, and RK3588, producing per-board `fip-flash-<board-suffix>` artifacts with BL32 + OP-TEE + U-Boot + TF-A.
3. `firmware-reproducibility` (10 steps): a blocking comparison of intended unsigned component bytes, with the QEMU signing boundary and RK3588 TPL boundary recorded, and 30-day JSON evidence, one ARM64 report per board.
4. `qemu` (10 steps): in a DHI container with a user-scoped hardened builder, downloads `fip-flash`, assembles `flash.bin` if needed, boots `qemu-system-aarch64`, and runs the fTPM e2e asserts (fTPM Early TA loads, TPM self-test marker, no known failure signatures, StMM SP loaded).
5. `firmware-publish` (11 steps): in the DHI container, on `workflow_dispatch` with `Docker_push=true`, publishes `/firmware` payloads (board MANIFEST.txt, fip.bin, flash.bin, bl1.bin, BL32_AP_MM.fd, u-boot.bin, tee bins) through the Bake `firmware` target with the strict yubiOS.rego policy.
6. `ci-callback` (1 step): legacy no-op from the pre-PR-145 callback contract (source doc).

The build consumes pinned env refs for TF-A, OP-TEE OS, optee_ftpm, U-Boot, EDK2, EDK2 platforms, ms-tpm-20-ref, and mbedTLS (source doc).

## Key invariants

The source doc (source doc) records three:

1. **Blocking comparison before QEMU.** The intended unsigned components comparison (per-board 30-day JSON evidence) runs before QEMU executes. A firmware that cannot prove its unsigned bytes match expectations never reaches the e2e stage.
2. **RK3588 TPL publish gate (OMN-56).** Publication is refused when the external TPL dependency is unresolved. The RK3588 final image depends on an external TPL blob, so byte equality cannot cover it; instead publication itself is gated.
3. **Board-scoped tags.** `firmware-qemu-arm64`, `firmware-rock5b-rk3588`, `firmware-rockpro64-rk3399`; the QEMU board additionally keeps the compatibility `firmware` tags.

## Publication shape

Unlike the prod/dev two-stage publication (per-arch tags then an `imagetools` index), firmware publishes directly with the registry exporter from a privileged DHI container job on a user-scoped `hardened` builder (source doc, doc 03). Docker Hub outputs are `firmware[-sha]` for QEMU compatibility plus the three board-scoped tag families (source doc).

## External grounding for the components

The components the lane assembles are external open source projects. The fTPM Trusted Application comes from OP-TEE's integration of the Microsoft TPM 2.0 reference implementation, where the fTPM TA provides a secure firmware implementation of a TPM using the MS reference implementation (github.com/OP-TEE/optee_ftpm, https://github.com/OP-TEE/optee_ftpm, jev weight 0.19, weak). U-Boot documents its `virt` machine for QEMU ARM with AArch64 support, which is the emulation surface the lane's QEMU job boots through (docs.u-boot-project.org, "QEMU ARM", https://docs.u-boot-project.org/en/stable/board/emulation/qemu-arm.html, jev weight 0.48, weak). For the Rockchip boards, third-party build guides for TF-A and OP-TEE on RK3588 exist (hardenedvault.net, "HOWTO: build ATF and OPTEE for RK3588", https://hardenedvault.net/blog/2025-03-10-build-atf-optee-rk3588/, jev weight 0.12, weak), and Rockchip's own secure-boot chain documentation describes the BL31/BL32 stage structure the FIP packaging matches (DeepWiki for rockchip-linux/rkbin, https://deepwiki.com/rockchip-linux/rkbin/2.1-secure-boot-chain, jev weight 0.26, weak). These are context for what the pinned forks are; the authoritative pins themselves live in `PINNED.md` and are refreshed by the fetches group (source doc, doc 07).

## Composes with

The source doc (source doc) records two composition edges. First, the 8 fork workflows feed component artifacts conceptually, but the fork workflows validate pinned forks and do not stitch; stitching is `ci_firmware-rk.yml`'s job (source doc, doc 07). Second, `ci_test-ftpm-tpm0.yml` and the VM lane consume `firmware-qemu-arm64`, which is why the lane publishes the QEMU board under both board-scoped and compatibility tags (source doc, docs 05 and 06).

## Why the lane is the repo's largest workflow

The 69 KB size reflects the breadth of the integration: 8 pinned external components, 3 board targets, a reproducibility proof with signed-boundary bookkeeping, and a QEMU e2e with 4 distinct asserts. The source doc treats this workflow as the integration point of the whole firmware story: everything upstream (forks, fetches) produces or pins inputs, and this workflow is where they are assembled, proven, and published (source doc).
