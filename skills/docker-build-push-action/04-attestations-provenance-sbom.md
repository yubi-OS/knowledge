# 04 - Attestations: SLSA provenance and SBOM

Scope: how build-push-action emits provenance and SBOM attestations, the mode=max / SLSA Build L3 relationship, and the id-token: write permission requirement.

## What the source doc records

The ground source (`yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md`) carries three attestation facts:

1. `provenance` defaults to `true`; setting `provenance: mode=max` generates SLSA Build L3 provenance and "requires `id-token: write` permission" (Key inputs table and Notes section).
2. `sbom` defaults to `false` and emits an SBOM attestation when set true.
3. The full workflow example and the yubiOS bootc pattern both reserve `id-token: write` in the job permissions block specifically "required for provenance/SBOM attestations".

The yubiOS production pattern is `provenance: mode=max` plus `sbom: true`, with the job permissions block carrying `contents: read`, `packages: write`, and `id-token: write` (source doc, Full workflow example). Doc 07 covers how the reusable workflow automates the signing side of this.

## How attestations travel

Attestations are attached to the pushed image and retrieved with the registry; Docker's documentation set covers them at three levels the dig surfaced:

- "Build attestations" is the overview page (weight 0.65, https://docs.docker.com/build/metadata/attestations/).
- "Provenance attestations" documents the SLSA provenance type specifically (weight 0.65 and 0.69, https://docs.docker.com/build/metadata/attestations/slsa-provenance/).
- "Add SBOM and provenance attestations with GitHub Actions" is the CI-focused how-to that pairs with build-push-action directly (weight 0.81, https://docs.docker.com/build/ci/github-actions/attestations/). This is the same URL the source doc lists in its own Source section, so the source doc and the dig agree on the canonical how-to.

## SLSA context

The SLSA Build L3 target referenced by `provenance: mode=max` sits inside the SLSA framework's build track; SLSA v1.0 tops the Build track at L3. The slsa.dev blog post "Build your own SLSA 3+ provenance builder on GitHub Actions" scored 0.31, below the 0.5 threshold, so its specific claims are not used here; it is noted only as evidence that the SLSA ecosystem documents alternate provenance-generation paths outside build-push-action (https://slsa.dev/blog/2023/08/bring-your-own-builder-github).

Two GitHub Actions alternatives to buildx-native attestations appeared in the dig: actions/attest-build-provenance, "Action for generating build provenance", scored 0.19 in both appearances (weak, https://github.com/actions/attest-build-provenance), and slsa-framework/slsa-github-generator scored 0.09 (weak, https://github.com/slsa-framework/slsa-github-generator). Neither is cited for any claim; they are listed to show the ecosystem has parallel generators, which matters when a team audits provenance sources.

## Verification note

The source doc does not describe how to verify the attestations build-push-action produces; it records only their generation. The sibling yubiOS skills `slsa-provenance` and `sigstore-rekor-v2` own verification (cosign, Rekor v2) and are the routed surfaces for that half of the lifecycle. Per the source doc's Guidelines, anything beyond this skill's frontmatter scope is a different skill's job (source doc).

## One drift point

The dig returned a DeepWiki auto-generated "Build Attestations" page for the action repository (weight 0.1, weak, https://deepwiki.com/docker/build-push-action/4.4-build-attestations). Not used as backing. Where the dig world and the source doc differ in emphasis, the source doc wins: it treats provenance as default-on, which is the behavior operators should assume when writing workflows without an explicit `provenance:` line.

## Sources

- Source doc: `yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md` (sections: Key inputs, Full workflow example, Notes, Source).
- https://docs.docker.com/build/metadata/attestations/slsa-provenance/ (weight 0.65 and 0.69)
- https://docs.docker.com/build/ci/github-actions/attestations/ (weight 0.81)
- https://docs.docker.com/build/metadata/attestations/ (weight 0.65)
- https://github.com/docker/build-push-action (weight 0.97)
