# 03 - Trusted boot, measured boot, and platform integrity

Scope: the trusted boot, measured boot, and platform integrity literature the citation doc names: the Arbaugh 1997 secure bootstrap paper, the Sailer 2004 IMA paper, the Parno 2011 trust-bootstrapping survey, the TCG TPM 2.0 Library Specification, and UEFI v2.10 Secure Boot. Grounded in yubi-OS/yubiOS [docs/CITATION.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/CITATION.md) (source doc); dig claims carry URL and jev weight.

## What the source doc cites

The source doc's "Trusted boot, measured boot, and platform integrity" section lists 5 primary sources [source doc: yubi-OS/yubiOS docs/CITATION.md]:

1. Arbaugh, W. A., Farber, D. J., & Smith, J. M. (1997). *A Secure and Reliable Bootstrap Architecture.* IEEE Symposium on Security and Privacy. Annotated by the source doc as the foundational chain-of-trust boot work.
2. Sailer, R., Zhang, X., Jaeger, T., & van Doorn, L. (2004). *Design and Implementation of a TCG-based Integrity Measurement Architecture.* USENIX Security Symposium. Annotated as IMA / PCR measurement.
3. Parno, B., McCune, J. M., & Perrig, A. (2011). *Bootstrapping Trust in Modern Computers.* Springer. Annotated as a survey of TPM-rooted trust that motivates the YubiKey-as-RoT substitution.
4. Trusted Computing Group, *TPM 2.0 Library Specification*.
5. UEFI Forum, *UEFI Specification, v2.10*, annotated as covering Secure Boot `db`/`KEK`/`PK` and Authenticode PE signing.

## Arbaugh 1997, verified by dig

The IEEE Xplore conference record for the paper is at https://ieeexplore.ieee.org/document/601317 (jev weight 0.8); its abstract states that in a computer system, the integrity of lower layers is typically assumed by the layers above, which is the problem the paper's chain-of-trust bootstrap answers. An author-hosted copy is available from the University of Maryland at https://www.cs.umd.edu/~waa/pubs/oakland97.pdf (jev weight 0.76), and the ACM Digital Library record for the same 1997 Symposium proceedings is at https://dl.acm.org/doi/abs/10.5555/882493.884371 (jev weight 0.76), whose abstract describes the AEGIS architecture for initializing a computer system, validating integrity at each layer. The 3 sources agree on the paper's venue (IEEE Symposium on Security and Privacy, 1997) and its thesis. A ResearchGate mirror exists (https://www.researchgate.net/publication/2562492_A_Secure_and_Reliable_Bootstrap_Architecture, jev weight 0.3, weak) and a University of Pennsylvania institutional-repository bitstream (https://repository.upenn.edu/server/api/core/bitstreams/a1e54e5b-ae6c-4fa1-a6c8-8e7fefce91ad/content, jev weight 0.44, weak); both are labeled weak and not relied on.

The 2 dig queries for this subtopic did not surface the Sailer 2004 or Parno 2011 works; their citations are carried by the source doc and not independently re-verified here.

## TPM 2.0 Library Specification, verified by dig

The Trusted Computing Group's specification page is at https://trustedcomputinggroup.org/resource/tpm-library-specification/ (jev weight 0.92). It explains that the TPM 2.0 specification is a "library specification", meaning it is composed of multiple parts rather than a single document, which matches how the source doc cites it as a specification rather than a versioned release. The TCG's Trusted Platform Module work-group page (https://trustedcomputinggroup.org/work-groups/trusted-platform-module/, jev weight 0.9) describes the work group chartered to maintain the TPM standard family. Microsoft's support documentation on enabling TPM 2.0 on Windows PCs (https://support.microsoft.com/en-us/windows/security/devicesecurity/enable-tpm-2-0-on-your-pc, jev weight 0.95) is recorded as practical context for why TPM 2.0 support is a baseline platform property, though it is vendor how-to rather than specification text.

Weak-backing or off-topic results (labeled as such, jev weight under 0.5): a Wikipedia overview of the TPM as an ISO/IEC 11889 secure cryptoprocessor (https://en.wikipedia.org/wiki/Trusted_Platform_Module, 0.41), a post-quantum-cryptography marketing page covering UEFI Secure Boot and firmware signing (https://www.pqctoday.com/learn/secure-boot-pqc/, 0.19), and one unrelated consumer-search result recorded for provenance only. One high-weight result (https://support.activision.com/articles/trusted-platform-module-and-secure-boot, jev weight 0.85) scored high but is a game-anti-cheat support article; it is recorded here with an explicit relevance caveat: weight reflects source class, not topical fit, and it is not cited for any technical claim.

## UEFI v2.10 and Secure Boot, from the source doc

The source doc cites the UEFI Specification, version 2.10, from the UEFI Forum, with the annotation that it covers Secure Boot `db`/`KEK`/`PK` key databases and Authenticode PE signing, at https://uefi.org/specifications [source doc]. The dig queries for this subtopic returned no UEFI Forum result worth weighting, so the version claim and the key-database annotation are carried by the source doc. This is consistent with how yubiOS uses the terms elsewhere: `PK` is the platform key, `KEK` the key-exchange keys, and `db` the signature database that UKI signing chains into.

## Why the survey motivates the substitution

The source doc's own annotation on the Parno 2011 Springer book is the interpretive bridge of this section: the survey of TPM-rooted trust "motivates the YubiKey-as-RoT substitution" [source doc]. In other words, the citation exists not only as background but as the academic argument for yubiOS's core design move: replacing the TPM at every trust boundary with a YubiKey. The measured-boot lineage runs Arbaugh 1997 (chain of trust at boot), Sailer 2004 (TCG-based measurement, IMA and PCRs), Parno 2011 (survey of TPM-rooted trust), then the TCG TPM 2.0 specification (the standard being substituted away from) and UEFI v2.10 (the firmware signing substrate). [source doc: yubi-OS/yubiOS docs/CITATION.md]
