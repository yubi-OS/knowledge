# slsa-github-generator: the container and generic reusable workflows

Scope: the two reusable workflows that generate SLSA Build L3 provenance on GitHub Actions, how each takes its subject, the upstream direction-of-travel toward artifact attestations, and the pinning discipline version upgrades require.

## What the repository provides

The slsa-framework/slsa-github-generator repository contains free tools to generate and verify SLSA Build Level 3 provenance for native GitHub projects using GitHub Actions. Developers build software through a secure process that protects against supply chain attacks and tampering, and users verify a tamper-proof statement of how the software was created. Source: https://github.com/slsa-framework/slsa-github-generator (weight 0.94, primary).

## The container generator

The Container Generator's reusable workflow helps a project achieve SLSA level 3 by automatically generating provenance from existing GitHub Actions workflows that produce images; provenance builds trust by letting users verify images come from the expected source repositories. Source: https://slsa.dev/blog/2023/02/slsa-github-workflows-container-ga (weight 0.83, primary announcement).

Third-party documentation describes generator_container_slsa3.yml as a reusable GitHub Actions workflow that generates SLSA Build Level 3 provenance attestations for pre-built OCI container images. Source: https://deepwiki.com/slsa-framework/slsa-github-generator/3.2-container-generator (weight 0.12, weak backing). The weak rating matters: the "pre-built image" reading of the container generator matches the generic generator's model, so treat the exact input semantics (image plus digest versus pre-built artifacts) against the repo's own docs (0.94, 0.83).

## The generic generator

The generic generator is the language-agnostic path. Its general availability was announced in August 2022 alongside the earlier Go builder work. Source: https://slsa.dev/blog/2022/08/slsa-github-workflows-generic-ga (weight 0.96, primary announcement). The generic builder README lives at https://github.com/slsa-framework/slsa-github-generator/blob/main/internal/builders/generic/README.md (weight 0.91, primary).

Third-party docs describe the generic generator as creating SLSA Build Level 3 provenance attestations for pre-built artifacts without performing the build itself, designed for projects with existing build processes that add provenance generation as a separate step. Source: https://deepwiki.com/slsa-framework/slsa-github-generator/3.1-generic-generator (weight 0.13, weak backing). This matches the integration pattern where a workflow builds artifacts first, then hands base64-encoded subjects to the reusable workflow.

## The direction of travel: GitHub artifact attestations

A pitfall for new integrations: the container builder's own README says that for new integrations they suggest GitHub artifact attestations, and points to the repository README for details; the document itself explains adding a step to call a reusable workflow to generate generic SLSA provenance for container images. Source: https://github.com/slsa-framework/slsa-github-generator/blob/main/internal/builders/container/README.md (weight 0.81, primary).

Corroborating that direction, a hands-on lab generates provenance using GitHub's native actions/attest-build-provenance and verifies with slsa-verifier, cosign, and gh attestation verify, with deployment-time enforcement via a Kubernetes admission policy. Source: https://secure-pipelines.com/ci-cd-security/lab-generating-verifying-slsa-provenance-container-images/ (weight 0.55).

## Bring your own builder

The BYOB (Bring Your Own Builder) framework provides GitHub Actions and workflows that help builder authors generate provenance: given an existing GitHub Action, it can generate provenance showing the action ran on some input and produced some output, without having to trust the calling workflow. Source: https://slsa.dev/blog/2023/08/bring-your-own-builder-github (weight 0.93, primary). This is the path for a project that wants L3-style provenance from a custom builder rather than the two stock generators.

## Pinning and upgrade discipline

The generator's migration guides cover step-by-step upgrade instructions between versions, including breaking changes, deprecated features, and required configuration updates. Source: https://deepwiki.com/slsa-framework/slsa-github-generator/13-migration-guides (weight 0.13, weak backing). The pinning consequence: a workflow pinned to a specific generator tag produces a specific builder identity in the provenance, and the verifier side must be updated in lockstep when the pin moves. Check the migration guide on every bump instead of assuming backward compatibility.
