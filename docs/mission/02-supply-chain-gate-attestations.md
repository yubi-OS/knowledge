# 02: The supply-chain gate, provenance, and SBOM

Scope: the source doc's second verification layer: the OPA/Rego gate that runs before a layer executes, plus the SLSA provenance and SBOM attestations every build ships with.

## What the source doc claims

The source doc (yubi-OS/yubiOS docs/MISSION.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MISSION.md) makes two adjacent claims: "Every build passes an OPA/Rego supply-chain gate before a single layer executes, and ships with SLSA provenance and SBOM attestations" (source doc). The same bullet block ties digest pinning to it: every base image and CI action is digest-pinned (PINNED.md) and mutable tags are rejected by build policy (yubiOS.rego) (source doc). The doc's non-negotiables add that PINNED.md is the live source of truth for digests and that historical evidence is not a current pin (source doc).

## SLSA provenance: what the standard provides

The dig results describe the attestation machinery the source doc references. All weights are below 0.5 (weak backing), but several are close to official documentation.

- GitHub's artifact attestations documentation states that GitHub Actions can generate artifact attestations that establish build provenance for artifacts such as binaries and container images (https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations, weight 0.39, weak). The concepts page describes SLSA levels as an industry standard used to evaluate supply-chain security, organized into levels (https://docs.github.com/en/actions/concepts/security/artifact-attestations, weight 0.17, weak).
- The slsa-github-generator project states its generators let you meet the provenance-generation and isolation-strength requirements for SLSA Build level 3 and above, creating an attestation for each artifact (https://github.com/slsa-framework/slsa-github-generator, weight 0.11, weak). The actions/attest-build-provenance action generates signed build-provenance attestations for workflow artifacts, binding subjects to their source (https://github.com/actions/attest-build-provenance, weight 0.19, weak).
- Practitioner walkthroughs confirm the pattern in CI: one guide describes storing container-image provenance attestations alongside the image in OCI-compatible registries after an isolated build (https://devopscube.com/slsa-provenance/, weight 0.11, weak), and another documents generating SLSA level 3 provenance for container images with slsa-github-generator and verifying with slsa-verifier (https://secure-pipelines.com/ci-cd-security/lab-generating-verifying-slsa-provenance-container-images/, weight 0.11, weak).

The mapping to the source doc is direct: "ships with SLSA provenance" is the attestation step these tools automate, and "before a single layer executes" is the enforcement point the Rego gate occupies in the build itself, where a policy can reject an input (a mutable tag, an unpinned image) before any layer is pulled.

## SBOM attestations

The dig set for SBOM was thinner than the SLSA set: one result describes building and publishing auditable container images with SBOM and SLSA attestation using a single build-push action in GitHub Actions (https://janik6n.net/posts/build-and-publish-auditable-container-images-with-sbom-and-slsa-attestation-to-azure-container-registry-using-github-actions/, weight 0.10, weak). That result supports the combination the source doc asserts (SBOM shipped alongside provenance) but not at authoritative weight. The corpus records this as a gap-weighted area: the SBOM half of the claim rests on the source doc plus one weak result, while the provenance half has richer, still-weak, backing.

## Enforcement ordering is the load-bearing detail

What makes the source doc's phrasing precise is the ordering: the gate runs "before a single layer executes." A post-hoc scan after images are pulled would still catch bad artifacts, but the doc's design rejects bad inputs at admission time. The digest-pinning half of the claim is what the gate checks against: a mutable tag cannot be verified as the same bytes yesterday and today, so yubiOS.rego rejecting mutable tags (source doc) is what turns the pin file from documentation into an enforced invariant. The doc's non-negotiable that "historical evidence is not a current pin" (source doc) closes the last procedural shortcut: a once-verified digest does not carry authority forward; the live pin file does.

## Sources note

Results kept for this subtopic: 8, of 8 weighted. Primary-backing count (weight >= 0.5): 0; the strongest result is the GitHub artifact-attestations how-to at weight 0.39. The corpus therefore presents the SLSA and SBOM material as corroborating context with explicit weak labels, while the normative claims (gate ordering, pin enforcement, attestations shipped) rest on the source doc. A future refresh should re-dig SBOM specifically, since the SBOM half of the dig set was a single weak result versus five for SLSA provenance.
