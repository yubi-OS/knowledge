# 06 - Multi-Key Quorum

Scope: the 2-of-3 and 3-of-5 quorum patterns for owner-held root-of-trust: physical distribution of keys and composition of quorum logic at the application layer.

## The pattern

For owner-held root-of-trust, yubiOS uses a 2-of-3 quorum pattern when the threat model includes "YubiKey lost or stolen but not both" (source doc: `yubi-OS/yubiOS skills/yubikey-operations/SKILL.md`). The three keys are distributed physically:

- Key A: Daily-driver YubiKey 5 NFC (in pocket or on desk)
- Key B: Backup YubiKey 5 NFC (in safe or safe deposit box)
- Key C: Recovery YubiKey 5C NFC (in a different physical location)

Note the connector diversity: two NFC keys and one USB-C NFC key, so a lost laptop cable or a lost adapter does not lock out a second key. For higher assurance, 3-of-5 adds two more keys at two more physical locations (source doc).

## The YubiKey itself has no quorum

The quorum logic is at the consumer: ssh-agent with multiple providers, ykman orchestration, age-plugin-yubikey with multiple recipients. The YubiKeys themselves do not natively support quorum; yubiOS composes it at the application layer (source doc). This is the load-bearing design decision. A hardware token enforces presence and unexportability per key; nothing in the device enforces "2 of 3 must agree". Each consumer therefore implements its own threshold:

- ssh: multiple PKCS#11 providers or multiple sk keys in ssh-agent, with the server-side authorized_keys policy enforcing how many distinct keys a session needs (or, more commonly, listing all quorum keys so any surviving pair can be used across roles).
- age: multiple recipients in the age file header, any one of which decrypts, which gives redundancy rather than threshold; threshold semantics live in the key-generation design.
- disk unlock: multiple FIDO2 enrollments on the LUKS2 volume, one per key, each independently sufficient unless the consumer is configured otherwise.

The honest summary, which the source doc implies: yubiOS quorum is a distribution and availability discipline more than a cryptographic threshold. The keys are physically separated so that no single loss event destroys the root of trust, and each consumer is re-enrolled with all quorum keys.

## Backup key practice from the vendor

Yubico's own guidance corroborates the multi-key posture. The Yubico blog states that the most secure plan is for each user to have two YubiKeys, and that establishing a backup YubiKey ensures the user can effortlessly access all of their accounts if they accidentally misplace the primary (https://www.yubico.com/blog/backup-recovery-plan/, weight 0.72). Yubico's spare-keys page, carried at weak weight 0.35, recommends registering all of your keys at the same time, so you only visit each service once and eliminate the chance of losing the primary key before the spares are registered (https://www.yubico.com/products/spare/, weight 0.35, weak backing). That ordering discipline maps directly onto the yubiOS enrollment ceremony: quorum keys are enrolled together, before any one of them becomes load-bearing alone.

A weakly-weighted general reference, Yubico's product page (weight 0.52), is context only. A 2-of-3 rationale from the multisig world, at weak weight 0.20, is directionally consistent and worth citing as analogy: adding more keys only helps if none of them has marginally reduced security, since including a weaker key or storing multiple keys in the same location makes the entire setup easier to expose (https://www.unchained.com/blog/why-2-of-3-multisig, weight 0.20, weak backing). For yubiOS that means: do not put Keys A and B in the same desk drawer.

Enterprise hardware-security practice shows the same physical-distribution requirement at stronger institutional scale: Azure Key Vault Managed HSM documentation states that security domain keys must be held in offline storage with each split of the quorum on a separate storage device, held at separate geographical locations (https://learn.microsoft.com/en-us/azure/key-vault/managed-hsm/security-domain, weight 0.11, weak backing, cited as analogy only).

## Why 2-of-3 and not 1-of-1 or 3-of-3

A single key is the anti-pattern the source doc names: single-key no-backup enrollment. A YubiKey can be lost, stolen, or break, and yubiOS conventions require at least a 2-key quorum before treating any key as a root of trust (source doc). At the other end, requiring all 3 keys for routine operations defeats the point, since the daily-driver key must be enough to work. 2-of-3 matches the stated threat model: any one key can be lost without losing the root of trust, and any two keys together can recover.

## Takeaway

Quorum is bought with physical distribution and consumer-side composition, not with a device feature. Register every quorum key everywhere at the same time, separate the storage locations for real (different building for Key C), keep connector diversity so one lost cable is not one lost identity, and treat the daily-driver key as sufficient for work while the full quorum exists for recovery.
