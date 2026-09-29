# Authenticated Boot and Disk Encryption on Linux

**Source essay:** [Authenticated Boot and Disk Encryption on Linux](http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html), Lennart Poettering, 23 September 2021.

**Abstract.** The essay defines the threat model that verified `/usr` and encrypted-state separation still stand on: the adversary is someone with brief physical access to your device, not a network attacker. Poettering splits the problem into authentication (modifications are detected, via dm-verity, dm-integrity, or SecureBoot signatures) and encryption (reading requires a secret, via dm-crypt/LUKS), then argues that generic Linux distributions chain them badly: they encrypt the disk with a user password but authenticate almost nothing after the kernel, so an attacker who can touch the disk can silently copy it for offline brute force, or plant a backdoored initrd that captures the encryption password and survives indefinitely. The repair is a per-resource matrix: everything in the boot chain gets authenticated, only per-host state (`/etc`, `/var`, TPM-bound) and per-user data (`/home/*`, bound to a user password or FIDO2/PKCS#11 token) get encrypted, and `/usr` gets authenticated but not encrypted. That matrix later grew into image-mode OS design on the blog ([Brave New Trusted Boot World](http://0pointer.net/blog/brave-new-trusted-boot-world.html) (0.95)) and in systemd.

## The three technologies, and what each actually delivers

The essay separates capabilities from the way distributions wire them ([essay](http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html)):

- **LUKS/dm-crypt/cryptsetup** provide disk encryption, and optionally data authentication. Most distributions in 2021 enabled only encryption; the author argued authentication should be a default. **Version-sensitive:** LUKS2 data authentication is cryptsetup-era and defaults have moved since; treat the 2021 default as historical.
- **dm-verity** authenticates immutable volumes: every read is verified against a 256-bit top-level hash, linkable into the kernel image or signable. **dm-integrity** does the same for writable volumes, stand-alone with a keyed hash (HMAC) for "authenticity without encryption", or combined with dm-crypt to add authenticity on top of confidentiality.
- **UEFI SecureBoot** authenticates pre-OS binaries by signature; the Microsoft-rooted chain is built into commodity firmware. **TPMs** protect secrets: boot components are hashed ("measured") into write-only PCR registers, the seed key never leaves the chip, and anti-hammering rate-limits unlock attempts.

## Where the generic distribution boot chain broke

Tracing a 2021 boot of Debian, Fedora, or Ubuntu ([essay](http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html)): firmware runs the Microsoft-signed shim (measured); shim launches the distribution-signed boot loader, typically Grub (measured); the loader launches the signed kernel plus an initrd. The kernel is validated and measured. **The initrd is not validated.** It is measured only sometimes, "if you are lucky". The unvalidated initrd then prompts for the disk encryption password and unlocks the root volume, and the later login prompt asks for a user password that protects nothing: the data was already decrypted by unauthenticated code.

In the author's words, "code validation happens for the shim, the boot loader and the kernel, but not for the initrd or the main OS code anymore", and the PCRs that do get filled are used by nothing in the typical setup. A second flaw: all users share the one disk-encryption password, so the per-user login is theater.

## The threat model: three attacks, two failures

The essay names three scenarios ([essay](http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html)):

1. **Stolen laptop.** FDE with a strong password mostly covers this. Security equals password strength.
2. **Silent disk copy.** The attacker copies the disk while you are away and brute forces offline; you never know you were attacked. Because the 2021 setup binds encryption only to a user password, the copy is enough.
3. **Disk backdoor.** The attacker modifies the disk instead. Since the unauthenticated initrd collects the FDE password, backdooring is "trivially easy": capture the password on entry, and persist by backdooring future OS versions too. The essay cites Pegasus-class spyware and industrial espionage as evidence this attack class happens at scale.

The 2021 distribution stack fails scenarios 2 and 3 completely, and the sharpest claim follows: your data is probably more secure on ChromeOS, Android, Windows, or MacOS than on a generic Linux distribution.

## The per-resource matrix

The fix is a table of resources, the document's core deliverable ([essay](http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html)):

| Resource | Authenticated | Encrypted | Technology | Key bound to |
| --- | --- | --- | --- | --- |
| shim, boot loader, kernel, initrd | yes | no | SecureBoot signature verification | firmware cert database |
| initrd parameters | yes | yes | systemd TPM encrypted credentials | TPM |
| initrd extensions | yes | no | systemd-sysext with Verity + PKCS#7 signatures | firmware/initrd cert database |
| OS binary resources (`/usr`) | yes | no | dm-verity | root hash in kernel image or cert database |
| OS configuration and state (`/etc`, `/var`) | yes | yes | dm-crypt (LUKS) + dm-integrity | TPM |
| `/home/` itself | yes | no | dm-integrity with HMAC | TPM |
| user home directories | yes | yes | dm-crypt (LUKS) + dm-integrity in loopback files | user password / FIDO2 / PKCS#11 |

Three structural choices do the real work:

- **`/usr` is authenticated, not encrypted.** Everyone has the same binaries, nothing to hide, and skipping encryption saves CPU. dm-verity is preferred because it makes `/usr` entirely immutable, forcing atomic whole-image updates instead of per-package rpm/dpkg mutation; for distributions keeping client-side updates, dm-integrity with a TPM-keyed HMAC is the fallback.
- **System state and user data encrypt with different trust anchors.** `/etc` and `/var` bind to the TPM, a security concept belonging to the system, so a copied disk is useless without the physical chip (defeating scenario 2 for system state). User homes bind to the user's own password or FIDO2/PKCS#11 token via systemd-homed (v245, version-sensitive), where the login password is the LUKS unlock key.
- **`/home/` gets HMAC-authenticated but unencrypted storage.** Double-encrypting per-user LUKS images inside an encrypted root wastes resources, and the plain-integrity layer keeps per-user volumes extractable for recovery if the TPM dies. Why authenticate `/home/` at all? A kernel-maintainer constraint: Linux filesystem code is not safe against rogue disk images, so mounting untrusted data can itself be a kernel exploit vector, trust must be established before mount.

## Building blocks the essay proposed

All version-sensitive as of the 2021 writing ([essay](http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html)): locally generated dracut-style initrds differ per host and so cannot be vendor-signed; pre-building the basic initrd into the kernel image makes it signed and measured for free. System extensions (systemd-sysext, v248) extend the initrd or `/usr` with images carrying dm-verity data plus PKCS#7 signatures (v250), restoring extensibility for exotic storage without breaking the trust chain. Credentials (systemd-creds, v250) pass authenticated, TPM-encrypted parameters via `LoadCredentialEncrypted=`. systemd-stub (v250) finds sysext and credential files next to the kernel image, measures them, and hands them to the initrd. crypttab (v248) already supported unlocking via password, TPM2, PKCS#11, or FIDO2.

## What the model protects, and what it does not

TPM-bound high-entropy keys plus anti-hammering defeat offline brute force for system state, and universal authentication defeats backdoor planting. The essay is explicit about residual limits ([essay](http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html)): with a plain password for the home directory, scenario 2 stays open unless the user actually adopts FIDO2/PKCS#11; without a TPM you fall back to password-encrypted state and unencrypted ESP credentials, keeping only scenario 1 protection; without UEFI the chain of trust has no suggested substitute; and a running, compromised system is out of scope, the model provides offline protection for data at rest, not online protection against a live attacker.

## Brittleness, recovery, and the image-mode consequence

Two operational problems shaped later systemd work ([essay](http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html)). Recovery keys: binding encryption to a TPM raises the lost-TPM question, answered with machine-generated, high-entropy passwords enrolled via systemd-cryptenroll alongside any combination of TPM, FIDO2, PKCS#11, and password, usable wherever a LUKS password is requested; a weak fallback would silently degrade the protection it backs up. PCR brittleness: binding keys to code-hash PCRs means OS updates change the hashes and lock you out. The recommendation is to bind to PCR 7 (the SecureBoot certificate databases) so code updates do not move the policy, pre-enroll expected new PCR values in extra LUKS slots before updates, and auto re-enroll current PCRs after a recovery-key unlock. **The follow-up post relocates the policy entirely:** [Brave New Trusted Boot World](http://0pointer.net/blog/brave-new-trusted-boot-world.html) (0.95) proposes binding the root filesystem encryption key to PCR 11, measured over a specific set of Unified Kernel Images, so the unlock policy tracks the bootable image set rather than component hashes; a [The Register write-up](https://www.theregister.com/software/2022/10/26/systemd-supremo-proposes-tightening-up-linux-boot-process/531742) (0.95) covered that October 2022 proposal.

The immutability consequence is the essay's quiet punchline: the preferred `/usr` mechanism, dm-verity, only works if the whole tree updates atomically, which "the traditional rpm/dpkg based update logic cannot". Package-signature checking (gpg on rpm/dpkg; ostree is no better, he notes) validates data at download time only, "online protection", while the threat model demands validation at use time, offline, against physical access. Verified boot therefore does not merely tolerate an immutable, image-built OS; it selects for one. That is the through-line from this essay to verified `/usr`, unified kernel images, and image-mode OS designs, later presented at OC3 2026 as remote attestation of immutable operating systems ([OC3 2026 talk](https://www.youtube.com/watch?v=hbIMBWJTx5s) (0.18)).

The essay closes on adoption realism: it is a proposal, not a report. Asked whether Fedora, Debian, or Ubuntu would implement it, the author answered "I don't know", noting some linked PRs were not yet merged ([essay](http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html)).

## Sources considered

- http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html : used, primary, fetched and read in full.
- http://0pointer.net/blog/brave-new-trusted-boot-world.html : used, follow-up post, verified reachable, jev 0.95.
- http://0pointer.net/blog/ : used, blog index, verified reachable.
- https://lwn.net/Articles/870194/ : used, corroboration of publication and discussion, jev 0.95.
- https://www.theregister.com/software/2022/10/26/systemd-supremo-proposes-tightening-up-linux-boot-process/531742 : used, third-party coverage of the follow-up, jev 0.95.
- https://www.youtube.com/watch?v=hbIMBWJTx5s : used, OC3 2026 attestation talk, jev 0.18, low weight noted.
- https://lwn.net/Articles/870204/ : rejected, duplicate thread.
- https://discourse.nixos.org/t/authenticated-boot-and-disk-encryption-on-linux/15186 : rejected, commentary.
- https://news.ycombinator.com/item?id=28627077 : rejected, commentary.
- https://news.ycombinator.com/item?id=41422387 : rejected, commentary.
- https://cdn.prod.website-files.com/63c54a346e01f30e726f97cf/69ce364a893d698d7d5622eb_OC3%202026%20%E2%80%93%20Remote%20Attestation%20of%20Immutable%20Operating%20Systems%20built%20on%20systemd.pdf : rejected, secondary, not fetched.
- skills/github-yubios-KS9n5GAT/0pointer-mastery/SKILL.md : rejected as a source, used as a map only.