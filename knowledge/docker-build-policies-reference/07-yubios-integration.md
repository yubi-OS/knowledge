# yubiOS integration: the yubiOS.rego gate

Scope: how yubiOS wires Docker Build Policies into its builds: the single centralized `yubiOS.rego`, the exact pinned CLI invocation, what the policy verifies, and how bake files carry policy config.

## The pinned invocation

The live pin recorded in yubiOS PINNED.md as of the 2026-07-23 refresh is:

```bash
docker buildx build --policy reset=true,strict=true,filename=$REPO.rego .
```

(source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md). Note that the yubiOS AGENTS.md carries a historical example of the same shape; PINNED.md is the current source of truth, not the AGENTS.md example (source doc).

Each flag does one job:

1. `reset=true` disables the Dockerfile-name auto-load so the only policy in force is the named one (source doc).
2. `strict=true` turns a missing or unsupported policy into a hard build failure instead of a silent bypass (source doc; weak-weight corroboration at https://matsuand.github.io/docker.docs-ja/docker.docs-ja/build/policies/usage/, weight 0.11).
3. `filename=$REPO.rego` names the one canonical policy for the repository (source doc).

## What the yubiOS policy verifies

The policy gates FROM images on three properties (source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md):

1. Image comes from the `dhi.io/` registry, enforced by a `startswith(input.image.ref, "dhi.io/")` allow rule. dhi.io is the Docker Hardened Images registry; the official policy templates likewise treat Docker Hardened Images as an approved registry class (https://docs.docker.com/build/policies/examples/, weight 0.95).
2. Image is referenced by digest, enforced via `input.image.isCanonical` so no mutable tag enters a build (source doc; the digest-requirement pattern documented at https://docs.docker.com/build/policies/validate-images/, weight 0.92).
3. Provenance is present, enforced via `input.image.hasProvenance` for supply-chain integrity (source doc).

## Why centralize on one policy file

The yubiOS convention deliberately opts out of the Dockerfile-name auto-load magic. The 2026-07-23 refresh records the reasoning: auto-load-by-Dockerfile-name does not fit a bake-file-driven multi-target build, because a bake file builds many targets across many Dockerfiles and per-Dockerfile auto-loaded policies would fragment one supply-chain rule into per-target rules (source doc). One named policy keeps the gate uniform.

## Build Policy as a pre-build gate

The yubiOS skill doc defines the contract: a Build Policy is an OPA/Rego program BuildKit evaluates before a build runs. It inspects each build input (notably FROM images) and returns an allow/deny decision. On deny, nothing is pulled or built, so the build fails immediately (https://github.com/yubi-OS/yubiOS/blob/main/skills/docker-build-policy/SKILL.md, weight 0.40, weak backing). The same skill is indexed publicly with the `reset=true,strict=true,filename=yubiOS.rego` invocation (https://skillsmp.com/creators/yubi-os/yubios/skills-docker-build-policy, weight 0.09, weak backing).

The deny-side consequence for reproducibility shows up in the yubiOS README's install guidance as well: for reproducible installs, pin the image by the digest produced by the latest green yubiOS-ci.yml publish for the intended release, and do not treat a run-specific digest in an old PR as current (https://yubi-os.github.io/, weight 0.08, weak backing). The policy's `isCanonical` rule is the build-side twin of that discipline.

## Bake integration

For bake-file-driven builds, each bake entry carries the same policy keys as the `--policy` flag: `filename`, `reset`, `disabled`, `strict`, and `log-level`. Bake also automatically loads `Dockerfile.rego` alongside the target Dockerfile when present, which is the auto-load behavior the yubiOS convention overrides per target (https://github.com/docker/buildx/blob/master/docs/bake-reference.md, weight 0.82).

In practice that means a yubiOS bake file can state the gate in-repo (`policy = [["reset=true,strict=true,filename=yubiOS.rego"]]` style entries per target) instead of depending on every CI job remembering the flag, while `strict=true` keeps the failure mode fail-closed either way (source doc).

## Version floor

yubiOS runs Buildx 0.31.0+ where the policies feature is documented, with the official prerequisites being Buildx 0.31.0 or later and BuildKit 0.26.0 or later (per Docker's usage page; the yubiOS refresh note flags a 0.26.0 versus 0.27.0 inconsistency between Docker's own overview and usage pages, either floor being safely under the yubiOS pinned toolchain) (source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md; https://docs.docker.com/build/policies/usage/, weight 0.95).

## Operational checklist

1. Keep one `yubiOS.rego` per repo, package `docker`, deny by default (source doc).
2. Invoke with `reset=true,strict=true,filename=$REPO.rego` or bake-target equivalents (source doc).
3. Test policy edits with `docker buildx policy eval --print` before CI (https://docs.docker.com/build/policies/usage/, weight 0.95).
4. Never rely on `input.image.hasSBOM`; use `signatures` and attestation metadata instead (source doc).
5. Debug failed gates with `--progress=plain --policy log-level=debug` (https://docs.docker.com/build/policies/debugging/, weight 0.92).
