# 10 LUKS2, TPM2, and FIDO2: Offline Security

Scope: the at-rest security layer of the vision: LUKS2 encryption, systemd-cryptenroll, TPM2 and FIDO2 key sealing, and the local key generation goal.

## The offline security goal

Goal 3 of the vision is offline security: data is encrypted at rest and bound to hardware, so a stolen disk is useless without the machine's security hardware (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). Goal 11 completes it: keys are generated locally, never pre-provisioned, so the vendor cannot decrypt the user's data (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). Poettering's "Authenticated Boot and Disk Encryption on Linux" essay is the precursor that frames the problem: without authenticated boot, encryption keys sealed to a machine can be extracted by an attacker who boots their own OS; with measurement-based sealing, the key is only released to the expected software stack (source: http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html, jev 0.90).

## systemd-cryptenroll

systemd-cryptenroll is the tool that makes this usable: it enrolls hardware security tokens and devices into a LUKS2 encrypted volume, which may then be used to unlock the volume during boot (source: https://www.freedesktop.org/software/systemd/man/251/systemd-cryptenroll.html, jev 0.96). The man page synopsis names the supported token families directly: PKCS#11, FIDO2, and TPM2 tokens or devices (source: https://www.man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html, jev 0.85). Poettering's own announcement of the tool in the systemd 248 cycle states its purpose plainly: to make it easy to enroll your security token or chip for unlocking LUKS2 volumes (source: https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, jev 0.96). ArchWiki documents the operator workflow around the tool, including recovery-key enrollment and combination policies (source: https://wiki.archlinux.org/title/Systemd-cryptenroll, jev 0.42).

## How enrollment stores state

Enrollment does not just add a key slot: the token metadata is stored in the LUKS2 JSON metadata area, and boot unlock is wired through crypttab entries that reference the enrolled tokens (source: https://www.golinuxcloud.com/systemd-cryptenroll-luks2-tpm2-fido2-linux/, jev 0.42, low weight). This design means the LUKS2 header itself carries the policy for which hardware factors may unlock the volume.

## TPM2 sealing and PCR binding

TPM2 enrollment seals the volume key against a set of PCR values, so the key is only unsealed if the measured boot state matches. The measurement side is covered in doc 09: systemd-stub extends PCRs with the UKI components it loads, and PCR 11 tracks the kernel and initrd measurements (source: https://deepwiki.com/systemd/systemd/4.1-early-boot-uefi-and-measured-boot, jev 0.66, secondary source; primary essay: https://0pointer.net/blog/brave-new-trusted-boot-world.html, jev 0.92). The essay's sealing model ties offline security to the boot chain: the TPM releases the key only to software whose measurements were expected, which is why the vision treats goals 3 and 4 as one system (source: https://0pointer.net/blog/brave-new-trusted-boot-world.html, jev 0.92; https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## FIDO2 and PKCS#11 as the user-held factor

FIDO2 tokens provide the alternative factor: a hardware token the user holds, typically using the hmac-secret extension to derive a key, rather than a chip soldered into the machine. The cryptenroll man page treats FIDO2 as a first-class enrollment type alongside TPM2 (source: https://www.man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html, jev 0.85). systemd-homed extends the same hardware-token model to home directories: v258 added homectl list-signing-keys and add-signing-key for FIDO2 signing key management (source: https://github.com/systemd/systemd/releases, jev 0.77, per the parent source material). The two-factor pattern is the vision's answer to the TPM's main weakness: a TPM-sealed key unlocks without user presence, so pairing it with a FIDO2 token or passphrase restores user intent to the unlock decision (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95; tool docs: https://www.freedesktop.org/software/systemd/man/251/systemd-cryptenroll.html, jev 0.96).

## First-boot enrollment in the image-based flow

In the vision's boot flow, systemd-repart creates the root filesystem on first boot, encrypts it, and enrolls the TPM2 key in the same pass (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). This is what makes the no-installer goal and offline security compatible: a dd-ed image arrives with no keys at all, and the machine generates and seals its own on first boot (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## v261 changes

v261 changed the sealing defaults: systemd-cryptenroll now defaults to RSA-OAEP plus SHA-256 for LUKS2 key sealing, strengthening the cryptography behind TPM2 and FIDO2 enrollment (source: https://github.com/systemd/systemd/releases/tag/v261, jev 0.86, per the parent source material). The same release added systemd-tpm2-swtpm.service, a software TPM fallback with stub-to-initrd boot secret functionality for systems that lack a physical TPM, which LWN's release coverage called out explicitly (source: https://lwn.net/Articles/1078708/, jev 0.66). The software TPM path means virtual machines and CI runners get the same sealed-key flow as physical hardware, without weakening the physical-machine story (source: https://lwn.net/Articles/1078708/, jev 0.66). v260 had already added LUKS volume key fixation, pinning the volume key across re-encryption events so enrolled tokens survive them (source: https://github.com/systemd/systemd/releases, jev 0.77, per the parent source material).

## Relevance to image-based immutable Linux

The stack is self-consistent: an immutable, verity-protected /usr proves what is running; measurements of that boot state go into TPM PCRs; the LUKS2 volume key is sealed to those measurements; and the user adds a FIDO2 token as the presence factor. A machine booted into a tampered image fails the seal check, so disk encryption and image integrity enforce each other rather than being independent features (source: http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html, jev 0.90; https://0pointer.net/blog/brave-new-trusted-boot-world.html, jev 0.92).
