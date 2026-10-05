# 06 - bootc integration and the ibcli convergence

Scope: bootc image mode integration and the 2026 convergence in which the standalone bootc-image-builder was deprecated and absorbed into the unified image-builder CLI.

## What bootc provides

bootc applies container-image discipline to bootable host systems: its project description states the aim of booting and upgrading via container images, using standard OCI/Docker containers as the transport and update mechanism (https://github.com/bootc-dev/bootc, noul 0.77). Fedora's documentation summarizes bootable containers as transactional, in-place operating system updates using OCI/Docker container images (https://docs.fedoraproject.org/en-US/bootc/getting-started/, noul 0.68).

A bootc container defines the OS content but is not itself bootable on metal; a disk image build step converts it. Red Hat's image mode documentation describes using bootc-image-builder to convert a bootc image to an ISO image, creating a system similar to the RHEL ISOs but with the container image content embedded (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/epub/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/deploying-an-iso-bootc-container-over-pxe-boot_deploying-the-rhel-bootc-images, noul 0.78).

## The convergence: two frontends become one

The osbuild project announced the convergence explicitly: the project is converging package mode and image mode into a single, unified image-building experience, and as part of that effort the standalone bootc-image-builder container is deprecated (https://osbuild.org/docs/bootc/deprecation-notice/, noul 0.74). The bootc-image-builder repository now states that the sources for bootc-image-builder are located in the osbuild/image-builder repository, and the repository itself contains build configs for the quay.io/centos-bootc/bootc-image-builder container (https://github.com/osbuild/bootc-image-builder, noul 0.93).

A maintainer's account of the merge describes the two different executables being largely merged into image-builder over the preceding months, with image-builder carrying all the functionality bootc-image-builder had (https://supakeen.com/weblog/merging-bootc-image-builder-and-image-builder/, weak backing, noul 0.40, a personal maintainer blog rather than project documentation). The yubiOS refs source research records the mechanical detail: image-builder-cli PR 374 (merged) made bootc-image-builder a multi-call binary of ibcli, with compatibility entry points kept for a transition period; bootc inputs surface as --bootc-ref, --bootc-build-ref, and --bootc-installer-payload-ref flags rather than a separate binary (https://github.com/osbuild/image-builder-cli, weak backing, noul 0.49, primary repository page but thin index text).

## The migration path

osbuild.org hosts a dedicated migration page for bootc users, oriented at Fedora/CentOS bootc or derivatives: it shows the concrete containerized workflow, pulling the input container and running the builder privileged with --pull=newer and SELinux options (https://osbuild.org/docs/bootc/, noul 0.84). The same page lists prerequisites that must be present on the building system, including the osbuild-selinux package or an equivalent osbuild SELinux policy where SELinux is enforced (https://osbuild.org/docs/bootc/, noul 0.86).

The bootc-image-builder README's usage guidance carries over to the unified tool: outside of initial experimentation, the recommendation is to build a derived container image (or reuse one) and then produce the disk image from it, rather than building directly from a base image (https://github.com/osbuild/bootc-image-builder/blob/main/README.md, noul 0.91).

## End state of the old artifacts

The ibcli release list tops out at release 69, with no newer release visible (https://github.com/osbuild/image-builder-cli/releases, noul 0.72), and the repository notice records the archive date as 2026-09-01 (https://github.com/osbuild/image-builder-cli, weak backing, noul 0.49). Forward motion lives in the unified image-builder project (https://github.com/osbuild/image-builder, noul 0.94). Community automation followed the same path: the ublue-os bootc-image-builder-action is in maintenance mode and points users at the upstream osbuild action (as verified 2026-09-29 in the yubiOS refs source research against https://github.com/ublue-os/bootc-image-builder-action, weak backing, noul 0.20).

## yubiOS framing

yubi-OS/image-builder-cli is a fork of osbuild/image-builder-cli, so the convergence lands directly on it: the fork now tracks a frozen upstream whose last release is v69, while bootc-facing capability continues in the unified image-builder. Any yubiOS tooling still referencing a separate bootc-image-builder binary or container should be treated as referring to the unified CLI's --bootc-* entry points. The convergence is also a caution for prior-art design: two frontends that shared one engine were still merged because duplicate CLIs split the user base; a new builder should keep one CLI surface from the start.
