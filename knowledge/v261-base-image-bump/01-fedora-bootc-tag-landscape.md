# 01. The fedora-bootc tag landscape

Scope: the published quay.io/fedora/fedora-bootc tag set, what each tag carries, who builds the images behind it, and how the tag set evolves across Fedora releases.

## What the image actually is

The Fedora/CentOS bootc project generates reference "base images" of so-called bootable containers designed for use with the bootc project, and it is an open source project associated with the Fedora Project (https://docs.fedoraproject.org/en-US/bootc/, noul 0.85). Bootable containers are transactional, in-place operating system updates shipped as OCI/Docker container images; the Linux kernel itself travels inside the image (https://docs.fedoraproject.org/en-US/bootc/getting-started/, noul 0.87). The bootc project's own repository states the same goal from the other side: using standard OCI/Docker containers as the transport and delivery format for base operating system updates (https://github.com/bootc-dev/bootc, noul 0.56, weak backing).

## Who builds and maintains the base images

The GitLab project `gitlab.com/fedora/bootc/base-images` exists to "create and maintain base bootable container images from Fedora packages" (https://gitlab.com/fedora/bootc/base-images, noul 0.74). Its releases page records that a major refactoring landed to create a "tier-x" component intended to be included as a git submodule by other projects such as Fedora CoreOS or IoT (https://gitlab.com/fedora/bootc/base-images/-/releases, noul 0.84). The project says it closely tracks CentOS and Fedora and aims to integrate tightly with their release and test infrastructure; CentOS Stream versions are the upstream for the RHEL product (https://docs.fedoraproject.org/en-US/bootc/base-images/, noul 0.89).

## Where the published tags live

The published image name is `quay.io/fedora/fedora-bootc`. The registry repository page is `https://quay.io/repository/fedora/fedora-bootc?tab=tags` (noul 0.90), although that page deliberately blocks automated description scraping, so programmatic consumers verify tags through the registry API or `docker buildx imagetools inspect` rather than the web page (https://quay.io/repository/fedora/fedora-bootc?tab=tags, noul 0.90). The Fedora IoT documentation demonstrates the intended consumer flow: build and boot a Fedora IoT bootc image using Quay.io, then push an update to a booted system (https://docs.fedoraproject.org/en-US/iot/fedora-iot-bootc-quay-example/, noul 0.92).

The base images documentation states that the Fedora and CentOS Stream base images are "listed and continuously updated" on the base images page, and that RHEL bootc images live separately in the Red Hat Ecosystem Catalog (https://docs.fedoraproject.org/en-US/bootc/getting-started/, noul 0.91). This is why a consumer like yubiOS cannot treat the tag set as frozen: the tags track the Fedora release stream underneath them.

## What a bootc base image contains

The Fedora documentation enumerates what ships inside the default base image: bootc itself to perform in-place upgrades as the day 2 mechanism, a kernel, systemd configured to run by default even when executed as a container, full NetworkManager support, and podman (https://docs.stg.fedoraproject.org/en-US/bootc/base-images/, noul 0.88). That composition is exactly why the yubiOS bump gate checks `systemd --version` inside the new image: systemd version drift is the user-visible signal that the base moved.

## Tag set evolution

Versioned tags follow the Fedora release stream. The dig surfaced variant repositories such as `quay.io/fedora-testing/fedora-bootc:rawhide-standard` for pre-release testing (https://gitlab.com/mmartinv/fedora-bootc-base-images, noul 0.59, weak backing), and mirror or fork repositories exist outside the Fedora GitLab namespace (https://forge.fedoraproject.org/pwhalen/base-images, noul 0.87). For yubiOS the relevant fact is recorded in the source ref: the pin targets `quay.io/fedora/fedora-bootc:45`, and the upstream tag set later grew a `:46` tag alongside the existing streams (source ref, no external weight for the internal pin; the general mutability of versioned tags is backed at noul 0.63 by https://docs.ozarksecuritylabs.com/supply-chain/tier-2-hardened/container-image-digests/).

## Why the landscape matters for a base bump

Because versioned tags on a registry are mutable pointers, the "current" content of `fedora-bootc:45` changes without any consumer-side action. The digest-pinning discipline doc (02) and the pin-drift doc (08) cover the controls that keep a consumer honest about that drift. The tag landscape itself sets the scope: every bump decision is a decision about which upstream stream and which digest of that stream yubiOS tracks.
