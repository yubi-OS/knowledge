# skills/slsa-provenance - SLSA v1.0 Build L3 Provenance Knowledge Corpus

Minted from the yubiOS ground source **yubi-OS/yubiOS skills/slsa-provenance/SKILL.md** (12048 bytes, fetched 2026-10-08 from raw.githubusercontent.com with User-Agent omni-agent/1.0). The corpus explicates the skill: SLSA v1.0 supply-chain security targeting Build Level 3, provenance attestations on build artifacts, GitHub Actions SLSA workflows, verification with slsa-verifier and cosign, and pipeline auditing.

## Documents

1. [01-slsa-v1-levels.md](01-slsa-v1-levels.md) - SLSA v1.0 build-track levels L1 to L3 and the v0.2 to v1.0 migration (source-track split, no Build L4).
2. [02-github-generator-workflows.md](02-github-generator-workflows.md) - slsa-github-generator reusable workflows for container and generic provenance, isolated runners, exact wiring.
3. [03-provenance-format.md](03-provenance-format.md) - in-toto Statement v1, DSSE envelope, slsa.dev/provenance/v1 predicate (buildDefinition and runDetails), v0.2 legacy shapes.
4. [04-slsa-verifier.md](04-slsa-verifier.md) - verification with slsa-verifier, the flags that matter, and the post-deploy CI gate role.
5. [05-cosign-attestation.md](05-cosign-attestation.md) - keyless OIDC signing, SBOM (SPDX) attestations, identity-pinned verification.
6. [06-build-policy.md](06-build-policy.md) - Docker Buildx Build Policies (OPA/Rego) enforcing hasProvenance and isCanonical at build time.
7. [07-rekor-transparency.md](07-rekor-transparency.md) - Rekor v2 tile-based log GA October 2025, v1 maintenance mode, client compatibility floors.
8. [08-yubios-pipeline-checklist.md](08-yubios-pipeline-checklist.md) - the yubiOS L3 checklist read as the end-to-end integration map (internal-record, no dig).

## Research summary

- Results collected: 84 (7 web-shaped subtopics, 2 queries each, top 6 per query kept).
- Weight split: 35 high (>= 0.5) / 49 low (< 0.5) of 84, all weighted, 0 null.
- Jev requests: 8 total via DefAPI direct (api.defapi.org/api/v1/decisions, model typesafe/jev-1.13): 1 outline score request (1530 in / 124 out tokens) + 7 weighting batches of 12 (10713 in / 1540 out tokens), zero 429s, no fallback to the worker relay needed.
- Redos: 0. All 14 dig queries succeeded on first attempt.
- Skipped docs: none. t06 and t07 scored marginal on outline validation and were kept because their digs returned official-source results (docs.docker.com and Sigstore blog/repo respectively).
- Internal-record subtopic: 08 (yubiOS checklist) cites the source doc only, no searXNG dig.

Preflight 2026-10-06: campaign preflight healthy (orchestrator); agent-side probe skipped for speed per the mint brief; weighting ran against DefAPI direct.

## Research DB

Under research-db/: preflight.json, outline.json, archive.json (84 weighted entries with full decision records), digs/ (8 records), jev-log.json (8 entries), db.ts (schema v2 interfaces).
