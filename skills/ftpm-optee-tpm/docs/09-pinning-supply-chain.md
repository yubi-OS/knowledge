# 09 - Pinning and supply chain

Scope: why a software TPM is a supply-chain surface, the commit pins the skill requires, how they fold into the existing yubiOS pipeline, and the CVE-tracking obligation.

## The fTPM is software, so it inherits software risk

The source doc's framing: the fTPM is software; a ms-tpm-20-ref or OP-TEE bug is a TPM bug (source doc, section "Pinning & supply chain"). The dig found direct corroboration in the vulnerability record: CERT's vulnerability note VU#431093 covers the TCG TPM 2.0 reference code found vulnerable to information disclosure, stating that the vulnerabilities originate in the TPM 2.0 reference implementation and that TPM vendors have incorporated the corresponding fixes into updated firmware and software releases (https://kb.cert.org/vuls/id/431093, jev weight 0.41, weak backing). A concrete instance: Trusted Computing Group reported an out-of-bounds read vulnerability in the TPM 2.0 reference implementation, CVE-2025-2884, which could allow a local attacker to disclose sensitive information (https://support.lenovo.com/us/en/product_security/ps500722, jev weight 0.28, weak backing), specifically an out-of-bounds read in the CryptHmacSign helper with information-disclosure impact (https://windowsforum.com/news/cve-2025-2884-tpm-2-0-oob-read-in-crypthmacsign-and-supply-chain-risk.384772/, jev weight 0.03, weak backing).

This is the whole argument for pinning in one line: because yubiOS compiles the reference implementation itself, the CVE history of that reference code is yubiOS's CVE history, on yubiOS's update schedule. A hardware TPM vendor ships the fix in firmware; yubiOS ships it in the pinned image.

## What to pin

The source doc requires pinning four things to exact commits (source doc, section "Pinning & supply chain"):

1. optee_ftpm, the integration repo.
2. ms-tpm-20-ref at commit 98b60a44aba79b15fcce1c0d1e46cf5918400f6a, the commit optee_ftpm expects (source doc, section "What it is").
3. OP-TEE OS.
4. TF-A commits.

The pins are load-bearing, not decorative: optee_ftpm's build compiles the reference implementation in place with expectations about its layout (doc 03), so an unpinned ms-tpm-20-ref is a build break; and the fTPM is the attestation root (doc 01), so an unpinned attestation root is a non-reproducible root, which defeats the point of owning it.

## Fold into the existing pipeline

The source doc does not invent a new supply-chain mechanism; it folds the fTPM pins into what yubiOS already runs (source doc, section "Pinning & supply chain"):

- Renovate digest tracking per ADR-015, so the pins update through the existing automated-dependency flow rather than by hand.
- The Docker Buildx plus OPA/Rego pipeline per ADR-014, so every build's inputs are vetted by the build-policy gate the same way other images are.

The provenance property of a pinned build also matters for attestation downstream: NVIDIA's BlueField BSP notes that any TA loaded by OP-TEE must be signed (signing done externally) and then authenticated by OP-TEE before being allowed to load and execute (https://networking-docs.nvidia.com/bsp/453/ftpm-over-op-tee, jev weight 0.47, weak backing; https://docs.nvidia.com/networking/display/bluefieldbsp480/ftpm-over-op-tee.pdf, jev weight 0.54, authoritative backing). A TA signature chain only means something if the TA binary that was signed is the one a pinned, policy-checked build produced.

## The no-fork-and-forget rule

The source doc's closing obligation: track upstream ms-tpm-20-ref CVEs; do not fork-and-forget (source doc, section "Pinning & supply chain"). The vulnerability record explains why the rule is stated as a rule: reference-implementation vulnerabilities keep being found and disclosed, and vendor firmware update availability lags in unhelpful ways. The 2026-6726 disclosure covers a TPM 2.0 reference-implementation information leakage and forged attestation risk (https://www.sentinelone.com/vulnerability-database/cve-2026-6726/, jev weight 0.08, weak backing; https://www.penligent.ai/hackinglabs/cve-2026-6726/, jev weight 0.06, weak backing), and CERT's VU#431093 documents the vendor-fix pattern (https://kb.cert.org/vuls/id/431093, jev weight 0.41, weak backing). A fork that stops pulling upstream fixes turns each new reference-code CVE into an unpatched yubiOS CVE with no vendor to update for you.

Operationally the tracking lives in the same review loop as any dependency: when a new ms-tpm-20-ref advisory lands, evaluate whether the affected code paths are compiled into the fTPM TA, decide whether to bump the pin or backport, and record the decision so the pinned commit stays an auditable choice.

## Production reference

The BlueField deployment remains the reference for what a production fTPM supply chain looks like, including the external-signing requirement for TAs (https://networking-docs.nvidia.com/bsp/453/ftpm-over-op-tee, jev weight 0.47, weak backing) and the full BSP documentation set in which the fTPM page sits (https://docs.nvidia.com/nvidia-bluefield-dpu-bsp-v4-7-0-documentation.pdf, jev weight 0.12, weak backing). The source doc's recommendation to use the BlueField BSP as the worked example extends to this doc: study how the pins, signing, and authentication compose there before designing yubiOS's own.

## Weak-backing note

The authoritative backing for this doc is the NVIDIA BlueField fTPM page at 0.54. CERT VU#431093 (0.41), the BlueField BSP page (0.47), Lenovo's CVE-2025-2884 advisory (0.28), and the BlueField BSP PDF (0.12) are weak backing, as are the 2026 CVE summaries (0.06 to 0.08). The pin list, the pipeline integration, and the no-fork-and-forget rule come from the source doc.
