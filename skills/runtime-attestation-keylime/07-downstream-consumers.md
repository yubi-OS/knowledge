# 07 - Downstream consumers of the attestation evidence

Scope: the yubiOS surfaces that consume this skill's evidence shape: the CI attestations gate (cosign verify-attestation against Rekor v2 per the `sigstore-rekor-v2` skill), the audit-evidence rollup (`audit-evidence-packaging`), and the `internal-big-picture` 10-primitive map. Internal-record subtopic, no dig: these consumers are named by the source doc itself.

## What the source doc declares

The source doc (`yubi-OS/yubiOS skills/runtime-attestation-keylime/SKILL.md`) enumerates the consumers explicitly:

- "Downstream consumers that reason about attestation coverage: the yubiOS CI attestations gate (cosign verify-attestation against Rekor v2 per `sigstore-rekor-v2`), the audit-evidence rollup (`audit-evidence-packaging`), the `internal-big-picture` 10-primitive map, credit this skill's contribution."
- "The reference implementation in `internal-big-picture` section 1 documents the full attestation primitive; this skill is the canonical body for that primitive's runtime + supply-chain + confidential-VM legs."

Three consumers, three different consumption modes. This doc spells out what each one takes from the evidence shape and what obligations that creates for the evidence producer.

## Consumer 1: the CI attestations gate

The gate runs `cosign verify-attestation` against Rekor v2. Its consumption mode is enforcement: it accepts or rejects an artifact at build or promotion time based on the presence and validity of attestation evidence anchored in the transparency log.

What it needs from the evidence shape:

- A bundle signed by an identity the gate's policy trusts, verifiable with cosign (the verify command format and bundle handling are covered in doc 05, sources https://docs.sigstore.dev/cosign/verifying/verify/ jev 0.86 and https://github.com/sigstore/cosign/blob/main/doc/cosign_verify-attestation.md jev 0.85).
- A Rekor v2 anchor so the gate's verdict survives later dispute: inclusion in the tile-backed log is the tamper-evidence property.
- Predicates the gate's policy knows how to evaluate, which is the in-toto predicate vocabulary of doc 03.

If any leg of the evidence shape is missing, the gate is the component that fails first and most visibly. That makes the gate the natural regression test for this skill: any change to evidence production should be checked against a gate run.

## Consumer 2: the audit-evidence rollup

The `audit-evidence-packaging` skill builds cryptographically-signed evidence bundles for external reviewers (HITRUST assessors, CISA reviewers). Its consumption mode is aggregation: it collects artifacts across the system and packages them into a hash-chained, attestation-quoted bundle.

The rollup does not re-verify every underlying quote; it depends on this skill's guarantee that each component evidence artifact already carries the 4-component shape, so the rollup can hash and sign the collection without re-deriving each attestation. The obligation this creates: evidence artifacts must be self-contained and individually verifiable, because the rollup's reviewer-facing verifier will fetch and check them independently.

## Consumer 3: the internal-big-picture 10-primitive map

The `internal-big-picture` skill maps every yubiOS skill, ADR, and docs artifact onto a 10-primitive model (attestation, trust chain, least privilege, declarative policy, continuous/adaptive telemetry, immutability, audit/evidence, cryptographic identity, segmentation, self-describing). Its consumption mode is classification: it needs to know which primitives a given artifact serves.

The source doc places this skill at P0 attestation (primary), with contributions to P3 declarative policy (the attestation policy itself is declarative) and P6 audit/evidence (the bundle is the audit artifact). The map's dependence runs the other way too: the source doc says the reference implementation of the attestation primitive lives in `internal-big-picture` section 1, so changes there and here must stay consistent.

## Drift discipline

Because all three consumers name this skill as a dependency, any change to the evidence shape should be reviewed for impact on attestation coverage, per the source doc: "any change should be reviewed for impact on attestation coverage; gaps in attestation that are attributable to this skill are tracked in the cycle-9 run log at `refs/curve-guided-rsi-v2-cycle9-corpus-enrichment-2026-08-06.md` on `yubi-OS/yubiOS`." The 8 attestation closure cells this skill is meant to serve are listed in doc 08.

Internal-record note: no web dig was run for this subtopic. All claims trace to the source doc and to the already-digged framework docs (01, 03, 05) of this corpus.
