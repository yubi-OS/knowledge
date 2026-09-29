# Unlocking LUKS2 Volumes with Hardware: TPM2, FIDO2, PKCS#11

systemd 248 made hardware-backed disk unlocking a first-class citizen of `systemd-cryptsetup`. The three token types buy three different security properties: FIDO2 tokens (via the `hmac-secret` extension) turn a plug-in USB device into a possession factor you carry on your keyring, with zero token modification and zero per-volume preparation; PKCS#11 tokens (PIV smartcards) store an RSA key pair on-card and do the key exchange there, but demand manual provisioning of that key; TPM2 chips are soldered smartcards that cannot leave the machine, so they defend a different threat, the offline disk copy, and can additionally bind unlocking to the exact software that booted via PCR measurements. The cost structure is equally different: FIDO2 needs nothing but the token at boot, PKCS#11 needs key ceremony, and TPM2 needs a PCR policy that breaks on every kernel update unless the distro re-enrolls. This doc walks the mechanics from the 13 January 2021 essay on 0pointer.net, then tracks what later systemd versions fixed.

## The v248 moment

The essay's TL;DR: "It's now easy to unlock your LUKS2 volume with a FIDO2 security token (e.g. YubiKey, Nitrokey FIDO2, AuthenTrend ATKey.Pro). And TPM2 unlocking is easy now too." [essay]. With "the upcoming systemd v248", `systemd-cryptsetup`, the component that assembles encrypted volumes during boot, "gained direct support for unlocking encrypted storage with three types of security hardware": FIDO2 tokens that implement the `hmac-secret` extension (YubiKey series 5 and above, Nitrokey FIDO2, AuthenTrend ATKey.Pro), TPM2 chips ("pretty ubiquitous on non-budget PCs/laptops"), and PKCS#11 tokens, meaning smartcards and older YubiKeys implementing PIV. PKCS#11 unlocking strictly speaking existed before v248, but "was a lot more manual" [essay].

The essay also lists what it calls the traditional mechanisms for completeness: interactive passphrases and key files on disk (both supported since forever), plus two things new in v248 themselves: unlocking via a key acquired through trivial AF_UNIX/SOCK_STREAM socket IPC, and recovery keys, computer-generated high-entropy keys that can be typed anywhere a passphrase is accepted [essay].

The second half of the story is a new tool: `systemd-cryptenroll`. Its "only purpose is to make it easy to enroll your security token/chip of choice into an encrypted volume". It works with any LUKS2 volume and embeds "a tiny bit of meta-information into the LUKS2 header with parameters necessary for the unlock operation" [essay]. Enrollment is additive: existing passphrases stay enrolled. The unlock side is driven from `/etc/crypttab`, where each mechanism has its own fourth-column option (`fido2-device=auto`, `pkcs11-uri=auto`, `tpm2-device=auto`); the man page confirms crypttab must name the mechanism explicitly rather than infer it from the header (0.96).

## FIDO2: possession with no prep

Enrollment is one command:

```
# systemd-cryptenroll --fido2-device=auto /dev/sda5
```

then the crypttab entry gains `fido2-device=auto`, which tells `systemd-cryptsetup` to use the FIDO2 metadata in the header and "wait for the FIDO2 token to be plugged in at boot (utilizing systemd-udevd)" [essay].

Two properties make this the essay's default recommendation. First, "all of this doesn't modify the FIDO2 token itself in any way": enrollment state lives entirely in the LUKS2 header, so one token can be enrolled in as many volumes as you like, bounded only by the number of LUKS2 key slots per volume [essay]. Second, no key ceremony: unlike PIV, FIDO2 tokens "typically just work" [essay].

A FIDO2 token authenticates the holder, not the boot state. There is no PCR-like binding here; the factor is physical possession of the token at boot time. Later versions made the interaction model configurable: `--fido2-with-client-pin=` (added in version 249, defaults to yes) requires the token's clientPin, and `--fido2-with-user-presence=` (added in version 249, defaults to yes) requires a tap, per the current man page [man-cryptenroll] (0.92).

