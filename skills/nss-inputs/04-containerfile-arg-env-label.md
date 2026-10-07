# 04: Containerfile inputs: ARG, ENV, LABEL, and BuildKit secret mounts

Scope: how a Containerfile's input surface maps onto the seven-channel taxonomy: ARG as the build-time CLI channel, ENV as image-level runtime config, LABEL as metadata rather than input, and BuildKit secret mounts as the only safe secret channel.

Grounded in the source doc `yubi-OS/yubiOS skills/nss-inputs/SKILL.md` plus the searXNG dig (digs/04-containerfile-arg-env-label.json). Dig sources: Docker official docs.

## ARG is a build-time parameter

The source doc: `ARG name` is a build-time parameter, supplied via `docker build --build-arg name=...`, and is to be used only for selecting versions or build behavior, never for runtime config or secrets, because build args are visible in image history. The Docker reference (weight 0.96) documents ARG as in-scope for the build stage only, and Docker's Build variables page (weight 0.93) covers the same distinction between predeclared and user-defined ARGs. The anti-pattern "ENV that should be ARG" cuts the other way: a value that affects only the build, such as `BASE_IMAGE_TAG`, belongs in ARG; putting it in ENV makes it persist in the image and ship to every consumer.

## ENV is image-level runtime configuration

`ENV name=val` persists in the image and is available to every process created from it. The source doc restricts it to safe runtime defaults or values that are intentionally image-level configuration. The runtime-surface distinction matters for the anti-pattern "ARG that should be ENV": a value the running process needs, such as `YUBIOS_RELEASE`, is unavailable at runtime if declared only as ARG. The Dockerfile reference (weight 0.96) and Docker's build overview (weight 0.95) both document that ENV values set at build time carry into the runtime environment of derived containers.

## LABEL is metadata, not an input contract

The source doc: LABEL is image metadata, not an application input contract. The yubiOS pattern labels every derived image with the originating commit SHA and the build timestamp, treating those labels as the build-time provenance record. Docker's DHI provenance documentation (weight 0.79) describes provenance attestations for images in the same spirit; the dig also collected third-party label guides (weights 0.13 to 0.23, weak backing) which repeat the syntax but were recorded as low-weight secondary material.

## Secrets never in ARG or ENV

The source doc's secret doctrine: use BuildKit secret/SSH mounts (`--mount=type=secret,id=foo`), never `ARG SECRET` or `ENV SECRET`, both of which leak into image/build history. Docker's official Build secrets documentation (weight 0.94) states the same: secrets passed as build args or ENV are exposed in the image history and in `docker inspect` output, and BuildKit mounts the secret as a file that is not persisted in the image. The dig's third-party posts on the same topic (weights 0.14 to 0.17, weak backing) agree but are recorded low-weight.

## The yubiOS example, decoded

The source doc's Example 1 declares a complete Containerfile input surface: build args `BASE_IMAGE_TAG` (default 45) and `ENABLE_SYSEXT` (default 0); runtime env `YUBIOS_RELEASE` and `YUBIOS_IMAGE_TAG` as image labels; files `mkosi.conf` (read by mkosi at build) and `rpms/*.rpm` (bind-mounted at /tmp/rpms during build); secrets: none, with the CI explicitly not requiring build-time secret injection; prerequisites podman >= 5.0, buildah, and the yubiOS signing key in /etc/pki/yubios. Precedence: `--build-arg` > ENV in this file > built-in default. Validation: mkosi.conf schema validated at build start, with `BASE_IMAGE_TAG` required to be an exact quay.io digest, no tag-only references. Failure: the build aborts naming the offending argument and the constraint that failed. This is the template for a cycle-9 Inputs patch on a Containerfile: one `# Inputs` comment block, seven-channel aware, with every field from doc 02 present.

## Build-time vs runtime as the audit line

Guideline 5 of the source doc: mixing ARG and ENV is the source of "my env var is not there at runtime" bugs. The audit red flag is symmetric: an ENV that should be ARG (a build-only value shipping to every consumer) and an ARG that should be ENV (a runtime value unavailable at runtime) are both listed anti-patterns. Doc 09's verification check 3 extends the secret half: if the file documents a secret, the declaration must reference `--mount=type=secret`, systemd `EnvironmentFile=`, or Kubernetes `Secret`, never a raw ENV or ARG.
