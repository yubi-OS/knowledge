# Docker Build Policies (OPA/Rego) knowledge corpus

Minted 2026-10-05 from yubi-OS/yubiOS `refs/docker-build-policies-reference-2026-07-23.md`. One corpus of 8 docs covering the Docker Build Policies feature: what it is, the policy file and flag surface, Rego semantics, the input object, common rules, eval and debugging, the yubiOS integration, and the surrounding supply-chain ecosystem.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-policy-model.md](01-policy-model.md) | What a build policy is: OPA Rego evaluated by Buildx before any layer executes; version floors Buildx 0.31.0+ / BuildKit 0.26.0 (0.27.0 doc mismatch noted) |
| 02 | [02-policy-files.md](02-policy-files.md) | Policy file discovery: Dockerfile-name auto-load, the --policy flag keys filename=, reset=, strict=, bake target keys, and why yubiOS opts out of auto-load |
| 03 | [03-rego-semantics.md](03-rego-semantics.md) | Rego semantics: package docker, default allow := false, allow rules, the decision object, and the allow/deny non-keyword pitfall |
| 04 | [04-input-object.md](04-input-object.md) | The input object: input.local and the full documented input.image field list, plus the hasSBOM caveat (field does not exist; use signatures) |
| 05 | [05-policy-rules.md](05-policy-rules.md) | Common rules: approved-registry startswith allowlists, digest pinning via isCanonical, provenance gating, metadata constraints, and composition |
| 06 | [06-policy-eval.md](06-policy-eval.md) | docker buildx policy eval (exists and is documented): --print, --fields, --file, --platform; the missing-fields caveat; debug logging workflow |
| 07 | [07-yubios-integration.md](07-yubios-integration.md) | yubiOS integration: the pinned --policy reset=true,strict=true,filename=$REPO.rego gate over dhi.io registry, digest pinning, provenance; bake wiring |
| 08 | [08-ecosystem.md](08-ecosystem.md) | SLSA provenance schema versions, SBOM/provenance attestations, Docker Scout policy evaluation as the post-build complement, SOC 2 / ISO 27001 framing |

## Research summary

- Results collected: 96 raw kept results across 16 queries (8 subtopics x 2 seed queries), deduplicated to 67 unique URLs weighted by jev.
- Weight split: 33 high (>= 0.5) / 34 low (< 0.5) of 67. Every doc is anchored on at least one primary source; low-weight results are cited only where labeled weak in the doc text.
- Jev requests: 16 total (1 preflight probe, 1 outline validation with 8 score questions, 14 weighting batches with 67 noul questions). 3 requests hit 429 and were retried after a 30s sleep per the redo rule; all completed on first retry. Usage: 11642 input tokens, 0 output tokens.
- Redo counts: 0 dig redos were needed. Every subtopic's dig returned at least 3 high-weight primary results, so all 8 subtopics cleared the "marginal: keep only if the dig comes back strong" bar (subtopics 07 and 08 scored marginal-to-load-bearing in validation and were kept on dig strength).
- Skipped docs: none.

## Provenance

Source doc: session/refs-mint/refs_corpus/docker-build-policies-reference-2026-07-23.md (from yubi-OS/yubiOS refs/). The typed decision and dig records live under research-db/ (schema v2, see research-db/db.ts).