## PKCS#11: keys on-card, ceremony required

The PKCS#11 path needs a device that can store an RSA key pair, and "most security tokens/smartcards that implement PIV qualify" [essay]. Getting the key onto the device is manual. The essay's YubiKey recipe:

```
# ykman piv reset
# ykman piv generate-key -a RSA2048 9d pubkey.pem
# ykman piv generate-certificate --subject "Knobelei" 9d pubkey.pem
# rm pubkey.pem
```

with the explicit warning that this chain "erases what was stored in PIV feature of your token before, be careful!" [essay]. Other vendors need their own commands. Enrollment then looks like the FIDO2 case: `systemd-cryptenroll --pkcs11-token-uri=auto /dev/sda5`, plus `pkcs11-uri=auto` in crypttab [essay].

Mechanically, per the current man page (added in version 248): enrollment generates a private key, stores the public key and JSON metadata in the LUKS2 header, and erases the private key; at unlock time the volume key is derived from a shared secret between the stored public key and a private key inside the token [man-cryptenroll]. The RSA key never leaves the card; only the derived shared secret does.

Poettering's own verdict when a token does both PIV and FIDO2: enroll it as FIDO2, "given it's the more contemporary, future-proof standard", and because FIDO2 needs no preparation to get a key onto the device [essay].

## TPM2: the key left at the door

The essay's threat-model framing is the sharpest part of the piece. A TPM2 chip "in many ways" is "a smartcard that is soldered onto the mainboard of your system". Unlike a USB token you can pocket, a TPM2 "isn't immediately comparable to a physical key you can take with you that unlocks some door, but they are a key you leave at the door, but that refuses to be turned by anyone but you" [essay].

What that model buys: because "the cryptographic key material stored in TPM2 devices cannot be extracted (at least that's the theory)", binding disk encryption to the TPM means "attackers cannot just copy your disk and analyze it offline", they need access to the TPM2 chip too. They can still steal the whole PC, "but they cannot just copy the disk without you noticing and analyze the copy" [essay]. The second benefit is state binding: you can bind unlocking to specific software versions, so that "only your trusted Fedora Linux can unlock the device, but not any arbitrary OS some hacker might boot from a USB stick" [essay].

Mechanics: `systemd-cryptenroll --tpm2-device=auto --tpm2-pcrs=7 /dev/sda5`, and `tpm2-device=auto` in crypttab. PCRs are "a set of (typically 24) hash values that every TPM2 equipped system at boot calculates from all the software that is invoked during the boot sequence, in a secure, unfakable way"; binding to a PCR value "requires the system has to follow the same sequence of software at boot to re-acquire the disk encryption key". The man page formalizes this: PCRs "allow binding of the encryption of secrets to specific software versions and system state, so that the enrolled key is only accessible (may be unsealed) if" the expected state holds (0.92).

### What the essay admits is broken

PCR binding "actually sucks hard": "if you naively update your system to newer versions you might lose access to your TPM2 enrolled keys". As of v248, "nothing updates the enrollment automatically after you initially enrolled it, hence after the first kernel/initrd update you have to manually re-enroll things again, and again, and again" [essay]. The fix Poettering sketches is distro integration, re-enroll with new PCR hashes on every upgrade, or the TPM2 "signed PCR hash values" concept, where a distro ships PCR signatures that unlock the keys. He is blunt about the latter: "I don't really see the point", since dropping in a signature file per update differs little from re-enrolling hashes [essay]. Recovery keys are the practical escape hatch: the essay explicitly pairs hardware unlocking with `systemd-cryptenroll --recovery-key`, which generates a high-entropy key, shows it with a QR code, and needs no crypttab change (0.96).

