# 02 - GitHub Actions Provenance Generation with slsa-github-generator

Scope: how yubiOS generates SLSA Build L3 provenance for container images and generic binaries using the slsa-framework/slsa-github-generator reusable workflows, including the runner isolation that makes the result L3 and the exact wiring the source doc prescribes.

Ground spine: yubi-OS/yubiOS skills/slsa-provenance/SKILL.md (source doc).

## What the project provides

The slsa-framework/slsa-github-generator repository contains "free tools to generate and verify SLSA Build Level 3 provenance for native GitHub projects using GitHub Actions," letting developers build software through a secure process that protects against supply chain attacks and tampering [https://github.com/slsa-framework/slsa-github-generator, jev 0.82, cited again at 0.83 for the container question]. Users of the software can then verify a tamper-proof statement of the build process [https://github.com/slsa-framework/slsa-github-generator, jev 0.83].

The source doc's mechanism claim is the core of this doc: the reusable workflows run in isolated GitHub-hosted runners, and that isolation is what makes the provenance L3 rather than merely L2 (source doc). A tenant project cannot tamper with the environment that produced the attestation, which is exactly the L3 requirement in doc 01.

## Container image provenance

The container generator went GA in February 2023 starting with v1.4.0; the announcement says the tool "allows any GitHub project to produce SLSA level 3 compliant provenance statements so users can verify the origin of container images they use," extending provenance generation beyond file artifacts to container images [https://slsa.dev/blog/2023/02/slsa-github-workflows-container-ga, jev 0.76].

The source doc wires it into `.github/workflows/release.yml` as a reusable `uses:` call pinned to `@v2.1.0`, with three permissions on the calling job: `id-token: write`, `contents: read`, and `packages: write`. The workflow takes `image` and `digest` inputs, with the digest produced by a separate build job (`${{ needs.build.outputs.digest }}`), and registry credentials passed through the `secrets:` block (`registry-username` from `github.actor`, `registry-password` from `secrets.GITHUB_TOKEN`). All of this is the source doc's own prescribed pattern for `generator_container_slsa3.yml`; the corpus does not alter it.

A third-party reference compendium describes the reusable workflows as "the primary user-facing entry points for generating SLSA provenance and building artifacts with provenance generation" [https://deepwiki.com/slsa-framework/slsa-github-generator/7.1-reusable-workflows-reference, jev 0.30, weak]. The container generator is a reusable GitHub Actions workflow that generates SLSA Build Level 3 provenance attestations for pre-built OCI container images [https://deepwiki.com/slsa-framework/slsa-github-generator/3.2-container-generator, jev 0.11, weak]. Both are consistent with the primary sources above.

## Generic binary provenance

For artifacts with no language-specific builder, the generic workflow is the path. The project's own generic-builder README explains that "projects for which there is no language or ecosystem specific builder available" add a step to their existing workflow that calls a reusable workflow to generate generic SLSA provenance [https://github.com/slsa-framework/slsa-github-generator/blob/main/internal/builders/generic/README.md, jev 0.78]. The generic generator was announced GA in August 2022, letting OSS projects "build artifacts using their own custom GitHub Actions workflows that support seamless provenance generation" [https://slsa.dev/blog/2022/08/slsa-github-workflows-generic-ga, jev 0.73].

The source doc wires `generator_generic_slsa3.yml` the same way: pinned `@v2.1.0`, `id-token: write` and `contents: read` permissions, and `base64-subjects: ${{ needs.build.outputs.hashes }}`. The build job produces that hashes value with:

```bash
sha256sum artifact.uki artifact.img | base64 -w0
```

(source doc). This is the pattern yubiOS uses for UKI binaries and OCI artifacts, per the checklist in doc 08.

## BYOB: the escape hatch for custom builders

When a project owns its own GitHub Action and wants provenance showing the action ran on some input and produced some output, the BYOB (bring your own builder) framework provides GitHub Actions and workflows for builder authors, so they can generate provenance "without having to trust the Workflow that called your Action" [https://slsa.dev/blog/2023/08/bring-your-own-builder-github, jev 0.77, and 0.75 on the container-question pass]. This is the documented route if yubiOS ever outgrows the two stock generators; it is not currently used (source doc checklist names only the two stock workflows).

## Notes for pipeline auditing

- The digest, not a tag, is the subject identity for container provenance (source doc passes `digest` explicitly).
- `id-token: write` is the permission that makes OIDC-based signing possible; both workflows require it (source doc).
- Verification of what these workflows produce is covered in docs 04 and 05.
- A hands-on tutorial comparing the generator with GitHub's native `actions/attest-build-provenance` exists [https://secure-pipelines.com/ci-cd-security/lab-generating-verifying-slsa-provenance-container-images/, jev 0.16, weak]; treat it as orientation only, since the native attestations action is a different mechanism from the isolated-runner L3 guarantee described here.
