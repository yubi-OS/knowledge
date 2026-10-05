# Owner-signed UKI: signing the unified kernel image with a YubiKey PIV key

Scope: how a unified kernel image is structured and signed with sbsign through PKCS#11 against a YubiKey PIV key in slot 9c, and what systemd-stub verifies at boot.

## The UKI is one PE binary

A unified kernel image (UKI) is a single executable which can be booted directly from UEFI firmware, or automatically sourced by boot loaders with little or no configuration. It is the combination of a UEFI boot stub program like systemd-stub, a Linux kernel image, and an initrd (weight 0.88, https://wiki.archlinux.org/title/Unified_kernel_image).

ukify is the tool whose primary purpose is to combine components, usually a kernel, an initrd, and the systemd-stub UEFI stub, to create a Unified Kernel Image: a single PE binary that boots the system (weight 0.92, https://www.freedesktop.org/software/systemd/man/ukify.html).

A 2026 walkthrough describes the same bundle: one PE-format EFI binary that bundles the kernel, initrd, kernel command line, OS release metadata, and an optional splash into one file that UEFI can execute directly and Secure Boot can sign as a whole (weight 0.43, https://botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/).

## The cmdline lives inside the signed object

During execution, systemd-stub unpacks and extracts the contents of the .cmdline section, the plain text kernel command line, and the .initrd section, the temporary root file system, for the boot process (weight 0.92, https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/deploying_rhel_9_on_microsoft_azure/configuring-rhel-on-public-cloud-platforms-with-uki). Because the cmdline is a section of the PE binary, signing the UKI signs the command line with it; an attacker cannot swap the command line without breaking the signature.

## Signing for Secure Boot with sbsign

Lennart Poettering's trusted boot writeup states that the resulting EFI PE binary is then signed for SecureBoot via a tool such as sbsign or similar, and that the SecureBoot key chosen to sign the UKI PE executable controls permissible choices of OS and kernel. The same writeup notes that the UKI model implies pre-built initrds (weight 0.83, https://0pointer.net/blog/brave-new-trusted-boot-world.html).

The yubiOS-specific extension is the signing key's location: the private key never sits in a build host's disk. sbsign consumes keys through a PKCS#11 provider, so the signing key can live on a YubiKey PIV applet in slot 9c and the build performs a signature operation on the device. The signature the firmware later verifies is therefore produced by hardware the owner physically holds, not by a key file a CI runner could exfiltrate. (This PKCS#11 routing is the project's own design decision; the underlying sbsign PKCS#11 support is the standard mechanism the same sbsign tool referenced above invokes.)

## What the stub verifies at boot

systemd-stub is the component that implements the UEFI stub program inside the UKI; the related systemd-measure tool can be used to pre-calculate expected PCR 11 values for the booted components (weight 0.75, https://0pointer.net/blog/brave-new-trusted-boot-world.html).

mkosi documentation summarizes the build-side tooling: mkosi provides comprehensive support for creating Secure Boot-enabled bootable images, with UKI support documented alongside (weight 0.31, https://deepwiki.com/systemd/mkosi/5.5-secure-boot-and-signing).

On a 2026 Arch, Fedora, or Debian system the canonical build path is ukify plus a signing step, which is why the owner-key signing slot in yubiOS replaces the distribution signing step rather than adding a parallel one (weight 0.43, https://botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/).

## Why the owner must hold the key

The design goal is that every stage of the boot proves to the next stage that what it is about to run was signed by a key the owner controls. Signing the UKI with a YubiKey-resident PIV key makes the first link of that chain a hardware-anchored signature operation. The alternative, a signing key as a file in CI, reduces the chain to whoever holds the CI secret.

sbctl-based walkthroughs show the same first link filled by a user-managed key on Arch systems (weight 0.17, https://edu4rdshl.dev/posts/uki-secure-boot-on-archlinux-systemd-boot-walkthrough/), and a distribution-aware UKI workflow covers kernel, initrd, command line, os-release, Secure Boot signing, inspection, rollout, and rollback verification (weight 0.19, https://danielcosenza.com/posts/lx-howto-unified-kernel-image/). The pattern is standard; yubiOS only changes who holds the key.
