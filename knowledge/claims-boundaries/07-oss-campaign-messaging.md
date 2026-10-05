# 07 - Campaign surfaces on open-source security projects

Scope: How open-source security projects phrase campaign surfaces: taglines, launch pages, README claims for secure boot, immutable OS and identity-root stories.

## A tagline that maps to named mechanisms

The yubi-OS/yubiOS repository describes itself as a FIDO2-first immutable OS and names its primary design reference: the "Fitting Everything Together" essay at 0pointer.net, alongside the concrete trust-chain components it builds on: hermetic /usr, DPS partitions, systemd-repart first-boot, A/B sysupdate, systemd-homed per-user encryption, and UKI + dm-verity [1] (jev weight 0.77). This is the constructive pattern for an identity-root story: the tagline names an architecture (FIDO2-first, immutable), and the README immediately points at the named mechanisms and the design essay behind them. Every element of the tagline has a pointer; nothing rests on adjectives.

## Status language inside the description

The NIST Security Compliance Project for Linux describes itself as an open source work-in-progress effort to provide a programmatic approach to generating security guidance [2] (jev weight 0.79). The phrase "work-in-progress" sits directly in the repository description: the status is part of the claim, not hidden behind it. A campaign surface for a project at this maturity stage can borrow the same construction: name the effort, name its status in the same sentence.

## Community-scale disclosure as a claimable fact

The Linux Foundation's Akrites project, launched June 26, 2026, is described as a joint effort to report, fix, and disclose vulnerabilities in open source software [3] (jev weight 0.61). This is an example of a claim about process rather than outcome: the project claims a disclosure capability it operates, which is verifiable by the process's existence, rather than a security outcome it cannot guarantee.

## Boot integrity as a design claim

The Open Compute Project's Secure Boot document presents a design for enforcing firmware integrity on the components within a server, published by the OCP Security workgroup [4] (jev weight 0.70). Note the claim shape: "a design for enforcing", not "enforces without exception". The design document form bounds the claim to intent and mechanism, which is what an evidence envelope can actually support before field evidence accumulates.

## Immutable OS framing with tradeoffs

A weakly weighted practitioner essay, "The Immutable Linux Paradox" (September 1, 2025), observes that immutable Linux distributions are gaining popularity for their resilience and security as mainstream operating systems adopt similar principles, and examines the tradeoffs different distributions accept [5] (jev weight 0.47, weak backing). The tradeoffs framing is the honest campaign form for immutability: popularity and resilience can be asserted; perfection cannot, and the essay's structure (benefits and tradeoffs together) is the shape a compliant campaign page should take.

## The contrast case

A weakly weighted project page, OpenNyx, claims that it "leaves absolutely no digital footprint on the host machine, ensuring your activities remain private and untraceable", and that a single rapid command can "instantly and irreversibly destroy its entire system" [6] (jev weight 0.28, weak backing). Read against the pattern of the sources above, the page inverts every rule: absolute adverbs (absolutely, instantly, irreversibly, untraceable), no named mechanisms, no bounding document, no status label. It is included here as the negative exemplar the dig surfaced; its weak weight reflects both its source class and its value as evidence.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | yubi-OS/yubiOS repository: https://github.com/yubi-OS/yubiOS | 0.77 |
| 2 | usnistgov/linux_security: https://github.com/usnistgov/linux_security | 0.79 |
| 3 | SecurityWeek, Linux Foundation Akrites: https://www.securityweek.com/linux-foundation-unveils-new-open-source-security-project-akrites/ | 0.61 |
| 4 | Open Compute Project, Secure Boot: https://www.opencompute.org/documents/secure-boot-2-pdf | 0.70 |
| 5 | Jon Seager, The Immutable Linux Paradox: https://jnsgr.uk/2025/09/immutable-linux-paradox | 0.47 (weak) |
| 6 | OpenNyx project page: https://opennyx.github.io/ | 0.28 (weak) |
