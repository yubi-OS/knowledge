# Ecosystem: SLSA provenance, Docker Scout, compliance

Scope: how build policies sit in the wider supply-chain stack: SLSA provenance attestations as policy input, Docker Scout as the post-build complement, and the SOC 2 / ISO 27001 compliance framing.

## SLSA provenance as a policy input

The integration point between build policies and provenance is the `input.image` attestation surface: `input.image.hasProvenance` plus `input.image.provenance.*` (source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md; `hasProvenance` documented at https://docs.docker.com/build/policies/inputs/, weight 0.93).

Provenance attestations themselves follow the SLSA provenance schema, version 0.2 by default. You can optionally enable SLSA Provenance v1 using the version parameter, and BuildKit populates the provenance fields from the build itself (https://docs.docker.com/build/metadata/attestations/slsa-provenance/, weight 0.96). A provenance attestation is created by passing the `--attest type=provenance` option to `docker buildx build`, or through `--provenance` in build-push flows (https://heisiwu.net/build/metadata/attestations/slsa-provenance/, weight 0.13, weak backing; the attestations overview at https://docs.docker.com/build/metadata/attestations/, weight 0.93).

The distinction that matters for policy design: attestations are opt-in output metadata about a build, while policies are pre-build gates over inputs. A policy can only require provenance of a base image if the producer of that image emitted attestations in the first place. An ecosystem example of generating them outside Docker: the Jenkins SLSA Provenance Attestation plugin provides a post-build action that generates provenance attestations for builds (https://plugins.jenkins.io/slsa, weight 0.77).

## SBOM attestations versus the missing hasSBOM field

Build attestations come in two types, SBOM and provenance, added to an image with the `--provenance` and `--sbom` options (https://docs.docker.com/build/metadata/attestations/, weight 0.93; weak-weight detail at https://liudonghua123.github.io/docker-docs/build/metadata/attestations/, weight 0.11). The policy-side asymmetry: `hasProvenance` is a documented `input.image` field, but there is no documented `hasSBOM` boolean, so SBOM presence in a policy must be checked through `signatures` and attestation metadata rather than a dedicated field (source doc; field list at https://docs.docker.com/build/policies/inputs/, weight 0.93).

## Docker Scout as the post-build complement

Docker Scout Policy Evaluation lets you define supply chain rules for your artifacts and evaluate image compliance using the `docker scout policy` command (https://docs.docker.com/scout/policy.md, weight 0.15, weak backing; the official Policy Evaluation page at https://docs.docker.com/scout/policy/, weight 0.80). Scout itself is a security tool that analyzes container images to identify vulnerabilities, outdated packages, and potential compliance issues, integrating with Docker Desktop and Docker Hub (https://www.docker.com/products/docker-scout/, weight 0.37, weak backing).

The yubiOS note positions the two correctly: Docker Scout provides post-build CVE monitoring that complements policy-at-build-time (source doc). The build policy decides what may enter a build; Scout evaluates what was produced. Neither substitutes for the other.

The Docker engineering narrative ties the two products together explicitly: Docker Hardened Images and Scout form the container-domain foundation for provenance, transparency, and continuous review (https://www.docker.com/blog/why-i-joined-docker-security-at-the-center-of-the-software-supply-chain, weight 0.66).

## Compliance framing

The yubiOS note asserts that policies satisfy SOC 2 and ISO 27001 supply-chain requirements (source doc, session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md). Treat this as framing rather than certification: what the feature gives you is an enforceable, auditable control point (deny-by-default Rego rules over build inputs) and reproducible build inputs (digest-pinned, provenance-carrying base images). Mapping that control onto a specific compliance framework's evidence requirements is an auditor exercise, not something the Docker feature itself certifies.

## The stack in one picture

1. Build time, input side: Docker Build Policies deny non-compliant inputs before any layer executes (https://docs.docker.com/build/policies/, weight 0.96).
2. Build time, output side: provenance and SBOM attestations record what was built and how (https://docs.docker.com/build/metadata/attestations/, weight 0.93).
3. Post build: Docker Scout evaluates the produced image against supply-chain rules and CVE posture (https://docs.docker.com/scout/policy/, weight 0.80).
4. Ecosystem wide: SLSA defines the provenance vocabulary that policies and scanners share (https://docs.docker.com/build/metadata/attestations/slsa-provenance/, weight 0.96).

A gate with no attestations downstream is enforcement without evidence; attestations with no gate are evidence without enforcement. yubiOS runs both halves.
