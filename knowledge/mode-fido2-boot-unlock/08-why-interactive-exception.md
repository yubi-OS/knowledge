# 08. Why the interactive touch is the deliberate exception in an automated boot chain

Scope: why the interactive touch is the deliberate exception in an automated boot chain: no remote unlock means no remote attacker unlock, and post-unlock services never see the key.

## The rest of the chain is automated by design

A modern image-based boot chain runs measurement, verification, and attestation without a human in the loop: UKIs are verified at load, dm-verity and composefs verify the root filesystem, and attestation daemons quote the measured state afterwards. Every one of those steps is a one-shot program or a daemon. The FIDO2 touch at the root volume is the single step where boot waits for a person. That is a choice, and the choice is visible in how the alternatives are classified: comparison surveys of encrypted-root strategies list TPM2 sealing and Clevis plus Tang keyserver unlock as the automated options and the FIDO2 YubiKey as the physical-presence option (source: https://www.bigiron.cc/guides/encrypted-root-with-tpm-clevis-tang-or-just-passphrase, jev weight 0.66). Implementation guidance for LUKS2 disk encryption describes managing TPM2 and FIDO2 hardware security keys for automated or hardware-backed volume unlocking, again placing TPM2 on the automated side and FIDO2 on the hardware-backed side (source: https://deepwiki.com/secureblue/secureblue/3.6-disk-encryption:-luks-tpm2-and-fido2, jev weight 0.62).

## The trade the choice makes

TPM2 sealing buys unattended boots by binding the unlock secret to measured boot state. FIDO2 buys a different property: the unlock secret lives in a device the operator physically holds, and its release requires user presence. FIDO2 as a protocol exists to provide phishing-resistant cryptographic authentication (source: https://www.microsoft.com/en-us/security/business/security-101/what-is-fido2, jev weight 0.76), and at the disk boundary that same property becomes: no person, no secret. A machine configured this way cannot be unlocked remotely, and by the same token cannot be unlocked remotely by an attacker. The waiting machine of doc 04 is the visible half of a security posture, not an unfinished feature.

An upstream discussion of moving LUKS to version 2 and adding TPM2 and FIDO devices at boot frames exactly this decision space at the distribution level (source: https://lists.opensuse.org/archives/list/factory@lists.opensuse.org/thread/BCBPXMSZFHXP5P3HB2SWJAPNVEGILFGO/, jev weight 0.36, weak backing).

## Why the key's job ends at the boot boundary

The touch happens in the initrd, before the system is up. Once the volume key is in the kernel keyring, nothing about the YubiKey is needed anymore, and the services that start afterwards should never see the device or the key material. The isolation machinery that keeps this true is the ordinary Linux container and seccomp isolation applied to rootless, capability-bounded services: a service with no device access and a restricted syscall surface cannot reach the USB token even if it wanted to. The token's role is confined to the boundary by the same mechanism that confines everything else the boot chain produces.

This division of labor is the practical answer to a question the comparison guides raise implicitly: why not use TPM2 and get an unattended boot (source: https://www.bigiron.cc/guides/encrypted-root-with-tpm-clevis-tang-or-just-passphrase, jev weight 0.66). TPM2 binds the secret to the machine; FIDO2 binds it to the person. A design that wants theft of the disk alone to be useless and theft of the running machine to still require the operator's physical token picks the person-bound key, and pays for it with the one interactive step.

## What the exception costs and what it buys

Cost: unattended reboots wait (doc 04); CI needs a software or policy-managed hardware leg (docs 05, 06); a lost or broken key needs the passphrase keyslot (doc 01).

Buy: the unlock secret is not derivable from anything on or near the machine, there is no network unlock surface in the initrd to attack, and the human is verifiably present at the single most privileged moment of the boot. The exception is the product.

## Design summary

1. The touch is the only human-in-the-loop step in the boot chain, by decision.
2. The decision excludes the remote paths: TPM2 auto-seal and network key servers (sources above).
3. Post-unlock isolation keeps services away from the key and the device.
4. The unattended-reboot consequence is stated policy, pending an integration test (doc 04).
