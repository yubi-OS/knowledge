# 06: The yubiOS CI workaround for the zstd zboot loader gap

Scope: the concrete workaround yubiOS adopted in its VM CI workflow: pinning the upstream QEMU fix commit, binding the QEMU prefix into the bcvk container, and keeping an exact-error skip as fallback.

## The stance: fix the loader, not the image

The yubiOS position on the zstd zboot blocker is stated as four rules in the source record (project-internal record, yubiOS refs source document):

1. Keep production aligned with Fedora ARM64 defaults; do not downgrade production compression solely for CI.
2. In the ARM64 CI workflow (.github/workflows/ci_test-vm.yml), use the pinned upstream QEMU commit 3a18e8a25992d1643707e2cebdd6e9bb2bd7d3b9 for the bcvk lane until runner distributions ship the zstd EFI zboot loader fix.
3. Bind-mount the QEMU prefix and wrapper into bcvk's inner container so DirectBoot uses the zstd capable QEMU binary with the matching ROM search path.
4. Keep the exact-error skip as a fallback for stale self-hosted caches and manual runs with an older QEMU.

The first rule is the load-bearing one: it preserves the strategic decision that production images match Fedora, so the CI environment bends around the image rather than the reverse. The same posture appears in the doc 02 record: the distro ships an EFI_ZBOOT image compressed with zstd, and the fix belongs on the loader side.

## Why a pinned commit instead of a distro package

The self-hosted runner's distro packages QEMU on the distro's own schedule. GitHub's documentation describes self-hosted runners as systems the operator deploys and manages, hosting their own runner and customizing the environment used to run jobs (GitHub Docs, self-hosted runners, jev weight 0.82, https://docs.github.com/en/actions/concepts/runners/self-hosted-runners). That control is what makes the pin possible: the workflow can install or reuse a QEMU built from the specific upstream commit that contains the zstd branch, regardless of what the distro ships.

The pinned commit 3a18e8a25992d1643707e2cebdd6e9bb2bd7d3b9 is the functional zstd patch of Daan De Meyer's series, merged into the QEMU 11.0 line (doc 04). A CI run reported the resulting binary as "QEMU emulator version 10.2.50", a development build between releases that contains the fix (project-internal record, doc 07).

## Why bind-mount the prefix, not just the binary

bcvk ephemeral runs QEMU inside a podman container that reuses the host virtualization stack (bcvk repository, jev weight 0.86, https://github.com/bootc-dev/bcvk, detailed in doc 05). So the QEMU that executes the DirectBoot is the container's QEMU. Installing a fixed QEMU on the host does nothing until it reaches the container.

Docker's bind mount documentation explains the mechanism and the trap: when you bind-mount a directory into a non-empty directory on the container, the directory's existing contents are obscured by the mount (Docker documentation, jev weight 0.80, https://docs.docker.com/engine/storage/bind-mounts/). Mounting the whole QEMU prefix into the container therefore replaces the container's QEMU tree wholesale, which is what the workaround wants: the fixed binary plus its matching ROM files. The ROM search path is the reason the prefix rather than a lone binary is mounted; QEMU locates firmware ROMs relative to its install prefix, and a binary without its ROMs fails differently and later (project-internal record).

## The exact-error skip as a safety net

Not every run executes under the pinned QEMU. Stale self-hosted runner caches and manual runs with an older QEMU can still present the old unpacker. The workflow therefore keeps a skip keyed on the exact error string: when the run fails with "unable to handle EFI zboot image with zstd compression", the job treats it as the known environmental limitation and skips rather than failing as a product regression (project-internal record). The skip is deliberately exact: any other failure still counts, which keeps the fallback from masking real regressions in the guest.

## The strategic ladder

The source record ranks the options (project-internal record):

1. Preferred short-term: pinned QEMU until the distro QEMU contains the fix.
2. Preferred medium-term: bcvk ARM64 firmware or stub boot mode for better fidelity.
3. Last-resort CI workaround: a test-only ARM64 image variant with older supported compression, never production.

The pinned commit is a bridge, not a destination. Doc 09 tracks the other end of the bridge: QEMU 11.0 shipped on 2026-04-22 (QEMU release announcement, jev weight 0.98, https://www.qemu.org/2026/04/22/qemu-11-0-0/), and the open question is when the runner image's package manager delivers a build at 11.0 or newer.
