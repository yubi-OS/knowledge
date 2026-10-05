# The policy input object

Scope: what Buildx hands to a policy: `input.local` for local contexts and the full documented `input.image` field list for image inputs, including the fields a policy can rely on and the `hasSBOM` field it cannot.

## Structure depends on the input type

When Buildx evaluates policies, it provides information about build inputs through the `input` object. The structure of `input` depends on the type of resource your Dockerfile references, and build inputs correspond to the sources a Dockerfile can have: images, Git repositories, HTTP downloads, and local contexts (https://docs.docker.com/build/policies/inputs/, weight 0.93; overview at https://docs.docker.com/build/policies/, weight 0.96).

## input.local

Local inputs are typically less restricted than remote inputs, but you can still write policies to enforce constraints on them. A local input carries a `name` field, for example `allow if { input.local.name == "." }` (https://abc.vhrghala.org/p/https/docs.docker.com/build/policies/inputs/, weight 0.05, weak backing; the core `input.local` rule explained at https://docs.docker.com/build/policies/intro/, weight 0.97). The intro doc explains why the rule is near-universal: `allow if input.local` allows local file access, which includes your build context (typically the current directory) and, importantly, the Dockerfile itself (https://docs.docker.com/build/policies/intro/, weight 0.97).

## input.image: the documented field list

The documented `input.image` fields, confirmed against the input reference as of the 2026-07-23 refresh (https://docs.docker.com/build/policies/inputs/, weight 0.93; source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md):

| Field | What it carries |
|---|---|
| `ref` | The full image reference the Dockerfile asked for |
| `host` | The registry hostname; Docker Hub images use `docker.io` |
| `repo` | The repository name |
| `fullRepo` | Host plus repository |
| `tag` | The tag as written |
| `isCanonical` | Whether the image is referenced by digest, not a mutable tag |
| `checksum` | The digest when the reference is canonical |
| `platform` | The requested platform |
| `os` | The operating system of the image |
| `arch` | The architecture of the image |
| `hasProvenance` | Whether provenance attestations are available |
| `labels` | Image labels |
| `env` | Environment variables from image metadata |
| `volumes` | Volumes declared by the image |
| `workingDir` | The working directory of the image |
| `user` | The default user of the image |
| `signatures` | Signature and attestation metadata |

The `host` semantics (registry hostname, `docker.io` for Docker Hub) come from the inputs reference content mirrored at https://abc.vhrghala.org/p/https/docs.docker.com/build/policies/inputs/, weight 0.05, weak backing; verify against the official page before hard-coding a hostname comparison.

## The hasSBOM caveat

The documented field list contains no `input.image.hasSBOM` field (https://docs.docker.com/build/policies/inputs/, weight 0.93; source doc). The prior yubiOS research note used `input.image.hasSBOM` in an example; the 2026-07-23 refresh flags that example as speculative and unconfirmed. Do not rely on it in a real policy. If you need to check SBOM presence, do it through another route: the `signatures` field and attestation metadata are the documented surface for attestation-shaped information, not a dedicated SBOM boolean (source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md).

## Fields the docs pair with validation rules

The validate-images doc walks the two fields that do most of the gating work in practice: digest requirements and attestation checks. Your policy can inspect image metadata, verify attestations, and enforce constraints before the build proceeds, and the simplest pattern is to allowlist specific repositories (https://docs.docker.com/build/policies/validate-images/, weight 0.92). See the policy-rules doc of this corpus for the concrete rule shapes (`startswith(input.image.ref, ...)`, `input.image.isCanonical`, `input.image.hasProvenance`).

## Discovering the real input at build time

The exact JSON a policy receives for a given build is best discovered empirically with `docker buildx policy eval --print`, which prints the input without running a build (https://docs.docker.com/reference/cli/docker/buildx/policy/eval/, weight 0.95; debugging guidance at https://docs.docker.com/build/policies/debugging/, weight 0.92). One known caveat from the debugging page: fields can be missing with `policy eval --print` relative to what a real build resolves, so treat `--print` output as a debugging aid and confirm a field exists in a real build before writing a rule that requires it (https://docs.docker.com/build/policies/debugging/, weight 0.92).
