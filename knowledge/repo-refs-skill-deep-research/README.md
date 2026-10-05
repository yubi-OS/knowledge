# repo-refs-skill-deep-research

Knowledge corpus minted from yubi-OS/yubiOS refs/repo-refs-skill-deep-research-2026-08-07.md. Topic: deep research and conceptualization for a repository refs-archive skill, archiving a docs directory, fitting RSI curves on its primitive coverage, and dispatching gap-filling deep research per cycle.

## Docs

| NN | file | scope |
|---|---|---|
| 01 | 01-docs-archive-enumeration.md | Enumerating and refresh-cycling a documentation directory as a corpus: full cold-start listing, incremental diff since last run, and archive caching. |
| 02 | 02-primitive-coverage-vectors.md | Binary structural primitive coverage vectors for documentation corpora: designing per-file 0/1 features from headings, evidence markers, cross-references, and verification sections. |
| 03 | 03-hyperspherical-lift.md | Fitting corpus points on a sphere: PCA top-2, stereographic projection, and Mobius reparameterization with identity initialization and cross-ratio preservation. |
| 04 | 04-sparse-cell-detection.md | Detecting sparse cells on the sphere: equal-area partitioning and kd-tree nearest-neighbor isolation radius to flag underrepresented topics. |
| 05 | 05-bounded-rsi-loop.md | Bounded recursive self-improvement on a documentation archive: gap-map, hypothesis, single edit, re-map, and the fixpoint-or-continue rule with a cycle cap. |
| 06 | 06-single-action-atom.md | Atomic single-action RSI: one primitive flip per cycle chosen by geodesic distance reduction toward the ideal all-ones coverage pole. |
| 07 | 07-deep-research-dispatch.md | Dispatching parallel deep-research subagents to fill corpus gaps and writing synthesized outputs back into the docs directory. |
| 08 | 08-event-vs-archival-layers.md | Splitting project knowledge into an event layer (git plus issue tracker) and an archival layer (docs files), joined by cross-reference invariants. |
| 09 | 09-granularity-and-scale-rules.md | Corpus-size granularity tiers: section-level decomposition below 20 files, per-file rows above, PCA degeneracy fallbacks, and re-fit cadence on corpus growth. |
| 10 | 10-coverage-map-outputs.md | Output artifacts: human-readable coverage maps, per-cycle changelogs, verification gates, and canonical push targets for archival audits. |

## Research summary

- Results collected: 168 (searXNG, 2 seed queries per subtopic, top 6 kept per query)
- Weight split: 52 high (>= 0.5) / 116 low (< 0.5) of 168
- Jev requests: 37 (usage 29023 input / 0 output tokens)
- Redos: 4 (07-deep-research-dispatch: 1; 09-granularity-and-scale-rules: 1; 10-coverage-map-outputs: 2 (2nd redo after redo 1 still thin))
- Skipped docs: none (all 10 outline subtopics authored)
- Gaps: doc 09 granularity-and-scale-rules and doc 10 coverage-map-outputs rest on fewer high-weight anchors; weak-backed claims are labeled as such in text

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Research-db

research-db/preflight.json, outline.json, archive.json, jev-log.json, db.ts, digs/NN-slug.json x10. Every archive entry carries its full noul decision record; every factual claim in the docs cites its source URL and jev weight.
