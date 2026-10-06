# Security Primitive Coverage

Scope: the five coverage sections the maintainer playbook records, mapping the doc to the yubiOS security primitives and naming the external projects each primitive draws on. Grounding spine: source doc (yubi-OS/yubiOS docs/MAINTAINER.md); Keylime facts dig-backed and strong; attestation-framework comparisons dig-backed but weak and labeled.

## What the source doc covers

The source doc carries five coverage sections:

1. Attestation coverage: in-toto attestations, Rekor transparency-log entries, SLSA provenance, Sigstore signing-config, bootupd measurement, Keylime runtime attestation. The doc states the attestation chain is end-to-end where applicable, with concrete commit/PR references in the changelog.
2. Trust chain coverage: ROT/ROTPK, X.509 PKI, root-key custody, transitive verification across boot stages; any new trust anchor introduced must have its chain from hardware root to consumer documented.
3. Least-privilege coverage: Linux capabilities (drop plus ambient), ProtectSystem/ProtectHome, rootless execution, dynamic user, RBAC, PrivilegeBoundary, with sandbox or jail idioms (bwrap, nsjail, landlock, seccomp) where isolation must exceed containerization.
4. Continuous/adaptive coverage: runtime detection via falco, tracee, tetragon, kubeArmor, with adaptive policy and real-time monitoring observable from the runtime-detect surface, feeding alerts and metrics into the audit-evidence rollup.
5. Cryptographic identity coverage: FIDO2/CTAP2 YubiKey, softhsm/PKCS#11/TPM, HSM-backed keys, key attestation, end-to-end attested identity, documented cryptographic root, and first-class key rotation.

## Keylime, dig-backed

The source doc names Keylime as the runtime attestation component. The dig returned strong sources. The project repository describes Keylime as an open-source scalable trust system harnessing TPM technology, providing an end-to-end solution for bootstrapping hardware-rooted cryptographic trust for remote machines, provisioning encrypted payloads, and runtime system integrity monitoring (weight 0.88, https://github.com/keylime/keylime). The project documentation describes it as a TPM-based, highly scalable remote boot attestation and runtime integrity measurement solution, noting it originated in the security research team at MIT Lincoln Laboratory (weight 0.76, https://keylime.readthedocs.io/en/latest/index.html and weight 0.76, https://keylime.readthedocs.io/). The CNCF project page lists Keylime as a CNCF-hosted project (weight 0.83, https://www.cncf.io/projects/keylime/), and a CNCF engineering post explains that Keylime pairs a TPM with the Linux Integrity Measurement Architecture to provide remote attestation, secure payload delivery, and a revocation framework (weight 0.55, https://www.cncf.io/blog/2021/07/06/ibm-implements-remote-attestation-on-linux-with-a-hardware-root-of-trust-using-keylime/). The Keylime project site itself returned weight 0.4 (weak, https://keylime.dev/).

## Attestation-framework relationships, weakly backed

The dig's comparative sources on the in-toto/SLSA/Sigstore relationship all scored low, so their specific claims are weakly backed and are used here only where they merely gloss what the source doc already asserts. One such claim: the in-toto attestation framework defines a common envelope with a statement type, subject, and predicate that provenance systems reuse (weight 0.2, weak, https://aquilax.ai/blog/supply-chain-artifact-signing-slsa). Another: Rekor entries serve as the transparency-log home for build attestations (weight 0.31, weak, https://www.asqav.com/docs/executable-hash-and-sbom-provenance). A comparison of SLSA, in-toto, and Sigstore verification practices returned weight 0.2 (weak, https://safeguard.sh/resources/blog/software-attestation-framework-comparison), and two further supply-chain explainers returned 0.18 and 0.12 (weak, https://beefed.ai/en/software-provenance-sigstore-in-toto, https://www.iqinfinite.com/articles/software-supply-chain-security-sbom-provenance-signing-2026). The authoritative statement of these frameworks' roles in yubiOS remains the source doc; the weak sources are directional color only.

## Why one doc carries the primitives

The maintainer playbook is a governance document, not an implementation spec, so its coverage sections function as a checklist of which primitive families the maintainer must be able to reason about and keep consistent across the corpus. Each section ends in an enforcement clause: attestation chains are end-to-end where applicable with commit/PR references; new trust anchors get a documented chain from hardware root to consumer; isolation idioms are chosen where isolation must exceed containers; runtime-detection output feeds the audit-evidence rollup; key rotation is first-class. The sections thus bind the maintainer's day-to-day work (docs, CI, releases) to the project's security architecture rather than leaving the two in separate silos.
