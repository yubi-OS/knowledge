# 01 - Keylime TPM2 attestation

Scope: Keylime's architecture (verifier, agent, registrar) and how TPM2 quotes flow into runtime attestation decisions. Ground source: the yubiOS skill `skills/runtime-attestation-keylime/SKILL.md`, which names Keylime TPM2 quotes as the runtime leg of the 4-component evidence shape.

## What Keylime is

Keylime is a CNCF hosted project that provides highly scalable remote boot attestation and runtime integrity measurement. It lets an operator monitor remote nodes using a hardware based cryptographic root of trust, which for yubiOS means the TPM2 device on the node is the trust anchor for every claim the node makes about itself (source: https://keylime.dev/, jev weight 0.80).

## The three components

Keylime consists of three main components (source: https://github.com/keylime/keylime, jev weight 0.94):

1. The Verifier. It continuously verifies the integrity state of the machine that the agent is running on. This is the component that turns raw cryptographic evidence into a pass or fail attestation decision.
2. The Registrar. It is a database of all agents registered with Keylime and hosts the public keys of the TPM vendors. Vendor key material is what lets the verifier confirm that a quote really came from a genuine TPM rather than a software impostor.
3. The Agent. It runs on the attested node, talks to the local TPM, and answers the verifier's challenge with quotes and supporting evidence.

The architecture matters for yubiOS because each component maps onto one of the evidence-shape roles: the agent produces the quote, the TPM provides the measurement, and the verifier decides whether the evidence satisfies policy.

## Runtime policies and the quote loop

A Keylime runtime policy in its most basic form is a set of "golden" cryptographic hashes of files' untampered state, or of keys that may be loaded onto keyrings for IMA verification. Keylime loads the runtime policy into the verifier. The verifier then polls TPM quotes to PCR 10 on the agent's TPM and validates the agent's file state against the policy (source: https://keylime.readthedocs.io/en/latest/user_guide/runtime_ima.html, jev weight 0.88).

That polling loop is the canonical quote component of the evidence shape: a signed TPM2 quote over PCR 10, produced on demand, checked against declarative expectations held by the verifier. The policy itself is a declarative artifact, which is why the skill maps attestation policy to the P3 declarative-policy primitive.

## Why the quote is anchored in hardware

The benefit of anchoring the aggregate integrity value in the TPM is that the measurement list cannot be compromised by any software attack without being detectable. On a trusted boot system, IMA measurement can therefore be used to attest to the system's runtime integrity remotely or locally (source: https://keylime.dev/blog/2019/04/02/running-IMA-on-keylime.html, jev weight 0.54, moderate backing). This is the property that makes a Keylime quote worth carrying into an evidence bundle: the quote is not a self-report by software that could be tampered with, it is a hardware-signed assertion whose forgery requires compromising the TPM itself.

## Fit inside the yubiOS evidence shape

The source doc assigns Keylime the runtime leg of the 4-component evidence shape (quote / measurement / evidence bundle / Rekor v2 anchor). In Keylime's own vocabulary:

- The quote is the TPM2-signed PCR assertion the agent returns.
- The measurement is the IMA measurement list and PCR state the quote attests to.
- The evidence bundle and the Rekor v2 anchor are added downstream when the attestation decision is packaged and published, which docs 02 and 05 cover.

For yubiOS, where the image is immutable and composefs-verified (see the `composefs-kernel-floors` and `dm-verity-and-integrity` skills), the runtime quote answers the question boot-time verification cannot: that the running system continues to match the measured state while it executes. Attestation coverage gaps attributable to this skill are tracked in the cycle-9 run log at `refs/curve-guided-rsi-v2-cycle9-corpus-enrichment-2026-08-06.md` on yubi-OS/yubiOS (source doc).

## Practical implications

- Provision the verifier with a runtime policy derived from the image content, not from a generic allowlist, so the golden hashes match the booted image generation.
- Treat the registrar's TPM vendor key store as part of the trust chain; a quote is only as good as the vendor key that authenticated the TPM.
- Keep quote polling frequent enough that compromise windows stay small, since the verifier's continuous model is what distinguishes Keylime from one-shot boot attestation.
