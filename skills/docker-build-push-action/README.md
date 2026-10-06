# skills/docker-build-push-action

Knowledge corpus explicating `yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md` (the docker/build-push-action GitHub Action: building and optionally pushing Docker/OCI images, caching, SLSA provenance/SBOM attestations, multi-platform builds, and the build-push discipline the skill teaches). Minted 2026-10-06.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-when-to-use-and-positioning.md](./01-when-to-use-and-positioning.md) | When build-push-action is the right tool, its role as the primary build action after setup-buildx-action, and the action family it composes with |
| 02 | [02-action-reference-key-inputs-outputs.md](./02-action-reference-key-inputs-outputs.md) | The complete input/output contract of build-push-action@v6: inputs with defaults, the digest/metadata/imageid outputs, and output behavior caveats |
| 03 | [03-caching-strategies.md](./03-caching-strategies.md) | cache-from/cache-to backends (gha, registry, s3), mode=max semantics, multi-source cache chains, cache discipline |
| 04 | [04-attestations-provenance-sbom.md](./04-attestations-provenance-sbom.md) | SLSA provenance and SBOM attestations, provenance mode=max as SLSA Build L3, the id-token: write requirement, attestation ecosystem context |
| 05 | [05-multi-platform-builds.md](./05-multi-platform-builds.md) | platforms input, QEMU emulation vs native runners, the multi-platform + load restriction, distribute/native distribution |
| 06 | [06-digest-pinning-supply-chain.md](./06-digest-pinning-supply-chain.md) | The digest output as the supply-chain artifact, pinning FROM lines, the yubiOS.rego enforcement hook, secrets hygiene |
| 07 | [07-github-builder-reusable-workflow.md](./07-github-builder-reusable-workflow.md) | docker/github-builder: the official reusable workflow, its inputs/outputs, native distribution, signed provenance, and the comparison against bare build-push-action |

## Research summary

- Results collected: 84 (14 searXNG queries, 2 per kept subtopic, top 6 per query), all 84 weighted with jev noul.
- Weight split: 27 high (>= 0.5) / 57 low (< 0.5).
- Jev: 14 HTTP requests across 9 log entries (1 outline validation + one full weighting pass whose answers were lost, one crashed partial attempt, one full superseding weighting pass), usage 20839 input / 3485 output tokens total (see research-db/jev-log.json). Outline validation used the score metric; weighting used noul. Weighting ran via DefAPI direct (https://api.defapi.org/api/v1/decisions) per the 2026-10-06 speed optimization; the steady-orbit /api/decide relay was not needed.
- Redo counts: 0 dig redos. One weighting pass (84 results) completed but its answers were lost to a read-only filesystem before persistence; it was re-run in full and the superseding pass's answers are recorded in archive.json. A second partial attempt consumed one batch before a script bug stopped it; both are logged in jev-log.json.
- Skipped docs: none. 2 outline subtopics dropped at validation: t07 yubios-bootc-pattern (score 0.46, padding-dominant; the pattern remains covered inside docs 02, 03, 04, 05, 06 via the source doc's yubiOS pattern section) and t09 corpus-primitive-coverage (score 0.31, padding-dominant; internal-record subtopic, no dig).
- Gaps: none.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); jev decide 200 via DefAPI direct.
