# osbuild-image-builder knowledge corpus

Minted 2026-10-05 from yubi-OS/yubiOS refs/osbuild-image-builder-2026-07-23.md. Topic: osbuild and Image Builder for on-premises OS image generation, what the toolchain builds, its deployment models, and how it compares as prior art for reproducible image builders.

## Docs

| NN | slug | scope |
|----|------|-------|
| 01 | osbuild-pipeline-engine | The manifest-driven pipeline engine: stages, sources, caching, runners. |
| 02 | deployment-models | Daemon (osbuild-composer + composer-cli) vs stateless image-builder-cli vs containerized vs hosted. |
| 03 | blueprint-format | TOML blueprint format and the customization surface, shared across frontends. |
| 04 | distro-image-matrix | Supported distros and the image-type catalogue, per-architecture descriptions. |
| 05 | ostree-iot-flows | OSTree commit flows, iot-* image chain, simplified installers, Pulp distribution. |
| 06 | bootc-convergence | bootc image mode input and the 2026 merge of bootc-image-builder into the unified CLI. |
| 07 | composefs-backend | Experimental composefs backend and the issue 2427 blocker chain. |
| 08 | release-ladder | Version ladder, archived repos, and cockpit-image-builder RHEL errata. |
| 09 | prior-art-comparison | osbuild vs mkosi/kiwi-ng/lorax and the image-mode axis for reproducible builders. |

## Research summary

- Results collected: 108 raw results across 18 searXNG queries (2 per subtopic), top 6 per query kept, deduplicated by URL within each subtopic to 99 weighted results.
- Weight split: 65 results at weight >= 0.5 (authoritative backing), 34 results below 0.5 (weak backing, labeled as such in the docs).
- jev requests: 23 total (1 outline score validation with 9 questions, 2 probes, 20 noul weighting batches of 5), usage 17235 input tokens, 0 output tokens.
- Redos: 0 dig redos (every subtopic's dig came back strong on the first attempt); 1 transient 429 on /api/decide retried successfully per the redo rule.
- Skipped docs: none. All 9 subtopics scored load-bearing or marginal-with-strong-dig in outline validation and were authored.

## Preflight

Preflight 2026-10-05: searXNG 85 results healthy (probe query returned 44 results across bing, duckduckgo, mwmbl, privacywall, seznam, yahoo, yandex engines on the first probe and 52 on the second); /api/decide (clef) 200.

## Gaps

- The dig surfaced some junk high-weight results (unrelated pages mis-scored by the weighting model); these were not cited in any doc and no claim rests on them.
- Issue-level detail for osbuild/image-builder issue 2427 comes from the source research dated 2026-07-23; the dig's issue-tracker index result only corroborates the tracker exists.

## research-db

- preflight.json: probe results for searXNG and /api/decide.
- outline.json: 9 subtopics with seed queries and full jev score validation record.
- archive.json: 99 collected results with noul weights and full decision records.
- digs/: one record per subtopic (queries attempted, redo log, results kept, outcome).
- jev-log.json: one entry per jev HTTP request with usage tokens.
- db.ts: TypeScript interfaces for all the shapes above.
