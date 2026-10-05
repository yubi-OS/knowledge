# 07 - Honest provenance claims: SLSA, in-toto, and what an attestation can say

Scope: making verifiable provenance claims for an open-source security product, covering SLSA provenance, in-toto attestations, and how build-level attestations connect to authorship provenance.

## What provenance means in the SLSA framework

SLSA's own definition is the primary anchor: in SLSA, provenance refers to verifiable information that can be used to track an artifact back through all the moving parts in a complex supply chain to where it came from, describing where, when, and how something was produced (source: https://slsa.dev/provenance/, weight 0.84). A weakly backed mirror of the older v0.2 spec adds that for higher SLSA levels provenance needs to exist from the very beginning of the build chain (source: https://devmoran.github.io/slsa/provenance/v0.2, weight 0.33, weak backing).

in-toto frames the same problem at the process level: the framework is designed to ensure the integrity of a software product from initiation to end-user installation by making it transparent what steps were performed, by whom, and in what order (source: https://in-toto.io/, weight 0.85). The in-toto Attestation Framework specification provides the format: verifiable claims about any aspect of how a piece of software is produced, which consumers validate to establish trust in the supply chain (source: https://github.com/in-toto/attestation, weight 0.79). A weakly backed explainer describes the envelope mechanics: a typed predicate, such as SLSA provenance or scan results, wrapped inside a signed envelope (source: https://sbomify.com/2024/08/14/what-is-in-toto/, weight 0.25, weak backing).

## What exists today for actually producing attestations

The tooling is real and shipping. Docker's BuildKit v0.11 release notes state that BuildKit can now create SLSA provenance attestations to trace a build back to source and make it easier to understand how a build was created (source: https://www.docker.com/blog/highlights-buildkit-v0-11-release/, weight 0.91). For language ecosystems, the deps.dev team documented npm's public beta for SLSA provenance support: package owners can upload cryptographically verifiable SLSA provenance attestations along with their packages, with integration into the Sigstore Rekor transparency log (source: https://blog.deps.dev/npm-provenance/, weight 0.64).

End-to-end pipeline patterns exist as open templates: an attested release pipeline template runs a build, attest, verify chain, supports a dry-run via workflow_dispatch where the full chain runs but publish is skipped, and signs and attests artifact verdicts at release (source: https://github.com/attested-delivery/attested-pipeline-template, weight 0.65). A weakly backed walkthrough describes attestations as first-class citizens in a supply chain inventory, with predicates parsed and indexed including SLSA provenance and SBOM data (source: https://safeguard.sh/resources/blog/in-toto-attestation-framework-walkthrough-2026, weight 0.37, weak backing).

## The boundary this corpus keeps honest

Build provenance and authorship provenance are different claims. SLSA provenance attests how an artifact was built (which repo, which workflow, which inputs); it does not attest which portions were written by AI. The yubiOS risk register's provenance section is about the second kind, the Assisted-by trailer convention for AI-assisted commits, and its attestation-coverage paragraph lists in-toto attestations, Rekor entries, SLSA provenance, and Sigstore signing as the attestation layer. Both layers are real and complementary, but a release-time SLSA attestation is not evidence about authorship of individual lines. The AI-commit side is covered in doc 06, where the sources are weakly backed community conventions rather than standards.

One dig result was an off-topic spam page discarded at weighting (weight 0.03), and one aggregator page for a kernel blog carried weak weight (source: https://planet.kernel.org/, weight 0.32, weak backing); neither supports any claim here.

## Sources considered

| URL | Weight | Note |
|---|---|---|
| https://www.docker.com/blog/highlights-buildkit-v0-11-release/ | 0.91 | BuildKit SLSA provenance attestations (primary) |
| https://in-toto.io/ | 0.85 | in-toto framework (primary) |
| https://slsa.dev/provenance/ | 0.84 | SLSA provenance definition (primary) |
| https://github.com/in-toto/attestation | 0.79 | Attestation framework spec (primary) |
| https://blog.deps.dev/npm-provenance/ | 0.64 | npm SLSA provenance and Rekor |
| https://github.com/attested-delivery/attested-pipeline-template | 0.65 | Attested release pipeline pattern |
| https://safeguard.sh/resources/blog/in-toto-attestation-framework-walkthrough-2026 | 0.37 | Weak: walkthrough |
| https://devmoran.github.io/slsa/provenance/v0.2 | 0.33 | Weak: spec mirror |
| https://sbomify.com/2024/08/14/what-is-in-toto/ | 0.25 | Weak: explainer |
| https://planet.kernel.org/ | 0.32 | Weak: background |
| https://m.thothd.com/search/dreamykittyyy-onlyfan-leaks/ | 0.03 | Discarded: spam |
| https://www.instagram.com/?hl=en-in | 0.03 | Discarded: off-topic |
