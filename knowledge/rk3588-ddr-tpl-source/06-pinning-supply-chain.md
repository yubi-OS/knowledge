# Supply-chain pinning of build-time-fetched binaries

Scope: why sha256 pinning and fail-closed builds are the right control for a build-time-fetched blob, and what the supply-chain standards literature says.

## The problem the pin solves

When a build fetches a binary from upstream instead of building it from source, the fetch becomes a trust decision executed by CI on every build. Docker's build documentation states the motivation for validating build inputs directly: "Validating these images protects your build supply chain from compromised registries, unexpected updates, and unauthorized base images" (https://docs.docker.com/build/policies/validate-images, jev weight 0.5679). Substitute "blob repository" for "registry" and the RK3588 case is the same shape: the rkbin repository (doc 02) could be renamed, moved, or updated at any moment, and a build that pulls whatever is at HEAD would silently consume a different artifact.

## Reproducibility: the source-to-binary verification gap

The reproducible-builds.org project defines the goal: "Reproducible builds are a set of software development practices that create an independently-verifiable path from source to binary code" (https://reproducible-builds.org/, jev weight 0.8124). It further explains the license and security stakes: "Reproducible Builds ensure software complies with licenses and industry standards by proving that binaries match their source code. Reproducible Builds protect developers from targeted attacks by allowing third-party verification of their software" (same source, weight 0.8124).

A closed blob breaks that path by definition: there is no source to match. The honest adaptation is to narrow the unverifiable surface to exactly one artifact and pin it: the blob is fetched by exact digest, the digest is reviewed and recorded, and every build consumes byte-identical input. A firmware project that practices this verification shows the pattern in production: Dasharo's reproducible build guide states "Reproducible builds are crucial from both security and open-source perspectives because they allow anyone to verify that the compiled binary of a software package truly matches the original source code. This ensures that no tampering, such as inserting malicious code during the build process, has occurred" (https://docs.dasharo.com/guides/reproducible-build-verification/, jev weight 0.7351). Dasharo ships firmware, the same trust domain as yubiOS's RK3588 image.

## SLSA: the levels framework

SLSA frames build integrity as graduated levels: "SLSA levels are like a common language to talk about how secure software, supply chains and their component parts really are. From source to platform, the levels blend together industry-recognized best practices to create four compliance levels of increasing assurance" (https://slsa.dev/, jev weight 0.7955).

Two SLSA specifics matter for the blob case:

1. Scope: "The level describes the integrity protections of an artifact's build process and top-level source, but nothing about the artifact's dependencies. Dependencies have their own SLSA ratings, and it is possible for a SLSA 4 artifact to be built from SLSA 0 dependencies" (https://slsa.dev/spec/v0.1/levels, jev weight 0.9514). A closed blob is effectively a SLSA 0 dependency of the image build: no build process protections can be claimed for it. Naming that honestly in the build's provenance documentation is what keeps the rest of the SLSA story truthful.
2. Provenance: "To trace software back to the source and define the moving parts in a complex supply chain, provenance needs to be there from the very beginning. It's the verifiable information about software artifacts describing where, when and how something was produced" (https://slsa.dev/spec/v0.1/provenance, jev weight 0.8863). For a build-time-fetched blob, "where, when and how" is exactly the record the pin creates: URL, digest, fetch timestamp, and the build that consumed it.

Docker's DHI documentation applies SLSA to containerized artifacts with the same framing (https://docs.docker.com/dhi/core-concepts/slsa/, jev weight 0.7997), reinforcing that digest-verified inputs plus recorded provenance is the current industry shape.

## The pinning mechanics

Digest pinning is a practiced, tool-supported pattern in general supply-chain work: a CLI tool exists specifically "to add @sha256:<digest> to FROM and COPY --from= lines in Dockerfiles... to prevent supply chain attacks" (https://github.com/azu/dockerfile-pin, jev weight 0.4667, weak backing at 0.4667). For the RK3588 blob the analogous control is recording the blob's sha256 alongside its version and upstream URL, failing the build if the fetched bytes do not hash to the recorded digest, and failing equally if the fetch fails. The fail-closed direction is the security-relevant half: a build that proceeds with an unpinned or unverifiable blob converts the entire image build's integrity story into a guess.

## Mapping to the RK3588 decision

Concretely, the pinning discipline applied to the rkbin DDR blob (for example the variant documented at https://danielc.dev/rk/rk3588/boot/, jev weight 0.7255, which names `rk3588_ddr_lp4_2112MHz_lp5_2400MHz_v1.18.bin` as the required artifact) looks like:

1. Record blob filename, version, upstream URL, and sha256 in the build's pinned-inputs document.
2. CI fetches from upstream, computes sha256, and hard-fails on mismatch or absence.
3. The build's provenance records the blob as a fetched dependency with its digest (the SLSA dependency caveat above stated honestly).
4. Blob version bumps are explicit, reviewed changes to the pinned record, never drift.

This is the pattern the OS already applies to its other build inputs; applying it to the one remaining closed input keeps the invariant uniform (doc 08).
