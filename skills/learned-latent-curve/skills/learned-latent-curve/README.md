# learned-latent-curve knowledge corpus

Minted from the ground source yubi-OS/yubiOS skills/learned-latent-curve/SKILL.md (35689 bytes). The corpus explicates the skill: what it does, how to use it, its primitives and patterns, and the domain knowledge it encodes.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | rsi-discipline-fixpoint | The bounded RSI loop, the 3-conjunct fixpoint rule, the cycle cap and user override |
| 02 | learned-latent-basis | Learned latents vs hand-engineered primitives, PC1+PC2 and holdout R2 readouts, fit coordinates |
| 03 | warm-start-refit-lifecycle | Re-fit cadence, drift signals, warm-start kwargs with t-range rescaling, persistence list, rollback |
| 04 | coordinate-robustness | Noisy t, PC1 sign flips, partial ordering, domain shift, ridge-residual drift detection |
| 05 | pre-fit-validation | The 7 pre-fit data pathology checks and their mapping to standard tooling |
| 06 | changelog-audit-trail | Internal record: the Changelog as per-cycle audit trail across 12 RSI cycles |
| 07 | composition-with-other-skills | Internal record: pairings, consumers, cross-reference consistency, scoping |

## Research summary

- Results collected: 119 dig results (59 attempt 1, 60 redo), all weighted, 0 unscored.
- Weight split: 10 results at weight >= 0.5 (authoritative), 109 below 0.5 (weak, labeled as such in the docs).
- Jev requests: 10 (1 outline score validation, 5 attempt-1 noul batches, 4 redo noul batches), 17325 input tokens / 2659 output tokens, via DefAPI direct (typesafe/jev-1.13).
- Redos: 1 per web-shaped subtopic (01, 02, 03, 04, 05), triggered because attempt-1 generic queries surfaced aggregator content with 0 results at weight >= 0.5; redo queries targeted official documentation.
- Skipped docs: 08 primitive-coverage-placement, outline score 0.34 (nearest the padding criterion); its content is the primitive-coverage template stubs, one of which the source doc itself removed as unsupported on 2026-09-17.

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator-run); decide endpoint https://api.defapi.org/api/v1/decisions (typesafe/jev-1.13), agent-side probe skipped for speed per the skills-variant brief.

## Gaps

- Doc 08 was dropped at outline validation (score 0.34); see research-db/outline.json drop_note.
- Subtopics 01, 03, 04 have no dig result at weight >= 0.5 after the redo wave; their docs lean on the source doc for load-bearing claims and carry dig results labeled weak.
- The source doc's attestation section contains literal f-string placeholders ({pct:.4f}, {hr2:.4f}) in one sentence; the numeric values 0.4615 and 0.2244 come from the preceding sentence and are used in doc 02.
