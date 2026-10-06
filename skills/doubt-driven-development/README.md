# skills/doubt-driven-development

Knowledge corpus explicating the yubiOS skill `doubt-driven-development`, ground source `yubi-OS/yubiOS skills/doubt-driven-development/SKILL.md` (23884 bytes, fetched 2026-10-06). The skill subjects every non-trivial decision to a fresh-context adversarial review before it stands; this corpus explicates its posture, triggers, 5-step cycle, reconciliation discipline, anti-patterns, and sibling-skill composition.

## Docs

| Doc | Scope | Results kept | Primary (>= 0.5) |
|---|---|---|---|
| 01-fresh-context-posture.md | Fresh-context review posture: why confidence is not correctness, context degradation and anchoring evidence, disprove-biased reviewer, in-flight vs /review. | 22 | 3 |
| 02-nontrivial-triggers.md | The 5 non-triviality criteria, apply-when and when-NOT-to-use lists, and the self-correction and review-effectiveness evidence behind the threshold. | 12 | 5 |
| 03-five-step-cycle.md | The 5-step doubt cycle (CLAIM, EXTRACT, DOUBT, RECONCILE, STOP), reviewer input isolation, loading constraints, cross-model essentials. | 18 | 3 |
| 04-reconcile-classification.md | Reconcile: the 4-class precedence order (contract misread / actionable / trade-off / noise) and the no-rubber-stamping rule. Internal-record, no dig. | 0 | 0 |
| 05-rationalizations-red-flags.md | Rationalization table, red flag list, the checkable doubt-theater signal, and the verification checklist. Internal-record, no dig. | 0 | 0 |
| 06-sibling-skill-interactions.md | Composition with code-review-and-quality, source-driven-development, TDD (RED step as the doubt step), debugging-and-error-recovery. | 18 | 1 |

## Research summary

- Results collected and weighted: 70 (weight >= 0.5: 12, weight < 0.5: 58). Weak-backed claims are labeled in the doc text.
- Jev requests: 7 via DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13); usage 9156 input / 1493 output tokens. Zero failed requests; no steady-orbit relay fallback needed.
- Outline validation: 9 subtopics scored; 3 dropped (t03 loading-constraints 0.38, t05 cross-model-escalation 0.20, t09 primitive-coverage-records 0.77 marginal with no dig). Dropped content was folded into kept docs 03 and 05 rather than lost.
- Redos: 3 (docs 01, 03, 06 each had a thin first dig with no result weighted >= 0.5; each redone once with different queries per the REDO rule). No doc skipped for thin digs.
- Gaps: none skipped. Docs 04 and 05 are internal-record subtopics with no dig by design; they cite the source doc only.

## Preflight

2026-10-06: campaign preflight healthy (orchestrator); agent-side probe skipped for speed per mint-brief speed optimization. Decide calls all served by https://api.defapi.org/api/v1/decisions (200).
