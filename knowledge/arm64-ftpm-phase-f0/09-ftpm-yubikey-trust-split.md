# 09 - The fTPM versus YubiKey trust split

Scope: why the Phase F0 plan keeps the fTPM for platform integrity and attestation while the YubiKey stays the disk-unlock root through FIDO2 hmac-secret and LUKS2, and what happens if the two roles are merged.

## The two roles, stated

The plan's division of labor is explicit: the fTPM is for platform integrity, measured boot, and attestation, while the YubiKey remains the disk-unlock root through FIDO2 hmac-secret and LUKS2. The plan's warning is its own: if the fTPM becomes the sole unlock gate, yubiOS has recreated the on-device trust anchor it exists to avoid.

This split is architectural, not incidental, and each role has distinct technology behind it.

## What the fTPM side provides

A TPM is a tamper-proof, cryptographically secure auditing component whose boot configuration log contains hash-chained measurements recorded in its Platform Configuration Registers during the bootstrapping sequence (https://learn.microsoft.com/en-us/azure/security/fundamentals/measured-boot-host-attestation, weight 0.649). Devices with a TPM can rely on attestation to prove that boot integrity is not compromised, along with using the measured boot process to detect early boot feature states; an attested state of a device is driven by the attestation policy (https://learn.microsoft.com/en-us/azure/attestation/tpm-attestation-concepts, weight 0.836). That is the fTPM's job in yubiOS: make the boot chain's state quotable and checkable.

Remote attestation flows built on this shape have the device receive a TPM-bound token and send it to a relying party to prove status, with the token able to carry a decryption key, and a device measured to be insecure needing a reset to be cleaned (https://defcon.org/images/defcon-21/dc-21-presentations/Griffin/DEFCON-21-Dan-Griffin-Protecting-Data-Updated.pdf, weight 0.730). The key property is that the attestation proves the software state; the key itself lives with the platform.

## What the YubiKey side provides

The unlock root is deliberately off-device. systemd has supported unlocking LUKS2 volumes with TPM2, FIDO2, and PKCS#11 security hardware since version 248 (https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, weight 0.910), and the FIDO2 path relies on the hmac-secret extension, implemented by YubiKeys series 5 and above along with Nitrokey FIDO2 and similar tokens (https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, weight 0.910).

Yubico's documentation describes the hmac-secret and hmac-secret-mc extensions as enabling the creation of a symmetric secret value scoped to a credential (https://docs.yubico.com/yesdk/users-manual/application-fido2/hmac-secret.html, weight 0.903). Community tooling builds directly on this: the fido2-luks package lets a FIDO2 token with the hmac-secret extension serve as a strong single factor for LUKS full disk encryption (https://github.com/nyancient/fido2-luks, weight 0.659), and walkthroughs verify hmac-secret support with `ykman` before wiring the token into LUKS (https://www.guyrutenberg.com/2022/02/17/unlock-luks-volume-with-a-yubikey/, weight 0.544) and configure LUKS to unlock via the YubiKey so the disk opens without a typed password (https://piotrnowicki.com/posts/2024-06-17/configuring-luks-to-work-with-yubikey/, weight 0.707).

Yubico's framing of FIDO2 passwordless authentication notes that every legacy authentication method relies on what cryptographers call shared secrets (https://www.yubico.com/authentication-standards/fido2/, weight 0.512). The hmac-secret design moves the secret generation into the token's hardware, which is precisely the property that makes the YubiKey usable as a disk-unlock root that is not resident on the machine it unlocks.

## Why the split resists merging

The two roles have different failure and threat models. The fTPM is on-device by definition: it runs in the secure world of the very platform it measures, so its measurements are strongest as evidence about the platform and weakest as a place to keep a secret that an attacker with the platform would want. Merging the unlock root into the fTPM would put the disk-encryption key inside the same device that a compromised boot chain could reach, and would make possession of the hardware alone sufficient to attempt an unlock. The YubiKey's value is that the secret is scoped to a credential held by separate hardware (https://docs.yubico.com/yesdk/users-manual/application-fido2/hmac-secret.html, weight 0.903), so the on-device fTPM can gate and attest but never become the only gate.

The plan states the consequence sharply: if the fTPM becomes the sole unlock gate, yubiOS has recreated the on-device trust anchor it exists to avoid. The sources above back each half of that argument: the fTPM side for attestation and measured boot (https://learn.microsoft.com/en-us/azure/attestation/tpm-attestation-concepts, weight 0.836), the YubiKey side for a hardware-scoped unlock secret outside the platform (https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, weight 0.910).

## What Phase F0 must preserve

Phase F0 is a QEMU-only proving ground, but its design choices set the precedent for the hardware path. Three constraints carry over:

1. The fTPM's authority should stay limited to platform integrity: PCRs for firmware, kernel, and IMA, plus attestation quotes over those measurements (https://learn.microsoft.com/en-us/azure/security/fundamentals/measured-boot-host-attestation, weight 0.649).
2. No disk-unlock path in the chain should terminate in the fTPM alone. The LUKS2 unlock design should keep at least one factor bound to external FIDO2 hardware (https://github.com/nyancient/fido2-luks, weight 0.659).
3. The emulated fTPM's development-key signing posture is a testing-only property and must not become the production posture without revisiting the trust split (https://networking-docs.nvidia.com/bsp/4.5.6/ftpm-over-op-tee, weight 0.884, as documented in the Early TA doc of this corpus).

The ADR-003 anchor remains: the YubiKey is the disk-unlock root through FIDO2 hmac-secret and LUKS2, and Phase F0's fTPM work is what makes the platform around that anchor provable.
