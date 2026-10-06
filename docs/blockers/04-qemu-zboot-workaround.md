# 04 - QEMU zboot Workaround (B-QEMU-ZBOOT)

Scope: the pinned QEMU workaround for zstd EFI zboot images in VM CI, the runner-image refresh condition for its removal, and why the ARM64 lane's failure moved elsewhere.

Grounding spine: source doc `yubi-OS/yubiOS docs/BLOCKERS.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/BLOCKERS.md), row B-QEMU-ZBOOT.

## The blocker as stated

The register states that zstd EFI zboot still depends on a pinned QEMU workaround until runner QEMU carries the upstream fix, and that run 29525332901 proved the workaround is no longer the active failure for the ARM64 lane (source doc). The next step is to keep the workaround explicit, keep the stale-cache skip, and revisit removal only after a runner image refresh (source doc). The root-cause class is an environment lag: the project's VM CI depends on a runner-level tool (QEMU) whose installed version does not yet support a kernel packaging format the project uses, so the fix must be carried locally until the environment catches up.

## What EFI zboot is and why QEMU cannot load it

Modern Fedora arm64 kernels are packaged as EFI zboot images: a PE-format wrapper around a zstd-compressed kernel payload. The bcvk issue that documents this states plainly that "Fedora aarch64 kernels (since F37+) are packaged as EFI zboot images, a PE-format wrapper around a zstd-compressed kernel payload. QEMU's -kernel flag cannot load these directly and fails", and that "x86_64 kernels are shipped uncompressed, so this issue doesn't occur there" (source: https://github.com/bootc-dev/bcvk/issues/290, jev weight 0.67). This asymmetry explains why the blocker is an ARM64-lane concern: on amd64 the kernel payload reaches QEMU uncompressed, so the same CI path never hits the limitation.

The kernel-side mechanism is documented upstream: the EFI boot stub lets a Linux kernel boot without a conventional EFI boot loader, since the stub itself performs the loader's job (source: https://www.kernel.org/doc/html/latest/admin-guide/efi-stub.html, jev weight 0.87). Generic EFI zboot support was implemented in the kernel so the same mechanism works on arm64, RISC-V, and LoongArch, which the LWN coverage notes helps maintenance of the kernel and the tooling around it, including kexec, code signing, and deployment (source: https://lwn.net/Articles/929431/, jev weight 0.62).

## The upstream fix on the QEMU side

QEMU support for zboot images compressed with zstd has been proposed on the qemu-devel mailing list: the patch series states "Fedora arm64 has an EFI_ZBOOT kernel image compressed with zstd. Let's make sure we can use it for direct kernel boot with qemu" (sources: https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02627.html, jev weight 0.63, patch v3; https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02623.html, jev weight 0.61, patch v2). This is the "upstream fix" the register refers to: it exists as a mailing-list series, so the blocker persists until the runner's installed QEMU version carries it. QEMU itself is the standard full-system emulator for the project's VM legs (source: https://www.qemu.org/, jev weight 0.72), which is why its version on the runner image is a dependency at all.

## The unblock path

The register's next step is deliberately conservative (source doc):

1. Keep the workaround explicit, so the pin and its reason stay visible in the workflow instead of becoming an unexplained magic flag.
2. Keep the stale-cache skip, which protects the lane from a different failure mode while the workaround is in place.
3. Revisit removal only after a runner image refresh, because that is the event that changes the installed QEMU version.

Run 29525332901 already proved the workaround is no longer the active failure for the ARM64 lane (source doc), which is evidence that the workaround works and that the blocker's remaining lifetime is governed entirely by the runner environment, not by the project's code.

## The dependency-management lesson

B-QEMU-ZBOOT is the register's model case for a time-boxed environmental dependency. The project cannot fix QEMU, and pinning the workaround locally is the only way to keep CI green in the meantime. The ledger discipline is to keep 3 facts attached to the pin: what it works around, how it was proven (the run number), and what event retires it (the runner image refresh). Notably, the register treats "no longer the active failure" as evidence to record but not as grounds to remove the workaround: removal is gated on the environment, not on the workaround's current pass rate. In a hardware-coupled OS project, runner images are part of the dependency surface, and the ledger keeps them there explicitly.
