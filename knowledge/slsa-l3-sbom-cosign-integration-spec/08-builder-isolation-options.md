# Builder isolation options for SLSA Build L3

Scope: the isolation bar L3 sets, the three builder paths that can meet it (GitHub-hosted ephemeral, hardened self-hosted, TEE-backed confidential containers), and what each path costs in audit burden and operations.

## The bar: isolation strength is what L3 measures

The SLSA Build level describes the minimum bar for isolation strength, and the spec points implementers to the Verifying build platforms material for assessing a build platform's isolation. Source: https://slsa.dev/spec/v1.0/requirements (weight 0.78, primary).

The detailed technical requirements for producing artifacts at each SLSA level are written for platform implementers and security engineers, and are published both on the spec site and in the spec repository. Sources: https://slsa.dev/spec/v1.2/build-requirements (weight 0.96, primary); https://github.com/slsa-framework/slsa/blob/main/spec/build-requirements.md (weight 0.90, primary).

The level progression makes the shape explicit: Build L2 is a build service, Build L3 is hardened builds. Source: https://marklodato.github.io/slsa/spec/v1.0-rc1/levels (weight 0.88, weak-provenance mirror of spec content, community mirror). A production-oriented secondary review covers isolation, provenance generation, hosted platform obligations, and operational patterns for builders. Source: https://safeguard.sh/resources/blog/slsa-builder-requirements-production (weight 0.26, weak backing).

## Option 1: GitHub-hosted ephemeral runners

The hosted path is the one the slsa-github-generator reusable workflows implement: provenance generation runs on ephemeral GitHub-hosted infrastructure that the calling workflow cannot reach mid-build. The generator repository and its container and generic generators are covered in the corpus doc on slsa-github-generator (weights 0.94, 0.83, 0.96).

What this buys: the isolation property is provided and operated by the platform, so the tenant project does not have to prove isolation itself. What it costs: the tenant accepts the platform's isolation model and its shared multi-tenant nature, and pins to the generator's version for stable builder identity.

## Option 2: hardened self-hosted runners

A self-hosted runner can in principle be hardened further than a hosted ephemeral runner (verified boot, measured boot, restricted egress). The trade is audit burden: the project, not the platform, must prove the build environment was not tampered with. The collected sources do not include a primary walkthrough of self-hosted SLSA L3 builders; the closest collected material is the production-oriented builder requirements review (weight 0.26, weak backing). Teams choosing this path should expect to assemble their own evidence from the primary requirements pages (0.96, 0.90).

## Option 3: TEE-backed confidential builders

The confidential containers path replaces or augments hosted-runner isolation with hardware-rooted attestation.

The model: before a confidential workload is granted access to sensitive data, it should be attested. Attestation provides guarantees about the TCB, isolation properties, and root of trust of the enclave. Confidential Containers uses Trustee to verify attestations and conditionally release secrets, and Trustee can attest any confidential workloads. Source: https://confidentialcontainers.org/docs/attestation/ (weight 0.89, primary project doc).

Policy layers: Confidential Containers uses three types of policies to secure workloads at different layers; the two managed by Trustee are KBS resource policies and attestation service policies, with kata agent policies controlling behavior inside the TEE. Source: https://confidentialcontainers.org/docs/attestation/policies/ (weight 0.87, primary project doc).

The attestation service verifies TEE evidence; the project states the attestation service must run in a secure environment, outside of the guest node, and notes the Attestation Service has been consolidated with the Key Broker Service. Source: https://github.com/confidential-containers/attestation-service (weight 0.68, primary).

Red Hat's overview frames attestation as a confidential computing keystone. Source: https://www.redhat.com/en/blog/understanding-confidential-containers-attestation-flow (weight 0.68, primary vendor doc). A third-party explainer adds the runtime property: attestation enables a trusted service to verify that a container is running in a genuine, unmodified TEE before releasing encryption keys or other confidential data to it. Source: https://deepwiki.com/confidential-containers/confidential-containers/3.2-attestation-system (weight 0.16, weak backing).

## What this means for a CI attestation program

For a project choosing between the options:

1. Hosted ephemeral via the generator is the lowest-cost L3-compliant path and the easiest to explain to an auditor (0.94, 0.83, 0.96).
2. Self-hosted hardening shifts the burden of proving isolation onto the project; without primary-source tooling collected here, budget for evidence assembly (0.26 weak).
3. TEE-backed builders give hardware-rooted attestation of the build environment itself, but require standing up Trustee, an attestation service outside the guest node, and policy layers (0.89, 0.87, 0.68).

The decision axis is who proves isolation: the platform (hosted), the project's configuration (self-hosted), or the hardware and its attestation flow (TEE).
