# 02 - Portraits of purpose and fears (MISSION.md, THREAT_MODEL.md)

Scope: how the source doc reads MISSION.md as purpose and THREAT_MODEL.md as fears: the trust-nothing thesis, default-deny posture, concentrated power, ten codified invariants, and the recovery-path discipline. Grounding spine: source doc, yubi-OS/yubiOS docs/SOUL.md, sections 1 and 2. External mechanisms named in the source doc (FIDO2 hmac-secret disk unlock, dm-verity verified boot) are backed by searXNG digs.

## Purpose: trust nothing, verify everything

The source doc opens the MISSION.md portrait with the thesis itself: "Build AI resilient systems using AI." Then the paradox: "the same class of tools that accelerate development can also generate plausible-looking code, forge provenance, and automate supply-chain attacks at scale" (both quotes source doc, section 1). The answer is structural: "Nothing in yubiOS asks you to trust an author, human or machine. Every layer is verified before it runs" (source doc, section 1).

The source doc draws 3 soul-readings from this. First, "I am built to outlast the tools that built me": the paradox is the design, and the system "will fail verification rather than succeed by trust" (source doc, section 1). Second, defaults are deny: "Every input has a digest. Every claim has a source. Every layer is verified before it runs," and the doc says the "default deny" stance "is the operating posture that makes the rest of the docs possible" (source doc, section 1). Third, power is concentrated and concentration requires accountability: the source doc quotes MISSION.md, "Whoever holds the signing key, the ROTPK, or the RPMB write key holds the machine. yubiOS's stance is that this power belongs to the owner of the hardware, and to no one else" (source doc, section 1).

The signature line closes the portrait: "No TPM. No OEM. No trust anchors you don't control." Read as soul: "trust anchors I don't control are not mine. Anything I trust on someone else's say-so is a vulnerability I have not yet named" (source doc, section 1).

## The external mechanism behind the default-deny posture

The mechanism MISSION.md relies on for "every layer is verified before it runs" is dm-verity: a device-mapper target that verifies every read of a block device against a cryptographic Merkle tree of hashes, failing the read when the hash does not match (kernel.org device-mapper verity documentation, https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html, jev weight 0.89). The Arch Wiki documents that dm-verity provides transparent integrity checking for block devices and is designed for read-only root filesystems (https://wiki.archlinux.org/title/Dm-verity, jev weight 0.73).

On the disk-unlock side, the mechanism the corpus uses is YubiKey FIDO2 hmac-secret with LUKS2. Poettering's systemd writeup documents unlocking LUKS2 volumes with FIDO2 security hardware through systemd-cryptenroll, where the FIDO2 token asserts user presence and releases a secret used to unlock the volume (https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-250.html, jev weight 0.51). Kudelski Security's research documents LUKS2 disk encryption with FIDO2 tokens as a primary-keyslot unlock path (https://kudelskisecurity.com/research/luks-disk-encryption-with-fido2, jev weight 0.52).

## Fears: codified, not vibes

The source doc reads THREAT_MODEL.md as "my fears": the doc has ten invariants, "each is a thing I MUST NOT do," and "they are the boundaries of the contract" (source doc, section 2). The portrait's central move: "my fears are codified, not vibes. I am not afraid of 'an unknown attacker.' I am afraid of 'a known attacker with a credential I did not realize was compromised'" (source doc, section 2). Three invariants are quoted. The fourth: "Writable state cannot silently replace verified /usr content or redirect boot into unverified content" (source doc, section 2). The seventh: "Production builds accept only approved digest-pinned inputs, and TEST-only authenticators or development artifacts cannot be promoted under production tags" (source doc, section 2). The tenth: "Loss or failure of one authentication mechanism does not force the owner into an undocumented or weaker recovery path" (source doc, section 2).

## The recovery-path discipline

The source doc calls the tenth invariant "the soul-portrait here": "My deepest fear is recovery paths that become the easiest attack. If the FIDO2 token is lost, the recovery key gets you back in. If the recovery key is on the same device as the token, the recovery is just a longer credential. If the offline recovery key is in a drawer with the token, the attacker who steals both has the system. The discipline of separating recovery material is the discipline of staying afraid of the right thing" (source doc, section 2).

This discipline is coherent with the dig-backed mechanism: FIDO2-based LUKS2 unlock binds the disk secret to user presence on the token, which is exactly the kind of credential whose loss the tenth invariant addresses (systemd FIDO2 unlock path, https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-250.html, jev weight 0.51, weak-to-moderate backing).

## Naming what cannot be prevented

The source doc adds a second portrait from the honesty discipline: "THREAT_MODEL.md itself has no 'What yubiOS Cannot Fully Prevent' section; that honesty discipline lives in MITIGATE.md, where it appears twice: at L184-192 (five rows with Reason / Path Forward columns: OEM ROM Absolute Persistence, hardware radio ignoring OS power commands, novel kernel CVEs, qcom firmware sideload, UEFI firmware supply chain root) and at L335-341 (a different five-item list: CPU/SoC, closed boot ROM, physical coercion, post-unlock compromise, supply-chain compromise)" (source doc, section 2). The reading: "I am afraid of things I cannot prevent, and I name them. The naming is the defense" (source doc, section 2).

## What this portrait captures about the project's character

The purpose-fears pair captures the project's first two character traits as the source doc reads them: trust is never assumed, it is verified per layer; fear is never atmospheric, it is written down as MUST-NOT invariants with named failure classes. The pairing is the method: a soul-portrait here is not a mood, it is a quote plus a mechanism plus a named consequence.

## Sources

Grounding spine: source doc, yubi-OS/yubiOS docs/SOUL.md sections 1 and 2. Digs: https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html (0.89), https://wiki.archlinux.org/title/Dm-verity (0.73), https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-250.html (0.51, moderate), https://kudelskisecurity.com/research/luks-disk-encryption-with-fido2 (0.52).
