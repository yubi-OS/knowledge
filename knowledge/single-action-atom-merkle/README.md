# single-action-atom-merkle

Knowledge corpus on the single-action atom and Merkle-tree artifact design: one atomic
action per improvement cycle, with a Merkle-structured artifact as the auditable unit of
change. Minted 2026-10-05 from yubi-OS/yubiOS `refs/single-action-atom-merkle-2026-08-07.md`.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | [atomic-unit-of-change](01-atomic-unit-of-change.md) | The smallest unit of change in databases, git, and improvement cycles. |
| 02 | [merkle-tree-fundamentals](02-merkle-tree-fundamentals.md) | Hash trees, inclusion proofs, content addressing as the tamper-evident substrate. |
| 03 | [git-object-model-merkle-history](03-git-object-model-merkle-history.md) | Git's blob/tree/commit Merkle DAG as native tamper-evident change history. |
| 04 | [transparency-log-attestation](04-transparency-log-attestation.md) | Rekor, Certificate Transparency, and public anchoring of change artifacts. |
| 05 | [evidence-bundle-artifact](05-evidence-bundle-artifact.md) | in-toto attestations, SLSA provenance, and hash-chained evidence bundles. |
| 06 | [bounded-rsi-one-action-cycle](06-bounded-rsi-one-action-cycle.md) | One hypothesis per cycle, loop bounds, and auditable self-improvement. |
| 07 | [idempotency-reversibility](07-idempotency-reversibility.md) | Idempotency keys, compensating actions, and recovery of ambiguous actions. |
| 08 | [change-artifact-manifest](08-change-artifact-manifest.md) | Manifest design: leaves, tree structure, and the published root hash. |

## Research summary

- Results collected: 130 (searXNG, 16 initial queries + 6 redo queries across 8 subtopics)
- Weight split: 19 authoritative (>= 0.5) / 111 weak (< 0.5); 0 unweighted
- jev requests: 28 (1 preflight probe, 1 outline validation with 8 score questions, 26 noul weighting batches), usage 23930 input / 0 output tokens
- Redo counts: 3 (docs 01 and 06 each redug once after returning 0 results at weight >= 0.5; redos also surfaced none above threshold, so those docs carry explicitly labeled weak backing)
- Skipped docs: none
- Gaps: docs 01 (atomic-unit-of-change) and 06 (bounded-rsi-one-action-cycle) have no primary source at weight >= 0.5 after 1 redo each; their claims are labeled weak backing in the text and should be treated as engineering positions, not cited doctrine

## Preflight

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Method

Outline decomposed the topic into 8 subtopics along the domain's joints (the unit of change,
the integrity substrate, the native implementations in git and transparency logs, the
evidence-packaging format, the improvement-loop discipline, action safety, and the manifest).
jev (clef via /api/decide on steady-orbit) scored outline load-bearingness with the score
metric and weighted every collected result with the noul metric. Every claim in the docs
carries its source URL and the weight that backed it; claims below 0.5 are labeled weak
backing in the text.

research-db/ holds the full record: preflight.json (endpoint probes), outline.json (outline
+ validation answers), archive.json (all 130 results with decisions), digs/ (per-subtopic
dig records), jev-log.json (one entry per jev HTTP request), db.ts (TypeScript interfaces
for every shape above).
