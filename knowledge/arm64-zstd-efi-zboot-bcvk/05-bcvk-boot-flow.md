# 05: bcvk and the bootc ephemeral VM boot flow

Scope: what bcvk is, how bcvk ephemeral run launches a VM from a bootc image, and where the direct kernel boot path enters the flow.

## What bcvk is

bcvk is the bootc virtualization kit from the bootc-dev organization. Its repository describes the project as helping to launch ephemeral VMs from bootc containers, and to create disk images that can be imported into other virtualization frameworks (bcvk repository README, jev weight 0.81, https://github.com/bootc-dev/bcvk). The operational model is container reuse: "Everything with bcvk ephemeral creates a podman container that reuses the host virtualization stack, making it simple to test bootc containers without requiring root privileges or dedicated VM infrastructure" (bcvk repository, jev weight 0.86, https://github.com/bootc-dev/bcvk).

That last clause is why bcvk fits CI: no root, no dedicated VM host, and the host's QEMU stack does the work. A third party architecture summary describes bcvk as a toolkit for running bootc containers as virtual machines without requiring root privileges, with ephemeral VMs as the primary execution mode, a hybrid approach that combines container convenience with VM isolation (DeepWiki overview, weak backing because it is an auto-generated summary site rather than the project's own docs, jev weight 0.37, https://deepwiki.com/bootc-dev/bcvk; related page, weak backing, jev weight 0.58, https://deepwiki.com/bootc-dev/bcvk/3-ephemeral-vms).

## How the ephemeral flow reaches QEMU

The ephemeral architecture description characterizes the system as running bootc container images as temporary VMs through a multi-stage execution model combining containers, namespaces, and QEMU virtualization (DeepWiki ephemeral VM architecture, weak backing, jev weight 0.23, https://deepwiki.com/bootc-dev/bcvk/3.1-ephemeral-vm-architecture). The container layer provides the environment, the namespace layer isolates it, and the final stage invokes QEMU against the bootc image's bootable content.

That final invocation is where the kernel goes to QEMU. A bootc image is built on the premise of bootable host systems transported and managed through standard OCI containers (bootc repository, jev weight 0.62, https://github.com/bootc-dev/bootc). The image carries a kernel, and the VM needs that kernel booted. Two routes exist:

1. Direct kernel boot: extract the kernel from the image and pass it with QEMU's -kernel option. This is the direct-kernel or DirectBoot path, documented by QEMU as launching a kernel without a full bootable image, useful for fast kernel testing (QEMU documentation, jev weight 0.91, https://qemu-project.gitlab.io/qemu/system/linuxboot.html, analyzed in doc 03).
2. Firmware or stub boot: boot the image's disk or kernel through UEFI firmware, so the EFI stub inside the image performs its own decompression (discussed in doc 08).

The yubiOS harness uses the first route: its VM e2e flow launches bcvk ephemeral run, which takes the kernel extracted from the bootc image and drives QEMU's direct-kernel path (project-internal record, yubiOS refs source document).

## Why that choice collides with zstd zboot images

When the bootc image is built from Fedora ARM64, its kernel is an EFI zboot image with a zstd payload (QEMU patch cover letter, jev weight 0.85, https://lists.gnu.org/archive/html/qemu-devel/2025-10/msg02627.html, detailed in doc 02). The direct boot path unpacks the payload itself, so it needs a QEMU whose unpacker implements zstd. Older QEMU builds handled gzip only and emitted the error that names this corpus:

unable to handle EFI zboot image with "zstd" compression

This error came from the host loader, before the guest ever started, which is what makes it a harness issue rather than a guest issue (project-internal record).

## What the container wrapper changes

Because bcvk runs QEMU inside a podman container, the QEMU binary that executes is the one inside the container, not the host's binary. This has two practical consequences that the yubiOS workaround exploits (project-internal record, detailed in doc 06):

1. A pinned newer QEMU can be installed on the host and bind-mounted into the bcvk container, so DirectBoot uses the zstd capable binary without replacing the container image.
2. QEMU finds its ROM files relative to its install prefix, so the wrapper must carry the matching ROM search path into the container, not just the binary.

The general bind mount behavior is documented by Docker: when you bind-mount a directory into a non-empty directory in the container, the directory's existing contents are obscured by the mount (Docker documentation, jev weight 0.80, https://docs.docker.com/engine/storage/bind-mounts/), which is why the workaround mounts the whole QEMU prefix rather than a single binary.

## Testing value of the ephemeral flow

The quick start documentation in the bcvk repository covers running ephemeral VMs as the primary workflow (bcvk docs quick start, jev weight 0.94, https://github.com/bootc-dev/bcvk/blob/main/docs/src/quick-start.md). For yubiOS the flow is the vehicle for the FIDO2 and LUKS2 CI tests: the test script tests/vm/test-luks-fido2-ci.sh runs through bcvk against a bootc image, which is exactly the path where the zstd loader failure first blocked the ARM64 lane (project-internal record, doc 07).
