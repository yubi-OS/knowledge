# learned-latent-curve-skill-quality-map

Knowledge corpus on learned latent curves as 1-D to 384-D embeddings for skill corpora: mapping a skill corpus into a high-dimensional learned latent space for quality assessment and coverage measurement.

Minted 2026-10-05 from yubi-OS/yubiOS refs/learned-latent-curve-skill-quality-map-2026-08-03.md.

## Docs

- 01-fourier-curve-model-form.md
- 02-one-d-coordinate-t.md
- 03-target-pipelines-short-documents.md
- 04-quality-feature-extraction.md
- 05-validation-methodology.md
- 06-diagnostic-discipline-pc1.md
- 07-embedding-dimensionality-rank-limits.md
- 08-when-not-to-use-alternatives.md

## Research summary

- Results collected: 96 searXNG results across 18 queries (16 initial + 2 redo queries for doc 04), top 6 kept per query.
- Weight split: 45 results at weight >= 0.5 (authoritative backing), 51 at weight < 0.5 (weak backing, labeled as such in the docs).
- Jev: 21 requests to /api/decide (1 outline score request with 8 questions, 20 noul weighting batches of 5), usage 16755 input / 0 output tokens. Two 429 responses recovered by the 30s redo protocol.
- Redo counts: doc 04 dig redone once with different queries (2 redo queries); all other docs 0 redos.
- Skipped docs: none. All 8 outline subtopics validated load-bearing (score 1.16 to 1.83) and authored.

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-fourier-curve-model-form.md | 12 | 5 |
| 02-one-d-coordinate-t.md | 10 | 4 |
| 03-target-pipelines-short-documents.md | 12 | 8 |
| 04-quality-feature-extraction.md | 12 | 6 |
| 05-validation-methodology.md | 12 | 5 |
| 06-diagnostic-discipline-pc1.md | 14 | 5 |
| 07-embedding-dimensionality-rank-limits.md | 12 | 6 |
| 08-when-not-to-use-alternatives.md | 12 | 6 |

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
