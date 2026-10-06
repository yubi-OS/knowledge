# docker/github-builder: the reusable bake workflow

Scope: the official `docker/github-builder` reusable workflow that wraps bake: its `bake.yml` job shape, key inputs and outputs, the `registry-auths` secret channel, and the four advantages the source doc lists over bare `bake-action`. Grounded in the source doc `yubi-OS/yubiOS skills/docker-bake-action/SKILL.md` plus weighted dig results.

## What it is

`docker/github-builder` is an official Docker-maintained reusable workflow that wraps `bake-action` with trusted isolation, native multi-platform distribution, and signed SLSA provenance. The source doc states the preference rule directly: "Prefer it over bare `bake-action` when pushing to a registry" (source doc, github-builder section). The repository itself is described on GitHub as the official Docker-maintained reusable workflow (https://github.com/docker/github-builder, jev weight 0.58 and 0.57 across two dig queries, plus 0.92 for Docker's bake-with-github-builder documentation page at https://docs.docker.com/build/ci/github-actions/github-builder/bake/).

## The source doc usage shape

```yaml
jobs:
  bake:
    uses: docker/github-builder/.github/workflows/bake.yml@v1
    permissions:
      contents: read
      id-token: write   # SLSA provenance signing
    with:
      output: image
      push: ${{ github.event_name != 'pull_request' }}
      meta-images: quay.io/yubi-os/yubios
      meta-tags: |
        type=ref,event=branch
        type=ref,event=pr
        type=semver,pattern={{version}}
        type=sha,format=long
      cache: true
      cache-mode: max
      sbom: true
    secrets:
      registry-auths: |
        - registry: quay.io
          username: ${{ vars.QUAY_USERNAME }}
          password: ${{ secrets.QUAY_TOKEN }}
```

(source doc, Usage). Note the two structural differences from a bare bake step: `permissions.id-token: write` is required so the workflow can mint the OIDC token that signs provenance (source doc comment), and registry credentials flow through the `registry-auths` secret as a structured list of `{registry, username, password}` entries rather than generic environment variables (source doc).

## Key inputs (source doc table)

| Input | Default | Description |
|---|---|---|
| `target` | `default` | Bake target to build |
| `files` | `docker-bake.hcl` | Bake definition files |
| `distribute` | `true` | Distribute across native runners per platform (no QEMU) |
| `runner` | See mapping | Platform to runner mapping |
| `cache` | `false` | Enable GHA cache backend |
| `cache-mode` | `min` | `min` or `max` |
| `set` | none | Override bake target properties; supports `{{meta.version}}` templates |
| `sbom` | `false` | SBOM attestation |
| `sign` | `auto` | Sign provenance when pushing |
| `meta-images` | none | Image names for metadata-action |
| `meta-tags` | none | Tag rules for metadata-action |

(source doc, bake.yml key inputs). The metadata integration is built in (see doc 04): `meta-images` and `meta-tags` replace the manual metadata-action + bake-file plumbing. The `{{meta.version}}` template in `set` is the escape hatch for injecting derived metadata into build args: `*.args.VERSION={{meta.version}}` (source doc, Metadata templates in set).

## Outputs

| Output | Description |
|---|---|
| `digest` | Image digest (sha256:...) |
| `meta-json` | Full metadata-action JSON |
| `cosign-verify-commands` | Commands to verify signed attestations |
| `signed` | Whether provenance was signed |

(source doc, Outputs). The `cosign-verify-commands` output is the verification hook: downstream jobs or humans can run the emitted commands to check that the pushed image carries valid signed attestations (source doc; see doc 08 for the attestation model).

## The four advantages (source doc)

The source doc lists the advantages explicitly:

1. **Native parallelization**: one runner per platform, no emulation (source doc; detailed in doc 07).
2. **Trusted isolation**: build steps pre-defined by Docker org, cannot be tampered with by the repo workflow (source doc). This is a supply-chain property: the build logic lives in a Docker-owned reusable workflow, so a malicious change to a repo's own build steps cannot alter the trusted build path.
3. **Automatic SLSA signing**: the GitHub OIDC token binds provenance to the commit and workflow identity (source doc). This is the mechanism behind `permissions.id-token: write` and the `sign: auto` default.
4. **Centralized config**: no per-repo buildx/driver setup needed (source doc). The workflow owns `setup-buildx-action` internally.

Docker's documentation page for baking with github-builder corroborates the workflow usage and input surface (https://docs.docker.com/build/ci/github-actions/github-builder/bake/, jev weight 0.94), and the workflow file itself is inspectable in the repo at `.github/workflows/bake.yml` (https://github.com/docker/github-builder/blob/main/.github/workflows/bake.yml, jev weight 0.67).

## When to stay on bare bake-action

The source doc's preference is scoped to registry pushes (source doc). For builds that do not push (PR smoke builds, local testing workflows), bare `bake-action` with `push: false` remains the simpler shape (source doc, action reference). The four advantages mostly concern push-time properties: signing, attestation, and registry auth all matter at push, not before.

## Recommendation for yubiOS

The source doc's yubiOS note and the org's existing bake file target `quay.io/yubi-os/...` registries (source doc, Example bake file). Any yubiOS pipeline that pushes image variants to quay.io should route through `docker/github-builder/.github/workflows/bake.yml@v1` with `id-token: write`, `registry-auths` for quay, `cache-mode: max`, and `sbom: true` (source doc usage example verbatim). Pipelines that only build locally can stay on bare `bake-action@v5` (source doc).

Primary sources: source doc (`yubi-OS/yubiOS skills/docker-bake-action/SKILL.md`); https://docs.docker.com/build/ci/github-actions/github-builder/bake/ (0.92); https://github.com/docker/github-builder/blob/main/.github/workflows/bake.yml (0.67); https://github.com/docker/github-builder (0.58, 0.57).
