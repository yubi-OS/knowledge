# 04: Security should be the default, for everyone

Scope: the source doc's section on hardware roots of trust as a historical luxury, the 25-70 dollar YubiKey bet, and the standard the doc applies to architecture decisions that would make trust depend on scale, budget, or enterprise tooling.

## What the source doc claims

The source doc (yubi-OS/yubiOS docs/MISSION.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MISSION.md) argues that hardware roots of trust have historically been a luxury: TPMs, HSMs, and vendor secure enclaves sit behind enterprise contracts, OEM partnerships, or price points most individuals never clear (source doc). Its bet: a 25-70 dollar YubiKey is a better root of trust than a TPM most people will never own, control, or even know is there (source doc). The goal is security that ships in the box, requires no vendor relationship, and works the same for a solo developer as for a fleet (source doc).

The doc also states a decision rule: "If an architecture decision would make yubiOS's trust model depend on scale, budget, or enterprise tooling to reach an individual owner, that's a signal to reconsider it" (source doc). It notes this is the same standard MISSION.md already applies to convenience features that would weaken a trust boundary (source doc).

## What the dig set supports about cost and access

All dig weights for this subtopic are below 0.5 (weak backing). The results support the affordability half of the bet more than the control half.

- Yubico's own FIDO2 page discusses passwordless authentication and warns that poorly designed recovery processes can reintroduce the social-engineering vulnerabilities FIDO2 prevents (https://www.yubico.com/authentication-standards/fido2/, weight 0.37, weak). A third-party 2026 comparison reports FIDO2 security-key pricing from approximately 14 dollars for entry-level keys to over 100 dollars at the high end (https://unlocked.everykey.com/fido2-security-key-comparison/, weight 0.07, weak). Together these weakly support the doc's price band claim: consumer hardware keys are within individual reach, which is what makes "security that ships in the box" a designable default rather than an enterprise feature.
- The Yubico store and product pages document the product line the source doc's bet names (https://www.yubico.com/store/, weight 0.14, weak; https://www.yubico.com/products/, weight 0.28, weak).
- A 2026 hardware comparison covering YubiKey 5 NFC, Google Titan, and OnlyKey (https://geniustechlab.com/posts/2026-07-06-best-security-keys-2026, weight 0.04, weak) and two retail/aggregator listings (https://www.amazon.com/fido2-security-key/s?k=fido2+security+key, weight 0.03, weak; https://www.accio.com/business/yubikeys-cost, weight 0.04, weak) round out the market picture but carry the weakest weights in this subtopic.

The control half of the bet (owning and auditing the root of trust) is carried by the source doc and by doc 05 in this corpus; the dig set did not return a source that directly compares TPM ownership by end users against key ownership, so that comparison is recorded as a gap rather than weakly asserted.

## The "same for a solo developer as for a fleet" clause

This clause is what separates the section from marketing. The doc's decision rule makes scale-dependence itself a defect: an architecture that only delivers its trust guarantees when the owner has a security team or enterprise tooling fails the mission (source doc). In structural terms, the owner-held YubiKey is the root of trust precisely because it is cheap, physical, and owned: the same three properties that make it available to individuals are what keep it out of vendor control (source doc, and the owner-held-keys non-negotiable in doc 08).

The dig set's strongest result (Yubico on FIDO2 recovery, weight 0.37) also sharpens the doc's physical-presence non-negotiable: a hardware key with a bad recovery path can reintroduce the social-engineering weaknesses the key was meant to remove, which is why the source doc requires a documented recovery path wherever the YubiKey is required (source doc).
