# 04: TPM2 sealing as the rejected alternative

Scope: how TPM2-sealed LUKS2 works under systemd-cryptenroll with PCR policies, the maintenance coupling between firmware or kernel updates and the sealed state, and why the model lost to the YubiKey as the sole anchor.

## The mechanism

TPM2 sealing is a first-class cryptenroll mode. The systemd man page documents enrolling TPM2 security devices alongside PKCS#11 and FIDO2 into LUKS2 volumes for boot unlock (source: https://www.freedesktop.org/software/systemd/man/systemd-cryptenroll.html , jev noul 0.94), and ArchWiki covers the same three token families in its practical guide (source: https://wiki.archlinux.org/title/Systemd-cryptenroll , jev noul 0.87).

The sealing policy is PCR-based. Poettering's "Brave New Trusted Boot World" post describes binding a LUKS2 encrypted file system volume to a TPM and PCR 11 public key or signatures, according to the UKI's signing model: the secret is unsealed only if the measured boot state matches the policy (source: http://0pointer.net/blog/brave-new-trusted-boot-world.html , jev noul 0.67). In that model the TPM measures the boot chain into PCRs, and the disk key is sealed against expected PCR values, so a legitimate boot unlocks silently and a tampered boot cannot.

## The maintenance coupling

The core operational cost is that sealed state must track the machine's state. The third-party luks-tpm2 utility makes this explicit in its own design: it manages LUKS keyfiles sealed by a TPM 2.0 and is intended to be used as part of the kernel update process, to generate the sealed key each time the kernel changes (source: https://github.com/electrickite/luks-tpm2 , jev noul 0.76). When the measured inputs to the PCR policy change, anything the old policy sealed becomes unopenable without a recovery path. This is the failure the source problem family summarizes as: a PCR change (firmware update) bricks unlock unless a recovery key exists, and provisioning a recovery key reintroduces the passphrase as a standing factor.

The rotation problem compounds it. The TPM is fixed hardware on the board: the source problem family notes the secret is sealed to a chip the owner cannot rotate, which means there is no equivalent of swapping to a replacement token or enrolling a second device of the same kind. The anchor is permanently soldered to the machine, so the ownership model is "the machine holds its own key" rather than "the owner holds the key".

## What TPM2 would have to become to be admitted

The source's flip condition is precise: TPM2 would be admitted as a second factor, never the sole one, if a board shipped a discrete TPM with an owner-resettable endorsement hierarchy. As a second factor, its silent-unlock convenience stacks on top of a possession factor the owner controls, and the PCR-brick risk becomes an inconvenience rather than a lockout, because the YubiKey path remains independent. As the sole anchor, the two properties collide: the chip cannot be rotated by the owner, and its policy is coupled to machine state that the owner does not fully control (firmware updates are vendor events).

## Where TPM2 remains legitimate

The rejection is scoped to "sole anchor for a portable machine". TPM-backed LUKS decryption remains a documented, supported pattern in server contexts, for example Ubuntu Server documents Clevis with dracut for automated TPM-backed LUKS decryption (source: https://ubuntu.com/server/docs/how-to/security/tpm-backed-luks-decryption-with-clevis/ , jev noul 0.95). The distinction is the same one the problem family draws between laptop and datacenter: a server bolted to a rack can tolerate a chip-anchored secret because the machine-identity model is intentional, while a laptop the owner carries needs the anchor to be a removable possession the owner can hold, rotate, and revoke.
