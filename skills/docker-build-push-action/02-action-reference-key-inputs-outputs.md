# 02 - Action reference: key inputs and outputs

Scope: the complete input and output contract of docker/build-push-action@v6 as recorded in the source doc, with dig-backed notes on output behavior.

## Inputs (source doc table, v6)

The ground source (`yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md`, Key inputs section) records these defaults:

| Input | Default | Notes |
|---|---|---|
| `context` | `.` | Build context path or URL |
| `file` | `Dockerfile` | Path to Dockerfile/Containerfile |
| `push` | `false` | Push after build |
| `load` | `false` | Load into local Docker; mutually exclusive with push for multi-platform |
| `platforms` | native | Comma-separated platform list |
| `tags` | none | Newline or comma separated |
| `labels` | none | OCI label annotations |
| `build-args` | none | `KEY=VALUE` build arguments |
| `secrets` | none | `id=mysecret,src=/path/to/secret` |
| `cache-from` | none | `type=gha` / `type=registry,ref=...` / `type=s3,...` |
| `cache-to` | none | Same options; `mode=max` caches all layers |
| `provenance` | `true` | SLSA provenance attestation (`mode=max` for L3) |
| `sbom` | `false` | SBOM attestation |
| `no-cache` | `false` | Disable all cache |

Three of these carry the most operational weight. First, `push` defaults to false, so a workflow that forgets it builds locally and pushes nothing; the source doc's yubiOS pattern gates push on the branch expression `push: ${{ github.ref == 'refs/heads/main' }}`. Second, `provenance` defaults to true, meaning attestations are on unless deliberately disabled; the source doc's L3 pattern sets `provenance: mode=max` explicitly. Third, `cache-from` and `cache-to` are string-typed backend selectors, not booleans; doc 03 covers their grammar.

The `secrets` input deserves one more line: secrets reach the build as `id=mysecret,src=/path/to/secret` entries and are consumed inside the Dockerfile via the `--mount=type=secret` build mount, never baked into layers (source doc, Key inputs).

## Outputs (source doc table)

| Output | Description |
|---|---|
| `digest` | Content-addressable digest `sha256:...`, use for pinning |
| `metadata` | JSON build metadata |
| `imageid` | Image ID |

The digest output is the one the supply chain depends on: the source doc's Notes state "the digest output is what to pin in `FROM` lines (yubiOS.rego policy requires this)", and doc 06 develops that fully.

The action repository README is the primary reference for this contract (weight 0.97, https://github.com/docker/build-push-action, appearing at rank 1 in both weighting queries for this subtopic). The Marketplace entry mirrors the same contract (weight 0.4, weak, https://github.com/marketplace/actions/build-and-push-docker-images).

## Output behavior caveat from the wild

An issue in the action repository titled "outputs.digest and outputs.imageid not showing anything" reports that the digest and imageid outputs can appear empty in some configurations (weight 0.67, https://github.com/docker/build-push-action/issues/596). The issue is real, scored above the 0.5 threshold, and its title alone is what this corpus cites: operators who consume `steps.build.outputs.digest` in a later step should verify the outputs are populated in their specific configuration before wiring downstream pinning, rather than assuming they are always set. The source doc does not document any output emptiness condition, so no cause is asserted here; do not contradict the source doc on this point.

## Third-party reference material

DeepWiki maintains an auto-generated configuration reference for the action (weight 0.12, https://deepwiki.com/docker/build-push-action/3-configuration-reference), plus separate input-parameters and output-variables pages (weights 0.11 and 0.09, https://deepwiki.com/docker/build-push-action/3.1-input-parameters and https://deepwiki.com/docker/build-push-action/3.2-output-variables). All three scored below the 0.5 threshold and are listed here only as pointers, not as backing for claims. A Gitea mirror of the README scored 0.3 (weak, https://gitea.psi.ch/docker/build-push-action) and a fork scored 0.22 (weak, https://github.com/RDXWorks-actions/build-push-action-v6); neither is cited for any claim.

## Sources

- Source doc: `yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md` (sections: Key inputs, Outputs, Notes).
- https://github.com/docker/build-push-action (weight 0.97)
- https://github.com/docker/build-push-action/issues/596 (weight 0.67)
- https://github.com/marketplace/actions/build-and-push-docker-images (weight 0.4, weak)
