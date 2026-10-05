# Rejected alternative: the TPM-rooted trust anchor

Scope: how a TPM-rooted boot chain works, including PCR-bound UKI sealing and systemd-pcrlock, and why an OEM-soldered endorsement key fails the owner-rotation and export test.

## What the TPM anchor is

A TPM is a secure cryptoprocessor that implements the ISO/IEC 11889 standard, commonly used for verifying that the boot process starts from a trusted combination of hardware and software and for storing disk encryption keys (weight 0.14, https://en.wikipedia.org/wiki/Trusted_Platform_Module).

The endorsement key is the identity root, and its properties are the crux: a trusted application can use the TPM only if the TPM contains an endorsement key, which is an RSA key pair; the private half of the key pair is held inside the TPM and is never revealed or accessible outside the TPM (weight 0.91, https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/tpm-fundamentals).

The TPM 2.0 design literature adds nuance about the endorsement hierarchy: because the endorsement hierarchy is intended for privacy-sensitive operations, its enable flag, policy, and authorization are controlled, and creating and certifying a primary key as a signing key is privacy sensitive because it permits correlation of keys back to a single TPM (weight 0.14, https://ebrary.net/24759/computer_science/platform_hierarchy).

For yubiOS the decisive sentence is the first one: the private half never leaves the chip. A key the owner cannot export cannot be rotated onto a replacement YubiKey, cannot be backed up in split-knowledge form, and cannot be audited outside the chip that OEM firmware initialized.

## How a TPM-rooted chain would work

Measured boot is the mechanism: the firmware and boot stages measure what they load into Platform Configuration Registers. systemd documents its PCR map, including PCR 9, where after completion of systemd-tpm2-setup-early.service, which initializes all NvPCRs and measures their initial state at early boot, the systemd-pcrnvdone.service service measures a separator event into PCR 9, isolating the early-boot NvPCR initializations (weight 0.93, https://systemd.io/TPM2_PCR_MEASUREMENTS/).

systemd-pcrlock is the policy layer on top. Its lock-firmware-code operation is invoked automatically at boot via the systemd-pcrlock-firmware-code.service unit if enabled, which ensures that an access policy managed by systemd-pcrlock is automatically locked to the new firmware version whenever the policy has been relaxed temporarily (weight 0.94, https://www.freedesktop.org/software/systemd/man/latest/systemd-pcrlock.html). The pcrlock.d configuration covers individual measurements, including 830-root-file-system.pcrlock, the measurement to PCR 15 that systemd-pcrfs-root.service makes at boot covering the root file system identity, generatable via systemd-pcrlock lock-file-system (weight 0.71, https://www.man7.org/linux/man-pages/man5/systemd.pcrlock.d.5.html).

A 2026 guide summarizes the practical value: systemd-pcrlock, available since systemd 255, predicts future PCR values across firmware updates so that TPM-bound secrets survive kernel upgrades (weight 0.64, https://linuxsecureops.com/article/linux-unified-kernel-images-uki-systemd-boot-secure-boot-2026).

The conceptual frame comes from Poettering's authenticated-boot writeup, which treats UEFI SecureBoot and TPMs as the available building blocks while arguing that the way most distributions set them up is not as secure as it should be (weight 0.81, http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html).

Note the boundary: measured boot answers a different question than trust anchoring. Measured boot records what ran; it does not decide who was allowed to sign it. A stackexchange answer separates the two, noting Secure Boot/UEFI is a separate process that occurs during boot time and uses keys that are different from the ownership keys (weight 0.17, https://security.stackexchange.com/questions/115445/is-tpm-ownership-required-for-secure-boot-or-measured-boot).

## Why yubiOS rejects it as the primary anchor

The rejection is about the anchor's ownership, not TPM utility. Microsoft's own OEM documentation states the default posture plainly: secure boot is a security standard to help make sure that a device boots using only software that is trusted by the Original Equipment Manufacturer; when the PC starts, the firmware checks the signature of each piece of boot software (weight 0.89, https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/oem-secure-boot). The trust root on a stock PC is the OEM's, and the TPM's endorsement key was generated on the OEM's assembly line.

The yubiOS flip condition, from the source decision record: the project would move to a TPM-rooted chain as the primary anchor only if a hardware TPM appeared whose endorsement key the owner could regenerate and export under their own control. As documented, the EK private half is never revealed or accessible outside the TPM (weight 0.91, https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/tpm-fundamentals), which is the opposite of that condition. The YubiKey inverts the property: the key material lives on a device the owner physically holds and can rotate, which is why the owner-held hardware anchor replaces the chip-anchored one rather than complementing it.
