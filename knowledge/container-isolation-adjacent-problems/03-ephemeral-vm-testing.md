# Ephemeral VMs: the whole-OS test boundary

Scope: bcvk ephemeral VMs for testing a bootc OS image end to end (UEFI boot, LUKS2, FIDO2 unlock), and why nspawn --boot or a bare-metal loop are not used in the inner test cycle.

## What only a VM can test

The first three boundaries in this corpus (rootless build, nspawn dev, unit sandboxing) all share the host kernel. That shared kernel is exactly what a whole-OS test must not have: the question is not "does this code run" but "does this image boot, unlock, and pass attestation like a real machine". Bootc's own tooling draws this line explicitly. The bootc virtualization kit (bcvk) bridges the gap between container development and hardware deployment: it launches ephemeral virtual machines from bootc containers to test bootable images locally or generate disk images for production frameworks [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-image-updates-with-the-bootc-virtualization-kit-bcvk, weight: high].

The mechanism is deliberately thin. Everything with bcvk ephemeral creates a podman container that reuses the host virtualization stack, making it simple to test bootc containers without requiring root privileges or dedicated VM infrastructure [https://github.com/bootc-dev/bcvk, weight: low]. bcvk ephemeral runs stateless VMs managed by podman; the VM boots directly from the container image's filesystem via virtiofs with no disk image creation, making startup very fast [https://www.mankier.com/8/bcvk, weight: low]. For disk-image paths, the bcvk libvirt run command wraps bcvk to-disk, which in turn wraps bootc install to-disk in an ephemeral VM [https://github.com/bootc-dev/bcvk/blob/main/README.md, weight: high].

## The boot chain the VM exercises

A namespace container never sees firmware. A disk-booted VM does. To boot a disk image in UEFI mode, QEMU is configured with OVMF firmware rather than a traditional BIOS [https://www.baeldung.com/linux/qemu-uefi-boot, weight: high]. The bootc-image-builder tool creates disk images from bootc images for provisioning across physical hardware, virtual machines, edge and cloud environments [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/creating-bootc-compatible-base-disk-images-by-using-bootc-image-builder, weight: high]. On yubiOS this is the layer where LUKS2 disk unlock and FIDO2-based unlock live: they are properties of the boot path (firmware, initramfs, disk layout), not of any process running inside a namespace. A boundary that shares the kernel cannot exercise them; a boundary with its own kernel and emulated firmware can.

## Why not nspawn --boot

nspawn can boot a full OS tree with its own systemd init, but it still inherits the host kernel and has no firmware stage. It cannot exercise UEFI boot, LUKS2 early unlock, or YubiKey-enrolled FIDO2 unlock, because those happen before the kernel that nspawn would share ever runs. The nspawn boundary exists to test the image's runtime (services, units, filesystem layout) cheaply; the VM boundary exists to test the image's boot. Promoting every dev-environment check to a VM would pay hypervisor startup cost for questions namespaces already answer.

## Why not bare metal in the loop

Bare metal is the final gate, not the loop. Only real hardware proves the actual YubiKey behavior, real UEFI firmware, and real TPM-free attestation path. But a bare-metal flash-and-reboot cycle is minutes per iteration; the inner loop needs the speed of ephemeral VMs. The Red Hat documentation positions bcvk exactly as this local test layer, with hardware deployment downstream [https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-image-updates-with-the-bootc-virtualization-kit-bcvk, weight: high]. The yubiOS loop is therefore: iterate in nspawn and ephemeral VMs, gate on bare metal before release.

## Where the boundary gets its inputs

The VM boundary intersects the identity boundary: a real YubiKey reaches the guest only through USB passthrough, which is the mechanism that lets the FIDO2 unlock leg run at all inside a VM test (see the passthrough doc). Without that passthrough, the VM could test the boot path but not the key ceremony; the boundary would be incomplete precisely where yubiOS is most opinionated.

## Cost and containment

The VM is the strongest isolation boundary in the family because it adds a kernel boundary: guest kernel bugs stay in the guest. That strength is why it is not used everywhere. VM startup and disk provisioning are the expensive steps the other boundaries avoid, and the VM's usefulness depends on the disk image it boots being the verified artifact, which ties it back to the verification chain (digest admission) upstream.
