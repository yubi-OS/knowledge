# release-gate-checklist-v2

Knowledge corpus on v1 launch readiness gate inventories: the non-engineering gates (security audit, pricing validity, reference customer) needed before a launch milestone, with definitions and evidence standards. Minted 2026-10-05 from yubi-OS/yubiOS refs/release-gate-checklist-v2-2026-08-04.md.

## Docs

| doc | scope | dig |
|---|---|---|
| 01-security-audit-gate-scope.md | security audit gate scope | 12 results kept, 3 primary |
| 02-security-audit-evidence.md | security audit evidence | 12 results kept, 3 primary |
| 03-pricing-validity-wtp.md | pricing validity wtp | 12 results kept, 3 primary |
| 04-paid-pilot-contract.md | paid pilot contract | 12 results kept, 2 primary |
| 05-reference-customer-gate.md | reference customer gate | 12 results kept, 5 primary |
| 06-reference-call-agreement.md | reference call agreement | 36 results kept, 3 primary |
| 07-gate-runner-mechanics.md | gate runner mechanics | 24 results kept, 9 primary |
| 08-gate-dependency-sequencing.md | gate dependency sequencing | 12 results kept, 2 primary |
| 09-evidence-artifact-conventions.md | evidence artifact conventions | 24 results kept, 5 primary |

## Research summary

- Results collected: 156 (searXNG, top 6 per query, deduplicated per subtopic)
- Weight split: 35 results at weight >= 0.5 (primary-grade), 121 at weight < 0.5 (weak backing, labeled in text)
- Jev requests: 35 (26698 input tokens, 0 output tokens), score metric for outline validation, noul metric for weighting, model clef
- Redo counts: 4 dig redos (t06 x2, t08 x1, t10 x1) after initial digs returned only low-weight results
- Skipped docs: none. Subtopic t07 (incident severity ladder) was dropped at outline validation with score 0.4453 and probability mass 0.6645 on "padding: drop"

## Preflight

Preflight 2026-10-05: searXNG 64 results healthy on the probe query (11 engines unresponsive, see research-db/preflight.json); /api/decide (clef) 200

## Method

Every factual claim in the docs carries its source URL and the jev weight that backed it. Claims with weight >= 0.5 are primary-grade backing; claims below 0.5 are labeled as weak backing in the text. Thin digs were redone with different queries per the redo rule; no primary-source fallback was used.
