# 08 running swtpm-backed VMs in CI

Scope: what the surrounding ecosystem provides for TPM emulator automation, how swtpm+QEMU fits unprivileged CI runners, and the composition with bcvk ephemeral VMs.

## The software stack is designed for this

The TPM2 software stack treats emulation as a first-class mode. The tpm2-tss project is the "OSS implementation of the TCG TPM2" stack [1] (weight 0.914), and its documentation describes the emulator support directly: "The Software TPM is an open-source TPM emulator with different front-end interfaces such as socket and character device. Its code is hosted on GitHub and building is faciliated by the GNU Autotools. The TCTI module for using this simulat"or is part of the stack [2] (weight 0.931). Because the TCTI layer abstracts the connection, the same guest-side and host-side tools run against swtpm in CI and against real hardware elsewhere, which is the property that keeps the TPM test matrix portable [2] (weight 0.931).

The tpm2-software community site collects the ecosystem: "the community around the TPM Software Stack 2" and links to software with TPM2 support [3] (weight 0.809).

## Precedents in image and platform tooling

Swtpm-backed flows are already automated in adjacent tooling. OpenStack's diskimage-builder ships a tpm-emulator element: "This element works with a software TPM 2.0 emulator", installing "TPM utility prerequisites... including tpm2-tss software st"ack into the built image [4] (weight 0.552).

At the platform layer, libvirt documents the TPM backend in its domain XML format: "for this backend type the 'swtpm' TPM Emulator must be installed" [5] (weight 0.884). Nova's admin guide gives the enablement checklist: "The swtpm binary and associated libraries. Set the libvirt.swtpm_enabled config option to True. This will enable support for both TPM version 1.2 and 2.0" [6] (weight 0.887). SUSE's guide anchors the dependency order: "Before you can install and use the software TPM emulator, you need to install the libvirt virtualization environment" [7] (weight 0.958 for SLES 15 SP6; 0.887 for SP4).

The full-stack guest recipe is also documented: a Windows 11 on KVM/libvirt walkthrough running "the OVMF/swtpm/q35 trio" [8] (weight 0.613). Together these give CI authors proven reference shapes for firmware-plus-swtpm boots.

## Why swtpm fits unprivileged CI runners

The decisive property for CI is that the whole stack runs in userspace. QEMU's TPM backend is "an external TPM emulator called 'swtpm'" started before QEMU touches it [9] (weight 0.723). Nothing in that chain needs kernel TPM hardware, TPM kernel modules on the host, or root: the QEMU TPM spec defines the guest-visible TIS interface [10] (weight 0.937), the emulator lives entirely on the host side [9] (weight 0.723), and the emulator has "no limit on the number of guests that can access it" compared to a hardware TPM [11] (weight 0.890).

That composes directly with bcvk's model: "bcvk ephemeral creates a podman container that reuses the host virtualization stack, making it simple to test bootc containers without requiring root privileges or dedicated VM infrastructure" [12] (weight 0.842). A CI lane is therefore: ephemeral podman container, swtpm process with a private state directory and socket, QEMU with -tpmdev emulator, bootc guest asserting its TPM flows (docs 02 through 07).

## Existing QEMU+TPM test harnesses

Community harnesses show the pattern in practice: a repository dedicated to "Setting up QEMU with OVMF (UEFI) and swtpm (software TPM emulation)" as a step-by-step guide [13] (weight 0.480, weak backing), a UEFI testing writeup exercising firmware under QEMU [14] (weight 0.139, weak backing), and a purpose-built repo for QEMU TPM measurement flows [15] (weight 0.802). The yubiOS fork's --swtpm flag packages the same shape natively for bcvk ephemeral VMs, pinned via PINNED.md (yubiOS ref premise; doc 05).

## Teardown and reproducibility notes

Two properties make the CI story clean: per-lane swtpm instances with private state directories give parallel isolation with no cross-talk [11] (weight 0.890), and swtpm_setup-driven re-provisioning gives every run a deterministic starting TPM state [16] (weight 0.902). The harness only has to guarantee startup order (swtpm before QEMU [9], weight 0.723) and teardown of both processes plus the state directory.

## Sources

1. https://github.com/tpm2-software/tpm2-tss (weight 0.914)
2. https://tpm2-tss.readthedocs.io/en/latest/index.html (weight 0.931)
3. https://tpm2-software.github.io/ (weight 0.809)
4. https://docs.openstack.org/diskimage-builder/latest/elements/tpm-emulator/README.html (weight 0.552)
5. https://libvirt.org/formatdomain.html (weight 0.884)
6. https://docs.openstack.org/nova/latest/admin/emulated-tpm.html (weight 0.887)
7. https://documentation.suse.com/sles/15-SP6/html/SLES-all/tpm.html (weight 0.958)
8. https://www.bigiron.cc/guides/windows-11-guests-on-libvirt-virtio-swtpm-and-ovmf (weight 0.613)
9. https://github.com/OpenCDP/QEMU-CDP/blob/master/docs/specs/tpm.rst (weight 0.723)
10. https://www.qemu.org/docs/master/specs/tpm.html (weight 0.937)
11. https://documentation.suse.com/sles/15-SP5/html/SLES-all/tpm.html (weight 0.890)
12. https://github.com/bootc-dev/bcvk (weight 0.842)
13. https://github.com/tompreston/qemu-ovmf-swtpm (weight 0.480, weak)
14. https://www.earth.li/~noodles/blog/2024/07/qemu-uefi-testing.html (weight 0.139, weak)
15. https://github.com/anpep/qemu-tpm-measurement (weight 0.802)
16. https://man.archlinux.org/man/swtpm_setup.8.en (weight 0.902)
