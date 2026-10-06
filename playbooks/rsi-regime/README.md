# playbooks/rsi-regime

Knowledge corpus explicating the yubiOS RSI regime playbook (ground source: yubi-OS/yubiOS `playbooks/rsi-regime.md`, last updated 2026-08-07, 7268 B fetched). The playbook is the source of record; this corpus explicates and deepens it. Minted 2026-10-06.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | 01-regime-overview.md | What the regime is: bounded recursive loop over any corpus, manifold-aware t on S2 |
| 02 | 02-skill-family.md | The 9 skills and their roles in the regime |
| 03 | 03-loop-mechanics.md | The 5-step per-cycle loop and the external math each step uses |
| 04 | 04-hard-rules.md | The 7 hard rules whose silent substitution voids the audit trail |
| 05 | 05-math-conventions.md | The frozen math conventions (PCA, stereographic lift, real SH, ridge, gate) |
| 06 | 06-time-series-library.md | The 5-dim per-cycle fit library at papers/data/series/ and its gate outcomes |
| 07 | 07-renders.md | Render output directories and their consumers |
| 08 | 08-skill-selection-cycle-cap.md | Which skill to run when, and the 3-cycle default cap |
| 09 | 09-sources-and-provenance.md | Vogel 1979, Saff-Kuijlaars 1997, NIST DLMF, the y33 papers, the tex paper, changelog |

## Research summary

- Results collected: 60 (10 searXNG queries over 5 web-shaped subtopics; 4 subtopics are internal-record, no dig, cited to the source doc)
- Weight split: 28 high (>= 0.5) / 32 low (< 0.5)
- jev: 5 logged requests (7192 input / 1355 output tokens), model typesafe/jev-1.13 via DefAPI direct (https://api.defapi.org/api/v1/decisions); zero fallbacks to the worker relay, zero redos
- Note: one outline-validation request was executed before the logged recapture but could not be persisted (read-only workspace); it was re-issued and the logged call is authoritative
- Redos: 0 dig redos, 0 decision redos
- Skipped docs: none (all 9 subtopics authored; outline scores 0.90 to 1.86, no score-0 drops)

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI direct decide endpoint used (campaign preflight orchestrator-side, agent-side probe skipped for speed per brief).
