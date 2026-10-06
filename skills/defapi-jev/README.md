# defapi-jev knowledge corpus

A knowledge corpus explicating the yubiOS skill `defapi-jev`: classifying, routing, gating, or scoring text and JSON with DefAPI's typesafe/jev-1.13 decision model. Ground source: yubi-OS/yubiOS `skills/defapi-jev/SKILL.md` (the primary source of record; every doc's grounding spine).

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-decision-model-not-chat-model.md | What a decision model is, how jev-1.13 differs from a generative chat model, why the output contract matters |
| 02 | 02-when-to-use-and-misfits.md | The 5 good fits (triage, gating, prioritization, batch labeling, multi-decision calls) and the 4 misfits |
| 03 | 03-setup-and-client.md | The 3 setup requirements (env key, network allowlist, stdlib client) and the smoke test |
| 04 | 04-calling-the-model-cli-and-python.md | The CLI (file or stdin) and the Python decide() interface, with the source doc's worked example |
| 05 | 05-question-types-schema.md | noul, choice, and score: criteria shapes, answer fields, the probability-weighted score, and the observed response envelope |
| 06 | 06-writing-good-questions.md | State shaping, instructions discipline, criteria design, score ordering, and what the external literature adds |
| 07 | 07-acting-on-results-thresholds-and-audit.md | Thresholds instead of rounding, confidence-based routing, task_id/consumed audit logging, session_id/user |
| 08 | 08-errors-and-failure-handling.md | RuntimeError and ValueError contracts, 401 code 1007, network blocks, and retry discipline |
| 09 | 09-integration-patterns-batch-and-routing.md | Batch labeling, multi-decision calls, triage and routing pipelines, division of labor with chat models |

## Research summary

- Results collected: 72 (48 from the primary dig pass, 24 from the 09 subtopic's 2 redo passes), all jev-weighted.
- Weight split: 9 high (>= 0.5) / 63 low (< 0.5).
- jev: 6 requests recorded backing shipped data (1 outline validation, 4 weighting batches of 12, 1 redo weighting batch of 24), all via https://api.defapi.org/api/v1/decisions with model typesafe/jev-1.13. Usage: 8064 input tokens, 1475 output tokens. An initial weighting pass earlier in this mint was discarded and re-run for the record (those 5 requests are not part of the shipped data; 11 DefAPI requests total this mint).
- Metrics: score (outline validation) and noul (source weighting) via typesafe/jev-1.13.
- Redos: subtopic 09 ran 2 dig redos (different queries) after its first dig came back thin; the redos returned strong on-topic material (Azure batch API docs weight 0.92, arXiv LLM ensemble annotation weight 0.60, PMC triage ML study weight 0.70), so doc 09 was kept.
- Skipped docs: none. Subtopics 02, 03, 04, 05, and 08 are internal-record subtopics (no dig, source doc only), recorded as such in their dig files.
- Outline validation: 9 subtopics proposed, all kept (scores 0.76 to 1.77 on the load-bearing scale; none scored 0).

Preflight 2026-10-06: campaign preflight healthy (orchestrator); searXNG https://p01--n8n-service--mcx7zcrbvdyt.code.run/webhook/searxng; decide https://api.defapi.org/api/v1/decisions (typesafe/jev-1.13); agent-side probe skipped for speed per mint brief.

## Research DB

Under `research-db/`: preflight.json, outline.json, archive.json (all 72 weighted results), digs/<NN>-<slug>.json per subtopic, jev-log.json (one entry per jev HTTP request), and db.ts (TypeScript interfaces for every shape).
