# 08 - SBOM and provenance attestations

Scope: producing SLSA provenance and SBOM attestations with buildx, the driver requirement, and verification via imagetools inspect.

## What attestations are

Build attestations are metadata attached to an image recording what it contains (SBOM) and how it was built (provenance) (https://docs.docker.com/build/metadata/attestations/, weight 0.85). The attestations introduction frames both as supply-chain transparency artifacts: an SBOM lists the software artifacts an image contains and those used to create it (https://docs.docker.com/build/metadata/attestations/sbom/, weight 0.83).

## Creating them

The source doc's creation command requires the docker-container driver:

    docker buildx build --attest type=provenance,mode=max --attest type=sbom --push -t dhi.io/yubi-OS/yubiOS:latest .

The docker-container driver requirement is explicit in the source doc (attestations need a full-featured driver) and on the driver page (https://docs.docker.com/build/builders/drivers/docker-container, weight 0.89). The provenance docs give the exact option form: pass --attest type=provenance to docker buildx build, with mode=max producing the most detailed provenance (https://scriptagc.wasmer.app/https_docs_docker_com/build/metadata/attestations/slsa-provenance/, weight 0.70; this is a proxy mirror of the docker docs provenance page, weight reflects that).

## SLSA provenance support history

Buildx v0.10 introduced support for a minimal SLSA provenance attestation, which requires OCI-compliant multi-platform image support (http://docs.docker.com/build/release-notes/, weight 0.73). That is the floor version for the attestation flow the source doc teaches.

## Verifying

Verification from the source doc:

    docker buildx imagetools inspect dhi.io/yubi-OS/yubiOS:latest --format '{{ json .Provenance }}'

This prints the provenance attestation attached to the pushed image (source doc). The SBOM page describes the same verify pattern for the SBOM side (https://docs.docker.com/build/metadata/attestations/sbom/, weight 0.83).

## Why yubiOS wants this

The source doc's supply-chain story is layered: the rootless daemon provides isolation, Build Policies gate FROM images, and attestations record the result for downstream verification. yubiOS pairs this skill with slsa-provenance and sigstore-rekor-v2 skills for the fuller provenance chain (source doc context in the skill corpus; the skill itself covers the build-time attestation step).

References: source doc at https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/docker-buildx-rootless/SKILL.md; https://docs.docker.com/build/metadata/attestations/ (weight 0.85); https://docs.docker.com/build/metadata/attestations/sbom/ (weight 0.83); http://docs.docker.com/build/release-notes/ (weight 0.73); https://scriptagc.wasmer.app/https_docs_docker_com/build/metadata/attestations/slsa-provenance/ (weight 0.70); https://docs.docker.com/build/builders/drivers/docker-container (weight 0.89).
