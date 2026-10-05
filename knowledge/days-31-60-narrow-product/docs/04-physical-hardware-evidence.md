# 04 - Physical Hardware Demonstration as Falsifiable Evidence

Scope: designing a reproducible, falsifiable physical hardware demonstration, the evidence to capture per run, and the limits that must be stated explicitly.

## What reproducible means for a hardware demo

The source plan (yubiOS refs, `days-31-60-narrow-product-2026-07-25.md`) is blunt that a physical YubiKey demonstration "cannot be executed by this agent (no physical hardware access)" and that the section's job is to specify what reproducible means "so the demo is falsifiable, not a claim". The distinction between a claim and a falsifiable demonstration has a research-methods backing: design principles for falsifiable, replicable and reproducible empirical research hold that clear research hypotheses shape experiment design, and that execution must be carried out with precision (weight 0.875, https://arxiv.org/abs/2405.18077; weight 0.792, https://drops.dagstuhl.de/entities/document/10.4230/OASIcs.DX.2024.7). The same line of work argues that null hypotheses provide an objective baseline and force falsifiable claims, which enhances reliability (weight 0.683, https://arxiv.org/html/2405.18077v1). Translated to a product demo: the demo has a stated hypothesis (a physical token of model M at firmware F unlocks a LUKS2 volume built from image digest D on host H), a procedure, and a failure mode that would disprove it.

A practitioner example shows the same pattern outside research: a robotics project replaced "previously unsupported performance-style claims with a reproducible hardware evidence package" and defined acceptance criteria including committing or stably linking an uncut demo (weight 0.101, weak, https://github.com/VivekVRobo/gesture-controlled-robotic-arm/issues/1). Uncut is the key word: an edited highlight reel is a claim, an uncut run is evidence.

## Evidence to capture per run

The source plan specifies the evidence list, and each item has a reason grounded in the sourced material:

- Exact YubiKey model and firmware. Compatibility claims are scoped to what was actually tested; the Yubico product page is the primary source for models in the family (weight 0.485, https://www.yubico.com/).
- Host OS build as git SHA plus image digest, so the software under test is pinned the same way vendor compatibility matrices pin versions.
- Each operation command and full output: enrollment, LUKS2 unlock, systemd homed login, PAM presence check, PIV signing, recovery path exercise, and one deliberate failure case such as a wrong key or an unplugged key.

The operating material for the operations themselves is well documented publicly. Unlocking LUKS volumes with a YubiKey has been supported since systemd, with the practical gotcha that udev must consistently recognize the YubiKey inside the initramfs, which required a dracut configuration update in one walkthrough (weight 0.573, https://www.guyrutenberg.com/2022/02/17/unlock-luks-volume-with-a-yubikey/). A distribution guide describes configuring LUKS unlock with a YubiKey in FIDO2 mode so the disk unlocks at boot by touching the key (weight 0.540, https://docs.anduinos.com/Skills/Secret-Management/Use-Yubikey-To-Unlock-LUKS.html). A step by step writeup covers upgrading an already LUKS encrypted system to FIDO2 based unlocking beyond passphrases (weight 0.530, weak, https://mhdez.com/posts/unlocking-encrypted-linux-with-a-yubikey/). For the PAM surface, pam-u2f expressly supports devices beyond YubiKeys that speak U2F or FIDO2 (weight 0.203, weak, https://www.tuxedocomputers.com/en/Setting-Up-a-Nitrokey-FIDO2-for-sudo-su-and-Linux-Login.tuxedo), which matters when stating what the demo does and does not cover.

## Limits to state explicitly

The source plan states three limit classes, and they map onto general evidence practice:

1. A single YubiKey model and firmware tested is not a hardware compatibility matrix. The Nitrokey guide's note that multiple authenticator families speak the same standards shows why single model results do not generalize.
2. A lab bench run is not a fleet scale reliability claim. One environment, one run.
3. Recovery tested once is not a statistically validated recovery rate.

A hardware reproducibility checklist from the quantum domain makes the general principle concrete: a result becomes reusable evidence only when the claim, configuration, calibration, raw output, reference, and failure path remain connected (weight 0.358, weak, https://neuraparse.com/blog/qantis-reproducibility-checklist-quantum-hardware/). The failure path clause is the one most often skipped in product demos, and the deliberate failure case in the source plan's evidence list exists precisely to cover it.

## Precondition and ownership

The plan sequences the hardware run behind B-VM-CTAP2 closing: software coverage is proven first, then the physical run exercises the same operations with a real token. This sequencing is what makes the hardware run a confirmation rather than a debugging session. The run also needs a named human owner with physical hardware access, which the plan flags as an open item, and a demo that no one is assigned to execute is the first thing that quietly fails.
