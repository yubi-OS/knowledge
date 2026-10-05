# arm64-zstd-efi-zboot-bcvk

Knowledge corpus on the zstd-compressed EFI zboot image format on ARM64, its interaction with bootc/VM boot flows (bcvk), the QEMU loader limitation that required a workaround, and the upstream QEMU fix that resolved it. Minted 2026-10-05 from yubi-OS/yubiOS refs/arm64-zstd-efi-zboot-bcvk-2026-07-23.md.

## Documents

| Doc | Scope |
|---|---|
| [01-efi-zboot-format.md](01-efi-zboot-format.md) | The Linux EFI zboot image format: header layout, compression field, and why ARM64 adopted it. |
| [02-fedora-zstd-kernels.md](02-fedora-zstd-kernels.md) | zstd-compressed kernel payloads in Fedora ARM64 builds: packaging motivation and the dracut-ng interaction. |
| [03-qemu-direct-loader.md](03-qemu-direct-loader.md) | QEMU direct kernel boot of EFI zboot images: the loader path and the zstd limitation behind the error. |
| [04-qemu-zstd-fix.md](04-qemu-zstd-fix.md) | The upstream QEMU fix: the zstd EFI zboot unpacker patch, its author, merge, and the QEMU 11.0 release that carries it. |
| [05-bcvk-boot-flow.md](05-bcvk-boot-flow.md) | bcvk (bootc virtualization kit) and the ephemeral run boot flow: how the kernel is extracted from a bootc image and handed to QEMU. |
| [06-yubios-workaround.md](06-yubios-workaround.md) | The yubiOS CI workaround: pinned upstream QEMU commit, bind-mount of the QEMU prefix into the bcvk container, and the exact-error skip fallback. |
| [07-ci-evidence.md](07-ci-evidence.md) | CI evidence: what run 29525332901 proved about the workaround reaching the guest and what still failed. |
| [08-firmware-stub-vs-directboot.md](08-firmware-stub-vs-directboot.md) | Firmware/stub boot versus DirectBoot for ARM64 VM testing: decompression ownership, fidelity, and Secure Boot alignment. |
| [09-distro-qemu-tracking.md](09-distro-qemu-tracking.md) | Distro QEMU 11.0 availability and the runner-image question: when the pinned workaround can be retired. |

## Research summary

- Results collected: 108 (searXNG, 2 queries per subtopic, top 6 kept per query)
- Weight split: 73 results at weight >= 0.5 (primary/official), 35 at weight < 0.5 (weak, labeled in text), 0 unweighted
- Jev requests: 30 total (1 preflight probe, 1 outline validation, 28 weighting batches incl. redos), usage 19364 input / 0 output tokens
- Redos: 2 weighting batches hit failures on first send and were redone with split batches; all 108 results weighted after redos
- Skipped docs: none. All 9 validated subtopics digged strongly enough to author. Doc 07 (score 0.9005, marginal) was kept because its dig surfaced directly relevant bootupd and bootloader-update.service material

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
