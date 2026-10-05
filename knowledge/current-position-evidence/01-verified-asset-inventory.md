# Verified asset inventory: what counts as evidence in an early-stage security project

Scope: how to inventory and verify the technical assets and public artifacts (public repo, license file, CI lanes, published images, provenance and SBOM attestations, staged upstream forks) that ground engineering-progress claims.

## The inventory principle

An evidence-boundary document starts with a list of what can be checked right now, by anyone, without trusting the project's word. The working definition: an asset is verified when a third party can inspect it directly. A public repository, a license file at the repo root, a CI pipeline whose run history is public, and a published container image whose attestations can be pulled from a registry all pass this test. Marketing copy on the project website does not.

The yubiOS project applied exactly this discipline in its current-position snapshot of 2026-07-25 (source doc: OMN-68, grounded in the live BLOCKERS.md reviewed 2026-07-22). Its verified inventory listed: a public GitHub org and repo, an LGPL-2.1 LICENSE file present at the repo root, living documentation (README, MISSION, BLOCKERS, TODO, PINNED, and a growing refs/ corpus), a CI pipeline with a VM end-to-end test lane where specific numbered runs retired specific named blockers, and a Docker Hub publish path with SLSA provenance and SBOM attestations on green main builds. Each line points at an inspectable artifact, not at a claim.

## Why provenance and SBOM attestations anchor the strongest claims

For container-based projects, the publish path is where evidence quality is highest, because attestations are machine-checkable. Docker's documentation defines SBOM and provenance attestations as structured metadata attached to built images (https://docs.docker.com/build/metadata/attestations/, weight 0.94, primary). Provenance traces a build back to its source; an SBOM records what is inside the image. BuildKit has produced SLSA provenance attestations since v0.11 precisely so a build's origin can be understood independently of the builder's say-so (https://www.docker.com/blog/highlights-buildkit-v0-11-release/, weight 0.89, primary).

Docker's hands-on lab walks through generating SBOMs and SLSA provenance with BuildKit, signing images with Cosign, and attaching OpenVEX statements declaring vulnerability exploitability status (https://docs.docker.com/guides/lab-attestation-basics/, weight 0.87, primary). This is the model an early-stage project should copy: the claim "our main-branch images carry provenance" becomes verifiable by anyone with a registry client, not just by the team's own blog post.

Third-party write-ups agree on the mechanism: attestations are signed metadata documents co-located with an image in an OCI registry, each an in-toto envelope wrapping a typed predicate such as SLSA provenance, and a non-forgeable SLSA Build L3 builder records source commit, build parameters, and builder identity so any deviation is detectable at policy-check time (https://www.systemshardening.com/articles/cicd/container-image-attestations/, weight 0.59, secondary). A commercial product page describes the same shape as "structured evidence packages" capturing build metadata, artifact hashes, environment details, and provenance records in tamper-evident form (https://orygn.tech/products/ci-evidence-pack, weight 0.57, vendor marketing page, treat as directional rather than authoritative).

## What each inventory line proves, and what it does not

Be precise about what each artifact is evidence of:

1. A public repo with a LICENSE file is evidence that source is available under stated terms. It is not evidence the software works.
2. A CI pipeline with a green history is evidence the build and test lanes pass as of the latest run. GitLab's documentation on predefined CI/CD variables shows how pipeline state (branch, commit SHA, job URL) is exposed per run, which is what makes a specific run citable by number (https://docs.gitlab.com/ci/variables/predefined_variables/, weight 0.72, primary).
3. Attestations on published images are evidence about how the artifact was built and what it contains, not about how it behaves under attack.
4. Staged upstream forks (the yubiOS snapshot counts 6 ARM64 forks added for fTPM groundwork per ADR-018/019/020) are evidence of groundwork only. A fork existing is not a working path.

The distinction matters because inventories are routinely over-read: "we publish SLSA provenance" becomes "our supply chain is secure" in a pitch deck. The inventory discipline prevents this by tying every line to a verification method a reader can execute.

A practitioner guide aimed at containers makes the same separation between provenance, SBOMs, and attestations as three distinct artifact types that appear together constantly but answer different questions (https://www.cleanstart.com/blogs/understanding-image-provenance, weight 0.50, secondary, moderate confidence). A broader explainer on SLSA build provenance in CI/CD pipelines covers the same ground at lower rigor (https://www.encryptionconsulting.com/slsa-build-provenance-and-signing-in-ci-cd-pipelines/, weight 0.34, weak).

## Inventory cadence

Two practices keep the inventory honest. First, date it: the yubiOS snapshot states its inspection date (2026-07-25) and the review date of the blocker list it depends on (2026-07-22), so a reader knows exactly how fresh the evidence is. Second, keep the live system authoritative: the snapshot defers to the live BLOCKERS.md on main as the single source of truth for current status, and later closures supersede snapshot lines without being back-edited. An inventory is a photograph, not a mirror.

One gap this corpus observed: sources on "CI evidence" as a product category are mostly vendor marketing (for example https://beefed.ai/en/automated-evidence-collection-devops, weight 0.13, weak), which is itself a reminder that vendor claims about evidence tooling need the same scrutiny as any other claim.