The essay also floats a future TPM2 policy: Windows-style short PINs, where the PIN is passed to the TPM2, which "enforces that not more than some limited amount of unlock attempts may be made within some time frame, and that after too many attempts the PIN is invalidated altogether" [essay].

## What later versions delivered

Every item here is version-sensitive; the current freedesktop man page is authoritative for post-248 details.

- Signed PCR policies shipped as promised: `--tpm2-public-key=`, `--tpm2-public-key-pcrs=`, and `--tpm2-signature=` (added in version 252) bind decryption to any PCR state signed by a given RSA public key, with signatures generated by `systemd-measure` and default binding to PCR 11, unified kernel images (0.92).
- `--tpm2-pcrlock=` (added in version 255) offers a predictive pcrlock policy as an alternative to raw PCR binding [man-cryptenroll].
- The TPM2 PIN idea became `--tpm2-with-pin=` (documented as added in version 262 on the current man page), which takes a boolean or `direct`, defaults to no, and hardens the PIN with Argon2id before passing it to the TPM, "making the TPM a second factor rather than a single point of failure" (0.42).

## Threat model ledger

| Token | Buys | Costs |
| --- | --- | --- |
| FIDO2 | Portable possession factor, no prep, token unmodified, one token per many volumes | Token must be present at every boot; no boot-state binding; needs `hmac-secret` support |
| PKCS#11 | Key stays on-card; shared-secret unlock; works with PIV smartcards and older YubiKeys | Manual key ceremony (ykman PIV, destructive reset); the essay calls it less future-proof than FIDO2 |
| TPM2 | Non-extractable key defeats offline disk copy; PCR binding locks out foreign OSes | Soldered in place, so it defends the disk, not the machine; v248-era PCR binding breaks on updates |

The ledger's row three needs an honesty note. The essay's TPM2 threat model is the disk copy, not physical possession of the running machine. A January 2025 analysis by oddlama demonstrates bypassing disk encryption on systems with automatic TPM2 unlock, against the premise that "the TPM2 can store an additional LUKS key which your system can only retrieve, if the TPM is in" the expected state; the bypass works when an attacker gets physical access to the booted machine (0.91). Automatic TPM2 unlock without a PIN or user presence is a convenience trade, exactly the trade `--tpm2-with-pin=` exists to close.

## Sources considered

- http://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html: primary source, fetched in full, posted 13 January 2021.
- https://www.freedesktop.org/software/systemd/man/latest/systemd-cryptenroll.html: primary source for post-248 version annotations.
- https://www.golinuxcloud.com/systemd-cryptenroll-luks2-tpm2-fido2-linux/ (0.96): secondary, used for crypttab-mechanism and recovery-key pairing.
- https://oddlama.org/blog/bypassing-disk-encryption-with-tpm2-unlock/ (0.91): secondary, used for the TPM2 auto-unlock bypass counterpoint.
- https://www.man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html (0.91): rejected, mirror of the freedesktop man page.
- https://manpages.debian.org/testing/systemd-cryptsetup/systemd-cryptenroll.1.en.html (0.62): rejected, mirror.
- https://wiki.archlinux.org/title/Systemd-cryptenroll (0.11): rejected, derivative wiki content.
- https://www.libhunt.com/posts/48063-unlocking-luks2-volumes-with-tpm2-fido2-pkcs-sharp-11-security-hw-on-systemd-248 (0.11): rejected, mirror.
- https://news.ycombinator.com/item?id=26644942 (0.07): rejected, discussion thread, no primary facts.
- https://github.com/ublue-os/packages/blob/main/packages/ublue-os-luks/src/luks-enable-tpm2-autounlock (0.07): rejected, derivative usage script.
- https://www.answeroverflow.com/m/1164945412080279572 (0.08): rejected, chat log.
- skills/github-yubios-KS9n5GAT/0pointer-mastery/SKILL.md: used as a navigation map only, not cited as a source.
