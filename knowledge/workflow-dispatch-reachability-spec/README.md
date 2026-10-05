# workflow-dispatch-reachability-spec

Knowledge corpus on workflow_dispatch reachability assertions: a script that proves every dispatchable workflow file in a repository is actually reachable from an orchestrator group, catching orphaned workflows. Minted 2026-10-05 from yubi-OS/yubiOS refs/workflow-dispatch-reachability-spec-2026-08-04.md.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-orphan-workflow-problem.md | The orphan-workflow bug class and the yubiOS 2026-08-02 fold of 4 orphan workflows into the tests group |
| 02 | 02-dispatch-trigger-anatomy.md | workflow_dispatch declaration, inputs, the YAML 1.1 on-key boolean gotcha, and runtime dispatch semantics |
| 03 | 03-orchestrator-group-routing.md | Central ci.yml dispatcher design, 7 dispatch groups, and the bidirectional reachability contract |
| 04 | 04-assertion-script-design.md | The assertion algorithm: walking workflows, detecting triggers, extracting group tables, bidirectional checks |
| 05 | 05-output-formats-ci.md | Text, JSON, and SARIF reporting, severity model, code scanning ingestion, and artifact transport |
| 06 | 06-ci-gate-workflow.md | The ci_dispatch-reachability gate: path-filtered PR trigger, weekly schedule, on-demand dispatch, least privilege |
| 07 | 07-api-enumeration-dispatch.md | GitHub REST enumeration, dispatches, run/job polling, and token scopes |
| 08 | 08-alternative-tooling.md | actionlint, rulesets, and required workflows, and the gap a custom assertion fills |
| 09 | 09-phased-adoption.md | The 3-phase migration from report-only audit to required gate |

## Research summary

- Results collected: 108 searXNG results (2 queries x 9 subtopics, top 6 per query kept)
- Weight split (jev noul): 58 high (>= 0.5) / 50 low (< 0.5)
- Jev requests: 24 (1 preflight probe + 1 outline validation + 22 weighting batches), usage 18345 input / 0 output tokens
- Redos: 0 (all 18 seed queries returned healthy result sets on attempt 1)
- Skipped docs: none; all 9 subtopics authored
- Outline validation: all 9 subtopics kept, no score-0 drops; t08 alternative-tooling scored lowest (0.34) and stayed because its dig came back strong

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Research DB

db.ts maps every research-db file to its TypeScript interface: preflight.json (PreflightRecord), outline.json (OutlineRecord), archive.json (DugResult[] with full per-result decision records), digs/<NN>-<slug>.json (DigRecord), jev-log.json (JevLogEntry[]).

