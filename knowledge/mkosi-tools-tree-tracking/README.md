# mkosi tools trees: version pinning and tracking of the build-tool environment

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS `refs/mkosi-tools-tree-tracking-2026-09-08.md`. Topic: mkosi tools trees, meaning version pinning and tracking of the build-tool environment so OS image builds run inside a pinned, managed tool tree, and how to track its versions.

## Docs

| NN | slug | one-line scope |
|---|---|---|
| 01 | tools-tree-mechanism | What the mkosi tools tree is, how mkosi builds and uses it, the ToolsTree* configuration surface, and default behavior. |
| 02 | pinning-strategies | Why digest rather than tag, which distro and registry source to select, and how to resolve the tools tree reproducibly. |
| 03 | single-source-of-truth | Where the tools-tree pin lives: exactly one owner for the approved digest, and how mkosi config relates to the ledger. |
| 04 | refresh-workflow | Confirm the pin, resolve the new digest, rebuild a candidate image, gate it, and update the pin in one commit. |
| 05 | verification-gates | Post-bump gates: boot the artifact and verify the UKI signs and boots, gating at image level rather than tool level. |
| 06 | rollback-discipline | Roll back by reverting the pin, never hand-editing a built image; atomic revert semantics. |
| 07 | supply-chain-integration | The tools tree as a supply-chain input feeding SLSA provenance and build-policy FROM-image vetting. |
| 08 | assumption-set | Build-host parity, universal pin consumption, registry availability and offline mirrors, concurrency over the pin. |
| 09 | version-tracking-ledger | Recording old-to-new transitions, changelog discipline, and auditing which tool versions produced which images. |

## Research summary

- Results collected: 109 (top 6 per query across 21 queries, deduplicated by URL).
- Weight split: 36 authoritative (jev weight >= 0.5), 73 weak (< 0.5), 0 unweighted.
- Jev requests: 26 total (24 successful: 1 preflight probe, 1 outline validation, 22 weighting batches; 2 rate-limited 429 attempts logged and retried). Usage: 18456 input tokens, 0 output tokens.
- Redo counts: 3 docs got 1 dig redo each with different queries (02, 03, 09) because their initial digs were thin. No doc was skipped.
- Skipped docs: none.

## Research-db

`research-db/` holds preflight.json, outline.json, archive.json (109 weighted results with full decision records), digs/01..09 per-doc dig records, jev-log.json, and db.ts (schema v2 interfaces).

## Preflight

2026-10-05: searXNG 152 results healthy; /api/decide (clef) 200.

## Gaps

None. All 9 validated subtopics authored.
