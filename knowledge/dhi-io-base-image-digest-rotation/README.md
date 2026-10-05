# dhi-io-base-image-digest-rotation

Knowledge corpus on base image digest rotation for supply-chain-pinned container builds: how to rotate approved FROM digests in a rego-gated pipeline while keeping the build policy coherent. Minted 2026-10-05 from yubi-OS/yubiOS `refs/dhi-io-base-image-digest-rotation-2026-09-08.md`.

## Docs

| NN | File | Scope |
|---|---|---|
| 01 | 01-digest-pinning-fundamentals.md | Why FROM lines are pinned by immutable digest instead of mutable tags, and how multi-arch OCI index digests differ from per-arch child digests. |
| 02 | 02-digest-resolution-tooling.md | Resolving the new digest with registry tooling (crane, skopeo, docker buildx imagetools inspect) and recording the multi-arch index digest rather than a child. |
| 03 | 03-build-policy-coherence.md | Keeping an OPA/Rego Docker Build Policy coherent across a rotation: approved registries, canonical digest-pinned FROM, provenance requirements, and what denies the new pin. |
| 04 | 04-rotation-automation.md | Automating the refresh cadence: Dependabot and Renovate digest-pin updates, updatecli, and scheduled workflows that open the bump PR. |
| 05 | 05-candidate-verification-gate.md | Smoke-gating a candidate digest before landing the pin: cosign signature and attestation verification, SBOM and provenance checks, and a container boot smoke test. |
| 06 | 06-pin-source-of-truth-drift.md | Single source of truth for approved digests (a PINNED.md-style pin file), keeping the consuming Containerfile in lockstep, and using commit messages as the audit trail. |
| 07 | 07-rollback-immutability.md | Rollback semantics: digests are immutable and rotation is additive, reverting the pin to the old digest, and treating a moved or mutated digest as an incident. |
| 08 | 08-provenance-attestation-continuity.md | Keeping SLSA provenance, Sigstore signatures, and transparency-log coverage continuous across a rotation: verifying the new base image digest carries its attestations. |

## Research summary

- Results collected: 96 (16 searXNG queries, 2 per subtopic, top 6 kept per query)
- Weight split (jev noul): 49 results at weight >= 0.5 (authoritative backing), 47 below 0.5 (weak backing, labeled as such in the docs)
- Jev requests: 22 total (1 preflight probe, 1 outline score validation over 8 questions, 20 noul weighting batches over 96 results), usage 16777 input tokens / 0 output tokens
- Redo counts: 4 retry attempts across 2 batches that hit HTTP 429 (batches 60 and 95); all redos succeeded, no results left unweighted
- Skipped docs: none. All 8 subtopics scored 0 or above (no score-0 drops) and every dig returned enough material to author honestly; no dig needed a query redo.

## Outline validation

Score metric, criteria lowest-first: padding (drop), marginal (keep only if the dig comes back strong), load-bearing (core subtopic). All 8 subtopics kept; scores ranged from 1.29 to 1.90 on the 0-2 scale.

## Preflight

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Gaps / skips

None.
