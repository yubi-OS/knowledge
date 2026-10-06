# 05 - Attestation and trust-chain coverage

**Scope:** What the ground doc's attestation-coverage and trust-chain-coverage sections record, and the external mechanisms behind each named component.

**Ground spine:** `yubi-OS/yubiOS docs/SER.md` (https://github.com/yubi-OS/yubiOS/blob/main/docs/SER.md, jev weight 0.61)

## Attestation coverage, as recorded

The attestation-coverage section states that the document supports the yubiOS attestation layer by anchoring primitive patterns: in-toto attestations, Rekor transparency-log entries, SLSA provenance, Sigstore signing-config, bootupd measurement, and keylime runtime attestation (source doc). It claims the attestation chain is end-to-end where applicable, with concrete commit and PR references in the changelog (source doc). Note the doc's posture: this section is an inventory of which attestation patterns the doc participates in, not a design of them.

## Runtime attestation: Keylime

The dig's strongest results ground the Keylime component. The Keylime documentation describes it as a TPM-based, highly scalable remote boot attestation and runtime integrity measurement solution (https://keylime.readthedocs.io/, weight 0.81). The project repository frames it as a CNCF project for bootstrapping and maintaining trust, an end-to-end solution for establishing hardware-rooted trust (https://github.com/keylime/keylime, weight 0.79). An Intel engineering article connects the two halves: multiple projects leverage IMA to protect runtime integrity, with Keylime as a CNCF sandbox project consuming those measurements (https://www.intel.com/content/www/us/en/developer/articles/community/runtime-integrity-measurement-and-attestation-in-a-trust-domain.html, weight 0.42, weak). Two DeepWiki pages describe Keylime's measured-boot verification and its integration with IMA runtime attestation (https://deepwiki.com/keylime/keylime/3.3-measured-boot-verification, weight 0.15, weak; https://deepwiki.com/keylime/keylime/4.2-measured-boot-policy, weight 0.15, weak).

## The Sigstore and in-toto family

The doc names in-toto attestations, Rekor transparency-log entries, SLSA provenance, and Sigstore signing-config together (source doc). The dig grounds the relationship weakly: a glossary defines provenance, attestation, and signing with concrete examples using in-toto, Sigstore, cosign, fulcio, and rekor (https://safeguard.sh/resources/blog/provenance-attestation-signing-practical-glossary, weight 0.23, weak). A supply-chain article states that the in-toto Attestation Framework (ITE-6) defines the common envelope that Sigstore, SLSA, and other tools use to represent provenance claims (https://aquilax.ai/blog/supply-chain-artifact-signing-slsa, weight 0.19, weak). A practitioner guide describes SLSA's key artifact as provenance: a signed attestation identifying an artifact by its SHA256 digest (https://dev.to/kamal_namdeo/slsa-sigstore-and-provenance-complete-practical-guide-1bl5, weight 0.13, weak). These are weakly backed but mutually consistent with the doc's listing of the same four names as one layer (source doc).

## Trust chain coverage, as recorded

The trust-chain-coverage section states that the document participates in the yubiOS root-of-trust chain covering ROT and ROTPK, X.509 PKI, root-key custody, and transitive verification across boot stages, and that where the document introduces a new trust anchor (key, certificate, or manifest) the chain from hardware root to consumer is documented (source doc). The dig returned no primary-weight result specifically on ROTPK chains; the Keylime results above are the nearest external mechanism (hardware-rooted trust bootstrap, weights 0.81 and 0.79). The chain structure itself is the source doc's record.

## What is grounded and what is not

Strong grounding (0.79 and 0.81) covers Keylime's role as the runtime-attestation mechanism. Everything in the Sigstore/in-toto/SLSA family is grounded only weakly (0.13 to 0.23). bootupd measurement and the boot-stage ROTPK chain appear only in the source doc with no external corroboration in this dig, and are reported as the doc's own claims (source doc).
