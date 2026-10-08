# rootless-container-builds knowledge corpus

Ground source: yubi-OS/yubiOS skills/rootless-container-builds/SKILL.md. The corpus explicates the skill: rootless container builds with Docker Buildx (yubiOS primary per ADR-014) and podman/buildah, supply-chain hardening via OPA/Rego Build Policies, cosign signing, and pinned digests.

## Docs

- [`01-rootless-security-model.md`](docs/01-rootless-security-model.md) - Rootless security model: user-namespace UID mapping and the root-daemon threat model.
- [`02-rootless-podman-setup.md`](docs/02-rootless-podman-setup.md) - Rootless podman setup: subuid/subgid, fuse-overlayfs storage.conf, verification.
- [`03-rootless-builds-podman-buildah.md`](docs/03-rootless-builds-podman-buildah.md) - Building images with rootless podman and buildah: hardened flags, push, digest capture.
- [`04-rootless-buildkit-buildx.md`](docs/04-rootless-buildkit-buildx.md) - Rootless Docker BuildKit and Buildx: kernel prerequisites, rootless buildkitd, ADR-014.
- [`05-opa-rego-build-policies.md`](docs/05-opa-rego-build-policies.md) - Build Policies: OPA/Rego schema for buildx --policy, allow rules, flags, debugging.
- [`06-podman-policy-json.md`](docs/06-podman-policy-json.md) - Podman policy.json pull-time enforcement: reject-by-default, sigstoreSigned, signedIdentity.
- [`07-cosign-signing-attestation.md`](docs/07-cosign-signing-attestation.md) - Cosign signing and verification: key pair, keyless OIDC, SBOM attestation, verify.
- [`08-pinned-base-digests.md`](docs/08-pinned-base-digests.md) - Pinned base images by digest: rationale, digest retrieval, pinning in two places.
- [`09-rootless-ci-and-checklist.md`](docs/09-rootless-ci-and-checklist.md) - Rootless GitHub Actions build-and-sign workflow and the nine-item hardening checklist.

## Research summary

- Results collected: 98 (deduplicated across 2 seed queries per subtopic)
- Weight split: 40 high (>= 0.5) / 58 low (< 0.5) of 98
- Jev requests: 10 (1 score outline validation + 9 noul weighting batches), usage 10966 input / 2037 output tokens, via DefAPI direct (typesafe/jev-1.13)
- Redo counts: 0 (all digs returned results on first attempt; no dig redos, no decision-model retries)
- Skipped docs: none (all 9 subtopics validated load-bearing and authored)

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide via DefAPI direct 200.

## Research DB

Schema v2 under `research-db/`: preflight.json, outline.json, archive.json (one entry per collected result with jev noul weight and raw decision record), digs/<NN>-<slug>.json, jev-log.json, and db.ts (TypeScript interfaces). Per-result usage tokens are batch-level and recorded in jev-log.json.
