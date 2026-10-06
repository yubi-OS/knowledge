# SLSA provenance and SBOM attestations from bake builds

Scope: how bake produces build attestations: the `provenance` and `sbom` action inputs from the source doc, the `sign: auto` OIDC-signed provenance path through github-builder, and the verification surface (`cosign-verify-commands`, `signed` outputs). Grounded in the source doc `yubi-OS/yubiOS skills/docker-bake-action/SKILL.md` plus weighted dig results.

## The inputs at the bake level

The source doc's Key inputs table lists two attestation inputs on `bake-action@v5`:

- `provenance`: "SLSA provenance for all targets" (source doc)
- `sbom`: "SBOM attestation for all targets" (source doc)

Both are all-target inputs by design: in a multi-target bake build, one setting covers every variant, consistent with the `*` wildcard override pattern from doc 05 (the source doc's cache snippet includes `*.provenance=mode=max` as the third wildcard property, source doc, Cache override). Docker's GitHub Actions attestations documentation covers generating SBOM and provenance attestations with GitHub Actions builds (https://docs.docker.com/build/ci/github-actions/attestations/, jev weight 0.89 and 0.86 across two dig queries).

What each attestation is, per Docker's attestations documentation: provenance records how the image was built (source inputs, build steps, materials), and an SBOM records what the image contains as a software bill of materials (https://docs.docker.com/build/ci/github-actions/attestations/, 0.89). For yubiOS these map onto the supply-chain posture the org already maintains: the build-policy and SLSA-provenance skills in the yubiOS corpus treat provenance attestation as the gate a build must clear (source doc context: the skill sits beside `slsa-provenance` and `docker-build-policy`).

## The signing layer: sign, OIDC, and github-builder

Bare bake emits attestations; github-builder signs them. The source doc's github-builder section carries the mechanism:

- The job must grant `permissions: id-token: write`, commented in the source doc as "SLSA provenance signing" (source doc, Usage).
- The `sign` input defaults to `auto`: "Sign provenance when pushing" (source doc, bake.yml key inputs).
- The signing binds the provenance to the commit and workflow identity: "Automatic SLSA signing: GitHub OIDC token binds provenance to commit + workflow identity" (source doc, Key advantages).

That OIDC binding is the security-relevant property: the attestation is signed by a token minted by GitHub for that specific workflow run, so the provenance statement is tied to the exact commit and the trusted workflow definition that built it. It composes with the trusted-isolation advantage (build steps pre-defined by the Docker org, source doc): the signer attests to a build whose steps could not have been altered by the repo.

## Verification: the outputs

The source doc's outputs table lists:

| Output | Description |
|---|---|
| `digest` | Image digest (sha256:...) |
| `meta-json` | Full metadata-action JSON |
| `cosign-verify-commands` | Commands to verify signed attestations |
| `signed` | Whether provenance was signed |

(source doc, Outputs). Two of the four are attestation plumbing: `cosign-verify-commands` emits ready-to-run verification commands, and `signed` is the boolean a workflow can assert on before publishing or promoting an image (source doc). Cosign is Sigstore's code signing and transparency tooling (https://github.com/sigstore/cosign, jev weight 0.11, weak backing: below the 0.5 line; the repo identity is uncontroversial but rely on the source doc and Docker docs for behavior). Sigstore's own engineering blog covers cosign verification of artifact attestations (https://blog.sigstore.dev/cosign-verify-bundles/, 0.19, weak backing).

## The yubiOS verification chain

The attestation flow completes the supply-chain story that starts in the bake file and ends at verification:

1. The bake build produces the image and its attestations (`provenance`, `sbom` inputs, source doc).
2. github-builder signs the provenance with the run's OIDC token (`sign: auto` default, `id-token: write` permission, source doc).
3. The workflow or a downstream job runs the emitted `cosign-verify-commands` to verify before use (source doc, Outputs).
4. yubiOS-side, the `audit-evidence-packaging` and `sigstore-rekor-v2` skills extend this into transparency-log anchoring and evidence bundles (source doc context: sibling skills in the yubiOS corpus; the bake skill's contribution is the signed attestation origin).

For the yubiOS bootc images specifically, a signed provenance on the pushed `quay.io/yubi-os/...` images is what lets a consuming pipeline distinguish an org-built image from an unsigned lookalike (source doc example tags; source doc signing advantages).

## Failure modes

1. **Missing `id-token: write`.** Without the permission the OIDC token cannot be minted and signing fails or is skipped; the source doc shows the permission as part of the canonical usage (source doc).
2. **Attesting without pushing.** `sign` signs "when pushing" (source doc); a build that only loads locally produces unsigned artifacts, which is fine for smoke builds but must not be mistaken for a publishable attestation.
3. **Per-target drift.** Setting provenance or sbom per target instead of via the wildcard invites one variant shipping without attestations; the source doc's own snippet uses `*.provenance=mode=max` for exactly this reason (source doc, Cache override).
4. **Trusting `signed` without running the verify commands.** The `signed` output is the workflow's own claim; the `cosign-verify-commands` output exists to check it cryptographically (source doc, Outputs).

## Summary

Bake-level `provenance` and `sbom` inputs produce attestations for all targets in one setting (source doc); github-builder signs provenance automatically with an OIDC token bound to the commit and workflow (source doc), and emits the digest, the signed flag, and ready-made cosign verification commands (source doc). Docker's attestations documentation grounds the attestation model (https://docs.docker.com/build/ci/github-actions/attestations/, 0.89); the sigstore sources are weak-weighted context for the verification tooling (0.19, 0.11).

Primary sources: source doc (`yubi-OS/yubiOS skills/docker-bake-action/SKILL.md`); https://docs.docker.com/build/ci/github-actions/attestations/ (0.89, 0.86). Weak backing (< 0.5): https://blog.sigstore.dev/cosign-verify-bundles/ (0.19); https://github.com/sigstore/cosign (0.11).
