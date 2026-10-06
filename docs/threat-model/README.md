# threat-model knowledge corpus

Corpus explicating the yubiOS threat model, minted 2026-10-06 from the ground source yubi-OS/yubiOS docs/THREAT_MODEL.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/THREAT_MODEL.md, 29843 B fetched). The source doc is the primary source of record; this corpus explicates and deepens it.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-platform-overview.md | FIDO2-first immutable Linux OS, bootc/OCI and mkosi delivery, ARM64 Path A vs Path B, x86-64 posture, verified `/usr` versus encrypted writable state. |
| 02 | 02-assets-and-objectives.md | The 9 protected assets with required properties and consequences if lost. |
| 03 | 03-security-invariants.md | The 10 security invariants and the boundary-based evaluation rule. |
| 04 | 04-actors-and-boundaries.md | 9 threat actors with control and trust levels plus 11 trust boundaries. |
| 05 | 05-input-classification.md | Attacker-controlled, operator-controlled, and developer-controlled inputs and the reclassification rule. |
| 06 | 06-assumptions-exclusions.md | Assumed-sound primitives, owner assumptions, platform-status conditions, and exclusions. |
| 07 | 07-attack-surface-mitigations.md | Control maturity tiers and 15 principal attacker stories with controls and residual risk. |
| 08 | 08-vulnerability-classes.md | Highest-value review classes versus low-relevance web classes. |
| 09 | 09-severity-calibration.md | Critical, High, Medium, Low definitions with raise and lower factors. |

## Research summary

- Results collected: 36 (6 searXNG queries across 3 web-shaped subtopics; 6 internal-record subtopics grounded in the source doc only, per the docs-variant brief).
- Weight split: 21 results at weight >= 0.5, 15 at weight < 0.5 (noul probabilities via typesafe/jev-1.13 on DefAPI direct).
- Jev requests: 10 (1 score outline validation, 3 noul batches of 12, 6 noul re-run batches of 6 after a client-side key-parsing error whose responses were discarded; weights recovered from the retained decision records). Usage: 4619 input tokens, 799 output tokens on retained requests.
- Redos: 0 dig redos. 1 weighting re-run (no unweighted result shipped).
- Skipped docs: none. All 9 subtopics authored.
- Subtopic outline scores: 01 1.35, 02 1.93, 03 1.62, 04 1.92, 05 1.81, 06 1.90, 07 1.92, 08 1.64, 09 1.77 (no score-0 drops).

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (DefAPI direct, typesafe/jev-1.13) 200, agent-side probe skipped for speed.
