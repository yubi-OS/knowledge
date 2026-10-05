# 07 - split kernel and ukify CLI

Scope: the `bootc container split-kernel-and-rootfs` and `bootc container ukify` CLI contract: argument placement, what bootc computes versus what passes through to ukify, and the staged sealed-image build shape these commands enable.

## The two commands

`bootc container split-kernel-and-rootfs` extracts the kernel and initramfs from the current root filesystem and places them under `/kernel/<kernel-version>/` with the filenames `vmlinuz` and `initramfs.img`. It can also extract kernel files from a container filesystem mounted at another path (weak backing, weight 0.26, [bootc-container-split-kernel-and-rootfs, ManKier](https://www.mankier.com/8/bootc-container-split-kernel-and-rootfs); corroborated at weight 0.39 by the [man page mirror on GitHub](https://github.com/bootc-dev/agentic-workflows-ci-sandbox/blob/main/docs/src/man/bootc-container-split-kernel-and-rootfs.8.md)). Both sources for this man page are low weight in the dig, so the extraction behavior should be confirmed against the pinned bootc version before it is load-bearing in a build.

`bootc container ukify` builds a Unified Kernel Image using ukify. The command computes the necessary arguments from the container image, namely the kernel, initrd, cmdline, and os-release, and invokes ukify with them. Any additional arguments after `--` are passed through to ukify unchanged (weight 0.80, [bootc-container-ukify.8.md](https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-container-ukify.8.md); corroborated at weight 0.51 by [ManKier](https://www.mankier.com/8/bootc-container-ukify) and weight 0.50 by the [bootc_lib::ukify internals](https://bootc-dev.github.io/bootc/internals/bootc_lib/ukify/index.html)).

## The argument contract

Two consequences follow from the man page text, and both are common build-recipe mistakes:

First, the arguments bootc computes for you should not be supplied a second time. The container image already provides the kernel, initrd, kernel command line, and OS release, and bootc hands them to ukify (weight 0.80, [bootc-container-ukify.8.md](https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-container-ukify.8.md)). Adding a second `--os-release` or re-specifying the initrd duplicates work the wrapper already did and risks a mismatch between the two sources.

Second, the `--` separator is load-bearing. Arguments before it are bootc's own options; arguments after it are ukify's, passed through unchanged. The UKI output path and the signing options, such as `--signtool`, `--secureboot-private-key`, and `--secureboot-certificate`, are ukify arguments and therefore belong after the separator (weight 0.80, [bootc-container-ukify.8.md](https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-container-ukify.8.md)). Misplaced, they are either rejected as unknown bootc options or silently treated as bootc options instead of reaching ukify.

## The staged build shape

A sealed image build needs stages because two artifacts that must not coexist have to be produced from the same tree: the UKI embeds the kernel and initramfs, but the final rootfs must not contain the raw kernel artifacts. The staged shape is:

1. Build and lint the rootfs that will ship, using the bootc project's container tooling as the transport (weight 0.96, [Getting Started with Bootable Containers, Fedora Docs](https://docs.fedoraproject.org/en-US/bootc/getting-started/); derived-image workflow at weight 0.95, [How to build derived bootc container images, Fedora Docs](https://docs.fedoraproject.org/en-US/bootc/building-containers/)).
2. Run `split-kernel-and-rootfs` to move `vmlinuz` and `initramfs.img` into a kernel-artifact stage outside the rootfs tree (weak backing, weight 0.26, [ManKier split-kernel man page](https://www.mankier.com/8/bootc-container-split-kernel-and-rootfs)).
3. Derive a final-rootfs stage that contains neither `/kernel` nor the raw kernel and initramfs, and mount that tree read-only for the ukify step.
4. Run `bootc container ukify` with the final rootfs as the rootfs source and the split kernel directory as the kernel source, with all ukify signing arguments after `--` (weight 0.80, [bootc-container-ukify.8.md](https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-container-ukify.8.md)).

The bootable-components framing behind this shape is documented in the bootc install guide: booting a system requires a bootloader, a kernel with optionally an initramfs, and a root filesystem, and the project treats these as components a container image must arrange correctly (weight 0.90, [Understanding bootc install](https://jmarrero.github.io/bootc/bootc-install.html)).

## Signing material handling

The signing options after `--` accept a private key and certificate. In a sealed-image pipeline these must enter as protected secrets or through external signing infrastructure, never as Dockerfile build arguments, ordinary `COPY` source, image layers, or workflow artifacts, because any of those paths persists the key material in the image or its provenance. The ukify wrapper's pass-through design is what makes the boundary clean: bootc computes the image-derived inputs, and only the operator-supplied signing options cross the `--` separator (weight 0.80, [bootc-container-ukify.8.md](https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-container-ukify.8.md)).

## Regeneration coupling

Every rootfs content change changes the composefs digest, and the signed UKI embeds that digest on its command line. The two commands above are therefore per-image steps, not one-time setup: a derived image ships a newly split kernel set and a newly signed UKI, and the UKI is placed in the final image at the EFI Linux directory for the boot path to select. The bootc project's own positioning supports treating the whole assembly as an image-level concern: the project aims to apply container image techniques to bootable host systems using standard OCI or Docker containers as the transport and delivery format for base operating system updates (weight 0.85, [bootc-dev/bootc](https://github.com/bootc-dev/bootc)).
