# 08. Coverage Layers and Drift Checks

Scope: the security-layer coverage declarations the onboarding doc closes with (attestation, trust chain, least privilege, continuous and adaptive monitoring), which external mechanisms each names, and the two 2026-09-18 drift-check annotations that trail the doc.

Grounding spine: yubi-OS/yubiOS docs/ONBOARDING.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/ONBOARDING.md), last reviewed 2026-07-11.

## Attestation coverage

The doc declares that it supports the yubiOS attestation layer by anchoring primitive patterns, naming 6 mechanisms: in-toto attestations, Rekor transparency-log entries, SLSA provenance, Sigstore signing-config, bootupd measurement, and keylime runtime attestation (source doc). The doc adds that the attestation chain is end-to-end where applicable, with concrete commit/PR references in the changelog (source doc).

The named mechanisms map onto documented external projects. SLSA's own blog explains the direct relationship between in-toto and SLSA: in-toto provides the attestation format and SLSA the supply-chain levels built on it (https://slsa.dev/blog/2023/05/in-toto-and-slsa, weight 0.25, weak backing). Keylime, a CNCF project for bootstrapping and maintaining cryptographic machine identity, documents its attestation security model around measured boot and runtime quotes (https://keylime.readthedocs.io/en/latest/design/security.html, weight 0.43, weak backing; project overview at https://keylime.readthedocs.io/, weight 0.40, weak backing and https://keylime.dev/, weight 0.20, weak backing). Distribution guidance documents Keylime deployment for attestation of running systems (https://documentation.suse.com/sle-micro/6.0/html/Micro-keylime/index.html, weight 0.48, weak backing). Comparative coverage places SLSA, in-toto, and Sigstore in one supply-chain attestation landscape (https://safeguard.sh/resources/blog/software-attestation-framework-comparison, weight 0.20, weak backing). Of the 6 named mechanisms, bootupd measurement is the one the dig pool does not independently corroborate; the corpus records it as a source-doc claim without external backing in this mint.

## Trust chain coverage

The doc states it participates in the yubiOS root-of-trust chain: ROT/ROTPK, X.509 PKI, root-key custody, and transitive verification across boot stages, with the rule that where the document introduces a new trust anchor (key, certificate, manifest), the chain from hardware root to consumer is documented (source doc). This is the onboarding doc's statement of how any trust anchor a contributor introduces must be wired: not as an isolated credential but as a link in a documented chain that starts in hardware. The ARM platform security architecture material describes secure systems in exactly these terms, a hardware-rooted chain of trust extended stage by stage (https://support.arm.com/documentation/PRD29-GENC-009492/c/TrustZone-Software-Arc, weight 0.49, weak backing).

## Least-privilege coverage

The doc declares least-privilege hardening: Linux capabilities (drop plus ambient), ProtectSystem/ProtectHome, rootless execution, dynamic user, RBAC, PrivilegeBoundary, and sandbox or jail idioms (bwrap, nsjail, landlock, seccomp) "used where isolation > container is required" (source doc). The systemd directives named here are the same family the development rules address from the other direction (doc 05, the RestrictFileSystems distinction), and independent hardening guides document them as the standard systemd sandboxing controls (https://docs.rockylinux.org/10/guides/security/systemd_hardening/, weight 0.40, weak backing).

## Continuous and adaptive coverage

The doc states the document is observable from the runtime-detect surface and that alerts and metrics feed the audit-evidence rollup, with runtime detection named as falco, tracee, tetragon, and kubeArmor plus adaptive policy and real-time monitoring (source doc). This is the onboarding doc's connection point between documentation work and the runtime monitoring layer: the claim is not that the onboarding doc itself detects runtime events, but that it participates in a monitoring fabric where those tools are the detectors.

## The drift checks

The doc ends with 2 annotations dated 2026-09-18 (source doc). The first, from wayfinder round 10 (cycle 15), reports the onboarding record unchanged and the docs corpus fully mojibake-repaired across rounds 9 and 10. The second, from round 11 (cycle 25), again reports the onboarding record unchanged, the corpus mojibake-repaired and single-version after SPEC resolution. Both are marked "note additive". These entries are the doc's own freshness mechanism: a reader can see the last audited state (2026-09-18) and the audit verdict (clean, single-version) without diffing anything.
