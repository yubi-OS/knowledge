# 03 Image builders: production, dev, installer, fixtures

**Scope:** the four OCI builders in the `ci-builders` group, their Bake wiring, the policy gate every build passes, and the reproducibility and publication discipline. Grounding spine: source doc (yubi-OS/yubiOS docs/CI_MAP.md, https://github.com/yubi-OS/yubiOS/blob/main/docs/CI_MAP.md).

## The four builders

Three of the four are Bake-driven from `yubiOS-bake.hcl`; the fixtures builder is not a Bake target (source doc):

- `yubiOS-ci.yml` builds the production image with 8 jobs (shellcheck, hadolint, unit-tests, mkosi config validation, build, merge-manifest, verify-attest, legacy ci-callback). It publishes per-arch tags and then a `<sha>`/`latest` multi-arch index.
- `ci_dev_image.yml` builds a TEST-only image with software FIDO2 (swu2f, ADR-026) and publishes `dev-<sha>`/`dev`.
- `ci_mkosi-installer.yml` builds the mkosi disk image with signed-UKI verification, an ARM64 reproducibility proof, and the installer artifact. It publishes `installer[-sha]`.
- `ci_build-test-fixtures.yml` builds and optionally pushes the test-fixture image tags consumed by other workflows. Push is opt-in via inputs (`tag`, default `v1`, immutable by convention; `push` input defaults true on dispatch).

Job shapes from the inventory (source doc): yubiOS-ci 8 jobs, ci_dev_image 4 jobs (build, merge-manifest, verify-attest, ci-callback), ci_mkosi-installer 6 jobs (build, installer-reproducibility, installer-publish, merge-manifest, verify-attest, ci-callback), ci_build-test-fixtures 1 job (build-fixtures, 3 steps).

## Key invariants

The source doc (source doc) states three:

1. **Policy gate.** Every Bake build passes the `yubiOS.rego` OPA policy with `reset=true, strict=true`.
2. **Reproducibility.** Production, dev, and installer each build their subject twice in clean ARM64 jobs and compare canonical bytes. Signed envelopes (installer signatures, QEMU's random TF-A signing envelope, the external-TPL-dependent RK3588 final image) are recorded but excluded from byte equality.
3. **Publication shape.** Prod and dev publish in two stages: per-arch tags through Bake, then the multi-arch index assembled with `imagetools`. Firmware and installer publish directly with the registry exporter from privileged DHI container jobs on user-scoped `hardened` builders (source doc, Canonical Docker Bake Graph section).

## The Bake contract the builders share

The canonical Bake graph defines 4 hidden targets that give every build the same contract (source doc, doc 10): `_policy` (exactly one `yubiOS.rego` with `reset=true, strict=true`), `_source-metadata` (source/revision OCI labels), `_image-export` (Docker output with provenance and manifest-list mode disabled when `PUSH=false`; registry output with both retained when `PUSH=true`), and `_yubios-base` (the pinned production Containerfile build). The design rationale lives in the repo's Bake consolidation note at refs/docker-bake-consolidation-2026-07-17.md (source doc).

The per-workflow mapping from the source doc (source doc):

| Workflow | CI target/group | Explicit publication target |
|---|---|---|
| `yubiOS-ci.yml` | `yubios-ci` (`yubios` + `yubios-smoke`) | `yubios` |
| `ci_dev_image.yml` | `yubios-dev-ci` (`yubios-dev` + `yubios-dev-smoke`) | `yubios-dev` |
| `ci_firmware-rk.yml` | none unless publication requested | `firmware` |
| `ci_mkosi-installer.yml` | DHI-contained mkosi validation + ARM64 comparison | `installer` |
| `ci_test_pq_tls_verify.yml` | `pq-tls-verify` | none (cacheonly) |

## External grounding

The multi-arch index pattern the two-stage publication relies on is standard Docker tooling: `docker buildx imagetools` works with manifest lists in container registries and is the documented tool for inspecting and assembling multi-platform manifests (docs.docker.com, "docker buildx imagetools", https://docs.docker.com/reference/cli/docker/buildx/imagetools/, jev weight 0.34). Docker's own walkthrough of building one image reference from per-arch images pushed to a registry describes the same per-arch-then-index flow at a tutorial level (docker.com blog, "How to Rapidly Build Multi-Architecture Images with Buildx", https://www.docker.com/blog/how-to-rapidly-build-multi-architecture-images-with-buildx/, jev weight 0.55).

On the policy gate: Docker's build-policies feature validates build inputs before a build executes and supports policies in bake files (docs.docker.com, "Using build policies", https://docs.docker.com/build/policies/usage/, jev weight 0.22, weak). OPA itself is the policy engine the Rego language comes from; its deployment docs describe the official OPA images (openpolicyagent.org, https://www.openpolicyagent.org/docs/deploy/docker, jev weight 0.66), though that page covers running an OPA server rather than buildx-integrated policies, so treat it as background on the engine, not on the yubiOS gate. The specifics of `yubiOS.rego` are internal to the repo and documented in the org's own skills and ADRs, not here (source doc).

## Composes with

The builders consume the digests that `fetch-*` workflows pin into `PINNED.md` (source doc), and their outputs are the images the pre-image test chain and VM e2e lane consume (source doc, docs 05 and 06). The fixtures builder's tags are consumed by other workflows, which is why its push is deliberately opt-in and immutable-by-convention (source doc).

## Why byte-equality reproducibility matters for an OS image lane

The reproducibility invariant is stated operationally in the source doc (source doc): each subject is built twice in clean ARM64 jobs and the canonical bytes are compared, with signed envelopes explicitly excluded from equality because they embed signatures or randomness (QEMU's TF-A signing envelope, the RK3588 external TPL). This turns "the image we publish is the image we tested" from an assumption into a checked equality, and it is why the signed-envelope exclusions are recorded rather than hidden.
