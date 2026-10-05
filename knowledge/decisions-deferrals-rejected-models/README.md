# decisions-deferrals-rejected-models

A knowledge corpus on engineering decision registers: how to record decisions, deferrals, and rejected models with rationale so choices can be re-derived later, and how to contradiction-check a decision log. Minted 2026-10-05 from yubi-OS/yubiOS refs/decisions-deferrals-rejected-models-2026-07-25.md.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-adr-decision-records.md | Recording a single decision: Nygard ADR, MADR, required fields, status, consequences |
| 02 | 02-rejected-alternatives.md | Recording rejected models and alternatives with rationale; rejected-as-primary-path vs never-viable |
| 03 | 03-deferred-decisions-evidence-gates.md | Deferring decisions pending evidence; unblock criteria; deferral vs rejection |
| 04 | 04-rationale-rederivation.md | Making choices re-derivable later via recorded context, forces, assumptions, confidence |
| 05 | 05-contradiction-checking.md | Contradiction-checking a decision log; contradictions vs sequencing dependencies |
| 06 | 06-lifecycle-supersession.md | Statuses, supersession links, CI-validated symmetry, re-check triggers |
| 07 | 07-reusable-schema.md | Reusable row patterns (Decision/Source, Deferred, Rejected-model/Why/Source) and schema variants |
| 08 | 08-provenance-traceability.md | Linking each decision to its authoritative source; PR-centered traceability |
| 09 | 09-decision-authority.md | Decision rights, one deciding frame, avoiding competing governance structures |

## Research summary

- Results collected: 108 (9 subtopics, 2 searXNG queries each, top 6 per query)
- Weight split: 40 high (>= 0.5, authoritative backing) / 68 low (< 0.5, weak backing, labeled in text) of 108 weighted
- Jev requests: 24 (1 preflight probe, 1 outline validation, 22 weighting batches of 5); usage 18307 input / 0 output tokens
- Redo counts: 0 (all 18 queries returned results on first attempt; no thin digs)
- Skipped docs: none (all 9 subtopics scored >= 1 in outline validation; all digs sufficient)

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
