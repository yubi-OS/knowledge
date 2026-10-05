# 07 - Supply chain integration

**Scope.** The tools tree as a supply-chain input: how the pinned tool environment feeds SLSA provenance, build-policy FROM-image vetting, and attestation of the build pipeline.

## The provenance hook

SLSA defines provenance as verifiable information that can be used to track an artifact back, through all the moving parts in a complex supply chain, to where it came from, describing where, when, and how something was produced ([slsa.dev/provenance/](https://slsa.dev/provenance/), jev weight 0.87, authoritative; the same definition appears in the v0.1 spec, [slsa.dev/spec/v0.1/provenance](https://slsa.dev/spec/v0.1/provenance), jev weight 0.84, authoritative).

The tools tree is one of those moving parts. The yubiOS plan states it directly: the tools tree is part of the supply chain, and it feeds SLSA provenance and build-policy inputs like any FROM image (yubiOS refs plan doc, source of this corpus). A provenance attestation that omits the tool environment is incomplete: two builds from the same source with different tools trees are different builds.

The toolchain's role in verifiability is stated in the strong-source research: a build is reproducible when the same source code, dependencies, toolchain, build instructions, and environment produce bit-for-bit identical output across separate machines ([arxiv.org/html/2605.08363](https://arxiv.org/html/2605.08363), Kettle: Attested Builds for Verifiable Software Provenance, jev weight 0.60, authoritative). The toolchain is listed explicitly as an input to the reproducibility property, which is exactly what the tools tree pins.

## Build-policy vetting of build inputs

Docker Build Policies vet build inputs before any layer executes. A documented example policy allows local and Git contexts, images from Docker Hub, GitHub Container Registry, and Docker Hardened Images, and blocks HTTP downloads and non-standard registries ([docs.docker.com/build/policies/examples/](https://docs.docker.com/build/policies/examples/), jev weight 0.81, authoritative). For the tools tree, this is the pattern for the FROM-class vetting: the tools-tree source reference and digest belong in the same allowlist review as any other image input, which is what the yubiOS plan means by treating it like any FROM image (yubiOS refs plan doc).

Image-allowlisting practice reaches the same conclusion from the cluster side, restricting deployments to verified images from approved registries ([oneuptime.com/blog/post/2026-02-09-image-allowlisting-admission/view](https://oneuptime.com/blog/post/2026-02-09-image-allowlisting-admission/view), jev weight 0.36, weak source). The weak-source label applies: it is practitioner guidance, not a spec.

## Generating the attestation

The attestation generation step exists in mainstream CI tooling: the Jenkins SLSA Provenance Attestation plugin provides a post-build action that generates provenance attestations ([plugins.jenkins.io/slsa](https://plugins.jenkins.io/slsa), jev weight 0.73, authoritative). Whatever generates the yubiOS provenance, the tools-tree digest is one of the fields it should carry: doc 09 covers how those transitions are tracked over time.

## What the integration requires of the tracker

Reading the yubiOS plan against the sources above, the tools-tree tracker has 3 supply-chain obligations:

1. The pin (digest, not tag) must be recorded so provenance can name it ([docs.docker.com/dhi/explore/security-concepts/digests/](https://docs.docker.com/dhi/explore/security-concepts/digests/), jev weight 0.79, authoritative, for digest immutability).
2. The pin must pass build-policy vetting like any FROM image (yubiOS refs plan doc; [docs.docker.com/build/policies/examples/](https://docs.docker.com/build/policies/examples/), jev weight 0.81, authoritative, for the vetting pattern).
3. The refresh workflow must record old-to-new transitions so the provenance history is continuous (yubiOS refs plan doc).

## Bottom line

The tools tree is not a build detail, it is a supply-chain input on the same footing as the base images. Provenance that names it, policies that vet it, and a ledger that tracks its transitions are the 3 concrete integration points.
