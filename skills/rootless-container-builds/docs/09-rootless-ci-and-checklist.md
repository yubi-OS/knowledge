# 09. Rootless CI workflow and the hardening checklist

Scope: the GitHub Actions build-and-sign workflow from the source doc, and the end-to-end hardening checklist that ties docs 01 through 08 together.

## The workflow

The source doc's GitHub Actions workflow runs the whole pipeline in one job. The runner itself is pinned: the job container is `docker://dhi.io/debian-base@sha256:9415967aa0ed8adea8b5c048994259d1982026dca143d0303c7bbe0e11ed67d3`, the same digest the Containerfile pins in doc 08, with registry credentials supplied from the `DOCKER` secret (source doc, yubi-OS/yubiOS skills/rootless-container-builds/SKILL.md). The pinned action checkout SHA, `actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd`, applies the same immutability discipline to the tooling.

Permissions matter for keyless signing. The workflow sets `id-token: write` alongside `contents: read` and `packages: write` (source doc). The id-token permission is what lets the job mint the GitHub OIDC token that keyless cosign consumes; without it the keyless flow in doc 07 cannot run.

The steps mirror the local pipeline of doc 03 exactly:

1. Build with rootless podman, `--no-cache --security-opt no-new-privileges --cap-drop ALL`, tagged with `github.sha` instead of `latest`.
2. Push, then capture the digest with `podman inspect --format '{{.Digest}}'` and write it to `$GITHUB_OUTPUT`.
3. Sign keylessly: `cosign sign dhi.io/yubi-OS/yubiOS@${{ steps.push.outputs.digest }}`.

(source doc). Tagging with the commit SHA rather than latest makes every CI artifact traceable to a source revision, and the digest capture step feeds the signature directly.

## Keyless signing in CI

The sigstore cosign repository documents the model the workflow relies on: keyless signing with the Sigstore public good Fulcio certificate authority and Rekor transparency log is a supported path, alongside key-based signing (https://github.com/sigstore/cosign, jev weight 0.84). In this workflow the OIDC issuer identity binds the signature to the repository's CI rather than to a long-lived key file, which removes key custody from the CI host.

## Credentials and identity in the job

The workflow authenticates to the registry with a `credentials` block on the job container, username `0mniteck42` and the password drawn from the `DOCKER` secret rather than inline (source doc). Keeping the credential in a secret keeps it out of the workflow file and out of logs; the username being visible is normal, since the secret carries the sensitive half. The `packages: write` permission covers pushing the built image to the registry, `contents: read` keeps the repository scope minimal, and `id-token: write` exists solely for the keyless signing step (source doc).

## The hardening checklist

The source doc closes with a nine-item checklist that reads as the deployment gate for the whole skill (source doc):

- User namespaces configured (`/etc/subuid`, `/etc/subgid`) - docs 01 and 02
- fuse-overlayfs configured as storage driver - doc 02
- All `FROM` lines pinned to digests - doc 08
- `Dockerfile.rego` policy enforces `isCanonical` + `hasProvenance` - doc 05
- Images signed with cosign, keyless OIDC in CI - docs 07 and 09
- SBOM attached as cosign attestation - doc 07
- `podman policy.json` enforces sigstore signatures on pull - doc 06
- `--cap-drop ALL`, `no-new-privileges` on all builds - doc 03
- Trivy CVE scan in CI as gate - this checklist item

The checklist is layered by design: items 1 through 3 and 8 are runtime containment (nothing privileged runs), items 4 through 7 are supply-chain attestation (nothing unvetted is consumed or produced), and item 9 adds vulnerability gating on the produced artifact. A build that skips any layer still runs but no longer meets the yubiOS supply-chain bar the checklist defines.

Weak-backing note: the third-party CI hardening articles in the dig set scored low under jev weighting (cubepath.com 0.14, codingprotocols.com 0.15, anhtu.dev 0.16) and are not used as claim sources; the workflow and checklist rest on the source doc, with the cosign mechanics grounded in the sigstore documentation cited above.
