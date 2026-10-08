# Knowledge corpus: runtime-attestation-keylime

Runtime attestation for yubiOS using Keylime, in-toto, and confidential-containers: the 4-component evidence shape (quote / measurement / evidence bundle / Rekor v2 anchor) shared across the three frameworks. Minted from the yubiOS skill ground source `yubi-OS/yubiOS skills/runtime-attestation-keylime/SKILL.md` (4764 bytes fetched 2026-10-08).

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-keylime-tpm2-attestation.md | Keylime architecture (verifier, agent, registrar) and the TPM2 quote-to-policy loop |
| 02 | 02-evidence-shape.md | The canonical 4-component evidence shape and how each of the three legs instantiates it (internal-record) |
| 03 | 03-intoto-slsa-attestations.md | in-toto attestation format, SLSA provenance, and what L3 adds |
| 04 | 04-confidential-containers-attestation.md | TDX / SEV-SNP / NVIDIA CC attestation and the CoCo Trustee evidence path |
| 05 | 05-rekor-v2-anchoring.md | Rekor v2 tile-backed transparency log and cosign verify-attestation |
| 07 | 07-downstream-consumers.md | The CI attestations gate, audit-evidence rollup, and 10-primitive map (internal-record) |
| 08 | 08-cycle9-provenance.md | Cycle-9 corpus-enrichment provenance and the 8 attestation closure cells (internal-record) |
| 09 | 09-measured-boot-ima-integration.md | Measured boot PCR state, IMA measurement list, and the quote-to-log binding |

## Research summary

- Results collected: 60 (top 6 per query, 10 queries, 5 web-shaped subtopics)
- Weight split: 34 high (>= 0.5) / 26 low (< 0.5) of 60; 0 unweighted
- Jev requests: 6 logged (1 outline validation + 4 weighting batches of 15 + 1 reconstructed first outline call that crashed before logging); usage totals in `research-db/jev-log.json`
- Redos: 0. All digs returned HTTP 200 with 40 to 46 raw results each on first attempt
- Skipped docs: 1. `06-primitive-mapping` was dropped at outline validation (score 0.56 with drop probability 0.56 dominant); its P0/P3/P6 content is covered inside docs 02 and 07 instead
- Weighting anomaly note: one result in the 04 dig (a Merriam-Webster dictionary page) received a high weight (0.75) despite being off-topic; it was excluded from claim support and is flagged here
- Outline scores (typesafe/jev-1.13, score metric): t01 1.81, t02 1.45, t03 1.49, t04 1.57, t05 1.37, t06 0.56 (dropped), t07 1.05, t08 0.94, t09 1.56

Internal-record subtopics (02, 07, 08) cite the ground source doc and sibling corpus docs and ran no searXNG dig, per the skills-variant mint spec.

## Preflight

Preflight 2026-10-06: campaign preflight healthy (orchestrator); agent-side probe skipped for speed. Observed during this mint: all 10 searXNG digs returned 200 with 40+ results each; DefAPI /api/v1/decisions answered every batch with zero 429s.
