# 03. Trust-chain openness

Scope: why the mechanisms that establish and verify trust (secure boot, signing, disk encryption, reproducible builds) must remain public and inspectable, and what happens to supply-chain integrity when they are not.

## Verifiability is the security property, not openness for its own sake

Reproducible builds are a set of software development practices that create a verifiable path from human-readable source code to the binary code a computer executes. The build system must be made fully deterministic so anyone can recompile the source and get bit-for-bit identical binaries [1] (weight 0.78). The upstream project describes the payoff directly: reproducible builds add a strong security layer to build pipelines, enabling independent audits and ensuring every binary matches the source code [2] (weight 0.95).

The academic literature sharpens the stakes: binaries are typically built and distributed by third-party vendors, and supply-chain compromise at that layer has severe security consequences. Reproducible builds let an auditor determine whether a distributed binary really corresponds to the claimed source [3] (weight 0.74). This is the core argument for keeping a trust chain public: an unverifiable trust boundary is a trust boundary the owner does not actually control.

## What "public trust chain" concretely means

The mechanisms named in operating covenants map directly onto documented standards:

- **Secure Boot signing.** The UEFI specification defines how a digital signature is generated for a UEFI executable, embedded within it, and verified before the platform trusts it [4] (weight 0.96). The verification logic is public, standard, and inspectable; the covenant question is whether the project's own signing flow (keys, manifests, policy) is inspectable with equal rigor.
- **Signing key custody.** Embedded-device practice shows the pattern: secure boot defaults to signing images and partition-table data during the build, with the private signing key configured as a file path to an ECDSA public/private pair in PEM format [5] (weight 0.95). A covenant that keeps signing flows public is asserting that key generation, storage, and use are documented and auditable, not hidden inside a vendor appliance.
- **Build determinism in CI.** Using a continuous integration tool makes it easier to ensure builds are reproducible and behave as expected, alongside language-specific reproducibility tooling [6] (weight 0.69).

## The fork-and-audit interaction

If the trust chain is public, a compliant fork inherits a working, auditable boot path. If it is closed, forks must either trust the upstream vendor's binary or re-derive the entire chain. Downstream security coordination (tracking who has which fix) is already hard across a fork tree; a closed trust layer makes the fork's audit position strictly worse. Distributions have had live disputes over exactly this surface, e.g. a Fedora engineering steering council issue on UEFI Secure Boot signing keys for a release [7] (weight 0.50). The existence of public, contestable processes over signing keys is itself part of the openness argument.

## The zero-trust framing

A practitioner argument for zero-trust supply-chain security starts from the premise that you should not need to trust any single actor in the pipeline; the USB-drive-on-the-sidewalk thought experiment motivates verifying artifacts rather than trusting origins [8] (weight 0.21, weak backing). The same stance, formalized by the reproducible-builds and SLSA literature, is what covenants institutionalize: nothing in the trust chain should require faith in the vendor.

## Caveats

The strongest sources in this doc are standards and upstream project documentation (UEFI spec, reproducible-builds.org, peer-reviewed survey). The zero-trust blog framing is weakly backed and labeled accordingly.

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | https://en.wikipedia.org/wiki/Reproducible_builds | 0.78 |
| 2 | https://reproducible-builds.org/ | 0.95 |
| 3 | https://arxiv.org/pdf/2104.06020 | 0.74 |
| 4 | https://uefi.org/specs/UEFI/2.11/32_Secure_Boot_and_Driver_Signing.html | 0.96 |
| 5 | https://docs.espressif.com/projects/esp-idf/en/stable/esp32/security/secure-boot-v1.html | 0.95 |
| 6 | https://osssc-edu.github.io/supply-chain.github.io/SSC-reproducible-builds/ | 0.69 |
| 7 | https://pagure.io/fesco/issue/2479 | 0.50 |
| 8 | https://dlorenc.medium.com/zero-trust-supply-chain-security-e3fb8b6973b8 | 0.21 |
| 9 | https://dictionary.cambridge.org/dictionary/english/reproducible | 0.06 |
| 10 | https://handwiki.org/wiki/Software:Features_new_to_Windows_XP | 0.10 |
| 11 | https://www.remove.bg/ | 0.03 |
| 12 | https://nlnet.nl/project/current.html | 0.38 |
